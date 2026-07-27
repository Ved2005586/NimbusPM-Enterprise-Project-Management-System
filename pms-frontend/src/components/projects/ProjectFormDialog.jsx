import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';
import { useEffect } from 'react';

export default function ProjectFormDialog({ open, onClose, onSubmit, initialValues, submitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues || {} });

  useEffect(() => {
    reset(initialValues || { name: '', projectKey: '', description: '', startDate: '', endDate: '' });
  }, [initialValues, open, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{initialValues ? 'Edit project' : 'New project'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Project name"
            fullWidth
            margin="normal"
            {...register('name', { required: 'Required' })}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
          <TextField
            label="Project key"
            placeholder="e.g. WEB"
            fullWidth
            margin="normal"
            disabled={Boolean(initialValues)}
            {...register('projectKey', {
              required: 'Required',
              maxLength: { value: 10, message: 'Max 10 characters' },
              pattern: { value: /^[A-Za-z0-9]+$/, message: 'Letters and numbers only' },
            })}
            error={Boolean(errors.projectKey)}
            helperText={errors.projectKey?.message || 'Used as the prefix for task keys (WEB-1, WEB-2…)'}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            {...register('description')}
          />
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving…' : initialValues ? 'Save changes' : 'Create project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
