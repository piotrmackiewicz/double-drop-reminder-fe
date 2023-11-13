import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Track } from 'types';
import {
  Container,
  DialogActions,
  LoaderContainer,
} from './TrackDetails.styled';
import { deleteMatchingTrack, getMatchingTracks, getTrack } from 'api';
import AddIcon from '@mui/icons-material/Add';
import { ROUTES } from 'router';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
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
  const [deleteMatchingTrackLoading, setDeleteMatchingTrackLoading] =
    useState(false);
  const [matchingTracksLoading, setMatchingTracksLoading] = useState(true);
  const [matchingTrackBeingDeleted, setMatchingTrackBeingDeleted] =
    useState<Track>();

  const handleDeleteMatchingTrack = (track: Track) => {
    setMatchingTrackBeingDeleted(track);
  };

  const handleDeleteMatchingTrackConfirm = async () => {
    setDeleteMatchingTrackLoading(true);
    setMatchingTracks((prev) =>
      prev.filter((track) => track.id !== matchingTrackBeingDeleted?.id)
    );
    // TODO: ensure that at this point both values are present
    if (track?.id && matchingTrackBeingDeleted?.id) {
      await deleteMatchingTrack({
        originTrackId: track.id,
        matchingTrackId: matchingTrackBeingDeleted?.id,
      });
      toast('Tracks match deleted', { type: 'success' });
    }
    setDeleteMatchingTrackLoading(false);
    setMatchingTrackBeingDeleted(undefined);
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

    const fetchMatchingTracks = async () => {
      const result = await getMatchingTracks(track.id);
      setMatchingTracks(result);
      setMatchingTracksLoading(false);
    };

    fetchMatchingTracks();
  }, [track]);

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
                  track={matchingTrack}
                  onDeleteMatchingTrack={handleDeleteMatchingTrack}
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
      <Dialog
        onClose={() => setMatchingTrackBeingDeleted(undefined)}
        open={!!matchingTrackBeingDeleted}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>These tracks will be unmatched:</Typography>
            <Typography>
              {track?.artist} - {track?.title}
            </Typography>
            <Typography>
              {matchingTrackBeingDeleted?.artist} -{' '}
              {matchingTrackBeingDeleted?.title}
            </Typography>
          </DialogContentText>
          <DialogActions>
            <LoadingButton
              variant='contained'
              onClick={handleDeleteMatchingTrackConfirm}
              loading={deleteMatchingTrackLoading}
            >
              Yes
            </LoadingButton>
            <Button
              variant='outlined'
              color='error'
              onClick={() => setMatchingTrackBeingDeleted(undefined)}
              disabled={deleteMatchingTrackLoading}
            >
              No
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};
