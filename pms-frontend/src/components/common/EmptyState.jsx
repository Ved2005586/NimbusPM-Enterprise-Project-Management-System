import { Box, Typography, Button } from '@mui/material';

/** A consistent "nothing here yet" pattern: says what's missing and what to do about it. */
export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
      }}
    >
      {Icon && <Icon sx={{ fontSize: 44, color: 'text.secondary', mb: 2 }} />}
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 380 }}>
        {description}
      </Typography>
      {actionLabel && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
