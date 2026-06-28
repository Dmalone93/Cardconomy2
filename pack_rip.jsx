// ─────────────────────────────────────────────────────────────
// Pack Rip — full-screen booster pack reveal animation
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
@keyframes prTearLeft {
  0% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; }
  30% { transform: translateX(-8vw) rotate(-2deg) scale(1); opacity: 1; }
  100% { transform: translateX(-70vw) rotate(-8deg) scale(0.85); opacity: 0; }
}
@keyframes prTearRight {
  0% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; }
  30% { transform: translateX(8vw) rotate(2deg) scale(1); opacity: 1; }
  100% { transform: translateX(70vw) rotate(8deg) scale(0.85); opacity: 0; }
}
@keyframes prGlow {
  0% { opacity: 0; transform: scaleX(0.2); }
  20% { opacity: 1; transform: scaleX(1.2); }
  50% { opacity: 0.8; transform: scaleX(1.8); }
  100% { opacity: 0; transform: scaleX(2.5); }
}
@keyframes prSparkle {
  0% { opacity: 1; transform: translate(0, 0) scale(1.2); }
  100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0); }
}
@keyframes prFlash {
  0% { opacity: 0; }
  15% { opacity: 0.7; }
  100% { opacity: 0; }
}
@keyframes prContentIn {
  0% { opacity: 0.85; }
  100% { opacity: 1; }
}
`;

// SVG jagged tear edge path (left side — right side is mirrored)
// Much more aggressive jagged tear — wider irregular teeth
const TEAR_CLIP_LEFT = 'polygon(0 0, 100% 0, 93% 2%, 100% 4%, 91% 7%, 98% 9%, 88% 12%, 96% 15%, 90% 18%, 100% 20%, 86% 23%, 95% 26%, 89% 29%, 100% 31%, 87% 34%, 97% 37%, 91% 40%, 85% 43%, 98% 45%, 89% 48%, 100% 50%, 86% 53%, 94% 55%, 88% 58%, 100% 60%, 90% 63%, 85% 66%, 97% 68%, 91% 71%, 100% 73%, 87% 76%, 95% 79%, 88% 82%, 100% 84%, 86% 87%, 93% 90%, 89% 93%, 100% 95%, 91% 98%, 100% 100%, 0 100%)';
const TEAR_CLIP_RIGHT = 'polygon(7% 2%, 100% 0, 100% 100%, 9% 98%, 0% 95%, 12% 93%, 7% 90%, 14% 87%, 0% 84%, 12% 82%, 5% 79%, 13% 76%, 0% 73%, 9% 71%, 15% 68%, 3% 66%, 10% 63%, 0% 60%, 12% 58%, 6% 55%, 14% 53%, 0% 50%, 11% 48%, 2% 45%, 15% 43%, 9% 40%, 3% 37%, 13% 34%, 0% 31%, 11% 29%, 5% 26%, 14% 23%, 0% 20%, 10% 18%, 4% 15%, 12% 12%, 2% 9%, 9% 7%, 0% 4%, 7% 2%)';

function PackRip({ onComplete }) {
  const [phase, setPhase] = React.useState('sealed'); // sealed | tearing | done
  const timerRef = React.useRef(null);

  // Auto-rip after 1.2s
  React.useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (phase === 'sealed') setPhase('tearing');
    }, 1200);
    return () => clearTimeout(timerRef.current);
  }, []);

  // After tear animation completes, remove overlay
  React.useEffect(() => {
    if (phase === 'tearing') {
      const t = setTimeout(() => {
        setPhase('done');
        if (onComplete) onComplete();
      }, 700);
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

  // Sparkle positions — more particles, scatter further
  const sparkles = [
    { top: '8%', sx: '-50px', sy: '-30px', size: 6 },
    { top: '15%', sx: '45px', sy: '-25px', size: 4 },
    { top: '22%', sx: '-35px', sy: '15px', size: 5 },
    { top: '30%', sx: '55px', sy: '-10px', size: 7 },
    { top: '38%', sx: '-60px', sy: '20px', size: 4 },
    { top: '46%', sx: '40px', sy: '-35px', size: 6 },
    { top: '54%', sx: '-45px', sy: '25px', size: 5 },
    { top: '62%', sx: '50px', sy: '15px', size: 7 },
    { top: '70%', sx: '-55px', sy: '-20px', size: 4 },
    { top: '78%', sx: '60px', sy: '30px', size: 6 },
    { top: '86%', sx: '-40px', sy: '-15px', size: 5 },
    { top: '93%', sx: '45px', sy: '25px', size: 4 },
  ];

  return (
    <div onClick={triggerTear} style={{
      position: 'fixed', inset: 0, zIndex: 9999, cursor: phase === 'sealed' ? 'pointer' : 'default',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: PR_KEYFRAMES }} />

      {phase === 'sealed' && (
        <div style={{ position: 'absolute', inset: 0, background: 'var(--fill)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* diagonal stripe texture */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
          }} />

          {/* holographic shimmer band */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{
              position: 'absolute', top: '-20%', bottom: '-20%', width: '60%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 60%, transparent 100%)',
              animation: 'prShimmer 1.8s ease-in-out infinite',
            }} />
          </div>

          {/* logo */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {LogoPR ? <LogoPR size={56} color="#fff" /> : null}
            <div style={{ fontFamily: 'var(--wordmark)', fontWeight: 800, fontSize: 22, letterSpacing: 2, color: '#fff', opacity: 0.9 }}>CARDCONOMY</div>
          </div>

          {/* tap hint */}
          <div style={{
            position: 'absolute', bottom: '12%', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
            color: 'rgba(255,255,255,0.5)', animation: 'prHintIn 0.4s ease 0.3s both',
          }}>tap anywhere to open</div>
        </div>
      )}

      {phase === 'tearing' && (
        <React.Fragment>
          {/* full-screen flash on rip */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9), transparent 70%)',
            animation: 'prFlash 0.5s ease-out forwards',
            zIndex: 0,
          }} />

          {/* glow behind tear — wider and more intense */}
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0, width: 80, marginLeft: -40,
            background: 'linear-gradient(180deg, rgba(255,200,0,0.6), rgba(255,255,255,0.8), rgba(255,200,0,0.6))',
            filter: 'blur(30px)',
            animation: 'prGlow 0.6s ease-out forwards',
            zIndex: 1,
          }} />

          {/* left half — faster, more rotation */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '52%', height: '100%',
            background: 'var(--fill)', clipPath: TEAR_CLIP_LEFT,
            animation: 'prTearLeft 0.55s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
            zIndex: 2, transformOrigin: 'left center',
          }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: 'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
            }} />
            <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translate(50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: 0.9 }}>
              {LogoPR ? <LogoPR size={56} color="#fff" /> : null}
              <div style={{ fontFamily: 'var(--wordmark)', fontWeight: 800, fontSize: 22, letterSpacing: 2, color: '#fff' }}>CARDCONOMY</div>
            </div>
          </div>

          {/* right half — faster, more rotation */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '52%', height: '100%',
            background: 'var(--fill)', clipPath: TEAR_CLIP_RIGHT,
            animation: 'prTearRight 0.55s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
            zIndex: 2, transformOrigin: 'right center',
          }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: 'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
            }} />
          </div>

          {/* sparkle particles — more, bigger, scatter further */}
          {sparkles.map((s, i) => (
            <div key={i} style={{
              position: 'absolute', left: '50%', top: s.top, width: s.size || 5, height: s.size || 5,
              borderRadius: 999, background: i % 3 === 0 ? '#ffd700' : '#fff', marginLeft: -(s.size || 5) / 2,
              '--sx': s.sx, '--sy': s.sy,
              animation: 'prSparkle 0.5s ease-out ' + (i * 0.03) + 's forwards',
              zIndex: 3, boxShadow: '0 0 6px rgba(255,255,255,0.8)',
            }} />
          ))}
        </React.Fragment>
      )}
    </div>
  );
}

Object.assign(window, { PackRip });
