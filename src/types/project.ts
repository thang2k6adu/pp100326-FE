export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
}

export interface ProjectListResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    items: Project[];
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

export interface ProjectResponse {
  error: boolean;
  code: number;
  message: string;
  data: Project;
  traceId: string;
}
