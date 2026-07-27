import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Stack,
  Button,
  Paper,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { fetchAllUsers } from '../../redux/slices/userSlice';
import projectService from '../../services/projectService';
import { fetchProjectById } from '../../redux/slices/projectSlice';
import { showToast } from '../../redux/slices/uiSlice';
import { initialsOf } from '../../utils/constants';
import { colors } from '../../theme/tokens';

/**
 * NOTE: adding a member requires a project role id. The backend seeds one
 * Role row per RoleName (ADMIN, PROJECT_MANAGER, TEAM_LEAD, DEVELOPER,
 * TESTER, CLIENT) with sequential ids starting at 1 on a fresh database —
 * this picker lets you choose by name rather than guessing the id.
 */
const ROLE_OPTIONS = [
  { id: 1, name: 'ADMIN' },
  { id: 2, name: 'PROJECT_MANAGER' },
  { id: 3, name: 'TEAM_LEAD' },
  { id: 4, name: 'DEVELOPER' },
  { id: 5, name: 'TESTER' },
  { id: 6, name: 'CLIENT' },
];

export default function MembersPanel({ projectId }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.items);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[3]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!selectedUser) return;
    try {
      await projectService.addMember(projectId, { userId: selectedUser.id, roleId: selectedRole.id });
      dispatch(fetchProjectById(projectId));
      dispatch(showToast({ message: 'Member added', severity: 'success' }));
      setDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      dispatch(showToast({ message: 'Could not add member', severity: 'error' }));
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={() => setDialogOpen(true)}>
          Add member
        </Button>
      </Stack>

      <Stack spacing={1.5}>
        {users.map((user) => (
          <Paper key={user.id} variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: colors.signal }}>{initialsOf(user.firstName, user.lastName)}</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email} · {user.roles?.join(', ')}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add project member</DialogTitle>
        <DialogContent dividers>
          <Autocomplete
            options={users}
            getOptionLabel={(u) => `${u.firstName} ${u.lastName} (${u.email})`}
            value={selectedUser}
            onChange={(_, val) => setSelectedUser(val)}
            renderInput={(params) => <TextField {...params} label="User" margin="normal" />}
          />
          <Autocomplete
            options={ROLE_OPTIONS}
            getOptionLabel={(r) => r.name}
            value={selectedRole}
            onChange={(_, val) => setSelectedRole(val)}
            renderInput={(params) => <TextField {...params} label="Project role" margin="normal" />}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!selectedUser}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
