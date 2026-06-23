// ─────────────────────────────────────────────────────────────
// Auth screens — sign in, sign up, forgot password
// ─────────────────────────────────────────────────────────────
const { T: TA2, Icon: IconA2, Logo: LogoA2 } = window;

// ── shared styles ────────────────────────────────────────────
const authWrap = {
  display: 'flex', flexDirection: 'column', minHeight: '100%',
  background: TA2.bg, padding: '0 24px 40px',
  overflowY: 'auto', WebkitOverflowScrolling: 'touch',
};

const authLogo = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  gap: 10, padding: '48px 0 36px',
};

const authWordmark = {
  fontFamily: 'var(--wordmark)', fontSize: 22, fontWeight: 800,
  letterSpacing: 2, color: TA2.ink, lineHeight: 1, transform: 'translateY(2px)',
};

const authInput = {
  width: '100%', padding: '14px 16px', borderRadius: 12,
  border: '1.5px solid var(--line)', background: TA2.surface,
  fontFamily: TA2.sans, fontSize: 15, color: TA2.ink,
  outline: 'none', boxSizing: 'border-box',
};

const authBtn = {
  width: '100%', padding: '15px 0', borderRadius: 12,
  background: TA2.ink, color: TA2.bg,
  fontFamily: TA2.sans, fontWeight: 700, fontSize: 15.5,
  letterSpacing: 0.2, border: 'none', cursor: 'pointer',
};

const authSecondaryBtn = {
  width: '100%', padding: '14px 0', borderRadius: 12,
  background: TA2.surface, color: TA2.ink,
  fontFamily: TA2.sans, fontWeight: 600, fontSize: 14.5,
  border: '1.5px solid var(--line)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
};

const authLink = {
  fontFamily: TA2.sans, fontSize: 14, color: 'var(--accent)',
  fontWeight: 600, background: 'none', border: 'none',
  cursor: 'pointer', padding: 0,
};

const authLabel = {
  fontFamily: TA2.sans, fontSize: 13, fontWeight: 600,
  color: TA2.ink2, marginBottom: 6,
};

const authDivider = {
  display: 'flex', alignItems: 'center', gap: 14,
  margin: '24px 0',
};

const authDividerLine = {
  flex: 1, height: 1, background: 'var(--line)',
};

const authDividerText = {
  fontFamily: TA2.sans, fontSize: 12.5, color: TA2.muted,
  fontWeight: 500, whiteSpace: 'nowrap',
};

// ── Apple / Google icons ─────────────────────────────────────
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.23 0-1.44.64-2.2.46-3.06-.4C3.79 16.16 4.36 9.54 8.73 9.3c1.27.07 2.15.72 2.9.77.93-.19 1.82-.88 2.83-.8 1.2.1 2.1.57 2.7 1.45-2.47 1.48-1.89 4.73.53 5.63-.42 1.12-.97 2.22-1.64 3.93zM12.04 9.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ── SignInScreen ─────────────────────────────────────────────
function SignInScreen({ app }) {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');

  const handleSignIn = () => {
    app.finishOnboarding({});
  };

  return (
    <div className="noscroll" style={authWrap}>
      {/* Logo */}
      <div style={authLogo}>
        <LogoA2 size={44} color={TA2.ink} />
        <span style={authWordmark}>CARDCONOMY</span>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={authLabel}>Email</div>
          <input type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={authInput} />
        </div>
        <div>
          <div style={authLabel}>Password</div>
          <input type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" value={pass}
            onChange={e => setPass(e.target.value)}
            style={authInput} />
        </div>
      </div>

      {/* Forgot password */}
      <div style={{ textAlign: 'right', marginTop: 10, marginBottom: 20 }}>
        <button onClick={() => app.nav.push('forgot_password')} style={authLink}>
          Forgot password?
        </button>
      </div>

      {/* Sign in button */}
      <button onClick={handleSignIn} style={authBtn}>Sign in</button>

      {/* Divider */}
      <div style={authDivider}>
        <div style={authDividerLine} />
        <span style={authDividerText}>or continue with</span>
        <div style={authDividerLine} />
      </div>

      {/* Social buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => app.toast('Apple Sign In coming soon')} style={authSecondaryBtn}>
          <AppleIcon /> Continue with Apple
        </button>
        <button onClick={() => app.toast('Google Sign In coming soon')} style={authSecondaryBtn}>
          <GoogleIcon /> Continue with Google
        </button>
      </div>

      {/* Sign up link */}
      <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: 32 }}>
        <span style={{ fontFamily: TA2.sans, fontSize: 14, color: TA2.muted }}>
          Don\u2019t have an account?{' '}
        </span>
        <button onClick={() => app.nav.push('signup')} style={authLink}>Sign up</button>
      </div>
    </div>
  );
}

// ── SignUpScreen ─────────────────────────────────────────────
function SignUpScreen({ app }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const handleCreate = () => {
    if (pass !== confirm) { app.toast('Passwords do not match'); return; }
    app.finishOnboarding({});
  };

  return (
    <div className="noscroll" style={authWrap}>
      {/* Logo */}
      <div style={authLogo}>
        <LogoA2 size={44} color={TA2.ink} />
        <span style={authWordmark}>CARDCONOMY</span>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={authLabel}>Full name</div>
          <input type="text" placeholder="Your name" value={name}
            onChange={e => setName(e.target.value)}
            style={authInput} />
        </div>
        <div>
          <div style={authLabel}>Email</div>
          <input type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={authInput} />
        </div>
        <div>
          <div style={authLabel}>Password</div>
          <input type="password" placeholder="At least 8 characters" value={pass}
            onChange={e => setPass(e.target.value)}
            style={authInput} />
        </div>
        <div>
          <div style={authLabel}>Confirm password</div>
          <input type="password" placeholder="Re-enter password" value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={authInput} />
        </div>
      </div>

      {/* Create button */}
      <button onClick={handleCreate} style={{ ...authBtn, marginTop: 24 }}>
        Create account
      </button>

      {/* Terms */}
      <p style={{ fontFamily: TA2.sans, fontSize: 12, color: TA2.muted, textAlign: 'center', lineHeight: 1.5, marginTop: 16 }}>
        By creating an account you agree to our{' '}
        <span style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Terms of Service</span>
        {' '}and{' '}
        <span style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>.
      </p>

      {/* Sign in link */}
      <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: 32 }}>
        <span style={{ fontFamily: TA2.sans, fontSize: 14, color: TA2.muted }}>
          Already have an account?{' '}
        </span>
        <button onClick={() => app.nav.pop()} style={authLink}>Sign in</button>
      </div>
    </div>
  );
}

// ── ForgotPasswordScreen ─────────────────────────────────────
function ForgotPasswordScreen({ app }) {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const handleSend = () => {
    if (!email.trim()) { app.toast('Please enter your email'); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="noscroll" style={authWrap}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
          {/* Checkmark circle */}
          <div style={{
            width: 64, height: 64, borderRadius: 32,
            background: 'var(--up-wash)', color: 'var(--up)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 700,
          }}>
            &#10003;
          </div>
          <div style={{ fontFamily: TA2.sans, fontWeight: 800, fontSize: 20, color: TA2.ink }}>
            Check your email
          </div>
          <p style={{ fontFamily: TA2.sans, fontSize: 14, color: TA2.muted, lineHeight: 1.5, maxWidth: 260 }}>
            We\u2019ve sent a password reset link to <span style={{ fontWeight: 700, color: TA2.ink }}>{email}</span>. Check your inbox and spam folder.
          </p>
          <button onClick={() => app.nav.pop()} style={{ ...authLink, marginTop: 12, fontSize: 15 }}>
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="noscroll" style={authWrap}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 0 8px' }}>
        <button onClick={() => app.nav.pop()} style={{ color: TA2.ink, flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {IconA2.back({})}
        </button>
        <span style={{ fontFamily: TA2.sans, fontWeight: 800, fontSize: 18, color: TA2.ink }}>
          Reset password
        </span>
      </div>

      {/* Description */}
      <p style={{ fontFamily: TA2.sans, fontSize: 14.5, color: TA2.muted, lineHeight: 1.5, margin: '16px 0 24px' }}>
        Enter your email address and we\u2019ll send you a link to reset your password.
      </p>

      {/* Email input */}
      <div style={{ marginBottom: 24 }}>
        <div style={authLabel}>Email</div>
        <input type="email" placeholder="you@example.com" value={email}
          onChange={e => setEmail(e.target.value)}
          style={authInput} />
      </div>

      {/* Send button */}
      <button onClick={handleSend} style={authBtn}>Send reset link</button>
    </div>
  );
}

Object.assign(window, { SignInScreen, SignUpScreen, ForgotPasswordScreen });
