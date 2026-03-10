export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user' | 'basic';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface FirebaseLoginCredentials {
  idToken: string;
  deviceId?: string;
  platform?: string;
}

export interface FirebaseLoginResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
  traceId: string;
}
