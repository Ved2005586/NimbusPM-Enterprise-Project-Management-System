import { Outlet } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import Logo from '../components/layout/Logo';
import { colors, fonts } from '../theme/tokens';

/**
 * Split-screen auth shell: form on the left, a quiet brand panel on the
 * right that states what the product is for in plain terms.
 */
export default function AuthLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ mb: 4 }}>
            <Logo />
          </Box>
          <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
            <Outlet />
          </Paper>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          px: 8,
          background: `linear-gradient(155deg, ${colors.ink} 0%, ${colors.slate800} 100%)`,
          color: '#fff',
        }}
      >
        <Typography sx={{ fontFamily: fonts.mono, color: colors.signal, fontSize: 13, fontWeight: 700, mb: 2 }}>
          WEB-01 → IN PROGRESS
        </Typography>
        <Typography variant="h3" sx={{ maxWidth: 440, mb: 2, lineHeight: 1.2 }}>
          Every sprint, every task, one board your whole team actually looks at.
        </Typography>
        <Typography sx={{ color: colors.slate300, maxWidth: 420 }}>
          Plan sprints, move work across the board, and see exactly who's blocked —
          without leaving the tab.
        </Typography>
      </Box>
    </Box>
  );
}
