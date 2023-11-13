import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from 'router';
import { BackButtonLink, Container } from './Layout.styled';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useModeContext } from 'context/modeContext';

interface Props {
  noBackButton?: boolean;
}

export const Layout = ({ noBackButton }: Props) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isPreparationMode } = useModeContext();

  return (
    <>
      <Container maxWidth='sm'>
        {pathname !== ROUTES.Search && (
          <BackButtonLink
            variant={isPreparationMode ? 'text' : 'outlined'}
            startIcon={<ArrowBackIcon />}
            size={isPreparationMode ? 'small' : 'large'}
            onClick={() => navigate(-1)}
          >
            Back
          </BackButtonLink>
        )}

        <Outlet />
      </Container>
    </>
  );
};
