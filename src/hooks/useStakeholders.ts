import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchStakeholdersThunk,
  fetchStakeholderByIdThunk,
  createStakeholderThunk,
  updateStakeholderThunk,
  deleteStakeholderThunk,
} from '@/store/thunks/stakeholderThunks';
import {
  CreateStakeholderData,
  UpdateStakeholderData,
} from '@/types/stakeholder';
import toast from 'react-hot-toast';

export const useStakeholders = () => {
  const dispatch = useAppDispatch();
  const {
    stakeholders,
    currentStakeholder,
    isLoading,
    error,
    total,
    page,
    limit,
  } = useAppSelector(state => state.stakeholder);

  const fetchStakeholders = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      projectId?: string;
      classification?: string;
      power?: string;
      interest?: string;
    }) => {
      const result = await dispatch(fetchStakeholdersThunk(params));
      if (fetchStakeholdersThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch stakeholders');
      }
      return result;
    },
    [dispatch]
  );

  const fetchStakeholderById = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchStakeholderByIdThunk(id));
      if (fetchStakeholderByIdThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch stakeholder');
      }
      return result;
    },
    [dispatch]
  );

  const createStakeholder = useCallback(
    async (data: CreateStakeholderData) => {
      const result = await dispatch(createStakeholderThunk(data));
      if (createStakeholderThunk.fulfilled.match(result)) {
        toast.success('Stakeholder created successfully!');
      } else if (createStakeholderThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to create stakeholder');
      }
      return result;
    },
    [dispatch]
  );

  const updateStakeholder = useCallback(
    async (id: string, data: UpdateStakeholderData) => {
      const result = await dispatch(updateStakeholderThunk({ id, data }));
      if (updateStakeholderThunk.fulfilled.match(result)) {
        toast.success('Stakeholder updated successfully!');
      } else if (updateStakeholderThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to update stakeholder');
      }
      return result;
    },
    [dispatch]
  );

  const deleteStakeholder = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteStakeholderThunk(id));
      if (deleteStakeholderThunk.fulfilled.match(result)) {
        toast.success('Stakeholder deleted successfully!');
      } else if (deleteStakeholderThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to delete stakeholder');
      }
      return result;
    },
    [dispatch]
  );

  return {
    stakeholders,
    currentStakeholder,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchStakeholders,
    fetchStakeholderById,
    createStakeholder,
    updateStakeholder,
    deleteStakeholder,
  };
};
