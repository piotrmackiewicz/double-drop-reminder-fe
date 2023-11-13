import { Button, Stack, Typography } from '@mui/material';
import { Logo } from 'components/Logo';
import { AuthForm, AuthFormInputs } from 'components/AuthForm';
import { register } from 'api';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'router';
import { SuccessContainer } from './Register.styled';

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: AuthFormInputs) => {
    setLoading(true);
    const response = await register(data);
    if (response.status === 201) {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <Stack spacing={3}>
      <Logo />
      {success ? (
        <SuccessContainer>
          <Typography variant='h5' textAlign='center'>
            Your account has been registered! You can login now
          </Typography>
          <Link to={ROUTES.Login}>
            <Button variant='contained'>Go to Login</Button>
          </Link>
        </SuccessContainer>
      ) : (
        <AuthForm mode='register' onSubmit={handleSubmit} loading={loading} />
      )}
    </Stack>
  );
};
