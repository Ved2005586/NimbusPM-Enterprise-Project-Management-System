import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { fetchProjects } from '../redux/slices/projectSlice';
import { fetchTasksByProject, upsertTaskFromSocket } from '../redux/slices/taskSlice';
import { fetchAllUsers } from '../redux/slices/userSlice';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskDetailDrawer from '../components/tasks/TaskDetailDrawer';
import EmptyState from '../components/common/EmptyState';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import useWebSocket from '../hooks/useWebSocket';

/**
 * A personal Kanban view: pick any project you belong to and see its board
 * without navigating into the full project workspace.
 */
export default function MyBoard() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.items);
  const tasks = useSelector((state) => state.tasks.items);
  const users = useSelector((state) => state.users.items);
  const [projectId, setProjectId] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  useEffect(() => {
    dispatch(fetchProjects()).then((res) => {
      if (res.payload?.length) setProjectId(res.payload[0].id);
    });
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (projectId) dispatch(fetchTasksByProject(projectId));
  }, [projectId, dispatch]);

  useWebSocket(
    projectId ? `/topic/projects/${projectId}/tasks` : null,
    (updatedTask) => dispatch(upsertTaskFromSocket(updatedTask)),
    Boolean(projectId)
  );

  if (!projects.length) {
    return (
      <EmptyState
        icon={ViewKanbanRoundedIcon}
        title="No projects to show"
        description="Join or create a project to see its board here."
      />
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 112px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">My board</Typography>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Project</InputLabel>
          <Select value={projectId} label="Project" onChange={(e) => setProjectId(e.target.value)}>
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <KanbanBoard tasks={tasks} onTaskClick={(t) => setSelectedTaskId(t.id)} />
      </Box>

      <TaskDetailDrawer
        task={selectedTask}
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTaskId(null)}
        members={users}
      />
    </Box>
  );
}
