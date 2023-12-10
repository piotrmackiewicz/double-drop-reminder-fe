import { Stack } from '@mui/material';
import { ROUTES } from 'router';
import { SpotifySearchTrack } from 'types';
import { Logo } from 'components/Logo';
import { SwitchModeButton } from 'components/SwitchModeButton';
import { useModeContext } from 'context/modeContext';
import { SpotifySearch } from 'components/SpotifySearch';
import { useNavigate } from 'react-router-dom';
import { TopDoubleDrops } from 'components/TopDoubleDrops';

export const Search = () => {
  const navigate = useNavigate();
  const { isPreparationMode } = useModeContext();

  const handleCompletionClick = (completion: SpotifySearchTrack) => {
    navigate(ROUTES.TrackDetails.replace(':id', completion.id.toString()), {
      state: { track: completion },
    });
  };

  return (
    <Stack spacing={4}>
      <SwitchModeButton />
      {isPreparationMode && <Logo />}
      <SpotifySearch onCompletionClick={handleCompletionClick} />
      <TopDoubleDrops />
    </Stack>
  );
};
