import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { fetchProjects, createProject, archiveProject, deleteProject } from '../redux/slices/projectSlice';
import { showToast } from '../redux/slices/uiSlice';
import ProjectFormDialog from '../components/projects/ProjectFormDialog';
import StatusChip from '../components/common/StatusChip';
import TaskKeyBadge from '../components/common/TaskKeyBadge';
import EmptyState from '../components/common/EmptyState';
import useAuth from '../hooks/useAuth';

export default function Projects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: projects, status } = useSelector((state) => state.projects);
  const { hasAnyRole } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);

  const canManage = hasAnyRole(['ADMIN', 'PROJECT_MANAGER']);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    const result = await dispatch(createProject(data));
    setSubmitting(false);
    if (createProject.fulfilled.match(result)) {
      setDialogOpen(false);
      dispatch(showToast({ message: 'Project created', severity: 'success' }));
    } else {
      dispatch(showToast({ message: result.payload || 'Failed to create project', severity: 'error' }));
    }
  };

  const openMenu = (e, id) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuProjectId(id);
  };

  const handleArchive = async () => {
    await dispatch(archiveProject(menuProjectId));
    setMenuAnchor(null);
    dispatch(showToast({ message: 'Project archived', severity: 'info' }));
  };

  const handleDelete = async () => {
    await dispatch(deleteProject(menuProjectId));
    setMenuAnchor(null);
    dispatch(showToast({ message: 'Project deleted', severity: 'info' }));
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Projects</Typography>
          <Typography variant="body2" color="text.secondary">
            {projects.length} project{projects.length === 1 ? '' : 's'}
          </Typography>
        </Box>
        {canManage && (
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialogOpen(true)}>
            New project
          </Button>
        )}
      </Stack>

      {!projects.length && status !== 'loading' ? (
        <EmptyState
          icon={FolderRoundedIcon}
          title="No projects yet"
          description="Create your first project to start planning sprints and tasks."
          actionLabel={canManage ? 'New project' : undefined}
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <Grid container spacing={2.5}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Paper
                variant="outlined"
                onClick={() => navigate(`/projects/${project.id}`)}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'border-color 0.15s',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <TaskKeyBadge taskKey={project.projectKey} />
                  {canManage && (
                    <IconButton size="small" onClick={(e) => openMenu(e, project.id)}>
                      <MoreVertRoundedIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
                <Typography sx={{ fontWeight: 700, mt: 1.5, mb: 0.5 }}>{project.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                  {project.description || 'No description yet'}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <StatusChip status={project.status} />
                  <Chip label={`${project.memberCount || 0} members`} size="small" variant="outlined" />
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={handleArchive}>Archive</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      <ProjectFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
        submitting={submitting}
      />
    </Box>
  );
}
