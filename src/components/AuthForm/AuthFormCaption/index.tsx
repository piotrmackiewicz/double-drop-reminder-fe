import { Typography } from '@mui/material';
import { ROUTES } from 'router';
import { TargetLink } from './AuthFormCaption.styled';

interface Props {
  mode: 'login' | 'register';
}

export const AuthFormCaption = ({ mode }: Props) => {
  const captionText =
    mode === 'login'
      ? "Don't have an account yet?"
      : 'Already have an account?';
  const linkText = mode === 'login' ? 'Register' : 'Login';

  return (
    <>
      <Typography variant='caption' textAlign='center'>
        {captionText}{' '}
        <TargetLink
          to={mode === 'login' ? ROUTES.Register : ROUTES.Login}
        >{`${linkText} now`}</TargetLink>
      </Typography>
      {mode === 'login' ? (
        <Typography variant='caption' textAlign='center'>
          Forgot your password?{' '}
          <TargetLink to={ROUTES.ForgotPassword}>Reset it</TargetLink>
        </Typography>
      ) : null}
    </>
  );
};
