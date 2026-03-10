import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProjectsThunk,
  fetchProjectByIdThunk,
  createProjectThunk,
  updateProjectThunk,
  deleteProjectThunk,
} from '@/store/thunks/projectThunks';
import { CreateProjectData, UpdateProjectData } from '@/types/project';
import toast from 'react-hot-toast';

export const useProjects = () => {
  const dispatch = useAppDispatch();
  const { projects, currentProject, isLoading, error, total, page, limit } =
    useAppSelector(state => state.project);

  const fetchProjects = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      const result = await dispatch(fetchProjectsThunk(params));
      if (fetchProjectsThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch projects');
      }
      return result;
    },
    [dispatch]
  );

  const fetchProjectById = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchProjectByIdThunk(id));
      if (fetchProjectByIdThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch project');
      }
      return result;
    },
    [dispatch]
  );

  const createProject = useCallback(
    async (data: CreateProjectData) => {
      const result = await dispatch(createProjectThunk(data));
      if (createProjectThunk.fulfilled.match(result)) {
        toast.success('Project created successfully!');
      } else if (createProjectThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to create project');
      }
      return result;
    },
    [dispatch]
  );

  const updateProject = useCallback(
    async (id: string, data: UpdateProjectData) => {
      const result = await dispatch(updateProjectThunk({ id, data }));
      if (updateProjectThunk.fulfilled.match(result)) {
        toast.success('Project updated successfully!');
      } else if (updateProjectThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to update project');
      }
      return result;
    },
    [dispatch]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteProjectThunk(id));
      if (deleteProjectThunk.fulfilled.match(result)) {
        toast.success('Project deleted successfully!');
      } else if (deleteProjectThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to delete project');
      }
      return result;
    },
    [dispatch]
  );

  return {
    projects,
    currentProject,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
  };
};
