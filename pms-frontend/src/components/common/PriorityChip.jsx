import { Chip } from '@mui/material';
import { priorityMeta } from '../../theme/tokens';

export default function PriorityChip({ priority }) {
  const meta = priorityMeta[priority] || { label: priority, color: '#999' };
  return (
    <Chip
      label={meta.label}
      size="small"
      variant="outlined"
      sx={{ borderColor: meta.color, color: meta.color, fontWeight: 700, fontSize: 11, height: 22 }}
    />
  );
}
