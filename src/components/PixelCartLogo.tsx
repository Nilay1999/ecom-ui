interface Props {
  size?: number;
  showText?: boolean;
}

export default function PixelCartLogo({ size = 36, showText = true }: Props) {
  const iconW = 48;
  const textW = 102;
  const gap = 10;
  const totalW = showText ? iconW + gap + textW : iconW;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalW} 48`}
      width={(size * totalW) / 48}
      height={size}
      aria-label="PixelCart"
    >
      <defs>
        <linearGradient id="pcBody" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#3d9fe8" />
          <stop offset="100%" stopColor="#004f9a" />
        </linearGradient>
        <linearGradient id="pcText" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3d9fe8" />
          <stop offset="100%" stopColor="#0070D1" />
        </linearGradient>
      </defs>

      {/* Left shoulder bumper */}
      <rect x="6"  y="9" width="14" height="7" rx="3.5" fill="url(#pcBody)" />
      {/* Right shoulder bumper */}
      <rect x="28" y="9" width="14" height="7" rx="3.5" fill="url(#pcBody)" />

      {/* Main controller body */}
      <rect x="3" y="14" width="42" height="27" rx="9" fill="url(#pcBody)" />

      {/* D-pad vertical */}
      <rect x="12"  y="23.5" width="3.5" height="11" rx="1.2" fill="rgba(255,255,255,0.88)" />
      {/* D-pad horizontal */}
      <rect x="8.5" y="27"   width="11"  height="3.5" rx="1.2" fill="rgba(255,255,255,0.88)" />

      {/* Face buttons — pixel squares, diamond layout */}
      <rect x="31"   y="21.5" width="4.5" height="4.5" rx="1.2" fill="rgba(255,255,255,0.88)" />
      <rect x="36.5" y="26"   width="4.5" height="4.5" rx="1.2" fill="rgba(255,255,255,0.88)" />
      <rect x="31"   y="30.5" width="4.5" height="4.5" rx="1.2" fill="rgba(255,255,255,0.88)" />
      <rect x="25.5" y="26"   width="4.5" height="4.5" rx="1.2" fill="rgba(255,255,255,0.88)" />

      {/* Centre home button */}
      <circle cx="24" cy="22" r="2.8" fill="rgba(255,255,255,0.95)" />

      {/* Small select/menu pills */}
      <rect x="18.5" y="19.5" width="3.5" height="2" rx="1" fill="rgba(255,255,255,0.45)" />
      <rect x="26"   y="19.5" width="3.5" height="2" rx="1" fill="rgba(255,255,255,0.45)" />

      {/* Wordmark */}
      {showText && (
        <text
          x={iconW + gap}
          y="32"
          fontFamily="Inter, Roboto, sans-serif"
          fontWeight="800"
          fontSize="20"
          letterSpacing="-0.5"
          fill="url(#pcText)"
        >
          PixelCart
        </text>
      )}
    </svg>
  );
}
