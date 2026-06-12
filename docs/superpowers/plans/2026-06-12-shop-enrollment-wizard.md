# Shop Enrollment Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current single-tap enroll flow with a 6-step linear wizard that collects shop details, verification, games, buylist, payout, and branding.

**Architecture:** Replace the `EnrollShopScreen` component in `screen_storefront.jsx` with a wizard that uses local state to track the current step and all form data. The landing page (hero, value props, testimonial) stays as step 0 / the entry screen. Tapping "Enroll" advances to step 1 of the wizard. A StepIndicator component renders the progress dots. Each step is a function component receiving the shared form state and setters.

**Tech Stack:** In-browser React 18 + Babel (existing prototype stack). No build step.

---

## File Structure

```
screen_storefront.jsx    — Replace EnrollShopScreen (lines 105-186) with wizard version
```

Single file change. The wizard, step indicator, and all 6 step components live inside `screen_storefront.jsx` alongside the existing `StorefrontScreen`.

---

### Task 1: Replace EnrollShopScreen with wizard shell + StepIndicator

**Files:**
- Modify: `screen_storefront.jsx:105-186`

- [ ] **Step 1: Replace EnrollShopScreen with wizard state management**

Replace the entire `EnrollShopScreen` function (lines 105-186) with a new version that manages wizard state. Keep the landing page (hero, stats, value props, testimonial, CTA) as the initial view (`step === 0`). When the user taps "Enroll your shop — free", set step to 1.

The component should have:
- `step` state (0 = landing, 1-6 = wizard steps, 7 = success)
- `form` state object holding all fields from all steps
- A `StepIndicator` component
- A `WizardField` helper for consistent text inputs
- Individual step render functions (Step1 through Step6)
- Success screen render

Read the existing file first. The component uses aliases `TF`, `IconF`, etc. Match those.

```jsx
function EnrollShopScreen({ app }) {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({
    shopName: '', address: '', city: '', state: '', zip: '', phone: '',
    hours: {
      mon: { open: '10:00', close: '20:00', closed: false },
      tue: { open: '10:00', close: '20:00', closed: false },
      wed: { open: '10:00', close: '20:00', closed: false },
      thu: { open: '10:00', close: '20:00', closed: false },
      fri: { open: '10:00', close: '20:00', closed: false },
      sat: { open: '10:00', close: '20:00', closed: false },
      sun: { open: '11:00', close: '18:00', closed: false },
    },
    ownerName: '', role: 'owner', uploaded: false,
    games: [],
    bulkRates: { cu: '6', rh: '25', fo: '80' },
    wantedCards: [],
    buylistSkipped: false,
    payoutMethod: 'bank',
    bankName: '', routing: '', account: '',
    logo: false, accentColor: '#2f8f5b', bio: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Step validation — determines if Continue is enabled
  const canContinue = () => {
    if (step === 1) return form.shopName && form.address && form.city && form.state && form.zip && form.phone;
    if (step === 2) return form.ownerName && form.role;
    if (step === 3) return form.games.length > 0;
    if (step === 4) return form.buylistSkipped || (form.bulkRates.cu && form.bulkRates.rh && form.bulkRates.fo);
    if (step === 5) return form.payoutMethod === 'credit' || (form.bankName && form.routing && form.account);
    if (step === 6) return true; // branding is all optional
    return true;
  };

  const STEP_LABELS = ['Shop', 'Verify', 'Games', 'Buylist', 'Payout', 'Brand'];
```

- [ ] **Step 2: Add StepIndicator component**

Add this inside the file, before `EnrollShopScreen`:

```jsx
function StepIndicator({ current, total, onJump }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 16px', alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => {
        const stepNum = i + 1;
        const completed = stepNum < current;
        const active = stepNum === current;
        return (
          <button key={i}
            onClick={() => completed ? onJump(stepNum) : null}
            style={{
              flex: 1, height: 4, borderRadius: 2, padding: 0,
              background: active ? 'var(--accent)' : completed ? 'var(--fill)' : 'var(--line)',
              cursor: completed ? 'pointer' : 'default',
              transition: 'background 0.2s',
            }}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Add WizardField helper**

A reusable text input component for the wizard:

```jsx
function WizardField({ label, value, onChange, placeholder, type = 'text', style = {} }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 6 }}>{label}</div>}
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} type={type}
        style={{ width: '100%', padding: '12px 14px', borderRadius: 4, border: 'none',
          background: TF.surface, boxShadow: 'inset 0 0 0 1px var(--line)',
          fontFamily: TF.sans, fontSize: 15, color: TF.ink, outline: 'none' }} />
    </div>
  );
}
```

- [ ] **Step 4: Add the wizard header and navigation shell**

Inside `EnrollShopScreen`, after the landing page return (step === 0), add the wizard shell that wraps all steps 1-6:

```jsx
  // ── Wizard steps 1-6 ──
  if (step >= 1 && step <= 6) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TF.bg }}>
        {/* header */}
        <div style={{ padding: '52px 12px 8px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button onClick={() => step === 1 ? setStep(0) : setStep(step - 1)}
            style={{ width: 38, height: 38, borderRadius: 999, background: TF.surface, color: TF.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-1)' }}>
            {IconF.back({})}
          </button>
          <div style={{ flex: 1, fontFamily: TF.sans, fontWeight: 700, fontSize: 16 }}>
            Step {step} of 6 — {STEP_LABELS[step - 1]}
          </div>
        </div>
        <div style={{ padding: '8px 0 16px', flexShrink: 0 }}>
          <StepIndicator current={step} total={6} onJump={setStep} />
        </div>

        {/* step content */}
        <div className="noscroll" style={{ flex: 1, overflow: 'auto', padding: '0 16px 120px' }}>
          {step === 1 && <Step1 form={form} set={set} />}
          {step === 2 && <Step2 form={form} set={set} />}
          {step === 3 && <Step3 form={form} set={set} />}
          {step === 4 && <Step4 form={form} set={set} />}
          {step === 5 && <Step5 form={form} set={set} />}
          {step === 6 && <Step6 form={form} set={set} />}
        </div>

        {/* sticky continue */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px 30px', background: 'var(--glass)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--line)' }}>
          <button onClick={() => setStep(step + 1)} disabled={!canContinue()}
            style={{ width: '100%', background: canContinue() ? 'var(--fill)' : 'var(--line)', color: canContinue() ? '#fff' : TF.muted,
              borderRadius: 4, padding: 16, fontFamily: TF.sans, fontWeight: 700, fontSize: 16 }}>
            {step === 6 ? 'Submit application' : 'Continue'}
          </button>
          {step === 4 && !form.buylistSkipped && (
            <button onClick={() => { set('buylistSkipped', true); setStep(5); }}
              style={{ width: '100%', marginTop: 8, color: TF.muted, fontFamily: TF.sans, fontWeight: 600, fontSize: 14, padding: 8, background: 'none' }}>
              I'll set this up later
            </button>
          )}
        </div>
      </div>
    );
  }
```

- [ ] **Step 5: Commit wizard shell**

```bash
git add screen_storefront.jsx
git commit -m "feat: add enrollment wizard shell with step indicator and navigation"
```

---

### Task 2: Implement Steps 1-3 (Shop, Verify, Games)

**Files:**
- Modify: `screen_storefront.jsx`

- [ ] **Step 1: Implement Step1 — Your Shop**

Add this function inside `screen_storefront.jsx`:

```jsx
function Step1({ form, set }) {
  const DAYS = [['mon','Mon'],['tue','Tue'],['wed','Wed'],['thu','Thu'],['fri','Fri'],['sat','Sat'],['sun','Sun']];
  const setHour = (day, field, val) => {
    set('hours', { ...form.hours, [day]: { ...form.hours[day], [field]: val } });
  };
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Your shop</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>Basic details so collectors can find you.</p>
      <WizardField label="Shop name" value={form.shopName} onChange={v => set('shopName', v)} placeholder="e.g. Gnome Games" />
      <WizardField label="Street address" value={form.address} onChange={v => set('address', v)} placeholder="123 Main St" />
      <div style={{ display: 'flex', gap: 10 }}>
        <WizardField label="City" value={form.city} onChange={v => set('city', v)} placeholder="Madison" style={{ flex: 2 }} />
        <WizardField label="State" value={form.state} onChange={v => set('state', v)} placeholder="WI" style={{ flex: 1 }} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <WizardField label="ZIP code" value={form.zip} onChange={v => set('zip', v)} placeholder="53703" style={{ flex: 1 }} />
        <WizardField label="Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="(608) 555-0123" type="tel" style={{ flex: 2 }} />
      </div>
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10, marginTop: 6 }}>Opening hours</div>
      {DAYS.map(([key, label]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ width: 36, fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: form.hours[key].closed ? TF.faint : TF.ink }}>{label}</span>
          {form.hours[key].closed ? (
            <span style={{ flex: 1, fontFamily: TF.sans, fontSize: 13, color: TF.faint }}>Closed</span>
          ) : (
            <React.Fragment>
              <input type="time" value={form.hours[key].open} onChange={e => setHour(key, 'open', e.target.value)}
                style={{ flex: 1, padding: '8px 10px', borderRadius: 4, border: 'none', background: TF.surface, boxShadow: 'inset 0 0 0 1px var(--line)', fontFamily: TF.sans, fontSize: 13, color: TF.ink }} />
              <span style={{ fontFamily: TF.sans, fontSize: 12, color: TF.muted }}>to</span>
              <input type="time" value={form.hours[key].close} onChange={e => setHour(key, 'close', e.target.value)}
                style={{ flex: 1, padding: '8px 10px', borderRadius: 4, border: 'none', background: TF.surface, boxShadow: 'inset 0 0 0 1px var(--line)', fontFamily: TF.sans, fontSize: 13, color: TF.ink }} />
            </React.Fragment>
          )}
          <button onClick={() => setHour(key, 'closed', !form.hours[key].closed)}
            style={{ fontFamily: TF.sans, fontSize: 11, fontWeight: 600, color: form.hours[key].closed ? TF.accent : TF.faint, padding: '4px 8px', background: 'none' }}>
            {form.hours[key].closed ? 'Open' : 'Close'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Implement Step2 — Verify Your Business**

```jsx
function Step2({ form, set }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Verify your business</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>We verify within 2 business days. Your shop won't appear publicly until verified.</p>
      <WizardField label="Owner full name" value={form.ownerName} onChange={v => set('ownerName', v)} placeholder="Sara Johnson" />
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Your role</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['owner', 'manager', 'staff'].map(r => (
          <button key={r} onClick={() => set('role', r)} style={{
            flex: 1, padding: '12px 10px', borderRadius: 4, textAlign: 'center',
            background: form.role === r ? 'var(--accent-wash)' : TF.surface,
            boxShadow: form.role === r ? '0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)',
            fontFamily: TF.sans, fontWeight: 600, fontSize: 14,
            color: form.role === r ? TF.accent : TF.ink,
          }}>{r.charAt(0).toUpperCase() + r.slice(1)}</button>
        ))}
      </div>
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Storefront photo or business registration</div>
      <button onClick={() => set('uploaded', !form.uploaded)} style={{
        width: '100%', height: 120, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: form.uploaded ? 'var(--up-wash)' : TF.surface,
        boxShadow: form.uploaded ? '0 0 0 2px var(--up)' : 'inset 0 0 0 1.5px var(--line)',
        color: form.uploaded ? 'var(--up)' : TF.muted,
      }}>
        {form.uploaded
          ? <React.Fragment>{IconF.check({ width: 28, height: 28 })}<span style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13 }}>Photo uploaded</span></React.Fragment>
          : <React.Fragment>{IconF.camera ? IconF.camera({ width: 28, height: 28 }) : <span style={{ fontSize: 28 }}>📷</span>}<span style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13 }}>Tap to upload</span></React.Fragment>
        }
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Implement Step3 — Games You Buy**

```jsx
function Step3({ form, set }) {
  const GAME_LIST = window.GAMES || [];
  const toggle = (id) => {
    const g = form.games.includes(id) ? form.games.filter(x => x !== id) : [...form.games, id];
    set('games', g);
  };
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Games you buy</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>Select the TCGs your shop deals in. You can change this later.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {GAME_LIST.map(g => {
          const on = form.games.includes(g.id);
          return (
            <button key={g.id} onClick={() => toggle(g.id)} style={{
              padding: 16, borderRadius: 4, textAlign: 'center',
              background: on ? g.tint + '1a' : TF.surface,
              boxShadow: on ? '0 0 0 2px ' + g.tint : 'inset 0 0 0 1px var(--line)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 32, height: 32, borderRadius: 999, background: g.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {on && <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>✓</span>}
              </span>
              <span style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 14, color: on ? g.tint : TF.ink }}>{g.short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify steps 1-3 render**

Reload `index.html`, navigate to the enroll screen, tap "Enroll your shop — free". Steps 1-3 should render with the step indicator. Back button should work. Tap completed step dots to jump back.

- [ ] **Step 5: Commit**

```bash
git add screen_storefront.jsx
git commit -m "feat: add wizard steps 1-3 (shop details, verification, games)"
```

---

### Task 3: Implement Steps 4-6 (Buylist, Payout, Branding) + Success Screen

**Files:**
- Modify: `screen_storefront.jsx`

- [ ] **Step 1: Implement Step4 — Buylist Setup**

```jsx
function Step4({ form, set }) {
  const setRate = (key, val) => set('bulkRates', { ...form.bulkRates, [key]: val });
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Buylist setup</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>Set your standing bulk buy rates. Sellers see these when submitting cards.</p>
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Bulk rates (per 1,000 cards)</div>
      {[['cu', 'Commons / Uncommons'], ['rh', 'Rares / Holos'], ['fo', 'Foils (any)']].map(([key, label]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ flex: 1, fontFamily: TF.sans, fontSize: 14, fontWeight: 500 }}>{label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: TF.surface, borderRadius: 4, padding: '8px 12px', boxShadow: 'inset 0 0 0 1px var(--line)', width: 90 }}>
            <span style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 15, color: TF.muted }}>$</span>
            <input value={form.bulkRates[key]} onChange={e => setRate(key, e.target.value)} type="number"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TF.sans, fontWeight: 700, fontSize: 15, color: TF.ink, width: 40 }} />
          </div>
        </div>
      ))}
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginTop: 20, marginBottom: 10 }}>Wanted singles</div>
      <p style={{ fontFamily: TF.sans, fontSize: 13, color: TF.muted, margin: '0 0 12px' }}>Cards you always want to buy. Sellers with matches get highlighted.</p>
      {form.wantedCards.length === 0 && (
        <div style={{ padding: 20, textAlign: 'center', color: TF.faint, fontFamily: TF.sans, fontSize: 13, background: TF.surface, borderRadius: 4, boxShadow: 'inset 0 0 0 1px var(--line)' }}>
          No wanted cards yet
        </div>
      )}
      {form.wantedCards.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '10px 12px', background: TF.surface, borderRadius: 4 }}>
          <span style={{ flex: 1, fontFamily: TF.sans, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
          <span style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 14 }}>${c.maxPrice}</span>
          <button onClick={() => set('wantedCards', form.wantedCards.filter((_, j) => j !== i))}
            style={{ color: TF.faint, fontWeight: 700, fontSize: 18, background: 'none', padding: '0 4px' }}>×</button>
        </div>
      ))}
      <button onClick={() => {
        const examples = [{ name: 'Charizard ex', maxPrice: 300 }, { name: 'Black Lotus', maxPrice: 20000 }, { name: 'Umbreon VMAX', maxPrice: 900 }];
        const next = examples[form.wantedCards.length % examples.length];
        set('wantedCards', [...form.wantedCards, next]);
      }} style={{ marginTop: 10, fontFamily: TF.sans, fontWeight: 600, fontSize: 14, color: TF.accent, background: 'none', padding: 0 }}>
        + Add a card
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Implement Step5 — Payout Details**

```jsx
function Step5({ form, set }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Payout details</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>How you receive funds from sales on Cardconomy. You can update this anytime in settings.</p>
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Payout method</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['bank', 'Bank transfer'], ['credit', 'Store credit only']].map(([val, label]) => (
          <button key={val} onClick={() => set('payoutMethod', val)} style={{
            flex: 1, padding: '14px 10px', borderRadius: 4, textAlign: 'center',
            background: form.payoutMethod === val ? 'var(--accent-wash)' : TF.surface,
            boxShadow: form.payoutMethod === val ? '0 0 0 2px var(--accent)' : 'inset 0 0 0 1px var(--line)',
            fontFamily: TF.sans, fontWeight: 600, fontSize: 14,
            color: form.payoutMethod === val ? TF.accent : TF.ink,
          }}>{label}</button>
        ))}
      </div>
      {form.payoutMethod === 'bank' && (
        <div>
          <WizardField label="Account holder name" value={form.bankName} onChange={v => set('bankName', v)} placeholder="Gnome Games LLC" />
          <WizardField label="Routing number" value={form.routing} onChange={v => set('routing', v)} placeholder="021000021" />
          <WizardField label="Account number" value={form.account} onChange={v => set('account', v)} placeholder="•••••••1234" />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Implement Step6 — Branding**

```jsx
function Step6({ form, set }) {
  const COLORS = ['#2f8f5b', '#1d4ed8', '#7c3aed', '#dc2626', '#ea580c', '#0e7490', '#334155', '#b8860b'];
  const GAME_LIST = window.GAMES || [];
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: TF.sans, fontWeight: 800, fontSize: 22, letterSpacing: -0.4 }}>Branding</h2>
      <p style={{ fontFamily: TF.sans, fontSize: 14, color: TF.muted, margin: '0 0 20px', lineHeight: 1.4 }}>Make your storefront stand out in the directory.</p>

      {/* logo upload */}
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Shop logo or photo</div>
      <button onClick={() => set('logo', !form.logo)} style={{
        width: 80, height: 80, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: form.logo ? form.accentColor : TF.surface,
        boxShadow: form.logo ? 'none' : 'inset 0 0 0 1.5px var(--line)',
        color: form.logo ? '#fff' : TF.muted, marginBottom: 20,
      }}>
        {form.logo
          ? <span style={{ fontFamily: TF.sans, fontWeight: 800, fontSize: 28 }}>{(form.shopName || 'S').charAt(0).toUpperCase()}</span>
          : <span style={{ fontSize: 24 }}>📷</span>
        }
      </button>

      {/* accent color */}
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Accent color</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {COLORS.map(c => (
          <button key={c} onClick={() => set('accentColor', c)} style={{
            width: 36, height: 36, borderRadius: 999, background: c, padding: 0,
            boxShadow: form.accentColor === c ? '0 0 0 3px var(--bg), 0 0 0 5px ' + c : 'none',
          }} />
        ))}
      </div>

      {/* bio */}
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginBottom: 10 }}>Shop bio</div>
      <textarea value={form.bio} onChange={e => e.target.value.length <= 200 && set('bio', e.target.value)}
        placeholder="Tell collectors what makes your shop special"
        rows={3} style={{
          width: '100%', padding: '12px 14px', borderRadius: 4, border: 'none', resize: 'none',
          background: TF.surface, boxShadow: 'inset 0 0 0 1px var(--line)',
          fontFamily: TF.sans, fontSize: 15, color: TF.ink, outline: 'none',
        }} />
      <div style={{ fontFamily: TF.sans, fontSize: 11, color: TF.faint, textAlign: 'right', marginTop: 4 }}>{form.bio.length}/200</div>

      {/* live preview */}
      <div style={{ fontFamily: TF.sans, fontWeight: 600, fontSize: 13, color: TF.ink2, marginTop: 16, marginBottom: 10 }}>Preview</div>
      <div style={{ background: TF.surface, borderRadius: 4, padding: 14, boxShadow: '0 1px 3px rgba(20,24,40,0.05)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 4, background: form.accentColor, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TF.sans, fontWeight: 800, fontSize: 20, flexShrink: 0,
        }}>{(form.shopName || 'S').charAt(0).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 15 }}>{form.shopName || 'Your Shop'}</div>
          <div style={{ fontFamily: TF.sans, fontSize: 12, color: TF.muted, marginTop: 2 }}>
            {form.bio || 'Your bio will appear here'}
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            {form.games.map(gid => {
              const g = GAME_LIST.find(x => x.id === gid);
              return g ? <span key={gid} style={{ background: g.tint + '1a', color: g.tint, padding: '1px 6px', borderRadius: 4, fontFamily: TF.sans, fontWeight: 600, fontSize: 10 }}>{g.short}</span> : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement Success Screen (step === 7)**

Add the success screen inside `EnrollShopScreen`, before the wizard steps block:

```jsx
  // ── Success ──
  if (step === 7) {
    const GAME_LIST = window.GAMES || [];
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: TF.bg, alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: 999, background: 'var(--up-wash)', color: 'var(--up)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ccPop 0.4s ease' }}>{IconF.check({ width: 44, height: 44 })}</div>
        <h1 style={{ margin: '20px 0 6px', fontFamily: TF.sans, fontWeight: 800, fontSize: 24, letterSpacing: -0.5 }}>Your application is in review</h1>
        <p style={{ fontFamily: TF.sans, fontSize: 14.5, color: TF.muted, lineHeight: 1.5, maxWidth: 290 }}>We'll verify your shop within 2 business days and send your QR intake kit.</p>

        {/* summary card */}
        <div style={{ background: TF.surface, borderRadius: 4, padding: 16, marginTop: 20, width: '100%', maxWidth: 300, textAlign: 'left', boxShadow: '0 1px 3px rgba(20,24,40,0.05)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 4, background: form.accentColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TF.sans, fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
              {(form.shopName || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: TF.sans, fontWeight: 700, fontSize: 15 }}>{form.shopName}</div>
              <div style={{ fontFamily: TF.sans, fontSize: 12, color: TF.muted }}>{form.city}{form.state ? ', ' + form.state : ''}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {form.games.map(gid => {
              const g = GAME_LIST.find(x => x.id === gid);
              return g ? <span key={gid} style={{ background: g.tint + '1a', color: g.tint, padding: '2px 8px', borderRadius: 4, fontFamily: TF.sans, fontWeight: 600, fontSize: 11 }}>{g.short}</span> : null;
            })}
          </div>
        </div>

        <button onClick={() => app.nav.push('storefront', { shop: 'gnome' })} style={{ marginTop: 24, background: TF.accent, color: '#fff', borderRadius: 4, padding: '14px 26px', fontFamily: TF.sans, fontWeight: 700, fontSize: 15.5 }}>Preview your storefront</button>
        <button onClick={() => app.nav.pop()} style={{ marginTop: 10, color: TF.muted, fontFamily: TF.sans, fontWeight: 600, fontSize: 14 }}>Back to home</button>
      </div>
    );
  }
```

- [ ] **Step 5: Verify full wizard flow**

Reload. Navigate to enroll. Tap "Enroll your shop — free". Walk through all 6 steps:
1. Fill shop name, address, phone → Continue
2. Fill owner name, pick role → Continue
3. Select 2+ games → Continue
4. Leave defaults or add a wanted card → Continue (or skip)
5. Pick bank, fill mock details → Continue
6. Pick color, add bio, see preview → Submit application
7. Success screen with summary

Test jumping back: on step 4, tap step 1 dot to jump back, change something, then continue forward.

- [ ] **Step 6: Commit**

```bash
git add screen_storefront.jsx
git commit -m "feat: add wizard steps 4-6 (buylist, payout, branding) and success screen"
```

---

## Summary

| Task | What | Steps Added |
|------|------|-------------|
| 1 | Wizard shell, StepIndicator, WizardField, navigation | Shell + nav |
| 2 | Steps 1-3 (shop, verify, games) | 3 step components |
| 3 | Steps 4-6 (buylist, payout, branding) + success | 3 step components + success |
