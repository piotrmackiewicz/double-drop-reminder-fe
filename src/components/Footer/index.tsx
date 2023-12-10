import { Typography } from '@mui/material';
import { Container } from './Footer.styled';
import { ROUTES } from 'router';
import { useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();

  if (location.pathname === ROUTES.Feedback) {
    return null;
  }

  return (
    <Container to={ROUTES.Feedback}>
      <Typography variant='body2' textAlign='center'>
        If you have any suggestions or wanna report a bug let me know here!
      </Typography>
    </Container>
  );
};
