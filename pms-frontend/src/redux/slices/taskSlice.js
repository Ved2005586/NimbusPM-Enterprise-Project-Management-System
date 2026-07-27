import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';
import { getErrorMessage } from '../../services/api';

export const fetchTasksByProject = createAsyncThunk('tasks/fetchByProject', async (projectId, { rejectWithValue }) => {
  try {
    return await taskService.getByProject(projectId);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const fetchTaskById = createAsyncThunk('tasks/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await taskService.getById(id);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const createTask = createAsyncThunk('tasks/create', async (payload, { rejectWithValue }) => {
  try {
    return await taskService.create(payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await taskService.update(id, payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await taskService.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const moveTask = createAsyncThunk(
  'tasks/move',
  async ({ id, status, position }, { rejectWithValue }) => {
    try {
      return await taskService.updateStatus(id, { status, position });
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const assignTask = createAsyncThunk('tasks/assign', async ({ id, userId }, { rejectWithValue }) => {
  try {
    return await taskService.assign(id, userId);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    current: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentTask(state) {
      state.current = null;
    },
    // Applied instantly on drag-drop for a snappy UI; server call reconciles after.
    applyOptimisticMove(state, action) {
      const { id, status, position } = action.payload;
      const task = state.items.find((t) => t.id === id);
      if (task) {
        task.status = status;
        task.position = position;
      }
    },
    upsertTaskFromSocket(state, action) {
      const incoming = action.payload;
      const idx = state.items.findIndex((t) => t.id === incoming.id);
      if (idx >= 0) {
        state.items[idx] = incoming;
      } else {
        state.items.push(incoming);
      }
      if (state.current?.id === incoming.id) state.current = incoming;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.items = state.items.map((t) => (t.id === action.payload.id ? action.payload : t));
        if (state.current?.id === action.payload.id) state.current = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        state.items = state.items.map((t) => (t.id === action.payload.id ? action.payload : t));
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.items = state.items.map((t) => (t.id === action.payload.id ? action.payload : t));
        if (state.current?.id === action.payload.id) state.current = action.payload;
      });
  },
});

export const { clearCurrentTask, applyOptimisticMove, upsertTaskFromSocket } = taskSlice.actions;
export default taskSlice.reducer;
