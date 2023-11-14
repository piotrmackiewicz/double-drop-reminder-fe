import { Button, CircularProgress, List, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Track } from 'types';
import { Container, LoaderContainer } from './TrackDetails.styled';
import { getMatchingTracks, getTrack } from 'api';
import AddIcon from '@mui/icons-material/Add';
import { ROUTES } from 'router';
import { MatchingTrackElement } from './MatchingTrackElement';
import { useModeContext } from 'context/modeContext';

interface LocationState {
  state: {
    track: Track;
  };
}

export const TrackDetails = () => {
  let { id } = useParams();
  const location = useLocation();
  const { state }: LocationState = location;
  const { isPreparationMode } = useModeContext();
  const [track, setTrack] = useState<Track>();
  const [matchingTracks, setMatchingTracks] = useState<Track[]>([]);
  const [matchingTracksLoading, setMatchingTracksLoading] = useState(true);

  useEffect(() => {
    if (!state?.track) {
      const fetchTrack = async () => {
        if (id) {
          const fetchedTrack = await getTrack(id);
          setTrack(fetchedTrack);
        }
      };

      fetchTrack();
    } else {
      setTrack(state.track);
    }
  }, [id, state]);

  useEffect(() => {
    if (!track) return;

    const fetchMatchingTracks = async () => {
      setMatchingTracksLoading(true);
      const result = await getMatchingTracks(track.id);
      setMatchingTracks(result);
      setMatchingTracksLoading(false);
    };

    fetchMatchingTracks();
  }, [track]);

  return (
    <Container>
      <div>
        <Typography variant='h3'>{track?.title}</Typography>
        <Typography variant='h6'>{track?.artist}</Typography>
      </div>
      <>
        <List subheader={isPreparationMode ? 'Matching tracks:' : ''}>
          {matchingTracksLoading ? (
            <LoaderContainer>
              <CircularProgress />
            </LoaderContainer>
          ) : (
            matchingTracks.map((matchingTrack) => (
              <MatchingTrackElement
                key={matchingTrack.id}
                track={matchingTrack}
              />
            ))
          )}
        </List>
        {isPreparationMode && (
          <Link
            // TODO: add a check if track is present
            to={ROUTES.AddMatchingTrack.replace(
              ':id',
              track?.id.toString() || ''
            )}
            state={{ originTrack: track }}
          >
            <Button startIcon={<AddIcon />} variant='outlined' size='small'>
              Add matching track
            </Button>
          </Link>
        )}
      </>
    </Container>
  );
};
