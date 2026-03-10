import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StakeholderTemplate } from '@/types/stakeholder';
import { fetchStakeholderTemplatesThunk } from '../thunks/stakeholderTemplateThunks';

interface StakeholderTemplateState {
  templates: StakeholderTemplate[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: StakeholderTemplateState = {
  templates: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

const stakeholderTemplateSlice = createSlice({
  name: 'stakeholderTemplate',
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
    builder
      .addCase(fetchStakeholderTemplatesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStakeholderTemplatesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload.data.items;
        state.total = action.payload.data.meta.totalItems;
      })
      .addCase(fetchStakeholderTemplatesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch templates';
      });
  },
});

export const { clearError, setPage } = stakeholderTemplateSlice.actions;
export default stakeholderTemplateSlice.reducer;
