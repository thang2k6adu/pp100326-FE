import { createAsyncThunk } from '@reduxjs/toolkit';
import { stakeholderService } from '@/services/stakeholderService';
import {
  CreateStakeholderData,
  UpdateStakeholderData,
  StakeholderListResponse,
  StakeholderResponse,
} from '@/types/stakeholder';

export const fetchStakeholdersThunk = createAsyncThunk<
  StakeholderListResponse,
  | {
      page?: number;
      limit?: number;
      search?: string;
      projectId?: string;
      group?: string;
      classification?: string;
      power?: string;
      interest?: string;
    }
  | undefined,
  { rejectValue: string }
>('stakeholder/fetchStakeholders', async (params, { rejectWithValue }) => {
  try {
    return await stakeholderService.getStakeholders(params);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch stakeholders'
    );
  }
});

export const fetchStakeholderByIdThunk = createAsyncThunk<
  StakeholderResponse,
  string,
  { rejectValue: string }
>('stakeholder/fetchStakeholderById', async (id, { rejectWithValue }) => {
  try {
    return await stakeholderService.getStakeholderById(id);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch stakeholder'
    );
  }
});

export const createStakeholderThunk = createAsyncThunk<
  StakeholderResponse,
  CreateStakeholderData,
  { rejectValue: string }
>('stakeholder/createStakeholder', async (data, { rejectWithValue }) => {
  try {
    return await stakeholderService.createStakeholder(data);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to create stakeholder'
    );
  }
});

export const updateStakeholderThunk = createAsyncThunk<
  StakeholderResponse,
  { id: string; data: UpdateStakeholderData },
  { rejectValue: string }
>(
  'stakeholder/updateStakeholder',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await stakeholderService.updateStakeholder(id, data);
    } catch (e) {
      const error = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update stakeholder'
      );
    }
  }
);

export const deleteStakeholderThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('stakeholder/deleteStakeholder', async (id, { rejectWithValue }) => {
  try {
    await stakeholderService.deleteStakeholder(id);
    return id;
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete stakeholder'
    );
  }
});
