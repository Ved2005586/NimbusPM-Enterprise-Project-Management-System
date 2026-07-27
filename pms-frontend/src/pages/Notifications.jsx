import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Stack, Chip } from '@mui/material';
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import { fetchNotifications, markNotificationRead } from '../redux/slices/notificationSlice';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/constants';

const TYPE_LABEL = {
  TASK_ASSIGNED: 'Task assigned',
  TASK_COMPLETED: 'Task completed',
  TASK_UPDATED: 'Task updated',
  COMMENT_ADDED: 'New comment',
  DEADLINE_REMINDER: 'Deadline reminder',
  PROJECT_INVITE: 'Project invite',
  MENTION: 'Mention',
};

export default function Notifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleClick = (n) => {
    if (!n.isRead) dispatch(markNotificationRead(n.id));
    if (n.link) navigate(n.link.replace('/tasks/', '/tasks/'));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Notifications
      </Typography>

      {!items.length ? (
        <EmptyState
          icon={CircleNotificationsRoundedIcon}
          title="You're all caught up"
          description="Task assignments, comments, and deadline reminders will show up here."
        />
      ) : (
        <Stack spacing={1}>
          {items.map((n) => (
            <Paper
              key={n.id}
              variant="outlined"
              onClick={() => handleClick(n)}
              sx={{
                p: 2,
                borderRadius: 2.5,
                cursor: 'pointer',
                bgcolor: n.isRead ? 'transparent' : 'action.hover',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Chip label={TYPE_LABEL[n.type] || n.type} size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2">{n.message}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', ml: 2 }}>
                  {formatDate(n.createdAt)}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
