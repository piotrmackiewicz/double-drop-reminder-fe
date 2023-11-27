import { Stack } from '@mui/material';
import { AuthForm, AuthFormInputs } from 'components/AuthForm';
import { Logo } from 'components/Logo';
import { useAuthContext } from 'context/authContext';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'router';
import { FirebaseError } from 'firebase/app';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { auth } = useAuthContext();

  const handleSubmit = async (data: AuthFormInputs) => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate(ROUTES.Search);
    } catch (err) {
      if ((err as FirebaseError).code === 'auth/invalid-credential') {
        setError('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

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
