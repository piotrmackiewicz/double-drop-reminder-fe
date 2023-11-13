import { Stack } from '@mui/material';
import { login } from 'api';
import { AuthForm, AuthFormInputs } from 'components/AuthForm';
import { Logo } from 'components/Logo';
import { useAuthContext } from 'context/authContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'router';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIdToken } = useAuthContext();

  const handleSubmit = async (data: AuthFormInputs) => {
    setLoading(true);
    const response = await login(data);
    if (response.status === 200) {
      setIdToken(response.data.idToken);
      navigate(ROUTES.Search);
    }
    setLoading(false);
  };

  return (
    <Stack spacing={3}>
      <Logo />
      <AuthForm mode='login' onSubmit={handleSubmit} loading={loading} />
    </Stack>
  );
};
