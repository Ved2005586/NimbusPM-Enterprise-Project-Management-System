import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Grid, Stack, Chip } from '@mui/material';
import { fetchProjects } from '../redux/slices/projectSlice';
import { fetchTasksByProject } from '../redux/slices/taskSlice';
import TaskKeyBadge from '../components/common/TaskKeyBadge';
import PriorityChip from '../components/common/PriorityChip';
import { formatDate } from '../utils/constants';

/**
 * A simple deadline list grouped by due date, rather than a full month grid —
 * gets the "what's due when" job done without a heavyweight calendar library.
 */
export default function Calendar() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.items);
  const tasks = useSelector((state) => state.tasks.items);

  useEffect(() => {
    dispatch(fetchProjects()).then((res) => {
      res.payload?.forEach((p) => dispatch(fetchTasksByProject(p.id)));
    });
  }, [dispatch]);

  const upcoming = useMemo(() => {
    return [...tasks]
      .filter((t) => t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Calendar
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upcoming deadlines across all your projects.
      </Typography>

      {!upcoming.length ? (
        <Typography color="text.secondary">No tasks with due dates yet.</Typography>
      ) : (
        <Stack spacing={1.25}>
          {upcoming.map((task) => (
            <Paper key={task.id} variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={2} sm={1.5}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{formatDate(task.dueDate)}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <TaskKeyBadge taskKey={task.taskKey} />
                </Grid>
                <Grid item xs={6}>
                  <Typography noWrap sx={{ fontSize: 14 }}>
                    {task.title}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                  <PriorityChip priority={task.priority} />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
