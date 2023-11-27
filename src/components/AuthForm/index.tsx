import { Alert, TextField } from '@mui/material';
import { Form } from './AuthForm.styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { AuthFormCaption } from './AuthFormCaption';
import { capitalize } from 'utils';
import { LoadingButton } from '@mui/lab';

export interface AuthFormInputs {
  email: string;
  password: string;
}

interface Props {
  mode: 'login' | 'register';
  onSubmit: (data: AuthFormInputs) => void;
  error?: string;
  loading?: boolean;
}

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

export const AuthForm = ({ mode, onSubmit, loading, error }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onFormSubmit: SubmitHandler<AuthFormInputs> = (data) => {
    onSubmit(data);
  };

  return (
    <>
      <Form noValidate autoComplete='off' onSubmit={handleSubmit(onFormSubmit)}>
        <Controller
          name='email'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label='E-mail'
              fullWidth
              disabled={loading}
              error={!!errors.email}
              helperText={errors.email?.message || null}
              {...field}
            />
          )}
        />
        <Controller
          name='password'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              type='password'
              label='Password'
              fullWidth
              disabled={loading}
              error={!!errors.password}
              helperText={errors.password?.message || null}
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
          {capitalize(mode)}
        </LoadingButton>
      </Form>
      <AuthFormCaption mode={mode} />
    </>
  );
};
