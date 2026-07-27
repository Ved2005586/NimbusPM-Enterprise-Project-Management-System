import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import { createSprint, startSprint, completeSprint } from '../../redux/slices/sprintSlice';
import { showToast } from '../../redux/slices/uiSlice';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/constants';

const STATUS_COLOR = { PLANNED: 'default', ACTIVE: 'warning', COMPLETED: 'success' };

export default function SprintsPanel({ projectId, sprints }) {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onCreate = async (data) => {
    const result = await dispatch(createSprint({ ...data, projectId: Number(projectId) }));
    if (createSprint.fulfilled.match(result)) {
      setDialogOpen(false);
      reset();
      dispatch(showToast({ message: 'Sprint created', severity: 'success' }));
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={() => setDialogOpen(true)}>
          New sprint
        </Button>
      </Stack>

      {!sprints.length ? (
        <EmptyState
          icon={EventRoundedIcon}
          title="No sprints yet"
          description="Create a sprint to start planning work in time-boxed iterations."
          actionLabel="New sprint"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <Stack spacing={1.5}>
          {sprints.map((sprint) => (
            <Paper key={sprint.id} variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{sprint.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sprint.goal || 'No goal set'} · {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={sprint.status} size="small" color={STATUS_COLOR[sprint.status]} />
                  {sprint.status === 'PLANNED' && (
                    <Button size="small" onClick={() => dispatch(startSprint(sprint.id))}>
                      Start
                    </Button>
                  )}
                  {sprint.status === 'ACTIVE' && (
                    <Button size="small" onClick={() => dispatch(completeSprint(sprint.id))}>
                      Complete
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit(onCreate)}>
          <DialogTitle>New sprint</DialogTitle>
          <DialogContent dividers>
            <TextField label="Sprint name" fullWidth margin="normal" {...register('name', { required: true })} />
            <TextField label="Goal" fullWidth multiline rows={2} margin="normal" {...register('goal')} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start date"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  {...register('startDate')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End date"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  {...register('endDate')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create sprint
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
