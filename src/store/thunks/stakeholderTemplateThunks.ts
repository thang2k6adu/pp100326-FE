import { createAsyncThunk } from '@reduxjs/toolkit';
import { stakeholderTemplateService } from '@/services/stakeholderTemplateService';
import {
  StakeholderTemplateListResponse,
  StakeholderTemplate,
} from '@/types/stakeholder';

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

export const fetchStakeholderTemplateByIdThunk = createAsyncThunk<
  StakeholderTemplate,
  string,
  { rejectValue: string }
>('stakeholderTemplate/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await stakeholderTemplateService.getTemplateById(id);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch template'
    );
  }
});

export const createStakeholderTemplateThunk = createAsyncThunk<
  StakeholderTemplate,
  Partial<StakeholderTemplate>,
  { rejectValue: string }
>('stakeholderTemplate/create', async (data, { rejectWithValue }) => {
  try {
    return await stakeholderTemplateService.createTemplate(data);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to create template'
    );
  }
});

export const updateStakeholderTemplateThunk = createAsyncThunk<
  StakeholderTemplate,
  { id: string; data: Partial<StakeholderTemplate> },
  { rejectValue: string }
>('stakeholderTemplate/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await stakeholderTemplateService.updateTemplate(id, data);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to update template'
    );
  }
});

export const deleteStakeholderTemplateThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('stakeholderTemplate/delete', async (id, { rejectWithValue }) => {
  try {
    await stakeholderTemplateService.deleteTemplate(id);
    return id;
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete template'
    );
  }
});
