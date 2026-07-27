import { Box } from '@mui/material';
import { colors, fonts } from '../../theme/tokens';

/** The recurring signature element: task keys rendered as monospace tags, e.g. WEB-42. */
export default function TaskKeyBadge({ taskKey }) {
  return (
    <Box
      component="span"
      sx={{
        fontFamily: fonts.mono,
        fontSize: 11,
        fontWeight: 700,
        color: colors.signalDark,
        bgcolor: colors.signalTint,
        px: 0.75,
        py: 0.25,
        borderRadius: '4px',
        letterSpacing: '0.02em',
      }}
    >
      {taskKey}
    </Box>
  );
}
