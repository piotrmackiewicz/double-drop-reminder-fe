import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, TextField } from '@mui/material';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Form } from './Feedback.styled';
import { giveFeedback } from 'api';
import { useAuthContext } from 'context/authContext';

interface FeedbackInputs {
  feedback: string;
}

const schema = yup
  .object({
    feedback: yup.string().required(),
  })
  .required();

export const Feedback = () => {
  const { auth } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onFormSubmit: SubmitHandler<FeedbackInputs> = async (data) => {
    setLoading(true);
    try {
      const { currentUser } = auth;
      if (!currentUser) return;
      const { email } = currentUser;
      if (!email) return;

      await giveFeedback(email, data.feedback);
      setSuccess(true);
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <Alert severity='success'>Thank you for your feedback!</Alert>;
  }

  return (
    <Form noValidate autoComplete='off' onSubmit={handleSubmit(onFormSubmit)}>
      <Controller
        name='feedback'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            placeholder='Enter your feedback in polish or english here...'
            fullWidth
            multiline
            minRows={10}
            maxRows={20}
            disabled={loading}
            error={!!errors.feedback}
            helperText={errors.feedback?.message || null}
            {...field}
          />
        )}
      />
      {error ? <Alert severity='error'>{error}</Alert> : null}
      <LoadingButton
        type='submit'
        variant='contained'
        size='large'
        loading={loading}
      >
        Submit
      </LoadingButton>
    </Form>
  );
};
