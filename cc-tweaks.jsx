// ─────────────────────────────────────────────────────────────
// Cardonomy — Tweaks (mounted outside the device frame)
// Drives CSS custom properties so changes propagate everywhere.
// ─────────────────────────────────────────────────────────────
const { useTweaks, TweaksPanel, TweakSection, TweakRadio } = window;

// neutral palettes — Radix Colors (Slate) scales mapped to our token system.
// plus --fill (high-contrast feature cards) and --glass (frosted bars)
const THEMES = {
  Light: {
    mode: 'light',
    '--bg': '#f1f3f5', '--surface': '#ffffff', '--surface-2': '#f8f9fa',
    '--ink': '#11181c', '--ink-2': '#2b333a', '--muted': '#687076', '--faint': '#889096',
    '--line': '#dfe3e6', '--line-2': '#eceef0',
    '--fill': '#11181c', '--glass': 'rgba(255,255,255,0.9)', '--up-wash': '#e9f6ec', '--ios-sb': '#11181c', '--logo-invert': 'none',
  },
  Dark: {
    mode: 'dark',
    '--bg': '#151718', '--surface': '#1c1f21', '--surface-2': '#202425',
    '--ink': '#ecedee', '--ink-2': '#c5cace', '--muted': '#9ba1a6', '--faint': '#697177',
    '--line': '#313538', '--line-2': '#26292b',
    '--fill': '#2a2f33', '--glass': 'rgba(21,23,24,0.85)', '--up-wash': '#1b2a1e', '--ios-sb': '#ffffff', '--logo-invert': 'invert(1)',
  },
  Midnight: {
    mode: 'dark',
    '--bg': '#000000', '--surface': '#0c0d0e', '--surface-2': '#141618',
    '--ink': '#eceef0', '--ink-2': '#c2c7cb', '--muted': '#8a9096', '--faint': '#565b60',
    '--line': '#1f2123', '--line-2': '#161819',
    '--fill': '#1c1f22', '--glass': 'rgba(0,0,0,0.82)', '--up-wash': '#16241a', '--ios-sb': '#ffffff', '--logo-invert': 'invert(1)',
  },
};

// accent palettes — Radix Colors [step9 accent, step10 press, wash] per mode
const ACCENTS = {
  Ink:     { swatch: '#11181c', light: ['#11181c', '#000000', '#eceef0'], dark: ['#43484e', '#363a3f', '#26292b'] },
  Indigo:  { swatch: '#3e63dd', light: ['#3e63dd', '#3a5ccc', '#e1e9ff'], dark: ['#5472e4', '#3e63dd', '#1c274d'] },
  Grass:   { swatch: '#46a758', light: ['#46a758', '#3d9a50', '#e9f6ec'], dark: ['#5bb469', '#46a758', '#1b2a1e'] },
  Tomato:  { swatch: '#e54d2e', light: ['#e54d2e', '#dd4425', '#fee9e2'], dark: ['#ec6142', '#e54d2e', '#3b1813'] },
  Orange:  { swatch: '#f76b15', light: ['#ef5f00', '#e35900', '#ffefd6'], dark: ['#f76b15', '#ef5f00', '#331e0b'] },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "Light",
  "accent": "Ink"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const r = document.documentElement.style;
  const theme = THEMES[t.theme] || THEMES.Light;
  Object.keys(theme).forEach(k => { if (k !== 'mode') r.setProperty(k, theme[k]); });
  const acc = ACCENTS[t.accent] || ACCENTS.Ink;
  const trip = theme.mode === 'dark' ? acc.dark : acc.light;
  r.setProperty('--accent', trip[0]);
  r.setProperty('--accent-press', trip[1]);
  r.setProperty('--accent-wash', trip[2]);
  // tell the device frame which status-bar style to use
  document.documentElement.setAttribute('data-theme', theme.mode);
}

function AccentSwatches({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '2px 0 6px' }}>
      {Object.keys(ACCENTS).map(name => {
        const on = value === name;
        return (
          <button key={name} onClick={() => onChange(name)} title={name} style={{
            width: 40, height: 40, borderRadius: 12, background: ACCENTS[name].swatch, cursor: 'pointer',
            border: 'none', boxShadow: on ? '0 0 0 2px var(--surface), 0 0 0 4px ' + ACCENTS[name].swatch : 'inset 0 0 0 1px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.15s',
          }}>{on && <span style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>✓</span>}</button>
        );
      })}
    </div>
  );
}

function TweakApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio label="Appearance" value={t.theme} options={['Light', 'Dark', 'Midnight']} onChange={(v) => setTweak('theme', v)} />
      <TweakSection label="Accent" />
      <AccentSwatches value={t.accent} onChange={(v) => setTweak('accent', v)} />
    </TweaksPanel>
  );
}

(function mount() {
  const el = document.getElementById('tweak-root');
  if (el) ReactDOM.createRoot(el).render(<TweakApp />);
})();
