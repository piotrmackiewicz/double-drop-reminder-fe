import {
  IconButton,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { getMatchingTracks, getTrack, matchTracks, search } from 'api';
import { CompletionsTextField } from 'components/CompletionsTextField';
import { CompletionsListLink } from 'components/CompletionsTextField/CompletionsTextField.styled';
import { useCallback, useEffect, useState } from 'react';
import { Track } from 'types';
import { Container, SelectedTrackBox } from './AddMatchingTracks.styled';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { ROUTES } from 'router';

export const AddMatchingTrack = () => {
  const navigate = useNavigate();
  const { id: originTrackId } = useParams<{ id: string }>();
  const [inputValue, setInputValue] = useState('');
  const [inputCompletions, setInputCompletions] = useState<Track[]>([]);
  const [track1, setTrack1] = useState<Track | undefined>();
  const [track2, setTrack2] = useState<Track | undefined>();
  const [matchingTracks, setMatchingTracks] = useState<Track[]>([]);
  const [trackApiCallSuccess, setTrackApiCallSuccess] = useState(false);
  const [errors, setErrors] = useState({ track: false });
  const [loading, setLoading] = useState(false);

  const handleClearInput = () => {
    setTrackApiCallSuccess(false);
    setTrack2(undefined);
    setInputValue('');
  };

  const searchHandler = useCallback(async () => {
    setTrackApiCallSuccess(false);
    const result = await search(inputValue);
    setTrackApiCallSuccess(true);
    setInputCompletions(result.data);
  }, [inputValue]);

  const completionClickHandler = (track: Track) => {
    setTrack2(track);
    setInputValue(`${track.artist} - ${track.title}`);
    setTrackApiCallSuccess(false);
  };

  const handleSubmit = async () => {
    setErrors({ track: false });
    let isError = false;

    if (!track2) {
      setErrors({ track: true });
      isError = true;
    }

    if (isError || !originTrackId || !track2) return;

    setLoading(true);
    await matchTracks({
      originTrackId: Number(originTrackId),
      matchingTrackId: track2.id,
    });
    setLoading(false);
    toast('Tracks match added', { type: 'success' });
    navigate(ROUTES.TrackDetails.replace(':id', originTrackId));
  };

  useEffect(() => {
    const fetchOriginTrack = async () => {
      if (originTrackId) {
        const originTrack = await getTrack(originTrackId);
        setTrack1(originTrack);
      }
    };

    const fetchMatchingTracks = async () => {
      if (originTrackId) {
        const result = await getMatchingTracks(Number(originTrackId));
        setMatchingTracks(result);
      }
    };

    fetchOriginTrack();
    fetchMatchingTracks();
  }, [originTrackId]);

  useEffect(() => {
    if (inputValue.length === 0) {
      setInputCompletions([]);
      setTrackApiCallSuccess(false);
      return;
    }

    const delayInputTimeoutId = setTimeout(() => {
      searchHandler();
    }, 300);
    return () => clearTimeout(delayInputTimeoutId);
  }, [searchHandler, inputValue]);

  return (
    <Container>
      <Typography variant='h3'>Match Tracks</Typography>
      {track1 && (
        <SelectedTrackBox>
          <Typography>
            {track1.artist} - {track1.title}
          </Typography>
        </SelectedTrackBox>
      )}
      {track2 ? (
        <SelectedTrackBox>
          <Typography>
            {track2.artist} - {track2.title}
          </Typography>
          <IconButton edge='end' onClick={handleClearInput} size='small'>
            <ClearIcon />
          </IconButton>
        </SelectedTrackBox>
      ) : (
        <CompletionsTextField
          id='matching-track'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          name='matching-track'
          fullWidth
          label='Matching track'
          error={errors.track}
          helperText='Select track from the list'
          placeholder='Search for an artist or track...'
          onClear={handleClearInput}
          completions={inputCompletions
            .filter((completion) => completion.id !== track1?.id)
            // TODO: instead of filtering, render already matched tracks at the bottom
            //       of the list, mark them somehow (green tick?) and make unclickable
            .filter(
              (completion) =>
                !matchingTracks
                  .map((matchingTrack) => matchingTrack.id)
                  .includes(completion.id)
            )}
          completionsListElementRenderer={(completion) => (
            <ListItemButton
              key={completion.id}
              onClick={() => completionClickHandler(completion)}
            >
              <ListItemText
                primary={completion.title}
                secondary={completion.artist}
              />
            </ListItemButton>
          )}
          showNoCompletionsHint={trackApiCallSuccess}
          noCompletionsHintRenderer={() => (
            <CompletionsListLink
              to={ROUTES.AddTrack}
              state={{ context: { originTrack: track1 } }}
            >
              <ListItemButton>
                <ListItemText primary='No track found? Click here to add new one!' />
              </ListItemButton>
            </CompletionsListLink>
          )}
        />
      )}

      <LoadingButton
        variant='contained'
        onClick={handleSubmit}
        loading={loading}
        size='large'
      >
        Submit
      </LoadingButton>
    </Container>
  );
};
