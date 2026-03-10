import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '@/types/project';
import {
  fetchProjectsThunk,
  fetchProjectByIdThunk,
  createProjectThunk,
  updateProjectThunk,
  deleteProjectThunk,
} from '../thunks/projectThunks';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: builder => {
    // Fetch projects
    builder
      .addCase(fetchProjectsThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.data.items;
        state.total = action.payload.data.meta.totalItems;
      })
      .addCase(fetchProjectsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch projects';
      });

    // Fetch single
    builder
      .addCase(fetchProjectByIdThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchProjectByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload.data;
      })
      .addCase(fetchProjectByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch project';
      });

    // Create project
    builder.addCase(createProjectThunk.fulfilled, (state, action) => {
      state.projects.unshift(action.payload.data);
    });

    // Update project
    builder.addCase(updateProjectThunk.fulfilled, (state, action) => {
      const index = state.projects.findIndex(
        p => p.id === action.payload.data.id
      );
      if (index !== -1) {
        state.projects[index] = action.payload.data;
      }
      if (state.currentProject?.id === action.payload.data.id) {
        state.currentProject = action.payload.data;
      }
    });

    // Delete project
    builder.addCase(deleteProjectThunk.fulfilled, (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
    });
  },
});

export const { clearError, setPage } = projectSlice.actions;
export default projectSlice.reducer;
