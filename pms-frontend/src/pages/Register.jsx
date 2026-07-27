import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Link, Alert, Grid } from '@mui/material';
import { registerUser } from '../redux/slices/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    const result = await dispatch(registerUser(data));
    setSubmitting(false);
    if (registerUser.fulfilled.match(result)) {
      navigate('/dashboard');
    } else {
      setServerError(result.payload || 'Registration failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Create your account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Start planning sprints in a couple of minutes.
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <Grid container spacing={1.5}>
        <Grid item xs={6}>
          <TextField
            label="First name"
            fullWidth
            margin="normal"
            {...register('firstName', { required: 'Required' })}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Last name"
            fullWidth
            margin="normal"
            {...register('lastName', { required: 'Required' })}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
          />
        </Grid>
      </Grid>

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
        })}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'At least 8 characters' },
        })}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
      />
      <TextField
        label="Confirm password"
        type="password"
        fullWidth
        margin="normal"
        {...register('confirmPassword', {
          validate: (value) => value === watch('password') || 'Passwords do not match',
        })}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword?.message}
      />

      <Button type="submit" fullWidth variant="contained" size="large" disabled={submitting} sx={{ mt: 2 }}>
        {submitting ? 'Creating account…' : 'Create account'}
      </Button>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">
          Log in
        </Link>
      </Typography>
    </Box>
  );
}
