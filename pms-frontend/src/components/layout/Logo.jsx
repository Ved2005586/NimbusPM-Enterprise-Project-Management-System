import { Box, Typography } from '@mui/material';
import { colors, fonts } from '../../theme/tokens';

/** The Nimbus brand mark: a small indigo glyph + wordmark, used sparingly. */
export default function Logo({ collapsed = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '8px',
          background: `linear-gradient(135deg, ${colors.signal}, ${colors.signalDark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ color: '#fff', fontFamily: fonts.display, fontWeight: 800, fontSize: 15 }}>
          N
        </Typography>
      </Box>
      {!collapsed && (
        <Typography sx={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 19, letterSpacing: '-0.02em' }}>
          Nimbus
        </Typography>
      )}
    </Box>
  );
}
