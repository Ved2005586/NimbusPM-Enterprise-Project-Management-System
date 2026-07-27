import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Typography, Stack, Avatar, Chip } from '@mui/material';
import TaskKeyBadge from '../common/TaskKeyBadge';
import PriorityChip from '../common/PriorityChip';
import { initialsOf, formatDate } from '../../utils/constants';
import { colors } from '../../theme/tokens';

export default function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(task.id),
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      variant="outlined"
      sx={{
        p: 1.75,
        mb: 1.25,
        borderRadius: 2.5,
        cursor: 'grab',
        bgcolor: 'background.paper',
        '&:hover': { borderColor: 'primary.main' },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <TaskKeyBadge taskKey={task.taskKey} />
        <PriorityChip priority={task.priority} />
      </Stack>

      <Typography sx={{ fontSize: 13.5, fontWeight: 600, mb: 1.25, lineHeight: 1.35 }}>{task.title}</Typography>

      {task.labels?.length > 0 && (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 1 }}>
          {task.labels.slice(0, 3).map((label) => (
            <Chip key={label} label={label} size="small" sx={{ height: 18, fontSize: 10 }} />
          ))}
        </Stack>
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          {task.dueDate ? formatDate(task.dueDate) : ''}
        </Typography>
        {task.assignee ? (
          <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: colors.signal }}>
            {initialsOf(task.assignee.firstName, task.assignee.lastName)}
          </Avatar>
        ) : (
          <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'action.disabledBackground' }}>?</Avatar>
        )}
      </Stack>
    </Paper>
  );
}
