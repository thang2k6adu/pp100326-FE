import { createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '@/services/projectService';
import {
  CreateProjectData,
  UpdateProjectData,
  ProjectListResponse,
  ProjectResponse,
} from '@/types/project';

export const fetchProjectsThunk = createAsyncThunk<
  ProjectListResponse,
  { page?: number; limit?: number; search?: string } | undefined,
  { rejectValue: string }
>('project/fetchProjects', async (params, { rejectWithValue }) => {
  try {
    return await projectService.getProjects(params);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch projects'
    );
  }
});

export const fetchProjectByIdThunk = createAsyncThunk<
  ProjectResponse,
  string,
  { rejectValue: string }
>('project/fetchProjectById', async (id, { rejectWithValue }) => {
  try {
    return await projectService.getProjectById(id);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch project'
    );
  }
});

export const createProjectThunk = createAsyncThunk<
  ProjectResponse,
  CreateProjectData,
  { rejectValue: string }
>('project/createProject', async (data, { rejectWithValue }) => {
  try {
    return await projectService.createProject(data);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to create project'
    );
  }
});

export const updateProjectThunk = createAsyncThunk<
  ProjectResponse,
  { id: string; data: UpdateProjectData },
  { rejectValue: string }
>('project/updateProject', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await projectService.updateProject(id, data);
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to update project'
    );
  }
});

export const deleteProjectThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('project/deleteProject', async (id, { rejectWithValue }) => {
  try {
    await projectService.deleteProject(id);
    return id;
  } catch (e) {
    const error = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete project'
    );
  }
});
