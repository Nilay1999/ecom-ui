import { createTheme, type PaletteMode, type Theme } from '@mui/material/styles';

type Tokens = {
  ink: string;
  inkSoft: string;
  inkDisabled: string;
  cream: string;
  paper: string;
  line: string;
  lineSoft: string;
  accent: string;
  hover: string;
  selected: string;
  appBar: string;
  buttonHover: string;
};

const LIGHT: Tokens = {
  ink: '#1c1a17',
  inkSoft: '#5b554d',
  inkDisabled: 'rgba(28,26,23,0.4)',
  cream: '#f5f1ea',
  paper: '#fbf8f4',
  line: 'rgba(28,26,23,0.10)',
  lineSoft: 'rgba(28,26,23,0.06)',
  accent: '#8a2e2a',
  hover: 'rgba(28,26,23,0.04)',
  selected: 'rgba(28,26,23,0.06)',
  appBar: 'rgba(245,241,234,0.82)',
  buttonHover: '#000',
};

const DARK: Tokens = {
  ink: '#ece7de',
  inkSoft: '#a39c90',
  inkDisabled: 'rgba(236,231,222,0.38)',
  cream: '#15130f',
  paper: '#1e1b16',
  line: 'rgba(236,231,222,0.14)',
  lineSoft: 'rgba(236,231,222,0.08)',
  accent: '#d4736d',
  hover: 'rgba(236,231,222,0.06)',
  selected: 'rgba(236,231,222,0.10)',
  appBar: 'rgba(21,19,15,0.82)',
  buttonHover: '#fff',
};

export function getTheme(mode: PaletteMode): Theme {
  const t = mode === 'dark' ? DARK : LIGHT;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: t.ink,
        light: mode === 'dark' ? '#fffaf2' : '#3a3631',
        dark: mode === 'dark' ? '#c9c3b8' : '#0f0e0c',
        contrastText: t.cream,
      },
      secondary: {
        main: t.accent,
        contrastText: mode === 'dark' ? '#15130f' : '#fbf8f4',
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
      error: { main: mode === 'dark' ? '#e0726a' : '#a8312a' },
      warning: { main: mode === 'dark' ? '#d4a23f' : '#a37312' },
      success: { main: mode === 'dark' ? '#6fae79' : '#3f7a4a' },
      info: { main: mode === 'dark' ? '#5f9bbd' : '#2c5a78' },
    },
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.035em' },
      h2: { fontWeight: 700, letterSpacing: '-0.03em' },
      h3: { fontWeight: 700, letterSpacing: '-0.025em' },
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600, letterSpacing: '-0.015em' },
      h6: { fontWeight: 600, letterSpacing: '-0.01em' },
      subtitle1: { fontWeight: 600, letterSpacing: '-0.005em' },
      body1: { lineHeight: 1.7 },
      body2: { lineHeight: 1.65 },
      button: { letterSpacing: '0' },
      caption: { letterSpacing: '0.02em' },
    },
    shape: { borderRadius: 6 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: t.cream,
            color: t.ink,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
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
            boxShadow: 'none',
            transition: 'border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease',
            '&:hover': {
              borderColor: t.line,
              transform: 'translateY(-2px)',
              boxShadow:
                mode === 'dark'
                  ? '0 12px 32px -16px rgba(0,0,0,0.7)'
                  : '0 12px 32px -16px rgba(28,26,23,0.18)',
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
            paddingInline: 18,
          },
          containedPrimary: {
            background: t.ink,
            color: t.paper,
            '&:hover': { background: t.buttonHover },
          },
          outlined: {
            borderColor: t.line,
            color: t.ink,
            '&:hover': { borderColor: t.ink, background: t.hover },
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
            backdropFilter: 'saturate(180%) blur(14px)',
            color: t.ink,
            boxShadow: 'none',
            borderBottom: `1px solid ${t.lineSoft}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: 4,
            letterSpacing: '0.02em',
            fontSize: 11,
            height: 22,
          },
          outlined: {
            borderColor: t.line,
            color: t.inkSoft,
            backgroundColor: 'transparent',
          },
          filled: {
            backgroundColor: t.selected,
            color: t.ink,
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
              borderColor: mode === 'dark' ? 'rgba(236,231,222,0.3)' : 'rgba(28,26,23,0.25)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: t.ink, borderWidth: 1 },
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
            boxShadow: 'none',
            '&:before': { display: 'none' },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { backgroundColor: t.ink, color: t.paper, fontSize: 11 },
        },
      },
      MuiLink: {
        defaultProps: { underline: 'hover' },
        styleOverrides: {
          root: { color: t.ink, textDecorationThickness: 1, textUnderlineOffset: 3 },
        },
      },
    },
  });
}

export default getTheme('light');
