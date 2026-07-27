import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import GlobalToast from '../components/common/GlobalToast';
import { fetchCurrentUser } from '../redux/slices/authSlice';
import { fetchUnreadCount } from '../redux/slices/notificationSlice';
import { receiveLiveNotification } from '../redux/slices/notificationSlice';
import useWebSocket from '../hooks/useWebSocket';
import useAuth from '../hooks/useAuth';

export default function MainLayout() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  useWebSocket(
    user?.email ? `/user/${user.email}/queue/notifications` : null,
    (notification) => dispatch(receiveLiveNotification(notification)),
    Boolean(user?.email)
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar />
      <Sidebar open={sidebarOpen} />
      <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
      <GlobalToast />
    </Box>
  );
}
