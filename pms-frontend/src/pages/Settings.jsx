import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Stack, Switch, Divider } from '@mui/material';
import { toggleThemeMode } from '../redux/slices/uiSlice';
import { setUser } from '../redux/slices/authSlice';
import { showToast } from '../redux/slices/uiSlice';
import userService from '../services/userService';
import { getErrorMessage } from '../services/api';

export default function Settings() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.ui.themeMode);
  const { user } = useSelector((state) => state.auth);
  const [saving, setSaving] = useState(false);

  const handleEmailToggle = async (event) => {
    const emailNotificationsEnabled = event.target.checked;
    setSaving(true);
    try {
      const updated = await userService.updatePreferences({ emailNotificationsEnabled });
      dispatch(setUser(updated));
    } catch (err) {
      dispatch(showToast({ message: getErrorMessage(err), severity: 'error' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Appearance
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Dark mode
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Switch between light and dark themes
            </Typography>
          </Box>
          <Switch checked={themeMode === 'dark'} onChange={() => dispatch(toggleThemeMode())} />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Notifications
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Email notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Get an email when you're assigned a task. In-app notifications (the bell icon) are
              unaffected by this — this only controls emails.
            </Typography>
          </Box>
          <Switch
            checked={Boolean(user?.emailNotificationsEnabled)}
            onChange={handleEmailToggle}
            disabled={saving}
          />
        </Stack>
      </Paper>
    </Box>
  );
}