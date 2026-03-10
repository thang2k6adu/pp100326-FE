import apiClient from '@/utils/api';
import { StakeholderTemplateListResponse } from '@/types/stakeholder';
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
};
