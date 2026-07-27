import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, Stack, Button, Chip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { fetchProjectById } from '../redux/slices/projectSlice';
import { fetchTasksByProject, createTask, upsertTaskFromSocket } from '../redux/slices/taskSlice';
import { fetchSprintsByProject } from '../redux/slices/sprintSlice';
import { fetchAllUsers } from '../redux/slices/userSlice';
import { showToast } from '../redux/slices/uiSlice';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import TaskDetailDrawer from '../components/tasks/TaskDetailDrawer';
import StatusChip from '../components/common/StatusChip';
import TaskKeyBadge from '../components/common/TaskKeyBadge';
import SprintsPanel from '../components/projects/SprintsPanel';
import MembersPanel from '../components/projects/MembersPanel';
import useWebSocket from '../hooks/useWebSocket';

export default function ProjectDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.projects.current);
  const tasks = useSelector((state) => state.tasks.items);
  const sprints = useSelector((state) => state.sprints.items);
  const users = useSelector((state) => state.users.items);

  const [tab, setTab] = useState(0);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  const refetchTasks = useCallback(() => dispatch(fetchTasksByProject(id)), [dispatch, id]);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    refetchTasks();
    dispatch(fetchSprintsByProject(id));
    dispatch(fetchAllUsers());
  }, [id, dispatch, refetchTasks]);

  useWebSocket(
    `/topic/projects/${id}/tasks`,
    (updatedTask) => dispatch(upsertTaskFromSocket(updatedTask)),
    Boolean(id)
  );

  // Deep-link support: /tasks/:id (used by notification links) resolves to
  // this project and appends ?task=<id> so we can open the right drawer
  // once that task has actually loaded into the tasks list.
  useEffect(() => {
    const taskParam = searchParams.get('task');
    if (taskParam && tasks.some((t) => String(t.id) === taskParam)) {
      setSelectedTaskId(Number(taskParam));
      const next = new URLSearchParams(searchParams);
      next.delete('task');
      setSearchParams(next, { replace: true });
    }
  }, [tasks, searchParams, setSearchParams]);

  const handleCreateTask = async (data) => {
    setSubmitting(true);
    const result = await dispatch(createTask(data));
    setSubmitting(false);
    if (createTask.fulfilled.match(result)) {
      setTaskDialogOpen(false);
      dispatch(showToast({ message: 'Task created', severity: 'success' }));
    } else {
      dispatch(showToast({ message: result.payload || 'Failed to create task', severity: 'error' }));
    }
  };

  if (!project) return null;

  return (
    <Box sx={{ height: 'calc(100vh - 112px)', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
            <TaskKeyBadge taskKey={project.projectKey} />
            <StatusChip status={project.status} />
          </Stack>
          <Typography variant="h4">{project.name}</Typography>
        </Box>
        {tab === 0 && (
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setTaskDialogOpen(true)}>
            New task
          </Button>
        )}
      </Stack>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Board" />
        <Tab label={`Sprints (${sprints.length})`} />
        <Tab label={`Members (${project.memberCount || 0})`} />
      </Tabs>

      {tab === 0 && (
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <KanbanBoard tasks={tasks} onTaskClick={(t) => setSelectedTaskId(t.id)} onRefetchNeeded={refetchTasks} />
        </Box>
      )}

      {tab === 1 && <SprintsPanel projectId={id} sprints={sprints} />}

      {tab === 2 && <MembersPanel projectId={id} />}

      <TaskFormDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        onSubmit={handleCreateTask}
        projectId={Number(id)}
        sprints={sprints}
        members={users}
        submitting={submitting}
      />

      <TaskDetailDrawer
        task={selectedTask}
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTaskId(null)}
        members={users}
      />
    </Box>
  );
}
