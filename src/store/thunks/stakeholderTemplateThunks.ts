import { createAsyncThunk } from '@reduxjs/toolkit';
import { stakeholderTemplateService } from '@/services/stakeholderTemplateService';
import { StakeholderTemplateListResponse } from '@/types/stakeholder';

export const fetchStakeholderTemplatesThunk = createAsyncThunk<
  StakeholderTemplateListResponse,
  { page?: number; limit?: number; search?: string } | undefined,
  { rejectValue: string }
>('stakeholderTemplate/fetchTemplates', async (params, { rejectWithValue }) => {
  try {
    return await stakeholderTemplateService.getTemplates(params);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch stakeholder templates'
    );
  }
});
