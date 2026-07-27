import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useSelector } from 'react-redux';
import Logo from './Logo';
import useAuth from '../../hooks/useAuth';
import { initialsOf } from '../../utils/constants';

const DRAWER_WIDTH = 248;

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: DashboardRoundedIcon },
  { label: 'Projects', to: '/projects', icon: FolderRoundedIcon },
  { label: 'My Board', to: '/board', icon: ViewKanbanRoundedIcon },
  { label: 'Calendar', to: '/calendar', icon: CalendarMonthRoundedIcon },
  { label: 'Notifications', to: '/notifications', icon: NotificationsRoundedIcon },
];

export default function Sidebar({ open }) {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const width = sidebarOpen ? DRAWER_WIDTH : 76;

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        '& .MuiDrawer-paper': {
          width,
          transition: 'width 0.2s ease',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 2 }}>
        <Logo collapsed={!sidebarOpen} />
      </Box>

      <List sx={{ px: 1.5, mt: 1, flexGrow: 1 }}>
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <ListItemButton
            key={to}
            component={NavLink}
            to={to}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.active': {
                bgcolor: 'primary.main',
                color: '#fff',
                '& .MuiListItemIcon-root': { color: '#fff' },
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />}
          </ListItemButton>
        ))}

        {hasRole('ADMIN') && (
          <ListItemButton
            component={NavLink}
            to="/admin"
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.active': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AdminPanelSettingsRoundedIcon fontSize="small" />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Admin" primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />}
          </ListItemButton>
        )}
      </List>

      <Divider />
      <List sx={{ px: 1.5, py: 1 }}>
        <ListItemButton
          component={NavLink}
          to="/settings"
          sx={{ borderRadius: 2, mb: 0.5, '&.active': { bgcolor: 'action.selected' } }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsRoundedIcon fontSize="small" />
          </ListItemIcon>
          {sidebarOpen && <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />}
        </ListItemButton>

        <ListItemButton onClick={() => navigate('/profile')} sx={{ borderRadius: 2, mt: 0.5 }}>
          <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: 'primary.main', mr: sidebarOpen ? 1.5 : 0 }}>
            {initialsOf(user?.firstName, user?.lastName)}
          </Avatar>
          {sidebarOpen && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography noWrap sx={{ fontSize: 13, fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography noWrap sx={{ fontSize: 11, color: 'text.secondary' }}>
                {user?.email}
              </Typography>
            </Box>
          )}
        </ListItemButton>
      </List>
    </Drawer>
  );
}
