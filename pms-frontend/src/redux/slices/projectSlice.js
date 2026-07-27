import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';
import { getErrorMessage } from '../../services/api';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await projectService.getAll();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const fetchProjectById = createAsyncThunk('projects/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await projectService.getById(id);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const createProject = createAsyncThunk('projects/create', async (payload, { rejectWithValue }) => {
  try {
    return await projectService.create(payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await projectService.update(id, payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const archiveProject = createAsyncThunk('projects/archive', async (id, { rejectWithValue }) => {
  try {
    return await projectService.archive(id);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await projectService.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    current: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentProject(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.items = state.items.map((p) => (p.id === action.payload.id ? action.payload : p));
        if (state.current?.id === action.payload.id) state.current = action.payload;
      })
      .addCase(archiveProject.fulfilled, (state, action) => {
        state.items = state.items.map((p) => (p.id === action.payload.id ? action.payload : p));
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
