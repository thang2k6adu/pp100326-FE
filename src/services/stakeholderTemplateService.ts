import apiClient from '@/utils/api';
import {
  StakeholderTemplateListResponse,
  StakeholderTemplate,
} from '@/types/stakeholder';
import { API_ENDPOINTS } from '@/constants';

export const stakeholderTemplateService = {
  getTemplates: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<StakeholderTemplateListResponse> => {
    const response = await apiClient.get<StakeholderTemplateListResponse>(
      API_ENDPOINTS.STAKEHOLDER_TEMPLATES.LIST,
      { params }
    );
    return response.data;
  },

  getTemplateById: async (id: string): Promise<StakeholderTemplate> => {
    const response = await apiClient.get<{ data: StakeholderTemplate }>(
      `${API_ENDPOINTS.STAKEHOLDER_TEMPLATES.LIST}/${id}`
    );
    return response.data.data;
  },

  createTemplate: async (
    data: Partial<StakeholderTemplate>
  ): Promise<StakeholderTemplate> => {
    const response = await apiClient.post<{ data: StakeholderTemplate }>(
      API_ENDPOINTS.STAKEHOLDER_TEMPLATES.LIST,
      data
    );
    return response.data.data;
  },

  updateTemplate: async (
    id: string,
    data: Partial<StakeholderTemplate>
  ): Promise<StakeholderTemplate> => {
    const response = await apiClient.patch<{ data: StakeholderTemplate }>(
      `${API_ENDPOINTS.STAKEHOLDER_TEMPLATES.LIST}/${id}`,
      data
    );
    return response.data.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.STAKEHOLDER_TEMPLATES.LIST}/${id}`);
  },
};
