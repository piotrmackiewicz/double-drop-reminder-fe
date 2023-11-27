import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from 'router';
import { BackButtonLink, ButtonsContainer, Container } from './Layout.styled';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useModeContext } from 'context/modeContext';
import { Button } from '@mui/material';

export const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isPreparationMode } = useModeContext();

  const pathsWithoutBackButton = [ROUTES.Search, ROUTES.Register, ROUTES.Login];

  return (
    <>
      <Container maxWidth='sm'>
        {!pathsWithoutBackButton.includes(pathname as ROUTES) && (
          <ButtonsContainer>
            <BackButtonLink
              variant={isPreparationMode ? 'text' : 'outlined'}
              startIcon={<ArrowBackIcon />}
              size={isPreparationMode ? 'small' : 'large'}
              onClick={() => navigate(-1)}
            >
              Back
            </BackButtonLink>
            <Button
              size='large'
              onClick={() => navigate(ROUTES.Search, { replace: true })}
            >
              Search
            </Button>
          </ButtonsContainer>
        )}

        <Outlet />
      </Container>
    </>
  );
};
