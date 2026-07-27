import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import taskService from '../services/taskService';

/**
 * Handles direct links to a task (e.g. from a notification's `link` field,
 * which points to `/tasks/{id}`). There's no standalone task page — the
 * task detail UI lives in a drawer inside its project's board — so this
 * resolves the task's project and forwards there with a `task` query param
 * that ProjectDetail reads to auto-open the right drawer.
 */
export default function TaskRedirect() {
  const { id } = useParams();
  const [target, setTarget] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    taskService
      .getById(id)
      .then((task) => {
        if (!cancelled) setTarget(`/projects/${task.projectId}?task=${task.id}`);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFound) return <Navigate to="/dashboard" replace />;
  if (target) return <Navigate to={target} replace />;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <CircularProgress size={28} />
      <Typography variant="body2" color="text.secondary">
        Opening task…
      </Typography>
    </Box>
  );
}
