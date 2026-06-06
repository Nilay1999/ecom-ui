/**
 * Theme-aware placeholder image as an inline SVG data URI.
 * Replaces the hardcoded light-mode placehold.co URL so the fallback
 * looks correct in both light and dark mode.
 */
export function placeholderImage(bg: string, fg: string, label = 'Game'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="616" height="353" viewBox="0 0 616 353">
    <rect width="616" height="353" fill="${bg}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="Inter, Helvetica, Arial, sans-serif" font-size="28" font-weight="600"
      letter-spacing="0.04em" fill="${fg}">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Convenience: build the fallback from MUI palette tokens. */
export function fallbackImageFor(mode: 'light' | 'dark', label = 'Game'): string {
  return mode === 'dark'
    ? placeholderImage('#1e1b16', '#a39c90', label)
    : placeholderImage('#f5f1ea', '#5b554d', label);
}
