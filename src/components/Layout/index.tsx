import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from 'router';
import { BackButtonLink, ButtonsContainer, Container } from './Layout.styled';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useModeContext } from 'context/modeContext';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useAuthContext } from 'context/authContext';
import { getSpotifyToken } from 'api';

export const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuth, spotifyAccessToken, setSpotifyAccessToken } =
    useAuthContext();
  const { isPreparationMode } = useModeContext();

  const pathsWithoutBackButton = [
    ROUTES.Search,
    ROUTES.Register,
    ROUTES.Login,
    ROUTES.ForgotPassword,
  ];

  useEffect(() => {
    const authSpotify = async () => {
      const result = await getSpotifyToken();
      setSpotifyAccessToken(result.accessToken);
    };

    if (isAuth && !spotifyAccessToken) {
      authSpotify();
    }
  }, [isAuth, setSpotifyAccessToken, spotifyAccessToken]);

  return (
    <>
      <Container maxWidth='sm'>
        {!pathsWithoutBackButton.includes(pathname as ROUTES) && (
          <ButtonsContainer>
            <BackButtonLink
              variant='outlined'
              startIcon={<ArrowBackIcon />}
              size={isPreparationMode ? 'small' : 'large'}
              onClick={() => navigate(-1)}
            >
              Back
            </BackButtonLink>
            <Button
              variant='outlined'
              onClick={() => navigate(ROUTES.Search, { replace: true })}
              size={isPreparationMode ? 'small' : 'large'}
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
