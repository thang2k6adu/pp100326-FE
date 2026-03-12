import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stakeholder } from '@/types/stakeholder';
import {
  fetchStakeholdersThunk,
  fetchStakeholderByIdThunk,
  createStakeholderThunk,
  updateStakeholderThunk,
  deleteStakeholderThunk,
} from '../thunks/stakeholderThunks';

interface StakeholderState {
  stakeholders: Stakeholder[];
  currentStakeholder: Stakeholder | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: StakeholderState = {
  stakeholders: [],
  currentStakeholder: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

const stakeholderSlice = createSlice({
  name: 'stakeholder',
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
    // Fetch stakeholders
    builder
      .addCase(fetchStakeholdersThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStakeholdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stakeholders = action.payload.data.items;
        state.total = action.payload.data.meta.totalItems;
        state.page = action.payload.data.meta.currentPage;
        state.limit = action.payload.data.meta.itemsPerPage;
      })
      .addCase(fetchStakeholdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch stakeholders';
      });

    // Fetch single
    builder
      .addCase(fetchStakeholderByIdThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchStakeholderByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStakeholder = action.payload.data;
      })
      .addCase(fetchStakeholderByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch stakeholder';
      });

    // Create stakeholder
    builder.addCase(createStakeholderThunk.fulfilled, (state, action) => {
      state.stakeholders.unshift(action.payload.data);
    });

    // Update stakeholder
    builder.addCase(updateStakeholderThunk.fulfilled, (state, action) => {
      const index = state.stakeholders.findIndex(
        s => s.id === action.payload.data.id
      );
      if (index !== -1) {
        state.stakeholders[index] = action.payload.data;
      }
      if (state.currentStakeholder?.id === action.payload.data.id) {
        state.currentStakeholder = action.payload.data;
      }
    });

    // Delete stakeholder
    builder.addCase(deleteStakeholderThunk.fulfilled, (state, action) => {
      state.stakeholders = state.stakeholders.filter(
        s => s.id !== action.payload
      );
      if (state.currentStakeholder?.id === action.payload) {
        state.currentStakeholder = null;
      }
    });
  },
});

export const { clearError, setPage } = stakeholderSlice.actions;
export default stakeholderSlice.reducer;
