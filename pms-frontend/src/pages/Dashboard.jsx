import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Stack, Avatar, AvatarGroup } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import StatCard from '../components/dashboard/StatCard';
import StatusChip from '../components/common/StatusChip';
import TaskKeyBadge from '../components/common/TaskKeyBadge';
import { fetchProjects } from '../redux/slices/projectSlice';
import taskService from '../services/taskService';
import { colors, statusMeta } from '../theme/tokens';
import { initialsOf, TASK_STATUSES } from '../utils/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: projects, status } = useSelector((state) => state.projects);

  // Dashboard aggregates tasks across every project, which is a different
  // shape of data than the single-project task list the Kanban board uses
  // (redux `tasks` slice) — so this pulls its own copy locally rather than
  // sharing that slice, to avoid the two views stomping on each other.
  const [allTasks, setAllTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (!projects.length) {
      setAllTasks([]);
      return;
    }
    let cancelled = false;
    setTasksLoading(true);
    Promise.all(projects.map((p) => taskService.getByProject(p.id).catch(() => [])))
      .then((results) => {
        if (!cancelled) setAllTasks(results.flat());
      })
      .finally(() => {
        if (!cancelled) setTasksLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // Re-run whenever the set of project ids changes (not on every project
    // object reference change, e.g. after an unrelated field edit).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.map((p) => p.id).join(',')]);

  const stats = useMemo(() => {
    const active = projects.filter((p) => !p.archived).length;
    const totalTasks = allTasks.length;
    const inProgress = allTasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const totalMembers = projects.reduce((sum, p) => sum + (p.memberCount || 0), 0);
    return { active, totalTasks, inProgress, totalMembers };
  }, [projects, allTasks]);

  const statusBreakdown = useMemo(() => {
    const counts = TASK_STATUSES.map(
      (s) => allTasks.filter((t) => t.status === s).length
    );
    return {
      labels: TASK_STATUSES.map((s) => statusMeta[s].label),
      datasets: [
        {
          data: counts,
          backgroundColor: TASK_STATUSES.map((s) => statusMeta[s].color),
          borderWidth: 0,
        },
      ],
    };
  }, [allTasks]);

  const hasAnyTasks = allTasks.length > 0;

  // Approximation: buckets DONE tasks by their last-updated date over the
  // trailing 7 days. This isn't a dedicated "completed on" timestamp (the
  // backend doesn't track status-change history in a queryable way yet —
  // see TaskHistory for the audit trail), so a task edited for any reason
  // after being marked done could shift days. Good enough for an at-a-glance
  // trend; swap for a real backend aggregate endpoint if precision matters.
  const weeklyProgressData = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    const counts = days.map((day) => {
      return allTasks.filter((t) => {
        if (t.status !== 'DONE' || !t.updatedAt) return false;
        const updated = new Date(t.updatedAt);
        return (
          updated.getFullYear() === day.getFullYear() &&
          updated.getMonth() === day.getMonth() &&
          updated.getDate() === day.getDate()
        );
      }).length;
    });

    return {
      labels: days.map((d) => DAY_LABELS[d.getDay()]),
      datasets: [
        {
          label: 'Tasks completed',
          data: counts,
          backgroundColor: colors.signal,
          borderRadius: 6,
          maxBarThickness: 28,
        },
      ],
    };
  }, [allTasks]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        A snapshot of everything moving across your projects.
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={FolderRoundedIcon} label="Active projects" value={stats.active} color={colors.signal} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={TaskAltRoundedIcon} label="Total tasks" value={stats.totalTasks} color={colors.done} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PendingActionsRoundedIcon}
            label="In progress"
            value={stats.inProgress}
            color={colors.inProgress}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={GroupsRoundedIcon} label="Team members" value={stats.totalMembers} color={colors.testing} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
              Weekly progress
            </Typography>
            {!hasAnyTasks && !tasksLoading ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
                No completed tasks yet this week.
              </Typography>
            ) : (
              <Bar
                data={weeklyProgressData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 }, grid: { display: false } },
                    x: { grid: { display: false } },
                  },
                }}
                height={220}
              />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
              Tasks by status
            </Typography>
            {!hasAnyTasks && !tasksLoading ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
                No tasks yet — create one from a project board.
              </Typography>
            ) : (
              <Doughnut
                data={statusBreakdown}
                options={{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } } }}
                height={220}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
          Your projects
        </Typography>
        {status === 'loading' && <Typography color="text.secondary">Loading…</Typography>}
        <Grid container spacing={2}>
          {projects.slice(0, 6).map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Paper
                variant="outlined"
                onClick={() => navigate(`/projects/${project.id}`)}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                  <TaskKeyBadge taskKey={project.projectKey} />
                  <StatusChip status={project.status} />
                </Stack>
                <Typography sx={{ fontWeight: 700, mb: 0.5 }} noWrap>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} noWrap>
                  {project.description || 'No description yet'}
                </Typography>
                <AvatarGroup max={4} sx={{ justifyContent: 'flex-end', '& .MuiAvatar-root': { width: 26, height: 26, fontSize: 11 } }}>
                  <Avatar sx={{ bgcolor: colors.signal }}>{initialsOf(project.owner?.firstName, project.owner?.lastName)}</Avatar>
                </AvatarGroup>
              </Paper>
            </Grid>
          ))}
        </Grid>
        {!projects.length && status !== 'loading' && (
          <Typography color="text.secondary">No projects yet — create your first one from the Projects page.</Typography>
        )}
      </Paper>
    </Box>
  );
}
