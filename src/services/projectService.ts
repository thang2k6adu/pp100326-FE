import apiClient from '@/utils/api';
import {
  CreateProjectData,
  UpdateProjectData,
  ProjectListResponse,
  ProjectResponse,
} from '@/types/project';
import { API_ENDPOINTS } from '@/constants';

export const projectService = {
  getProjects: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ProjectListResponse> => {
    const response = await apiClient.get<ProjectListResponse>(
      API_ENDPOINTS.PROJECTS.LIST,
      { params }
    );
    return response.data;
  },

  getProjectById: async (id: string): Promise<ProjectResponse> => {
    const response = await apiClient.get<ProjectResponse>(
      API_ENDPOINTS.PROJECTS.DETAIL(id)
    );
    return response.data;
  },

  createProject: async (data: CreateProjectData): Promise<ProjectResponse> => {
    const response = await apiClient.post<ProjectResponse>(
      API_ENDPOINTS.PROJECTS.CREATE,
      data
    );
    return response.data;
  },

  updateProject: async (
    id: string,
    data: UpdateProjectData
  ): Promise<ProjectResponse> => {
    const response = await apiClient.patch<ProjectResponse>(
      API_ENDPOINTS.PROJECTS.UPDATE(id),
      data
    );
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
  },
};
