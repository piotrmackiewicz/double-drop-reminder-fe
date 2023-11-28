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
import { MatchingTrack, Track } from 'types';
import {
  Container,
  LoaderContainer,
  RateButtonsContainer,
  SuccessContainer,
} from './TrackDetails.styled';
import { getMatchingTracks, getTrack, getUserRating, rateMatch } from 'api';
import AddIcon from '@mui/icons-material/Add';
import { ROUTES } from 'router';
import { MatchingTrackElement } from './MatchingTrackElement';
import { useModeContext } from 'context/modeContext';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface LocationState {
  state: {
    track: Track;
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
  const { isPreparationMode } = useModeContext();
  const [track, setTrack] = useState<Track>();
  const [matchingTracks, setMatchingTracks] = useState<MatchingTrack[]>([]);
  const [matchingTracksLoading, setMatchingTracksLoading] = useState(true);
  const [userRatings, setUserRatings] = useState<number[]>([]);
  const [ratingMatchId, setRatingMatchId] = useState<null | number>(null);
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [isRateSuccess, setIsRateSuccess] = useState(false);

  const fetchMatchingTracks = useCallback(async () => {
    if (!track) return;
    setMatchingTracksLoading(true);
    const result = await getMatchingTracks(track.id);
    setMatchingTracks(result);
    setMatchingTracksLoading(false);
  }, [track]);

  const handleRate = async (rate: number) => {
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
    const { thumb_up_matches_ids, thumb_down_matches_ids } = result;
    let ratings: number[] = [];
    if (thumb_up_matches_ids) {
      ratings = [...ratings, ...thumb_up_matches_ids];
    }
    if (thumb_down_matches_ids) {
      ratings = [...ratings, ...thumb_down_matches_ids];
    }
    setUserRatings(ratings);
  };

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

    fetchUserRatings();
    fetchMatchingTracks();
  }, [fetchMatchingTracks, track]);

  return (
    <>
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
                  isRated={userRatings.includes(matchingTrack.match_id)}
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
              state={{ originTrack: track }}
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
                      <IconButton size='large' onClick={() => handleRate(1)}>
                        <ThumbUpOutlinedIcon color='success' fontSize='large' />
                      </IconButton>
                      <IconButton size='large' onClick={() => handleRate(0)}>
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
