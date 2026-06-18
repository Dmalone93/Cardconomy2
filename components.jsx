// ─────────────────────────────────────────────────────────────
// Cardonomy — shared UI components + theme
// ─────────────────────────────────────────────────────────────
const { GRADERS, gradeText, gameById, setById } = window;

const T = {
  bg: 'var(--bg)', surface: 'var(--surface)', surface2: 'var(--surface-2)',
  ink: 'var(--ink)', ink2: 'var(--ink-2)', muted: 'var(--muted)', faint: 'var(--faint)',
  line: 'var(--line)', line2: 'var(--line-2)',
  accent: 'var(--accent)', accentPress: 'var(--accent-press)', accentWash: 'var(--accent-wash)',
  up: 'var(--up)', upWash: 'var(--up-wash)', down: 'var(--down)', gold: 'var(--gold)',
  sans: 'var(--sans)', heading: 'var(--heading)', mono: 'var(--mono)',
};

// money formatter
function money(n, opts = {}) {
  const { cents = true } = opts;
  if (n == null) return '—';
  const fixed = n >= 1000 ? n.toLocaleString('en-GB', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 })
    : n.toFixed(cents ? 2 : 0);
  return '£' + fixed;
}

// ── Card art placeholder (looks like trading-card face) ──────
function CardArt({ item, w = 120, radius = 10, showFoil = true }) {
  const h = Math.round(w * 1.4);
  const art = item.art || '#334155';
  const g = gameById(item.game);
  const set = setById(item.set);
  const [realUrl, setRealUrl] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    setRealUrl(null); setLoaded(false); setFailed(false);
    if (window.CardImg) {
      window.CardImg.get(item, (url) => {
        if (!alive) return;
        if (url) { setRealUrl(url); }
        else { setFailed(true); }
      });
    } else {
      setFailed(true);
    }
    return () => { alive = false; };
  }, [item.game, item.name, item.number]);

  // Show skeleton shimmer until real image is loaded
  const showSkeleton = !loaded;

  return (
    <div style={{
      width: w, maxWidth: '100%', height: h, borderRadius: radius, position: 'relative',
      overflow: 'hidden', flexShrink: 0, isolation: 'isolate',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      background: '#e5e7eb',
    }}>
      {/* skeleton shimmer until image loads */}
      {showSkeleton && (
        <div className="shimmer" style={{
          position: 'absolute', inset: 0, borderRadius: radius, zIndex: 1,
        }} />
      )}
      {/* real card image (fades in once loaded) */}
      {realUrl && (
        <img src={realUrl} alt={item.name}
          onLoad={() => setLoaded(true)}
          onError={() => { setFailed(true); setRealUrl(null); }}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            borderRadius: radius, opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease', zIndex: 3,
          }}
        />
      )}
      {/* foil effect overlay — only on loaded foil cards */}
      {loaded && showFoil && item.foil && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
          background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 47%, transparent 60%)',
        }} />
      )}
    </div>
  );
}

// ── Graded slab (real PSA case image + card in the window) ───
function Slab({ item, w = 150 }) {
  const grd = item.grade || { company: 'raw' };
  if (grd.company === 'raw') {
    return (
      <div style={{ position: 'relative', display: 'inline-block', filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.16))' }}>
        <CardArt item={item} w={w} radius={12} />
      </div>
    );
  }
  const caseW = w, caseH = Math.round(w * 1.698); // matches slab image aspect (574×975)
  return (
    <div style={{ width: caseW, height: caseH, position: 'relative', filter: 'drop-shadow(0 12px 26px rgba(0,0,0,0.22))' }}>
      {/* card sits in the slab window */}
      <div style={{ position: 'absolute', left: '12.5%', top: '21.5%', width: '75%', height: '73%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <CardArt item={item} w={caseW * 0.75} radius={4} showFoil={true} />
          {/* plastic sheen over the card */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 4, pointerEvents: 'none',
            background: 'linear-gradient(118deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 22%, transparent 42%, transparent 70%, rgba(255,255,255,0.12) 100%)' }} />
        </div>
      </div>
      {/* the PSA case frame on top (label + plastic edges) */}
      <img src="ads/psa-slab.webp" alt="Graded slab" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none', zIndex: 5 }} />
    </div>
  );
}

// ── small grade chip (for cards in lists) ────────────────────
function GradeChip({ grade, size = 'sm' }) {
  const meta = GRADERS[grade.company] || GRADERS.raw;
  const small = size === 'sm';
  if (grade.company === 'raw') {
    return (
      <span style={{
        fontFamily: T.sans, fontWeight: 600, fontSize: small ? 10.5 : 12,
        color: T.muted, background: T.surface2, border: '1px solid ' + 'var(--line)',
        borderRadius: 5, padding: small ? '1px 6px' : '3px 9px', letterSpacing: 0.2,
      }}>RAW</span>
    );
  }
  return (
    <span style={{
      fontFamily: T.sans, fontWeight: 800, fontSize: small ? 10.5 : 12,
      color: meta.fg, background: meta.bg, borderRadius: 5,
      padding: small ? '1px 6px' : '3px 9px', letterSpacing: 0.3,
      display: 'inline-flex', gap: 4, alignItems: 'center',
    }}>
      {meta.label} <span style={{ fontFamily: T.mono }}>{grade.grade}</span>
    </span>
  );
}

// ── sparkline / price history ────────────────────────────────
function Sparkline({ data, w = 300, h = 64, up = true, fill = true, dots = false }) {
  const min = Math.min(...data), max = Math.max(...data);
  const pad = 4;
  const span = (max - min) || 1;
  const xs = (i) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const ys = (v) => pad + (1 - (v - min) / span) * (h - pad * 2);
  const pts = data.map((v, i) => [xs(i), ys(v)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ' L' + xs(data.length - 1).toFixed(1) + ' ' + (h - pad) + ' L' + pad + ' ' + (h - pad) + ' Z';
  const col = up ? T.up : T.down;
  const gid = 'spk' + Math.round(Math.random() * 1e6);
  return (
    <svg width={w} height={h} viewBox={'0 0 ' + w + ' ' + h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={col} stopOpacity="0.22" />
          <stop offset="1" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={'url(#' + gid + ')'} />}
      <path d={line} fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {dots && <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3.5" fill={col} stroke="#fff" strokeWidth="1.5" />}
    </svg>
  );
}

// ── delta pill (price change) ────────────────────────────────
function Delta({ from, to, style = {} }) {
  const pct = ((to - from) / from) * 100;
  const up = pct >= 0;
  return (
    <span style={{
      fontFamily: T.mono, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
      color: up ? T.up : T.down, display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0, ...style,
    }}>
      {(up ? '▲ ' : '▼ ') + Math.abs(pct).toFixed(1) + '%'}
    </span>
  );
}

// ── star rating ──────────────────────────────────────────────
function Stars({ rating, size = 12 }) {
  const full = Math.round((rating / 100) * 5 * 2) / 2;
  return (
    <span style={{ display: 'inline-flex', gap: 1, color: T.gold, fontSize: size }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ opacity: i <= Math.round(full) ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  );
}

// ── shared pill badge (consistent across the app) ────────────
function Badge({ children, tone = 'neutral', style = {} }) {
  const tones = {
    neutral: ['var(--surface-2)', 'var(--ink-2)'],
    accent:  ['var(--accent-wash)', 'var(--accent)'],
    gold:    ['oklch(0.95 0.06 85)', 'oklch(0.52 0.11 75)'],
    up:      ['var(--up-wash)', 'var(--up)'],
    down:    ['oklch(0.95 0.04 24)', 'var(--down)'],
  };
  const [bg, fg] = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
      fontFamily: T.sans, fontWeight: 700, fontSize: 10.5, letterSpacing: 0.2,
      background: bg, color: fg, borderRadius: 7, padding: '3px 8px', ...style,
    }}>{children}</span>
  );
}

// ── pill chip / segmented filter ─────────────────────────────
function Chip({ children, active, onClick, leading, style = {} }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
      fontFamily: T.sans, fontWeight: 600, fontSize: 13.5,
      padding: '8px 14px', borderRadius: 999,
      background: active ? 'var(--fill)' : T.surface,
      color: active ? '#fff' : T.ink2,
      boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--line)',
      transition: 'all 0.15s ease', ...style,
    }}>
      {leading}{children}
    </button>
  );
}

// ── icon set (stroked, minimal) ──────────────────────────────
const Icon = {
  search: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  menu: (p={}) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  cart: (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 4h2l2.2 11.2a1.5 1.5 0 001.5 1.2h8.1a1.5 1.5 0 001.5-1.2L21 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9.5" cy="20" r="1.4" fill="currentColor"/><circle cx="17.5" cy="20" r="1.4" fill="currentColor"/></svg>,
  home: (p={}) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-5h-6v5H5a1 1 0 01-1-1v-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  grid: (p={}) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="2"/></svg>,
  sell: (p={}) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  heart: (p={}, filled) => <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} {...p}><path d="M12 20s-7-4.5-7-9.5A4 4 0 0112 7a4 4 0 017 3.5C19 15.5 12 20 12 20z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  user: (p={}) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="2"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  back: (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  filter: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  share: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3v12M12 3L8 7M12 3l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12v7a1 1 0 001 1h12a1 1 0 001-1v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  check: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>,
  trash: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevron: (p={}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  camera: (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2"/></svg>,
  bolt: (p={}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>,
  gavel: (p={}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M14 4l6 6-3 3-6-6 3-3zM8 10l6 6-6 6-6-6 6-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  tag: (p={}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 4h7l9 9-7 7-9-9V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="8" cy="8" r="1.6" fill="currentColor"/></svg>,
  truck: (p={}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="7" cy="18" r="1.8" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="18" r="1.8" stroke="currentColor" strokeWidth="2"/></svg>,
  shield: (p={}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
};

// ── bottom tab nav ───────────────────────────────────────────
function BottomNav({ tab, setTab, watchCount }) {
  const tabs = [
    { id: 'home', label: 'Browse', icon: Icon.home },
    { id: 'search', label: 'Search', icon: Icon.search },
    { id: 'sell', label: 'Sell', icon: Icon.sell, primary: true },
    { id: 'watch', label: 'Watching', icon: Icon.heart, badge: watchCount },
    { id: 'profile', label: 'You', icon: Icon.user },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingBottom: 26, paddingTop: 8,
      background: 'var(--glass)', backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: '1px solid var(--line)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
    }}>
      {tabs.map(t => {
        const on = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            flex: 1, paddingTop: 2, position: 'relative',
            color: on ? T.accent : T.faint,
          }}>
            {t.primary ? (
              <div style={{
                width: 46, height: 30, marginTop: -2, borderRadius: 11,
                background: T.accent, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px oklch(0.52 0.2 264 / 0.4)',
              }}>{t.icon({ width: 22, height: 22 })}</div>
            ) : t.icon({})}
            {t.badge ? (
              <span style={{
                position: 'absolute', top: -2, right: '50%', marginRight: -22,
                background: T.down, color: '#fff', fontFamily: T.sans, fontWeight: 700,
                fontSize: 10, minWidth: 16, height: 16, borderRadius: 999, padding: '0 4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{t.badge}</span>
            ) : null}
            <span style={{ fontFamily: T.sans, fontSize: 10.5, fontWeight: on ? 700 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── bottom sheet (modal) ─────────────────────────────────────
function Sheet({ open, onClose, children, height = 'auto', title }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(10,12,18,0.4)',
        animation: 'ccScrim 0.2s ease',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: T.surface, borderRadius: '22px 22px 0 0',
        maxHeight: '88%', display: 'flex', flexDirection: 'column',
        animation: 'ccSlideUp 0.28s cubic-bezier(0.2,0.9,0.3,1)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 38, height: 5, borderRadius: 999, background: 'var(--line)' }} />
        </div>
        {title && (
          <div style={{
            fontFamily: T.sans, fontWeight: 700, fontSize: 17, padding: '12px 20px 8px',
          }}>{title}</div>
        )}
        <div className="noscroll" style={{ overflow: 'auto', padding: '4px 20px 30px' }}>{children}</div>
      </div>
    </div>
  );
}

// ── toast ────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  const isRich = typeof msg === 'object' && msg.title;
  return (
    <div style={{
      position: 'absolute', bottom: 96, left: '50%', transform: 'translateX(-50%)',
      zIndex: 90, background: 'var(--fill)', color: '#fff', borderRadius: 12,
      padding: isRich ? '11px 14px' : '11px 18px', fontFamily: T.sans, fontSize: 14, fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)', animation: 'ccFade 0.2s ease',
      display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
      maxWidth: 'calc(100% - 32px)',
    }}>
      {isRich ? (
        <React.Fragment>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{msg.title}</div>
            {msg.subtitle && <div style={{ fontSize: 11, opacity: 0.8, marginTop: 1, fontWeight: 500 }}>{msg.subtitle}</div>}
          </div>
          {msg.action && msg.onAction && (
            <button onClick={msg.onAction} style={{ color: 'var(--accent-wash)', fontFamily: T.sans, fontWeight: 700, fontSize: 11, background: 'none', padding: '4px 0', whiteSpace: 'nowrap', flexShrink: 0 }}>{msg.action}</button>
          )}
        </React.Fragment>
      ) : msg}
    </div>
  );
}

// ── brand mark (fanned trio of cards) ────────────────────────
function Logo({ size = 28, color = 'currentColor', style = {} }) {
  const h = Math.round(size * 147 / 135);
  return (
    <svg width={size} height={h} viewBox="0 0 135 147" fill="none" style={{ color, display: 'block', ...style }}>
      <path d="M134.047 112.854L113.87 74.7287C113.365 73.774 112.182 73.4096 111.227 73.9149L52.7288 104.873C51.774 105.378 51.4096 106.562 51.9149 107.516L72.0912 145.641C72.5964 146.596 73.78 146.961 74.7348 146.455L133.233 115.497C134.188 114.992 134.552 113.808 134.047 112.854Z" fill="currentColor"></path>
      <path d="M51.2594 54.1188L8.30231 50.2085C7.22656 50.1106 6.27511 50.9033 6.17719 51.979L0.177287 117.891C0.0793624 118.967 0.872047 119.918 1.9478 120.016L44.9048 123.927C45.9806 124.025 46.932 123.232 47.03 122.156L53.0299 56.2439C53.1278 55.1682 52.3351 54.2167 51.2594 54.1188Z" fill="currentColor"></path>
      <path d="M117.389 49.8882L86.8878 80.3891C86.7098 80.5669 86.4208 80.5671 86.2429 80.3891L39.4433 33.5895C39.2654 33.4116 39.2655 33.1226 39.4433 32.9446L69.9442 2.44369C70.1222 2.26567 70.4111 2.26566 70.5892 2.44369L117.389 49.2433C117.567 49.4213 117.567 49.7102 117.389 49.8882Z" stroke="currentColor" strokeWidth="3"></path>
    </svg>
  );
}

// ── side menu (hamburger drawer) ─────────────────────────────
function SideMenu({ app, open, onClose }) {
  if (!open) return null;
  const games = (window.GAMES || []).filter(g => !['arcana', 'digimon', 'sports'].includes(g.id));
  const go = (fn) => { onClose(); setTimeout(fn, 60); };
  const quick = [
    ['Sell your cards', Icon.sell, () => go(() => app.nav.setTab('sell'))],
    ['Trade with collectors', Icon.gavel, () => go(() => app.nav.push('trade'))],
    ['My buylist', Icon.tag, () => go(() => app.nav.push('buylist'))],
    ['Watching', Icon.heart, () => go(() => app.nav.setTab('watch'))],
    ['Find a local shop', Icon.shield, () => go(() => app.nav.push('shopfinder'))],
    ['Collector\'s corner', Icon.bolt, () => go(() => app.toast('Opening the help center'))],
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 95 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(10,12,18,0.45)', animation: 'ccScrim 0.2s ease' }} />
      <div className="noscroll" style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '82%', maxWidth: 320, background: T.surface,
        boxShadow: '6px 0 30px rgba(0,0,0,0.25)', animation: 'ccMenuIn 0.28s cubic-bezier(0.2,0.9,0.3,1)',
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 18px 16px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Logo size={24} color={T.accent} />
            <img src="brand/wordmark.png" alt="CARDONOMY" style={{ height: 15, width: 'auto', display: 'block', filter: 'var(--logo-invert, none)' }} />
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 999, background: T.surface2, color: T.ink2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        {/* games */}
        <div style={{ padding: '10px 0 6px' }}>
          <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 11.5, letterSpacing: 0.6, color: T.faint, padding: '8px 20px 6px' }}>SHOP BY GAME</div>
          {games.map(g => (
            <button key={g.id} onClick={() => go(() => app.nav.push('search', { game: g.id }))} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', textAlign: 'left', background: 'transparent' }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: g.tint, flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: T.sans, fontWeight: 600, fontSize: 16 }}>{g.name}</span>
              {Icon.chevron({ style: { color: T.faint } })}
            </button>
          ))}
        </div>

        {/* quick links */}
        <div style={{ borderTop: '1px solid var(--line)', padding: '10px 0' }}>
          <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 11.5, letterSpacing: 0.6, color: T.faint, padding: '8px 20px 6px' }}>QUICK LINKS</div>
          {quick.map(([label, ic, onClick]) => (
            <button key={label} onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '13px 20px', textAlign: 'left', background: 'transparent' }}>
              <span style={{ color: T.muted }}>{ic({ width: 20, height: 20 })}</span>
              <span style={{ flex: 1, fontFamily: T.sans, fontWeight: 600, fontSize: 15.5 }}>{label}</span>
              {Icon.chevron({ style: { color: T.faint } })}
            </button>
          ))}
        </div>

        {/* footer cta */}
        <div style={{ marginTop: 'auto', padding: '16px 18px 30px', borderTop: '1px solid var(--line)' }}>
          <button onClick={() => go(() => app.nav.push('enroll_shop'))} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--up-wash)', borderRadius: 13, padding: '13px 14px', textAlign: 'left' }}>
            <span style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--up)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 9l1-4h14l1 4M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M4 9h16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
            </span>
            <span style={{ flex: 1, fontFamily: T.sans, fontSize: 13, color: T.ink2 }}><b style={{ color: T.ink }}>Own a game shop?</b><br/>List it on Cardonomy</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Native share utility ─────────────────────────────────────
function shareCard(item) {
  const url = window.location.origin + '/#listing/' + item.id;
  const text = item.name + (item.subtitle ? ' \u2014 ' + item.subtitle : '');
  if (navigator.share) {
    navigator.share({ title: item.name, text: text, url: url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
  }
}

Object.assign(window, {
  T, money, CardArt, Slab, GradeChip, Sparkline, Delta, Stars, Chip, Badge, Icon, BottomNav, Sheet, Toast, Logo, SideMenu, shareCard,
});
