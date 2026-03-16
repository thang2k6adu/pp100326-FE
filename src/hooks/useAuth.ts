import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, SignUpCredentials } from '@/types/auth';
import {
  loginThunk,
  signUpThunk,
  logoutThunk,
  signInWithGoogleThunk,
  signInWithFacebookThunk,
  signInWithGitHubThunk,
  forgotPasswordThunk,
} from '@/store/thunks/authThunks';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    state => state.auth
  );

  const login = async (credentials: LoginCredentials) => {
    const result = await dispatch(loginThunk(credentials));
    if (loginThunk.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate('/projects');
    } else if (loginThunk.rejected.match(result)) {
      toast.error(result.payload || 'Login failed');
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    const result = await dispatch(signUpThunk(credentials));
    if (signUpThunk.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate('/projects');
    } else if (signUpThunk.rejected.match(result)) {
      toast.error(result.payload || 'Sign up failed');
    }
  };

  const logoutUser = async () => {
    const result = await dispatch(logoutThunk());
    if (logoutThunk.fulfilled.match(result)) {
      toast.success('Logged out successfully');
      navigate('/');
    } else if (logoutThunk.rejected.match(result)) {
      toast.error('Logout failed');
      navigate('/');
    }
  };

  const signInWithGoogle = async () => {
    const result = await dispatch(signInWithGoogleThunk());
    if (signInWithGoogleThunk.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate('/projects');
    } else if (signInWithGoogleThunk.rejected.match(result)) {
      toast.error('Google sign in failed');
    }
  };

  const signInWithFacebook = async () => {
    const result = await dispatch(signInWithFacebookThunk());
    if (signInWithFacebookThunk.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate('/projects');
    } else if (signInWithFacebookThunk.rejected.match(result)) {
      toast.error('Facebook sign in failed');
    }
  };

  const signInWithGitHub = async () => {
    const result = await dispatch(signInWithGitHubThunk());
    if (signInWithGitHubThunk.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate('/projects');
    } else if (signInWithGitHubThunk.rejected.match(result)) {
      toast.error('GitHub sign in failed');
    }
  };

  const forgotPassword = async (email: string) => {
    const result = await dispatch(forgotPasswordThunk(email));
    if (forgotPasswordThunk.fulfilled.match(result)) {
      toast.success('Password reset email sent!');
    } else if (forgotPasswordThunk.rejected.match(result)) {
      toast.error(result.payload || 'Failed to send reset email');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signUp,
    logout: logoutUser,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGitHub,
    forgotPassword,
  };
};
