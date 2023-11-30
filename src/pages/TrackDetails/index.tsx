import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  Modal,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { MatchingTrack, SpotifySearchTrack, Track } from 'types';
import {
  Container,
  LoaderContainer,
  RateButtonsContainer,
  SuccessContainer,
} from './TrackDetails.styled';
import { getMatches, getTrack, getTracks, getUserRating, rateMatch } from 'api';
import AddIcon from '@mui/icons-material/Add';
import { ROUTES } from 'router';
import { MatchingTrackElement } from './MatchingTrackElement';
import { useModeContext } from 'context/modeContext';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuthContext } from 'context/authContext';

interface LocationState {
  state: {
    track: SpotifySearchTrack;
  };
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  borderRadius: '8px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
export const TrackDetails = () => {
  let { id } = useParams();
  const location = useLocation();
  const { state }: LocationState = location;
  const { spotifyAccessToken } = useAuthContext();
  const { isPreparationMode } = useModeContext();
  const [track, setTrack] = useState<SpotifySearchTrack>();
  const [matchingTracks, setMatchingTracks] = useState<MatchingTrack[]>([]);
  const [matchingTracksLoading, setMatchingTracksLoading] = useState(true);
  const [ratingMatchId, setRatingMatchId] = useState<null | string>(null);
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [isRateSuccess, setIsRateSuccess] = useState(false);
  const [ratedMatchesIds, setRatedMatchesIds] = useState<string[]>([]);

  const fetchMatchingTracks = useCallback(async () => {
    if (!track) return;
    setMatchingTracksLoading(true);
    const result = await getMatches(track.id);
    const matchingTracksIds = result.map((match) =>
      match.track_1 === track.id ? match.track_2 : match.track_1
    );
    if (matchingTracksIds.length > 0) {
      const fetchedTracks = await getTracks(
        matchingTracksIds,
        spotifyAccessToken
      );
      const matchingTracks = [];
      for (let i = 0; i < result.length; i++) {
        const match = result.find(
          (r) =>
            r.track_1 === fetchedTracks[i].id ||
            r.track_2 === fetchedTracks[i].id
        );
        if (match) {
          const fetchedTrack = fetchedTracks[i];
          const matchingTrack = {
            ...fetchedTrack,
            match_id: match.id,
            thumbs_up: match.thumbs_up,
            thumbs_down: match.thumbs_down,
          };
          matchingTracks.push(matchingTrack);
        }
      }
      setMatchingTracks(matchingTracks);
    }
    setMatchingTracksLoading(false);
  }, [spotifyAccessToken, track]);

  const handleRate = async (rate: boolean) => {
    if (!ratingMatchId) return;
    setIsRateLoading(true);
    try {
      await rateMatch(ratingMatchId, rate);
      setIsRateSuccess(true);
      fetchUserRatings();
      fetchMatchingTracks();
    } catch (e) {
      // TODO: handle error
    } finally {
      setIsRateLoading(false);
    }
  };

  const handleModalClose = () => {
    setRatingMatchId(null);
    setIsRateSuccess(false);
  };

  const fetchUserRatings = async () => {
    const result = await getUserRating();
    setRatedMatchesIds(result.map((r) => r.match_id));
  };

  useEffect(() => {
    if (!state?.track) {
      const fetchTrack = async () => {
        if (id) {
          const fetchedTrack = await getTrack(id, spotifyAccessToken);
          setTrack(fetchedTrack);
        }
      };

      fetchTrack();
    } else {
      setTrack(state.track);
    }
  }, [id, spotifyAccessToken, state]);

  useEffect(() => {
    if (!track) return;

    fetchUserRatings();
  }, [fetchMatchingTracks, track]);

  useEffect(() => {
    if (track) {
      fetchMatchingTracks();
    }
  }, [fetchMatchingTracks, track]);

  return (
    <>
      <Container>
        <div>
          <Typography variant='h3'>{track?.name}</Typography>
          <Typography variant='h6'>{track?.artists.join(', ')}</Typography>
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
                  isRated={ratedMatchesIds.includes(matchingTrack.match_id)}
                  onRateClick={() => setRatingMatchId(matchingTrack.match_id)}
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
              state={{
                originTrack: track,
                matchingTracksIds: matchingTracks.map((mt) => mt.id),
              }}
            >
              <Button startIcon={<AddIcon />} variant='outlined' size='small'>
                Add matching track
              </Button>
            </Link>
          )}
        </>
        <Modal open={!!ratingMatchId} onClose={handleModalClose}>
          <Box sx={style}>
            {isRateSuccess ? (
              <>
                <Typography variant='h5' marginBottom='16px'>
                  Thanks for you vote!
                </Typography>
                <SuccessContainer>
                  <CheckCircleIcon color='success' fontSize='large' />
                  <Button
                    color='primary'
                    variant='contained'
                    onClick={handleModalClose}
                  >
                    Go back
                  </Button>
                </SuccessContainer>
              </>
            ) : (
              <>
                <Typography variant='h5' marginBottom='16px'>
                  Rate this double drop!
                </Typography>
                <RateButtonsContainer>
                  {isRateLoading ? (
                    <CircularProgress />
                  ) : (
                    <>
                      <IconButton size='large' onClick={() => handleRate(true)}>
                        <ThumbUpOutlinedIcon color='success' fontSize='large' />
                      </IconButton>
                      <IconButton
                        size='large'
                        onClick={() => handleRate(false)}
                      >
                        <ThumbDownOutlinedIcon color='error' fontSize='large' />
                      </IconButton>
                    </>
                  )}
                </RateButtonsContainer>
              </>
            )}
          </Box>
        </Modal>
      </Container>
    </>
  );
};
