import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Stack,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { fetchAllUsers } from '../redux/slices/userSlice';
import { fetchProjects } from '../redux/slices/projectSlice';
import userService from '../services/userService';
import { showToast } from '../redux/slices/uiSlice';
import StatCard from '../components/dashboard/StatCard';
import { initialsOf } from '../utils/constants';
import { colors } from '../theme/tokens';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.items);
  const projects = useSelector((state) => state.projects.items);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleToggle = async (user) => {
    try {
      if (user.enabled === false) {
        await userService.activate(user.id);
      } else {
        await userService.deactivate(user.id);
      }
      dispatch(fetchAllUsers());
      dispatch(showToast({ message: 'User updated', severity: 'success' }));
    } catch {
      dispatch(showToast({ message: 'Action failed', severity: 'error' }));
    }
  };

  const totalTasks = projects.reduce((sum, p) => sum + (p.taskCount || 0), 0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Admin panel
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        System-wide user and project oversight.
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard icon={PeopleAltRoundedIcon} label="Total users" value={users.length} color={colors.signal} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard icon={FolderRoundedIcon} label="Total projects" value={projects.length} color={colors.testing} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard icon={TaskAltRoundedIcon} label="Total tasks" value={totalTasks} color={colors.done} />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 30, height: 30, fontSize: 12, bgcolor: colors.signal }}>
                      {initialsOf(user.firstName, user.lastName)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {user.roles?.map((r) => (
                      <Chip key={r} label={r.replace('_', ' ')} size="small" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.enabled === false ? 'Deactivated' : 'Active'}
                    size="small"
                    color={user.enabled === false ? 'default' : 'success'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => handleToggle(user)}>
                    {user.enabled === false ? 'Activate' : 'Deactivate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
