import { Typography } from '@mui/material';
import { getTrack, matchTracks } from 'api';
import { useEffect, useState } from 'react';
import { SpotifySearchTrack } from 'types';
import { Container, SelectedTrackBox } from './AddMatchingTracks.styled';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { ROUTES } from 'router';
import { SpotifySearch } from 'components/SpotifySearch';
import { useAuthContext } from 'context/authContext';

interface LocationState {
  state: {
    originTrack: SpotifySearchTrack;
    matchingTracksIds: string[];
  };
}

export const AddMatchingTrack = () => {
  const navigate = useNavigate();
  const { id: originTrackId } = useParams<{ id: string }>();
  const location = useLocation();
  const {
    state: { originTrack: stateOriginTrack, matchingTracksIds },
  }: LocationState = location;
  const { spotifyAccessToken } = useAuthContext();
  const [track1, setTrack1] = useState<SpotifySearchTrack | undefined>();
  const [track2, setTrack2] = useState<SpotifySearchTrack | undefined>();
  const [loading, setLoading] = useState(false);

  const completionClickHandler = (track: SpotifySearchTrack) => {
    setTrack2(track);
  };

  const handleSubmit = async () => {
    if (!originTrackId || !track1 || !track2) return;

    setLoading(true);
    await matchTracks({
      originTrackId: originTrackId,
      matchingTrackId: track2.id,
    });
    setLoading(false);
    navigate(ROUTES.TrackDetails.replace(':id', originTrackId), {
      state: {
        track: track1,
      },
    });
  };

  useEffect(() => {
    const fetchOriginTrack = async () => {
      if (originTrackId) {
        const originTrack = await getTrack(originTrackId, spotifyAccessToken);
        setTrack1(originTrack);
      }
    };

    if (stateOriginTrack) {
      setTrack1(stateOriginTrack);
    } else {
      fetchOriginTrack();
    }
  }, [originTrackId, spotifyAccessToken, stateOriginTrack]);

  return (
    <Container>
      <Typography variant='h3'>Match Tracks</Typography>
      {track1 && (
        <SelectedTrackBox>
          <Typography>
            {track1.name} - {track1.artists.join(', ')}
          </Typography>
        </SelectedTrackBox>
      )}
      <SpotifySearch
        onCompletionClick={completionClickHandler}
        disabledCompletionsIds={matchingTracksIds}
      />

      <LoadingButton
        variant='contained'
        onClick={handleSubmit}
        loading={loading}
        disabled={!track1 || !track2}
        size='large'
      >
        Submit
      </LoadingButton>
    </Container>
  );
};
