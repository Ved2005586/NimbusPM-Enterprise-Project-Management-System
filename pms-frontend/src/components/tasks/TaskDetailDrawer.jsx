import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
  TextField,
  Button,
  Avatar,
  MenuItem,
  Select,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TaskKeyBadge from '../common/TaskKeyBadge';
import PriorityChip from '../common/PriorityChip';
import { initialsOf, formatDate, TASK_STATUSES } from '../../utils/constants';
import taskService from '../../services/taskService';
import { moveTask, assignTask } from '../../redux/slices/taskSlice';
import { showToast } from '../../redux/slices/uiSlice';
import useWebSocket from '../../hooks/useWebSocket';
import { statusMeta } from '../../theme/tokens';

export default function TaskDetailDrawer({ task, open, onClose, members = [] }) {
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (task && open) {
      setLoadingComments(true);
      taskService
        .getComments(task.id)
        .then(setComments)
        .finally(() => setLoadingComments(false));
    }
  }, [task, open]);

  useWebSocket(
    task ? `/topic/tasks/${task.id}/comments` : null,
    (comment) => setComments((prev) => (prev.some((c) => c.id === comment.id) ? prev : [...prev, comment])),
    Boolean(task && open)
  );

  if (!task) return null;

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await taskService.addComment(task.id, commentText.trim());
      setCommentText('');
    } catch {
      dispatch(showToast({ message: 'Could not post comment', severity: 'error' }));
    }
  };

  const handleStatusChange = (status) => {
    dispatch(moveTask({ id: task.id, status, position: 0 }));
  };

  const handleAssigneeChange = (userId) => {
    dispatch(assignTask({ id: task.id, userId }));
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 440, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <TaskKeyBadge taskKey={task.taskKey} />
          <IconButton onClick={onClose} size="small">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Typography variant="h6" sx={{ mb: 2 }}>
          {task.title}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
          <Select
            size="small"
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            sx={{ fontSize: 13, minWidth: 140 }}
          >
            {TASK_STATUSES.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: 13 }}>
                {statusMeta[s].label}
              </MenuItem>
            ))}
          </Select>
          <PriorityChip priority={task.priority} />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
          {task.description || 'No description provided.'}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Assignee
            </Typography>
            <Select
              size="small"
              value={task.assignee?.id || ''}
              displayEmpty
              onChange={(e) => handleAssigneeChange(e.target.value)}
              sx={{ fontSize: 13, minWidth: 160 }}
            >
              <MenuItem value="" disabled>
                Unassigned
              </MenuItem>
              {members.map((m) => (
                <MenuItem key={m.id} value={m.id} sx={{ fontSize: 13 }}>
                  {m.firstName} {m.lastName}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Reporter
            </Typography>
            <Typography variant="body2">
              {task.reporter?.firstName} {task.reporter?.lastName}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Due date
            </Typography>
            <Typography variant="body2">{formatDate(task.dueDate)}</Typography>
          </Stack>
          {task.storyPoints != null && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Story points
              </Typography>
              <Typography variant="body2">{task.storyPoints}</Typography>
            </Stack>
          )}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Comments
        </Typography>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
          {loadingComments && <Typography variant="body2" color="text.secondary">Loading…</Typography>}
          {!loadingComments && !comments.length && (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          )}
          <Stack spacing={2}>
            {comments.map((c) => (
              <Stack direction="row" spacing={1.5} key={c.id}>
                <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                  {initialsOf(c.author?.firstName, c.author?.lastName)}
                </Avatar>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {c.author?.firstName} {c.author?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(c.createdAt)}
                    </Typography>
                  </Stack>
                  <Typography variant="body2">{c.content}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            fullWidth
            placeholder="Write a comment…"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <Button variant="contained" onClick={handleAddComment} disabled={!commentText.trim()}>
            Post
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
