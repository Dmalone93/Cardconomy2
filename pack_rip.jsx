// ─────────────────────────────────────────────────────────────
// Pack Rip — full-screen booster pack reveal animation
// Top-to-bottom sequential tear on the RIGHT side of the pack
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
@keyframes prGlowLine {
  0% { top: -5%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 105%; opacity: 0; }
}
@keyframes prFlapLeft {
  0% { transform: perspective(800px) rotateY(0deg) translateX(0); opacity: 1; }
  40% { transform: perspective(800px) rotateY(-12deg) translateX(-4vw); opacity: 1; }
  100% { transform: perspective(800px) rotateY(-40deg) translateX(-50vw); opacity: 0; }
}
@keyframes prFlapRight {
  0% { transform: perspective(800px) rotateY(0deg) translateX(0); opacity: 1; }
  40% { transform: perspective(800px) rotateY(20deg) translateX(5vw); opacity: 1; }
  100% { transform: perspective(800px) rotateY(50deg) translateX(40vw); opacity: 0; }
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

// Jagged tear edge for the LEFT flap (right edge is the torn side)
var CLIP_LEFT_TEAR = 'polygon(0 0, 93% 0, 100% 1.5%, 90% 3.5%, 97% 5%, 88% 7.5%, 95% 9%, 86% 11.5%, 98% 13%, 89% 15.5%, 94% 17%, 85% 19.5%, 97% 21%, 88% 23.5%, 93% 25%, 84% 27.5%, 96% 29%, 87% 31.5%, 100% 33%, 86% 35.5%, 92% 37%, 85% 39.5%, 98% 41%, 87% 43.5%, 93% 45%, 84% 47.5%, 97% 49%, 89% 51.5%, 94% 53%, 85% 55.5%, 100% 57%, 88% 59.5%, 92% 61%, 83% 63.5%, 96% 65%, 87% 67.5%, 93% 69%, 85% 71.5%, 99% 73%, 88% 75.5%, 94% 77%, 84% 79.5%, 97% 81%, 89% 83.5%, 92% 85%, 83% 87.5%, 96% 89%, 87% 91.5%, 100% 93%, 88% 95.5%, 93% 97%, 86% 99%, 100% 100%, 0 100%)';

// Jagged tear edge for the RIGHT flap (left edge is the torn side) — deeper teeth for smaller piece
var CLIP_RIGHT_TEAR = 'polygon(22% 0, 100% 0, 100% 100%, 18% 99%, 28% 97%, 10% 95.5%, 24% 93%, 0% 91.5%, 26% 89%, 8% 87.5%, 30% 85%, 14% 83.5%, 22% 81%, 0% 79.5%, 28% 77%, 10% 75.5%, 4% 73%, 26% 71.5%, 16% 69%, 24% 67.5%, 2% 65%, 30% 63.5%, 12% 61%, 22% 59.5%, 0% 57%, 26% 55.5%, 8% 53%, 20% 51.5%, 4% 49%, 28% 47.5%, 14% 45%, 24% 43.5%, 0% 41%, 26% 39.5%, 16% 37%, 24% 35.5%, 2% 33%, 22% 31.5%, 8% 29%, 28% 27.5%, 12% 25%, 22% 23.5%, 0% 21%, 26% 19.5%, 10% 17%, 20% 15.5%, 4% 13%, 24% 11.5%, 8% 9%, 22% 7.5%, 0% 5%, 18% 3.5%, 6% 1.5%, 22% 0)';

function PackRip({ onComplete }) {
  var ref = React.useState('sealed');
  var phase = ref[0], setPhase = ref[1];
  var timerRef = React.useRef(null);

  // Auto-rip after 1.2s
  React.useEffect(function() {
    timerRef.current = setTimeout(function() {
      if (phase === 'sealed') setPhase('tearing');
    }, 1200);
    return function() { clearTimeout(timerRef.current); };
  }, []);

  // Tearing phase — slower rip (1.2s)
  React.useEffect(function() {
    if (phase === 'tearing') {
      var t = setTimeout(function() { setPhase('clearing'); }, 1200);
      return function() { clearTimeout(t); };
    }
  }, [phase]);

  // Clearing phase — flaps peel away
  React.useEffect(function() {
    if (phase === 'clearing') {
      var t = setTimeout(function() {
        setPhase('done');
        if (onComplete) onComplete();
      }, 650);
      return function() { clearTimeout(t); };
    }
  }, [phase]);

  if (phase === 'done') return null;

  var triggerTear = function() {
    if (phase === 'sealed') {
      clearTimeout(timerRef.current);
      setPhase('tearing');
    }
  };

  // Sparkles along the tear line (positioned at ~68% from left)
  var sparkles = [];
  for (var i = 0; i < 16; i++) {
    var pct = (i / 15) * 100;
    sparkles.push({
      top: pct + '%',
      sx: (i % 2 === 0 ? -1 : 1) * (25 + Math.abs(((i * 7 + 13) % 45))) + 'px',
      sy: (((i * 11 + 5) % 30) - 15) + 'px',
      size: 3 + (i % 3) * 2,
      delay: (i * 0.05),
    });
  }

  var packTexture = {
    position: 'absolute', inset: 0, opacity: 0.04,
    backgroundImage: 'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
  };

  return React.createElement('div', {
    onClick: triggerTear,
    style: { position: 'fixed', inset: 0, zIndex: 9999, cursor: phase === 'sealed' ? 'pointer' : 'default', overflow: 'hidden' },
  },
    React.createElement('style', { dangerouslySetInnerHTML: { __html: PR_KEYFRAMES } }),

    // ── SEALED ──
    phase === 'sealed' && React.createElement('div', {
      style: { position: 'absolute', inset: 0, background: 'var(--fill)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    },
      React.createElement('div', { style: packTexture }),
      React.createElement('div', { style: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' } },
        React.createElement('div', { style: {
          position: 'absolute', top: '-20%', bottom: '-20%', width: '60%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 60%, transparent 100%)',
          animation: 'prShimmer 1.8s ease-in-out infinite',
        } })
      ),
      React.createElement('div', { style: { position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 } },
        LogoPR ? React.createElement(LogoPR, { size: 56, color: '#fff' }) : null,
        React.createElement('div', { style: { fontFamily: 'var(--wordmark)', fontWeight: 800, fontSize: 22, letterSpacing: 2, color: '#fff', opacity: 0.9 } }, 'CARDCONOMY')
      ),
      React.createElement('div', { style: {
        position: 'absolute', bottom: '12%', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
        color: 'rgba(255,255,255,0.5)', animation: 'prHintIn 0.4s ease 0.3s both',
      } }, 'tap anywhere to open')
    ),

    // ── TEARING: tear on the RIGHT side, top to bottom ──
    phase === 'tearing' && React.createElement(React.Fragment, null,
      // Left flap — the BIG piece (~68% width), stays put during tear
      React.createElement('div', { style: {
        position: 'absolute', top: 0, left: 0, width: '68%', height: '100%',
        background: 'var(--fill)', zIndex: 3, clipPath: CLIP_LEFT_TEAR,
      } },
        React.createElement('div', { style: packTexture }),
        React.createElement('div', { style: { position: 'absolute', top: '50%', left: '42%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: 0.9 } },
          LogoPR ? React.createElement(LogoPR, { size: 56, color: '#fff' }) : null,
          React.createElement('div', { style: { fontFamily: 'var(--wordmark)', fontWeight: 800, fontSize: 22, letterSpacing: 2, color: '#fff' } }, 'CARDCONOMY')
        )
      ),

      // Right flap — the SMALL strip (~36% width), stays put during tear
      React.createElement('div', { style: {
        position: 'absolute', top: 0, right: 0, width: '36%', height: '100%',
        background: 'var(--fill)', zIndex: 3, clipPath: CLIP_RIGHT_TEAR,
      } },
        React.createElement('div', { style: packTexture })
      ),

      // Glow line traveling down the tear at ~66%
      React.createElement('div', { style: {
        position: 'absolute', left: '62%', width: '8%', height: 35,
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9), rgba(255,200,0,0.5), transparent)',
        filter: 'blur(14px)', borderRadius: '50%',
        animation: 'prGlowLine 1.2s cubic-bezier(0.25, 0, 0.2, 1) forwards',
        zIndex: 5,
      } }),

      // Sparkles along tear line at ~66%
      sparkles.map(function(s, idx) {
        return React.createElement('div', {
          key: idx,
          style: {
            position: 'absolute', left: '66%', top: s.top,
            width: s.size, height: s.size, borderRadius: 999,
            background: idx % 3 === 0 ? '#ffd700' : '#fff',
            marginLeft: -s.size / 2,
            '--sx': s.sx, '--sy': s.sy,
            animation: 'prSparkle 0.5s ease-out ' + s.delay + 's forwards',
            zIndex: 6, boxShadow: '0 0 6px rgba(255,255,255,0.8)',
            opacity: 0,
          },
        });
      })
    ),

    // ── CLEARING: both flaps peel away ──
    phase === 'clearing' && React.createElement(React.Fragment, null,
      // Flash
      React.createElement('div', { style: {
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 66% 50%, rgba(255,255,255,0.7), transparent 60%)',
        animation: 'prFlash 0.5s ease-out forwards', zIndex: 1,
      } }),

      // Left flap peeling away
      React.createElement('div', { style: {
        position: 'absolute', top: 0, left: 0, width: '68%', height: '100%',
        background: 'var(--fill)', zIndex: 3, clipPath: CLIP_LEFT_TEAR,
        animation: 'prFlapLeft 0.55s cubic-bezier(0.4, 0, 0.7, 0.2) forwards',
        transformOrigin: 'left center',
      } },
        React.createElement('div', { style: packTexture })
      ),

      // Right flap peeling away
      React.createElement('div', { style: {
        position: 'absolute', top: 0, right: 0, width: '36%', height: '100%',
        background: 'var(--fill)', zIndex: 3, clipPath: CLIP_RIGHT_TEAR,
        animation: 'prFlapRight 0.55s cubic-bezier(0.4, 0, 0.7, 0.2) forwards',
        transformOrigin: 'right center',
      } },
        React.createElement('div', { style: packTexture })
      )
    )
  );
}

Object.assign(window, { PackRip });
