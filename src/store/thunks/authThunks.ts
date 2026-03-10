import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '@/config/firebase';
import { authService } from '@/services/authService';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { LoginCredentials, SignUpCredentials } from '@/types/auth';
import { User } from '@/types/auth';

interface AuthPayload {
  user: User;
  token: string;
}

// Helper function to handle Firebase errors
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  const errorObj = error as { code?: string; message?: string };
  if (errorObj?.code === 'auth/invalid-credential') {
    return 'Invalid email or password';
  }
  if (errorObj?.code === 'auth/email-already-in-use') {
    return 'Email already in use';
  }
  if (errorObj?.code === 'auth/user-not-found') {
    return 'User not found';
  }
  return errorObj?.message || defaultMessage;
};

// Login thunk
export const loginThunk = createAsyncThunk<
  AuthPayload,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const idToken = await userCredential.user.getIdToken();

    const response = await authService.firebaseLogin({ idToken });
    const { user, tokens } = response.data;

    localStorage.setItem('token', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    // Provide default required fields for User type just in case backend misses them
    const fullUser: User = {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user: fullUser, token: tokens.accessToken };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Login failed');
    return rejectWithValue(errorMessage);
  }
});

// Sign up thunk
export const signUpThunk = createAsyncThunk<
  AuthPayload,
  SignUpCredentials,
  { rejectValue: string }
>('auth/signUp', async (credentials, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    if (credentials.displayName) {
      await updateProfile(userCredential.user, {
        displayName: credentials.displayName,
      });
    }

    const idToken = await userCredential.user.getIdToken(true); // force refresh so name is updated

    const response = await authService.firebaseLogin({ idToken });
    const { user, tokens } = response.data;

    localStorage.setItem('token', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    const fullUser: User = {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user: fullUser, token: tokens.accessToken };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Sign up failed');
    return rejectWithValue(errorMessage);
  }
});

// Logout thunk
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/logout', async (_, { rejectWithValue }) => {
  if (!auth) {
    localStorage.removeItem('token');
    return;
  }

  try {
    await signOut(auth);
    localStorage.removeItem('token');
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Logout failed');
    return rejectWithValue(errorMessage);
  }
});

// Google sign in thunk
export const signInWithGoogleThunk = createAsyncThunk<
  AuthPayload,
  void,
  { rejectValue: string }
>('auth/signInWithGoogle', async (_, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    const idToken = await userCredential.user.getIdToken();

    const response = await authService.firebaseLogin({ idToken });
    const { user, tokens } = response.data;

    localStorage.setItem('token', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    const fullUser: User = {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user: fullUser, token: tokens.accessToken };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Google sign in failed');
    return rejectWithValue(errorMessage);
  }
});

// Facebook sign in thunk
export const signInWithFacebookThunk = createAsyncThunk<
  AuthPayload,
  void,
  { rejectValue: string }
>('auth/signInWithFacebook', async (_, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    const provider = new FacebookAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    const idToken = await userCredential.user.getIdToken();

    const response = await authService.firebaseLogin({ idToken });
    const { user, tokens } = response.data;

    localStorage.setItem('token', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    const fullUser: User = {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user: fullUser, token: tokens.accessToken };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Facebook sign in failed');
    return rejectWithValue(errorMessage);
  }
});

// GitHub sign in thunk
export const signInWithGitHubThunk = createAsyncThunk<
  AuthPayload,
  void,
  { rejectValue: string }
>('auth/signInWithGitHub', async (_, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    const idToken = await userCredential.user.getIdToken();

    const response = await authService.firebaseLogin({ idToken });
    const { user, tokens } = response.data;

    localStorage.setItem('token', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    const fullUser: User = {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { user: fullUser, token: tokens.accessToken };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'GitHub sign in failed');
    return rejectWithValue(errorMessage);
  }
});

// Forgot password thunk
export const forgotPasswordThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('auth/forgotPassword', async (email, { rejectWithValue }) => {
  if (!auth) {
    const error =
      'Firebase is not configured. Please set up Firebase in .env file.';
    return rejectWithValue(error);
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Failed to send reset email');
    return rejectWithValue(errorMessage);
  }
});
