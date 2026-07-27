import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Paper, Typography, Stack, Chip } from '@mui/material';
import TaskCard from './TaskCard';
import { statusMeta } from '../../theme/tokens';

export default function KanbanColumn({ status, tasks, onTaskClick }) {
  const meta = statusMeta[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <Paper
      variant="outlined"
      sx={{
        width: 288,
        flexShrink: 0,
        borderRadius: 3,
        p: 1.5,
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, px: 0.5 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: meta.color }} />
        <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>{meta.label}</Typography>
        <Chip label={tasks.length} size="small" sx={{ height: 18, fontSize: 11, ml: 'auto' }} />
      </Stack>

      <Box
        ref={setNodeRef}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          minHeight: 80,
          borderRadius: 2,
          transition: 'background-color 0.15s',
          bgcolor: isOver ? 'action.hover' : 'transparent',
          p: 0.5,
        }}
      >
        <SortableContext items={tasks.map((t) => String(t.id))} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </Box>
    </Paper>
  );
}
