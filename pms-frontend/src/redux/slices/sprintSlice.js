import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import sprintService from '../../services/sprintService';
import { getErrorMessage } from '../../services/api';

export const fetchSprintsByProject = createAsyncThunk('sprints/fetchByProject', async (projectId, { rejectWithValue }) => {
  try {
    return await sprintService.getByProject(projectId);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const createSprint = createAsyncThunk('sprints/create', async (payload, { rejectWithValue }) => {
  try {
    return await sprintService.create(payload);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const startSprint = createAsyncThunk('sprints/start', async (id, { rejectWithValue }) => {
  try {
    return await sprintService.start(id);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const completeSprint = createAsyncThunk('sprints/complete', async (id, { rejectWithValue }) => {
  try {
    return await sprintService.complete(id);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const sprintSlice = createSlice({
  name: 'sprints',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSprintsByProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSprintsByProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSprintsByProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createSprint.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(startSprint.fulfilled, (state, action) => {
        state.items = state.items.map((s) => (s.id === action.payload.id ? action.payload : s));
      })
      .addCase(completeSprint.fulfilled, (state, action) => {
        state.items = state.items.map((s) => (s.id === action.payload.id ? action.payload : s));
      });
  },
});

export default sprintSlice.reducer;
