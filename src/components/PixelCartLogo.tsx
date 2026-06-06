import { useTheme } from '@mui/material/styles';

interface Props {
  size?: number;
  showText?: boolean;
}

export default function PixelCartLogo({ size = 36, showText = true }: Props) {
  const theme = useTheme();
  const body = theme.palette.text.primary;
  const cutout = theme.palette.background.paper;
  const muted = theme.palette.mode === 'dark' ? 'rgba(21,19,15,0.55)' : 'rgba(251,248,244,0.55)';
  const accent = theme.palette.secondary.main;

  const iconW = 48;
  const textW = 148;
  const gap = 12;
  const totalW = showText ? iconW + gap + textW : iconW;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalW} 48`}
      width={(size * totalW) / 48}
      height={size}
      aria-label="PixelCart"
    >
      {/* Controller body — ink, editorial */}
      <g fill={body}>
        {/* Left shoulder bumper */}
        <rect x="6" y="9" width="14" height="7" rx="3.5" />
        {/* Right shoulder bumper */}
        <rect x="28" y="9" width="14" height="7" rx="3.5" />
        {/* Main controller body */}
        <rect x="3" y="14" width="42" height="27" rx="9" />
      </g>

      {/* D-pad — cream cutouts */}
      <g fill={cutout}>
        <rect x="12" y="23.5" width="3.5" height="11" rx="1.2" />
        <rect x="8.5" y="27" width="11" height="3.5" rx="1.2" />

        {/* Face buttons — diamond */}
        <rect x="31" y="21.5" width="4.5" height="4.5" rx="1.2" />
        <rect x="36.5" y="26" width="4.5" height="4.5" rx="1.2" />
        <rect x="31" y="30.5" width="4.5" height="4.5" rx="1.2" />
        <rect x="25.5" y="26" width="4.5" height="4.5" rx="1.2" />

        {/* Centre home button */}
        <circle cx="24" cy="22" r="2.6" />
      </g>

      {/* Small select/menu pills — muted */}
      <g fill={muted}>
        <rect x="18.5" y="19.5" width="3.5" height="2" rx="1" />
        <rect x="26" y="19.5" width="3.5" height="2" rx="1" />
      </g>

      {/* Single accent dot — burgundy */}
      <circle cx="38.75" cy="28.25" r="1.1" fill={accent} />

      {/* Wordmark — serif editorial */}
      {showText && (
        <text
          x={iconW + gap}
          y="27"
          dominantBaseline="middle"
          fontFamily='"Plus Jakarta Sans", "Inter", sans-serif'
          fontWeight="800"
          fontSize="29"
          letterSpacing="-1"
          fill={body}
        >
          PixelCart
        </text>
      )}
    </svg>
  );
}
