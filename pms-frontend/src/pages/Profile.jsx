import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Avatar, Stack, Chip, Grid, TextField, Button, Alert } from '@mui/material';
import { setUser } from '../redux/slices/authSlice';
import { showToast } from '../redux/slices/uiSlice';
import userService from '../services/userService';
import { getErrorMessage } from '../services/api';
import { initialsOf } from '../utils/constants';
import { colors } from '../theme/tokens';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { firstName: '', lastName: '', phone: '' },
  });

  useEffect(() => {
    if (user) {
      reset({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
    }
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      const updated = await userService.updateMe(data);
      dispatch(setUser(updated));
      dispatch(showToast({ message: 'Profile updated', severity: 'success' }));
      reset({ firstName: updated.firstName, lastName: updated.lastName, phone: updated.phone || '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My profile
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Avatar sx={{ width: 64, height: 64, fontSize: 22, bgcolor: colors.signal }}>
            {initialsOf(user.firstName, user.lastName)}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {user.email}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {user.roles?.map((r) => (
                <Chip key={r} label={r.replace('_', ' ')} size="small" />
              ))}
              <Chip
                label={user.emailVerified ? 'Email verified' : 'Email not verified'}
                size="small"
                color={user.emailVerified ? 'success' : 'warning'}
                variant="outlined"
              />
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Account details
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="First name"
              fullWidth
              {...register('firstName', { required: 'Required' })}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last name"
              fullWidth
              {...register('lastName', { required: 'Required' })}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" fullWidth value={user.email} disabled helperText="Email can't be changed here" />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Phone" fullWidth placeholder="Not set" {...register('phone')} />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" disabled={submitting || !isDirty}>
            {submitting ? 'Saving…' : 'Save changes'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
