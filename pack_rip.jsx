// ─────────────────────────────────────────────────────────────
// Pack Rip — full-screen booster pack reveal animation
// Top-to-bottom sequential tear like ripping open a real pack
// ─────────────────────────────────────────────────────────────
const { Logo: LogoPR } = window;

const PR_KEYFRAMES = `
@keyframes prShimmer {
  0% { transform: translateX(-120%) rotate(25deg); }
  100% { transform: translateX(120%) rotate(25deg); }
}
@keyframes prHintIn {
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 0.5; transform: translateY(0); }
}
@keyframes prTearDown {
  0% { clip-path: inset(0 0 100% 0); }
  100% { clip-path: inset(0 0 0% 0); }
}
@keyframes prFlapLeft {
  0% { transform: perspective(800px) rotateY(0deg) translateX(0); opacity: 1; }
  40% { transform: perspective(800px) rotateY(-15deg) translateX(-4vw); opacity: 1; }
  100% { transform: perspective(800px) rotateY(-45deg) translateX(-50vw); opacity: 0; }
}
@keyframes prFlapRight {
  0% { transform: perspective(800px) rotateY(0deg) translateX(0); opacity: 1; }
  40% { transform: perspective(800px) rotateY(15deg) translateX(4vw); opacity: 1; }
  100% { transform: perspective(800px) rotateY(45deg) translateX(50vw); opacity: 0; }
}
@keyframes prGlowLine {
  0% { top: -5%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 105%; opacity: 0; }
}
@keyframes prSparkle {
  0% { opacity: 1; transform: translate(0, 0) scale(1.2); }
  100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0); }
}
@keyframes prFlash {
  0% { opacity: 0; }
  20% { opacity: 0.6; }
  100% { opacity: 0; }
}
`;

function PackRip({ onComplete }) {
  const [phase, setPhase] = React.useState('sealed'); // sealed | tearing | clearing | done
  const timerRef = React.useRef(null);

  // Auto-rip after 1.2s
  React.useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (phase === 'sealed') setPhase('tearing');
    }, 1200);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Tearing phase: after the tear reaches the bottom, clear the flaps
  React.useEffect(() => {
    if (phase === 'tearing') {
      const t = setTimeout(() => setPhase('clearing'), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Clearing phase: flaps fly away, then done
  React.useEffect(() => {
    if (phase === 'clearing') {
      const t = setTimeout(() => {
        setPhase('done');
        if (onComplete) onComplete();
      }, 550);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === 'done') return null;

  const triggerTear = () => {
    if (phase === 'sealed') {
      clearTimeout(timerRef.current);
      setPhase('tearing');
    }
  };

  // Sparkle particles that appear as the tear progresses down
  const sparkles = [];
  for (var i = 0; i < 16; i++) {
    var pct = (i / 15) * 100;
    sparkles.push({
      top: pct + '%',
      sx: (i % 2 === 0 ? -1 : 1) * (30 + Math.abs(((i * 7 + 13) % 40))) + 'px',
      sy: (((i * 11 + 5) % 30) - 15) + 'px',
      size: 3 + (i % 3) * 2,
      delay: (i * 0.035),
    });
  }

  // Shared pack surface styles
  var packTexture = {
    position: 'absolute', inset: 0, opacity: 0.04,
    backgroundImage: 'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
  };

  return (
    <div onClick={triggerTear} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      cursor: phase === 'sealed' ? 'pointer' : 'default',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: PR_KEYFRAMES }} />

      {/* ── SEALED: full pack wrapper ── */}
      {phase === 'sealed' && (
        <div style={{ position: 'absolute', inset: 0, background: 'var(--fill)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={packTexture} />
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{
              position: 'absolute', top: '-20%', bottom: '-20%', width: '60%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 60%, transparent 100%)',
              animation: 'prShimmer 1.8s ease-in-out infinite',
            }} />
          </div>
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {LogoPR ? <LogoPR size={56} color="#fff" /> : null}
            <div style={{ fontFamily: 'var(--wordmark)', fontWeight: 800, fontSize: 22, letterSpacing: 2, color: '#fff', opacity: 0.9 }}>CARDCONOMY</div>
          </div>
          <div style={{
            position: 'absolute', bottom: '12%', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
            color: 'rgba(255,255,255,0.5)', animation: 'prHintIn 0.4s ease 0.3s both',
          }}>tap anywhere to open</div>
        </div>
      )}

      {/* ── TEARING: pack splits top-to-bottom ── */}
      {phase === 'tearing' && (
        <React.Fragment>
          {/* The pack wrapper — still covers the screen but a vertical gap tears down the center */}

          {/* Left flap — full height, right edge is jagged, stays in place during tear */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '51%', height: '100%',
            background: 'var(--fill)', zIndex: 3,
            clipPath: 'polygon(0 0, 93% 0, 100% 1.5%, 90% 3.5%, 97% 5%, 88% 7.5%, 95% 9%, 86% 11.5%, 98% 13%, 89% 15.5%, 94% 17%, 85% 19.5%, 97% 21%, 88% 23.5%, 93% 25%, 84% 27.5%, 96% 29%, 87% 31.5%, 100% 33%, 86% 35.5%, 92% 37%, 85% 39.5%, 98% 41%, 87% 43.5%, 93% 45%, 84% 47.5%, 97% 49%, 89% 51.5%, 94% 53%, 85% 55.5%, 100% 57%, 88% 59.5%, 92% 61%, 83% 63.5%, 96% 65%, 87% 67.5%, 93% 69%, 85% 71.5%, 99% 73%, 88% 75.5%, 94% 77%, 84% 79.5%, 97% 81%, 89% 83.5%, 92% 85%, 83% 87.5%, 96% 89%, 87% 91.5%, 100% 93%, 88% 95.5%, 93% 97%, 86% 99%, 100% 100%, 0 100%)',
          }}>
            <div style={packTexture} />
            <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translate(50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: 0.9 }}>
              {LogoPR ? <LogoPR size={56} color="#fff" /> : null}
              <div style={{ fontFamily: 'var(--wordmark)', fontWeight: 800, fontSize: 22, letterSpacing: 2, color: '#fff' }}>CARDCONOMY</div>
            </div>
          </div>

          {/* Right flap — full height, left edge is jagged */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '51%', height: '100%',
            background: 'var(--fill)', zIndex: 3,
            clipPath: 'polygon(7% 0, 100% 0, 100% 100%, 14% 99%, 7% 97%, 0% 95.5%, 12% 93%, 4% 91.5%, 13% 89%, 3% 87.5%, 17% 85%, 8% 83.5%, 11% 81%, 3% 79.5%, 16% 77%, 6% 75.5%, 1% 73%, 15% 71.5%, 7% 69%, 13% 67.5%, 4% 65%, 17% 63.5%, 8% 61%, 12% 59.5%, 0% 57%, 15% 55.5%, 6% 53%, 11% 51.5%, 3% 49%, 16% 47.5%, 7% 45%, 13% 43.5%, 2% 41%, 15% 39.5%, 8% 37%, 14% 35.5%, 0% 33%, 13% 31.5%, 4% 29%, 16% 27.5%, 7% 25%, 12% 23.5%, 3% 21%, 15% 19.5%, 6% 17%, 11% 15.5%, 2% 13%, 14% 11.5%, 5% 9%, 12% 7.5%, 3% 5%, 10% 3.5%, 0% 1.5%, 7% 0)',
          }}>
            <div style={packTexture} />
          </div>

          {/* Reveal window — transparent gap between flaps that tears open top-to-bottom */}
          {/* This is achieved by a dark overlay with animated clip-path that shrinks from bottom */}
          <div style={{
            position: 'absolute', left: '42%', width: '16%', top: 0, height: '100%',
            background: 'var(--fill)', zIndex: 2,
            animation: 'prTearDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            clipPath: 'inset(0 0 100% 0)',
            transform: 'scaleY(-1)',
          }}>
            {/* This block HIDES the gap — but we animate it in reverse: it starts covering everything,
                then reveals from top to bottom by inverting the animation */}
          </div>

          {/* Glowing tear line that travels downward */}
          <div style={{
            position: 'absolute', left: '44%', width: '12%', height: 30,
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9), rgba(255,200,0,0.6), transparent)',
            filter: 'blur(12px)', borderRadius: '50%',
            animation: 'prGlowLine 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            zIndex: 5,
          }} />

          {/* Sparkles that appear along the tear as it progresses */}
          {sparkles.map(function(s, idx) {
            return (
              <div key={idx} style={{
                position: 'absolute', left: '50%', top: s.top,
                width: s.size, height: s.size, borderRadius: 999,
                background: idx % 3 === 0 ? '#ffd700' : '#fff',
                marginLeft: -s.size / 2,
                '--sx': s.sx, '--sy': s.sy,
                animation: 'prSparkle 0.4s ease-out ' + s.delay + 's forwards',
                zIndex: 6, boxShadow: '0 0 6px rgba(255,255,255,0.8)',
                opacity: 0,
              }} />
            );
          })}
        </React.Fragment>
      )}

      {/* ── CLEARING: flaps peel away to the sides ── */}
      {phase === 'clearing' && (
        <React.Fragment>
          {/* Flash */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7), transparent 70%)',
            animation: 'prFlash 0.5s ease-out forwards',
            zIndex: 1,
          }} />

          {/* Left flap peeling away */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '51%', height: '100%',
            background: 'var(--fill)', zIndex: 3,
            clipPath: 'polygon(0 0, 93% 0, 100% 1.5%, 90% 3.5%, 97% 5%, 88% 7.5%, 95% 9%, 86% 11.5%, 98% 13%, 89% 15.5%, 94% 17%, 85% 19.5%, 97% 21%, 88% 23.5%, 93% 25%, 84% 27.5%, 96% 29%, 87% 31.5%, 100% 33%, 86% 35.5%, 92% 37%, 85% 39.5%, 98% 41%, 87% 43.5%, 93% 45%, 84% 47.5%, 97% 49%, 89% 51.5%, 94% 53%, 85% 55.5%, 100% 57%, 88% 59.5%, 92% 61%, 83% 63.5%, 96% 65%, 87% 67.5%, 93% 69%, 85% 71.5%, 99% 73%, 88% 75.5%, 94% 77%, 84% 79.5%, 97% 81%, 89% 83.5%, 92% 85%, 83% 87.5%, 96% 89%, 87% 91.5%, 100% 93%, 88% 95.5%, 93% 97%, 86% 99%, 100% 100%, 0 100%)',
            animation: 'prFlapLeft 0.5s cubic-bezier(0.4, 0, 0.7, 0.2) forwards',
            transformOrigin: 'left center',
          }}>
            <div style={packTexture} />
          </div>

          {/* Right flap peeling away */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '51%', height: '100%',
            background: 'var(--fill)', zIndex: 3,
            clipPath: 'polygon(7% 0, 100% 0, 100% 100%, 14% 99%, 7% 97%, 0% 95.5%, 12% 93%, 4% 91.5%, 13% 89%, 3% 87.5%, 17% 85%, 8% 83.5%, 11% 81%, 3% 79.5%, 16% 77%, 6% 75.5%, 1% 73%, 15% 71.5%, 7% 69%, 13% 67.5%, 4% 65%, 17% 63.5%, 8% 61%, 12% 59.5%, 0% 57%, 15% 55.5%, 6% 53%, 11% 51.5%, 3% 49%, 16% 47.5%, 7% 45%, 13% 43.5%, 2% 41%, 15% 39.5%, 8% 37%, 14% 35.5%, 0% 33%, 13% 31.5%, 4% 29%, 16% 27.5%, 7% 25%, 12% 23.5%, 3% 21%, 15% 19.5%, 6% 17%, 11% 15.5%, 2% 13%, 14% 11.5%, 5% 9%, 12% 7.5%, 3% 5%, 10% 3.5%, 0% 1.5%, 7% 0)',
            animation: 'prFlapRight 0.5s cubic-bezier(0.4, 0, 0.7, 0.2) forwards',
            transformOrigin: 'right center',
          }}>
            <div style={packTexture} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

Object.assign(window, { PackRip });
