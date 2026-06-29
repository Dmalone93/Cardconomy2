// ─────────────────────────────────────────────────────────────
// Logo Rip — loading screen where the logo tears apart to
// reveal the homepage beneath
// ─────────────────────────────────────────────────────────────
const { Logo: LogoRip } = window;

var RIP_STYLES = `
@keyframes ripShimmer {
  0% { transform: translateX(-150%) rotate(20deg); }
  100% { transform: translateX(150%) rotate(20deg); }
}
@keyframes ripFadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes ripSplitLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-52vw); }
}
@keyframes ripSplitRight {
  0% { transform: translateX(0); }
  100% { transform: translateX(52vw); }
}
@keyframes ripBgLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
@keyframes ripBgRight {
  0% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
`;

function PackRip({ onComplete }) {
  var ref = React.useState('loading'); // loading | ripping | done
  var phase = ref[0], setPhase = ref[1];

  // After logo appears, trigger the rip
  React.useEffect(function() {
    var t = setTimeout(function() {
      if (phase === 'loading') setPhase('ripping');
    }, 1200);
    return function() { clearTimeout(t); };
  }, []);

  // After rip animation, clean up
  React.useEffect(function() {
    if (phase === 'ripping') {
      var t = setTimeout(function() {
        setPhase('done');
        if (onComplete) onComplete();
      }, 1000);
      return function() { clearTimeout(t); };
    }
  }, [phase]);

  if (phase === 'done') return null;

  var triggerRip = function() {
    if (phase === 'loading') setPhase('ripping');
  };

  // The jagged tear line — used as clip-path on both halves
  // Left half: everything left of the tear (right edge is jagged)
  var tearLeft = 'polygon(0 0, 48% 0, 52% 2%, 47% 4.5%, 53% 7%, 46% 9.5%, 51% 12%, 47% 14.5%, 54% 17%, 48% 19.5%, 52% 22%, 46% 24.5%, 53% 27%, 47% 29.5%, 51% 32%, 48% 34.5%, 54% 37%, 46% 39.5%, 52% 42%, 47% 44.5%, 53% 47%, 48% 49.5%, 51% 52%, 46% 54.5%, 54% 57%, 47% 59.5%, 52% 62%, 48% 64.5%, 53% 67%, 46% 69.5%, 51% 72%, 47% 74.5%, 54% 77%, 48% 79.5%, 52% 82%, 46% 84.5%, 53% 87%, 47% 89.5%, 51% 92%, 48% 94.5%, 53% 97%, 50% 100%, 0 100%)';

  // Right half: everything right of the tear (left edge is jagged, mirrored)
  var tearRight = 'polygon(52% 0, 100% 0, 100% 100%, 50% 100%, 53% 97%, 48% 94.5%, 51% 92%, 47% 89.5%, 53% 87%, 46% 84.5%, 52% 82%, 48% 79.5%, 54% 77%, 47% 74.5%, 51% 72%, 46% 69.5%, 53% 67%, 48% 64.5%, 52% 62%, 47% 59.5%, 54% 57%, 46% 54.5%, 51% 52%, 48% 49.5%, 53% 47%, 47% 44.5%, 52% 42%, 46% 39.5%, 54% 37%, 48% 34.5%, 51% 32%, 47% 29.5%, 53% 27%, 46% 24.5%, 52% 22%, 48% 19.5%, 54% 17%, 47% 14.5%, 51% 12%, 46% 9.5%, 53% 7%, 47% 4.5%, 52% 2%, 52% 0)';

  var isRipping = phase === 'ripping';

  return React.createElement('div', {
    onClick: triggerRip,
    style: {
      position: 'fixed', inset: 0, zIndex: 9999,
      cursor: phase === 'loading' ? 'pointer' : 'default',
      overflow: 'hidden',
    },
  },
    React.createElement('style', { dangerouslySetInnerHTML: { __html: RIP_STYLES } }),

    // Left half of the dark background
    React.createElement('div', { style: {
      position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
      background: 'var(--fill)',
      animation: isRipping ? 'ripBgLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards' : 'none',
      zIndex: 2,
    } }),

    // Right half of the dark background
    React.createElement('div', { style: {
      position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
      background: 'var(--fill)',
      animation: isRipping ? 'ripBgRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards' : 'none',
      zIndex: 2,
    } }),

    // Shimmer on loading screen
    !isRipping && React.createElement('div', { style: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 3 } },
      React.createElement('div', { style: {
        position: 'absolute', top: '-20%', bottom: '-20%', width: '50%',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 60%, transparent 100%)',
        animation: 'ripShimmer 2s ease-in-out infinite',
      } })
    ),

    // Logo container — centered, splits into two halves on rip
    React.createElement('div', { style: {
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4,
    } },

      // Left half of logo
      React.createElement('div', { style: {
        position: 'absolute',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        clipPath: tearLeft,
        animation: isRipping
          ? 'ripFadeIn 0.4s ease both, ripSplitLeft 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.05s forwards'
          : 'ripFadeIn 0.4s ease both',
      } },
        LogoRip ? React.createElement(LogoRip, { size: 52, color: '#fff' }) : null,
        React.createElement('div', { style: {
          fontFamily: 'var(--wordmark)', fontWeight: 800, fontSize: 20, letterSpacing: 2.5, color: '#fff',
        } }, 'CARDCONOMY')
      ),

      // Right half of logo
      React.createElement('div', { style: {
        position: 'absolute',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        clipPath: tearRight,
        animation: isRipping
          ? 'ripFadeIn 0.4s ease both, ripSplitRight 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.05s forwards'
          : 'ripFadeIn 0.4s ease both',
      } },
        LogoRip ? React.createElement(LogoRip, { size: 52, color: '#fff' }) : null,
        React.createElement('div', { style: {
          fontFamily: 'var(--wordmark)', fontWeight: 800, fontSize: 20, letterSpacing: 2.5, color: '#fff',
        } }, 'CARDCONOMY')
      )
    ),

    // Tap hint
    !isRipping && React.createElement('div', { style: {
      position: 'absolute', bottom: '10%', left: 0, right: 0, textAlign: 'center',
      fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, letterSpacing: 1,
      color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', zIndex: 5,
    } }, 'tap to enter')
  );
}

Object.assign(window, { PackRip });
