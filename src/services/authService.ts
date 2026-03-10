import apiClient from '@/utils/api';
import {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  FirebaseLoginCredentials,
  FirebaseLoginResponse,
} from '@/types/auth';
import { API_ENDPOINTS } from '@/constants';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  firebaseLogin: async (
    credentials: FirebaseLoginCredentials
  ): Promise<FirebaseLoginResponse> => {
    const response = await apiClient.post<FirebaseLoginResponse>(
      API_ENDPOINTS.AUTH.FIREBASE_LOGIN,
      credentials
    );
    return response.data;
  },

  signUp: async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>(
      API_ENDPOINTS.AUTH.REFRESH
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
    });
  },
};
