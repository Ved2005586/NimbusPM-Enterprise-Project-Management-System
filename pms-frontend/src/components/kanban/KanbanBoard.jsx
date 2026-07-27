import { useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { Box, Stack } from '@mui/material';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { TASK_STATUSES } from '../../utils/constants';
import { applyOptimisticMove, moveTask } from '../../redux/slices/taskSlice';
import { showToast } from '../../redux/slices/uiSlice';

/**
 * Kanban board: five status columns, drag-and-drop reordering/movement.
 * Movement is applied optimistically to Redux state immediately, then
 * confirmed against the backend; on failure the board simply refetches.
 */
export default function KanbanBoard({ tasks, onTaskClick, onRefetchNeeded }) {
  const dispatch = useDispatch();
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const tasksByStatus = useMemo(() => {
    const grouped = Object.fromEntries(TASK_STATUSES.map((s) => [s, []]));
    [...tasks]
      .sort((a, b) => a.position - b.position)
      .forEach((t) => {
        if (grouped[t.status]) grouped[t.status].push(t);
      });
    return grouped;
  }, [tasks]);

  const handleDragStart = useCallback(
    (event) => {
      const task = tasks.find((t) => String(t.id) === event.active.id);
      setActiveTask(task || null);
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      setActiveTask(null);
      if (!over) return;

      const activeTaskObj = tasks.find((t) => String(t.id) === active.id);
      if (!activeTaskObj) return;

      // `over.id` is either a column status (dropped on empty column area)
      // or another task's id (dropped on/near a card) — resolve to a status.
      const overIsColumn = TASK_STATUSES.includes(over.id);
      const overTask = overIsColumn ? null : tasks.find((t) => String(t.id) === over.id);
      const newStatus = overIsColumn ? over.id : overTask?.status;
      if (!newStatus) return;

      const columnTasks = tasksByStatus[newStatus] || [];
      const newPosition = overTask
        ? columnTasks.findIndex((t) => t.id === overTask.id)
        : columnTasks.length;

      if (activeTaskObj.status === newStatus && activeTaskObj.position === newPosition) return;

      dispatch(applyOptimisticMove({ id: activeTaskObj.id, status: newStatus, position: newPosition }));

      const result = await dispatch(moveTask({ id: activeTaskObj.id, status: newStatus, position: newPosition }));
      if (moveTask.rejected.match(result)) {
        dispatch(showToast({ message: 'Could not move task — refreshing board', severity: 'error' }));
        onRefetchNeeded?.();
      }
    },
    [tasks, tasksByStatus, dispatch, onRefetchNeeded]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 2, height: '100%' }}>
        {TASK_STATUSES.map((status) => (
          <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} onTaskClick={onTaskClick} />
        ))}
      </Stack>

      <DragOverlay>{activeTask ? <Box sx={{ width: 288 }}><TaskCard task={activeTask} onClick={() => {}} /></Box> : null}</DragOverlay>
    </DndContext>
  );
}
