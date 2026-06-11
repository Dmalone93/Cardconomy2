export function money(n, opts = {}) {
  const { cents = true } = opts;
  if (n == null) return '\u2014';
  const fixed = n >= 1000
    ? n.toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 })
    : n.toFixed(cents ? 2 : 0);
  return '$' + fixed;
}
