import { Stack } from '@mui/material';
import { AuthForm, AuthFormInputs } from 'components/AuthForm';
import { Logo } from 'components/Logo';
import { useAuthContext } from 'context/authContext';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'router';
import { FirebaseError } from 'firebase/app';

export const Login = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { auth } = useAuthContext();

  const handleSubmit = async (data: AuthFormInputs) => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      if (result.user.emailVerified) {
        navigate(ROUTES.Search);
      } else {
        setError('Please verify your email address to login');
        await signOut(auth);
      }
    } catch (err) {
      if ((err as FirebaseError).code === 'auth/invalid-credential') {
        setError('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.emailVerified) {
          await auth.updateCurrentUser(user);
          navigate(ROUTES.Search);
        } else {
          await signOut(auth);
          setError('Please verify your email address to login');
        }
      } else {
        setLoading(false);
      }
    });
  }, [auth, navigate]);

  return (
    <Stack spacing={3}>
      <Logo />
      <AuthForm
        mode='login'
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </Stack>
  );
};
