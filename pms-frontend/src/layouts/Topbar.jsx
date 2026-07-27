import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Typography,
  ListItemIcon,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { toggleSidebar, toggleThemeMode, showToast } from '../../redux/slices/uiSlice';
import { logoutUser } from '../../redux/slices/authSlice';
import projectService from '../../services/projectService';
import taskService from '../../services/taskService';
import { getErrorMessage } from '../../services/api';

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector((state) => state.ui.themeMode);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    if (e.key !== 'Enter') return;
    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      const [projects, tasks] = await Promise.all([
        projectService.search(trimmed),
        taskService.search(trimmed),
      ]);

      if (projects.length) {
        navigate(`/projects/${projects[0].id}`);
        setQuery('');
      } else if (tasks.length) {
        navigate(`/tasks/${tasks[0].id}`);
        setQuery('');
      } else {
        dispatch(showToast({ message: `No results for "${trimmed}"`, severity: 'info' }));
      }
    } catch (err) {
      // Previously this failure was swallowed silently (each search call
      // had its own .catch(() => []) fallback), so a real API error looked
      // identical to "no results" — pressing Enter appeared to do nothing.
      // Surfacing it here makes the actual cause visible instead of hidden.
      dispatch(showToast({ message: getErrorMessage(err), severity: 'error' }));
    }
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <AppBar position="fixed" color="inherit" sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.paper' }}>
      <Toolbar sx={{ gap: 2 }}>
        <IconButton onClick={() => dispatch(toggleSidebar())} edge="start">
          <MenuRoundedIcon />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'action.hover',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            flexGrow: 1,
            maxWidth: 420,
          }}
        >
          <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <InputBase
            placeholder="Search projects, tasks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            sx={{ fontSize: 14, flexGrow: 1 }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton onClick={() => dispatch(toggleThemeMode())}>
          {themeMode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>

        <IconButton onClick={() => navigate('/notifications')}>
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsRoundedIcon />
          </Badge>
        </IconButton>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <PersonRoundedIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate('/profile');
            }}
          >
            <ListItemIcon>
              <PersonRoundedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">My profile</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Log out</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}