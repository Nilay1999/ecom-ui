import { createTheme, type PaletteMode, type Theme } from '@mui/material/styles';

type Tokens = {
  ink: string;
  inkSoft: string;
  inkDisabled: string;
  cream: string;
  paper: string;
  paperRaised: string;
  line: string;
  lineSoft: string;
  accent: string;
  accentDeep: string;
  accentSoft: string;
  hover: string;
  selected: string;
  appBar: string;
  glow: string;
};

// Light mode — clean, cool neutral with a rich electric-violet accent
const LIGHT: Tokens = {
  ink: '#16131f',
  inkSoft: '#605a72',
  inkDisabled: 'rgba(22,19,31,0.38)',
  cream: '#f5f4fb',
  paper: '#ffffff',
  paperRaised: '#ffffff',
  line: 'rgba(22,19,31,0.10)',
  lineSoft: 'rgba(22,19,31,0.06)',
  accent: '#6a3df0',
  accentDeep: '#5326d6',
  accentSoft: 'rgba(106,61,240,0.10)',
  hover: 'rgba(22,19,31,0.04)',
  selected: 'rgba(106,61,240,0.08)',
  appBar: 'rgba(245,244,251,0.78)',
  glow: 'rgba(106,61,240,0.30)',
};

// Dark mode — deep cool near-black with a bright neon-violet accent (the headline experience)
const DARK: Tokens = {
  ink: '#ece9f5',
  inkSoft: '#9b96ab',
  inkDisabled: 'rgba(236,233,245,0.36)',
  cream: '#0a0a10',
  paper: '#14141e',
  paperRaised: '#1b1b27',
  line: 'rgba(255,255,255,0.12)',
  lineSoft: 'rgba(255,255,255,0.07)',
  accent: '#9d80ff',
  accentDeep: '#7c5cff',
  accentSoft: 'rgba(157,128,255,0.14)',
  hover: 'rgba(255,255,255,0.05)',
  selected: 'rgba(157,128,255,0.16)',
  appBar: 'rgba(10,10,16,0.7)',
  glow: 'rgba(124,92,255,0.45)',
};

export function getTheme(mode: PaletteMode): Theme {
  const t = mode === 'dark' ? DARK : LIGHT;
  const ctaText = '#ffffff';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: t.accent,
        light: t.accent,
        dark: t.accentDeep,
        contrastText: ctaText,
      },
      secondary: {
        main: t.accent,
        dark: t.accentDeep,
        contrastText: ctaText,
      },
      background: {
        default: t.cream,
        paper: t.paper,
      },
      text: {
        primary: t.ink,
        secondary: t.inkSoft,
        disabled: t.inkDisabled,
      },
      divider: t.line,
      action: {
        hover: t.hover,
        selected: t.selected,
      },
      error: { main: mode === 'dark' ? '#ff6b6b' : '#d6303b' },
      warning: { main: mode === 'dark' ? '#f5b945' : '#c2840a' },
      success: { main: mode === 'dark' ? '#34d399' : '#0f9d63' },
      info: { main: mode === 'dark' ? '#56b6e8' : '#2c6fa8' },
    },
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
      h1: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 800, letterSpacing: '-0.025em' },
      h3: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.015em' },
      h5: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 600, letterSpacing: '-0.005em' },
      subtitle1: { fontWeight: 600, letterSpacing: '-0.005em' },
      body1: { lineHeight: 1.7 },
      body2: { lineHeight: 1.65 },
      button: { letterSpacing: '0.01em' },
      caption: { letterSpacing: '0.02em' },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: t.cream,
            color: t.ink,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            // Subtle ambient glow behind the page for the gaming vibe
            backgroundImage:
              mode === 'dark'
                ? `radial-gradient(900px 500px at 80% -10%, rgba(124,92,255,0.10), transparent 60%),
                   radial-gradient(700px 500px at 0% 0%, rgba(124,92,255,0.06), transparent 55%)`
                : `radial-gradient(900px 500px at 80% -10%, rgba(106,61,240,0.06), transparent 60%)`,
            backgroundAttachment: 'fixed',
          },
          '::selection': {
            background: t.accentSoft,
            color: t.ink,
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: t.paper,
            border: `1px solid ${t.lineSoft}`,
            borderRadius: 14,
            boxShadow: 'none',
            transition: 'border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease',
            '&:hover': {
              borderColor: mode === 'dark' ? 'rgba(157,128,255,0.45)' : 'rgba(106,61,240,0.35)',
              transform: 'translateY(-3px)',
              boxShadow:
                mode === 'dark'
                  ? `0 18px 40px -20px rgba(0,0,0,0.8), 0 0 0 1px ${t.accentSoft}`
                  : '0 18px 40px -20px rgba(22,19,31,0.22)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none', backgroundColor: t.paper },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 999,
            paddingInline: 20,
            '&.Mui-focusVisible': {
              outline: `2px solid ${t.accent}`,
              outlineOffset: 2,
            },
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDeep} 100%)`,
            color: ctaText,
            boxShadow: `0 6px 18px -8px ${t.glow}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDeep} 100%)`,
              boxShadow: `0 10px 26px -6px ${t.glow}`,
              filter: 'brightness(1.06)',
            },
          },
          containedSecondary: {
            background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDeep} 100%)`,
            color: ctaText,
            boxShadow: `0 6px 18px -8px ${t.glow}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDeep} 100%)`,
              boxShadow: `0 10px 26px -6px ${t.glow}`,
              filter: 'brightness(1.06)',
            },
          },
          outlined: {
            borderColor: t.line,
            color: t.ink,
            '&:hover': {
              borderColor: t.accent,
              color: t.accent,
              background: t.accentSoft,
            },
          },
          outlinedPrimary: {
            borderColor: t.accent,
            color: t.accent,
            '&:hover': { borderColor: t.accentDeep, background: t.accentSoft },
          },
          text: {
            color: t.ink,
            '&:hover': { background: t.selected },
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'default' },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: t.appBar,
            backdropFilter: 'saturate(180%) blur(16px)',
            color: t.ink,
            boxShadow: 'none',
            borderBottom: `1px solid ${t.lineSoft}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 6,
            letterSpacing: '0.02em',
            fontSize: 11,
            height: 23,
          },
          outlined: {
            borderColor: t.line,
            color: t.inkSoft,
            backgroundColor: 'transparent',
          },
          filled: {
            backgroundColor: t.accentSoft,
            color: mode === 'dark' ? t.accent : t.accentDeep,
          },
          colorPrimary: {
            backgroundColor: t.accentSoft,
            color: mode === 'dark' ? t.accent : t.accentDeep,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: t.lineSoft },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: t.paper,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: t.line },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(22,19,31,0.24)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: t.accent,
              borderWidth: 2,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottomColor: t.lineSoft },
          head: {
            fontWeight: 600,
            color: t.inkSoft,
            letterSpacing: '0.04em',
            fontSize: 11,
            textTransform: 'uppercase',
          },
        },
      },
      MuiAccordion: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: t.paper,
            border: `1px solid ${t.lineSoft}`,
            borderRadius: 12,
            boxShadow: 'none',
            '&:before': { display: 'none' },
            '&.Mui-expanded': { borderColor: t.line },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { backgroundColor: t.ink, color: t.cream, fontSize: 11 },
        },
      },
      MuiLink: {
        defaultProps: { underline: 'hover' },
        styleOverrides: {
          root: {
            color: t.accent,
            textDecorationThickness: 1,
            textUnderlineOffset: 3,
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: { fontWeight: 700 },
        },
      },
    },
  });
}

export default getTheme('dark');
