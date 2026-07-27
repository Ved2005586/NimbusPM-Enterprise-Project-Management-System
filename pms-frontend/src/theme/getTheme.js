import { createTheme } from '@mui/material/styles';
import { colors, fonts } from './tokens';

/**
 * Builds the MUI theme for the given mode ('light' | 'dark').
 * Kept as a function (not a static object) so ThemeContext can rebuild it
 * whenever the user toggles appearance.
 */
export default function getTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.signal,
        dark: colors.signalDark,
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? colors.ink : '#F5F6FA',
        paper: isDark ? colors.slate900 : colors.paper,
      },
      text: {
        primary: isDark ? '#F2F3F8' : colors.ink,
        secondary: isDark ? colors.slate300 : colors.slate500,
      },
      divider: isDark ? colors.slate700 : colors.slate100,
      error: { main: colors.danger },
      warning: { main: colors.warning },
      success: { main: colors.success },
    },
    typography: {
      fontFamily: fonts.body,
      h1: { fontFamily: fonts.display, fontWeight: 700 },
      h2: { fontFamily: fonts.display, fontWeight: 700 },
      h3: { fontFamily: fonts.display, fontWeight: 600 },
      h4: { fontFamily: fonts.display, fontWeight: 600 },
      h5: { fontFamily: fonts.display, fontWeight: 600 },
      h6: { fontFamily: fonts.display, fontWeight: 600 },
      button: { fontFamily: fonts.body, fontWeight: 600, textTransform: 'none' },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, paddingTop: 8, paddingBottom: 8 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
            borderBottom: `1px solid ${isDark ? colors.slate700 : colors.slate100}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${isDark ? colors.slate700 : colors.slate100}`,
            boxShadow: 'none',
          },
        },
      },
    },
  });
}
