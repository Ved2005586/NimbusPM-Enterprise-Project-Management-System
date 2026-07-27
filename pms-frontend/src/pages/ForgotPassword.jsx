import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Box, Link, Alert } from '@mui/material';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setSubmitting(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Check your email
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          If an account exists for that address, we've sent a link to reset your password.
        </Typography>
        <Link component={RouterLink} to="/login">
          Back to login
        </Link>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Forgot your password?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your account email and we'll send you a reset link.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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

      <Button type="submit" fullWidth variant="contained" size="large" disabled={submitting} sx={{ mt: 2 }}>
        {submitting ? 'Sending…' : 'Send reset link'}
      </Button>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
        <Link component={RouterLink} to="/login">
          Back to login
        </Link>
      </Typography>
    </Box>
  );
}
