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
  0% { transform: translateX(0) scale(1); opacity: 1; }
  100% { transform: translateX(-55vw) scale(0.92); opacity: 0; }
}
@keyframes prTearRight {
  0% { transform: translateX(0) scale(1); opacity: 1; }
  100% { transform: translateX(55vw) scale(0.92); opacity: 0; }
}
@keyframes prGlow {
  0% { opacity: 0; transform: scaleX(0.3); }
  40% { opacity: 1; transform: scaleX(1); }
  100% { opacity: 0; transform: scaleX(1.5); }
}
@keyframes prSparkle {
  0% { opacity: 1; transform: translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0); }
}
@keyframes prContentIn {
  0% { opacity: 0.85; }
  100% { opacity: 1; }
}
`;

// SVG jagged tear edge path (left side — right side is mirrored)
const TEAR_CLIP_LEFT = 'polygon(0 0, 98% 0, 100% 3%, 97% 7%, 100% 11%, 96% 16%, 99% 20%, 97% 25%, 100% 29%, 96% 34%, 99% 38%, 97% 42%, 100% 47%, 96% 51%, 99% 55%, 97% 60%, 100% 64%, 96% 68%, 99% 73%, 97% 77%, 100% 82%, 96% 86%, 99% 90%, 97% 95%, 100% 100%, 0 100%)';
const TEAR_CLIP_RIGHT = 'polygon(2% 0, 100% 0, 100% 100%, 0% 100%, 3% 95%, 1% 90%, 4% 86%, 1% 82%, 3% 77%, 0% 73%, 4% 68%, 1% 64%, 3% 60%, 0% 55%, 4% 51%, 1% 47%, 3% 42%, 0% 38%, 4% 34%, 1% 29%, 3% 25%, 0% 20%, 4% 16%, 1% 11%, 3% 7%, 0% 3%)';

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
      }, 900);
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

  // Sparkle positions along the vertical center tear
  const sparkles = [
    { top: '15%', sx: '-30px', sy: '-20px' },
    { top: '30%', sx: '25px', sy: '-15px' },
    { top: '50%', sx: '-20px', sy: '10px' },
    { top: '70%', sx: '30px', sy: '20px' },
    { top: '85%', sx: '-25px', sy: '15px' },
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
          {/* glow behind tear */}
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0, width: 40, marginLeft: -20,
            background: 'linear-gradient(180deg, rgba(255,215,0,0.4), rgba(255,255,255,0.6), rgba(255,215,0,0.4))',
            filter: 'blur(20px)',
            animation: 'prGlow 0.8s ease-out forwards',
            zIndex: 1,
          }} />

          {/* left half */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
            background: 'var(--fill)', clipPath: TEAR_CLIP_LEFT,
            animation: 'prTearLeft 0.8s ease-in forwards',
            zIndex: 2,
          }}>
            {/* stripe texture on left half */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: 'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
            }} />
            {/* logo on left half */}
            <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translate(50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: 0.9 }}>
              {LogoPR ? <LogoPR size={56} color="#fff" /> : null}
              <div style={{ fontFamily: 'var(--wordmark)', fontWeight: 800, fontSize: 22, letterSpacing: 2, color: '#fff' }}>CARDCONOMY</div>
            </div>
          </div>

          {/* right half */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
            background: 'var(--fill)', clipPath: TEAR_CLIP_RIGHT,
            animation: 'prTearRight 0.8s ease-in forwards',
            zIndex: 2,
          }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: 'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
            }} />
          </div>

          {/* sparkle particles along tear */}
          {sparkles.map((s, i) => (
            <div key={i} style={{
              position: 'absolute', left: '50%', top: s.top, width: 5, height: 5,
              borderRadius: 999, background: '#fff', marginLeft: -2.5,
              '--sx': s.sx, '--sy': s.sy,
              animation: 'prSparkle 0.6s ease-out ' + (i * 0.06) + 's forwards',
              zIndex: 3,
            }} />
          ))}
        </React.Fragment>
      )}
    </div>
  );
}

Object.assign(window, { PackRip });
