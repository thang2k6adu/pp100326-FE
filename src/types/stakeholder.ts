export type Classification = 'Internal' | 'External';
export type Level = 'High' | 'Medium' | 'Low';
export type Attitude =
  | 'Unaware'
  | 'Resistant'
  | 'Neutral'
  | 'Supportive'
  | 'Leading';

export interface Stakeholder {
  id: string;
  projectId: string;
  name: string;
  positionRole?: string;
  contactInformation?: string;
  requirements?: string;
  expectations?: string;
  phaseOfMostImpact?: string;
  classification?: Classification;
  power?: Level;
  interest?: Level;
  influence?: Level;
  currentAttitude?: Attitude;
  desiredAttitude?: Attitude;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStakeholderData {
  projectId: string;
  name: string;
  positionRole?: string;
  contactInformation?: string;
  requirements?: string;
  expectations?: string;
  phaseOfMostImpact?: string;
  classification?: Classification;
  power?: Level;
  interest?: Level;
  influence?: Level;
  currentAttitude?: Attitude;
  desiredAttitude?: Attitude;
}

export type UpdateStakeholderData = Partial<CreateStakeholderData>;

export interface StakeholderListResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    items: Stakeholder[];
    meta: {
      itemCount: number;
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  };
  traceId: string;
}

export interface StakeholderResponse {
  error: boolean;
  code: number;
  message: string;
  data: Stakeholder;
  traceId: string;
}

export interface StakeholderTemplate {
  id: string;
  stakeholderId: string;
  name: string;
  positionRole?: string;
  contactInformation?: string;
  requirements?: string;
  expectations?: string;
  phaseOfMostImpact?: string;
  classification?: Classification;
  power?: Level;
  interest?: Level;
  influence?: Level;
  currentAttitude?: Attitude;
  desiredAttitude?: Attitude;
  createdAt: string;
  updatedAt: string;
}

export interface StakeholderTemplateListResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    items: StakeholderTemplate[];
    meta: {
      itemCount: number;
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  };
  traceId: string;
}
