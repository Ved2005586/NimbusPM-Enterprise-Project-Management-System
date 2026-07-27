import { Chip } from '@mui/material';
import { statusMeta } from '../../theme/tokens';

export default function StatusChip({ status }) {
  const meta = statusMeta[status] || { label: status, color: '#999' };
  return (
    <Chip
      label={meta.label}
      size="small"
      sx={{
        bgcolor: `${meta.color}1F`,
        color: meta.color,
        fontWeight: 700,
        fontSize: 11,
        height: 22,
      }}
    />
  );
}
