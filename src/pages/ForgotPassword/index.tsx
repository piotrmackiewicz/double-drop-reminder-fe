import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { Logo } from 'components/Logo';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'router';
import * as yup from 'yup';
import { StyledForm } from './ForgotPassword.styled';
import { useAuthContext } from 'context/authContext';
import { sendPasswordResetEmail } from 'firebase/auth';

interface ForgotPasswordInputs {
  email: string;
}

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();

export const ForgotPassword = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuthContext();

  const onFormSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    setLoading(true);
    const { email } = data;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onGoBackToLogin = () => {
    navigate(ROUTES.Login);
  };

  return (
    <Stack spacing={3}>
      <Logo />
      {success ? (
        <Alert severity='success'>
          Password reset email has been sent. Please check your inbox.
        </Alert>
      ) : (
        <StyledForm noValidate onSubmit={handleSubmit(onFormSubmit)}>
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label='E-mail'
                placeholder='Enter your e-mail address'
                fullWidth
                disabled={loading}
                error={!!errors.email}
                helperText={errors.email?.message || null}
                {...field}
              />
            )}
          />
          {!!error ? <Alert severity='error'>{error}</Alert> : null}
          <LoadingButton
            type='submit'
            variant='contained'
            size='large'
            loading={loading}
          >
            Send reset password email
          </LoadingButton>
        </StyledForm>
      )}

      <Button variant='outlined' size='large' onClick={onGoBackToLogin}>
        Go back to login
      </Button>
    </Stack>
  );
};
