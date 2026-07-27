import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Link, Alert, FormControlLabel, Checkbox } from '@mui/material';
import { loginUser } from '../redux/slices/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    const result = await dispatch(loginUser(data));
    setSubmitting(false);
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard');
    } else {
      setServerError(result.payload || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Log in to pick up where you left off.
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register('email', { required: 'Email is required' })}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register('password', { required: 'Password is required' })}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
        <FormControlLabel
          control={<Checkbox size="small" {...register('rememberMe')} />}
          label={<Typography variant="body2">Remember me</Typography>}
        />
        <Link component={RouterLink} to="/forgot-password" variant="body2">
          Forgot password?
        </Link>
      </Box>

      <Button type="submit" fullWidth variant="contained" size="large" disabled={submitting} sx={{ mt: 2 }}>
        {submitting ? 'Logging in…' : 'Log in'}
      </Button>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
        Don't have an account?{' '}
        <Link component={RouterLink} to="/register">
          Create one
        </Link>
      </Typography>
    </Box>
  );
}
