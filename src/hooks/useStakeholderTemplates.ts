import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchStakeholderTemplatesThunk,
  fetchStakeholderTemplateByIdThunk,
  createStakeholderTemplateThunk,
  updateStakeholderTemplateThunk,
  deleteStakeholderTemplateThunk,
} from '@/store/thunks/stakeholderTemplateThunks';
import toast from 'react-hot-toast';
import { StakeholderTemplate } from '@/types/stakeholder';

export const useStakeholderTemplates = () => {
  const dispatch = useAppDispatch();
  const { templates, isLoading, error, total, page, limit } = useAppSelector(
    state => state.stakeholderTemplate
  );

  const fetchTemplates = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      const result = await dispatch(fetchStakeholderTemplatesThunk(params));
      if (fetchStakeholderTemplatesThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch templates');
      }
      return result;
    },
    [dispatch]
  );

  const fetchTemplateById = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchStakeholderTemplateByIdThunk(id));
      if (fetchStakeholderTemplateByIdThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch template');
      }
      return result;
    },
    [dispatch]
  );

  const createTemplate = useCallback(
    async (data: Partial<StakeholderTemplate>) => {
      const result = await dispatch(createStakeholderTemplateThunk(data));
      if (createStakeholderTemplateThunk.fulfilled.match(result)) {
        toast.success('Template created successfully!');
      } else if (createStakeholderTemplateThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to create template');
      }
      return result;
    },
    [dispatch]
  );

  const updateTemplate = useCallback(
    async (id: string, data: Partial<StakeholderTemplate>) => {
      const result = await dispatch(
        updateStakeholderTemplateThunk({ id, data })
      );
      if (updateStakeholderTemplateThunk.fulfilled.match(result)) {
        toast.success('Template updated successfully!');
      } else if (updateStakeholderTemplateThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to update template');
      }
      return result;
    },
    [dispatch]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteStakeholderTemplateThunk(id));
      if (deleteStakeholderTemplateThunk.fulfilled.match(result)) {
        toast.success('Template deleted successfully!');
      } else if (deleteStakeholderTemplateThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to delete template');
      }
      return result;
    },
    [dispatch]
  );

  return {
    templates,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchTemplates,
    fetchTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};
