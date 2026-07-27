import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ newPassword }) => {
    setSubmitting(true);
    setError('');
    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Alert severity="error">
        This reset link is missing its token. Please request a new one from{' '}
        <Link component={RouterLink} to="/forgot-password">
          the forgot password page
        </Link>
        .
      </Alert>
    );
  }

  if (success) {
    return <Alert severity="success">Password reset! Redirecting you to log in…</Alert>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Set a new password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose a strong password you haven't used before.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="New password"
        type="password"
        fullWidth
        margin="normal"
        {...register('newPassword', {
          required: 'Required',
          minLength: { value: 8, message: 'At least 8 characters' },
        })}
        error={Boolean(errors.newPassword)}
        helperText={errors.newPassword?.message}
      />
      <TextField
        label="Confirm new password"
        type="password"
        fullWidth
        margin="normal"
        {...register('confirmPassword', {
          validate: (value) => value === watch('newPassword') || 'Passwords do not match',
        })}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword?.message}
      />

      <Button type="submit" fullWidth variant="contained" size="large" disabled={submitting} sx={{ mt: 2 }}>
        {submitting ? 'Resetting…' : 'Reset password'}
      </Button>
    </Box>
  );
}
