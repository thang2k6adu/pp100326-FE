import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStakeholderTemplatesThunk } from '@/store/thunks/stakeholderTemplateThunks';
import toast from 'react-hot-toast';

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

  return {
    templates,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchTemplates,
  };
};
