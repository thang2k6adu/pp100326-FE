import apiClient from '@/utils/api';
import {
  CreateStakeholderData,
  UpdateStakeholderData,
  StakeholderListResponse,
  StakeholderResponse,
} from '@/types/stakeholder';
import { API_ENDPOINTS } from '@/constants';

export const stakeholderService = {
  getStakeholders: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    projectId?: string;
    classification?: string;
    power?: string;
    interest?: string;
  }): Promise<StakeholderListResponse> => {
    const response = await apiClient.get<StakeholderListResponse>(
      API_ENDPOINTS.STAKEHOLDERS.LIST,
      { params }
    );
    return response.data;
  },

  getStakeholderById: async (id: string): Promise<StakeholderResponse> => {
    const response = await apiClient.get<StakeholderResponse>(
      API_ENDPOINTS.STAKEHOLDERS.DETAIL(id)
    );
    return response.data;
  },

  createStakeholder: async (
    data: CreateStakeholderData
  ): Promise<StakeholderResponse> => {
    const response = await apiClient.post<StakeholderResponse>(
      API_ENDPOINTS.STAKEHOLDERS.CREATE,
      data
    );
    return response.data;
  },

  updateStakeholder: async (
    id: string,
    data: UpdateStakeholderData
  ): Promise<StakeholderResponse> => {
    const response = await apiClient.patch<StakeholderResponse>(
      API_ENDPOINTS.STAKEHOLDERS.UPDATE(id),
      data
    );
    return response.data;
  },

  deleteStakeholder: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.STAKEHOLDERS.DELETE(id));
  },
};
