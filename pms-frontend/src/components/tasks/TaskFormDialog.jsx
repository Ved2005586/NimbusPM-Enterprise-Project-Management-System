import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
} from '@mui/material';
import { PRIORITIES } from '../../utils/constants';

export default function TaskFormDialog({ open, onClose, onSubmit, projectId, sprints = [], members = [], submitting }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { title: '', description: '', priority: 'MEDIUM', sprintId: '', assigneeId: '', dueDate: '' },
  });

  useEffect(() => {
    if (open) reset({ title: '', description: '', priority: 'MEDIUM', sprintId: '', assigneeId: '', dueDate: '' });
  }, [open, reset]);

  const submit = (data) => {
    onSubmit({
      ...data,
      projectId,
      sprintId: data.sprintId || undefined,
      assigneeId: data.assigneeId || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle>New task</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            autoFocus
            {...register('title', { required: 'Required' })}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />
          <TextField label="Description" fullWidth multiline rows={3} margin="normal" {...register('description')} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Priority" fullWidth margin="normal">
                    {PRIORITIES.map((p) => (
                      <MenuItem key={p} value={p}>
                        {p.charAt(0) + p.slice(1).toLowerCase()}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Due date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register('dueDate')}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="sprintId"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Sprint" fullWidth margin="normal">
                    <MenuItem value="">Backlog (no sprint)</MenuItem>
                    {sprints.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Assignee" fullWidth margin="normal">
                    <MenuItem value="">Unassigned</MenuItem>
                    {members.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.firstName} {m.lastName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
