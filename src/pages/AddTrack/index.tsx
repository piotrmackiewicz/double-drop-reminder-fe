import {
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { FormContainer } from './AddTrack.styled';
import { Track } from 'types';
import { addTrack, search } from 'api';
import { CompletionsTextField } from 'components/CompletionsTextField';
import { LoadingButton } from '@mui/lab';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from 'router';
import { toast } from 'react-toastify';

interface LocationState {
  state: {
    context?: {
      originTrack?: Track;
      matchingTrack?: Track;
    };
  };
}

export const AddTrack = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state }: LocationState = location;
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [errors, setErrors] = useState({
    title: false,
    artist: false,
  });
  const [formInvalid, setFormInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [artistCompletions, setArtistCompletions] = useState<Track[]>([]);

  const handleArtistInputClear = () => {
    setArtist('');
  };

  const artistSearchHandler = useCallback(async () => {
    const { data } = await search(artist, { field: 'artist' });
    const uniqueArtistCompletions = Object.values(
      data.reduce<Track[]>(
        (acc, completion) => ({
          ...acc,
          [completion.artist]: completion,
        }),
        []
      )
    );
    setArtistCompletions(uniqueArtistCompletions);
  }, [artist]);

  const handleArtistCompletionClick = (completion: Track) => {
    setArtist(completion.artist);
    setArtistCompletions([]);
  };

  const handleSubmit = async () => {
    if (!title) {
      setErrors((prev) => ({ ...prev, title: true }));
      setFormInvalid(true);
    }

    if (!artist) {
      setErrors((prev) => ({ ...prev, artist: true }));
      setFormInvalid(true);
    }
    setIsLoading(true);
    const addedTrack = await addTrack({ title, artist });
    setIsLoading(false);
    toast('New track added!', { type: 'success' });

    if (state?.context?.originTrack) {
      navigate(ROUTES.AddMatchingTrack, {
        state: {
          originTrack: state?.context?.originTrack,
          matchingTrack: addedTrack,
        },
      });
    } else if (state?.context?.matchingTrack) {
      navigate(ROUTES.AddMatchingTrack, {
        state: {
          originTrack: addedTrack,
          matchingTrack: state?.context?.matchingTrack,
        },
      });
    } else {
      navigate(ROUTES.TrackDetails.replace(':id', addedTrack.id.toString()), {
        state: { track: addedTrack },
      });
    }
  };

  useEffect(() => {
    if (artist.length === 0) {
      setArtistCompletions([]);
      return;
    }

    const delayInputTimeoutId = setTimeout(() => {
      artistSearchHandler();
    }, 300);
    return () => clearTimeout(delayInputTimeoutId);
  }, [artistSearchHandler, artist]);

  useEffect(() => {
    if (!formInvalid) return;

    if (title.length > 0) {
      setErrors((prev) => ({ ...prev, title: false }));
    } else {
      setErrors((prev) => ({ ...prev, title: true }));
    }
  }, [formInvalid, title]);

  useEffect(() => {
    if (!formInvalid) return;

    if (artist.length > 0) {
      setErrors((prev) => ({ ...prev, artist: false }));
    } else {
      setErrors((prev) => ({ ...prev, artist: true }));
    }
  }, [formInvalid, artist]);

  return (
    <FormContainer>
      <Typography variant='h3'>Add Track</Typography>
      <CompletionsTextField
        id='artist'
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        name='arist'
        fullWidth
        label='Artist'
        onClear={handleArtistInputClear}
        error={errors.artist}
        helperText='Artist is required'
        completions={artistCompletions}
        completionsListElementRenderer={(completion) =>
          completion.artist !== artist && (
            <ListItemButton
              key={completion.id}
              onClick={() => handleArtistCompletionClick(completion)}
            >
              <ListItemText primary={completion.artist} />
            </ListItemButton>
          )
        }
      />
      <TextField
        id='title'
        fullWidth
        error={errors.title}
        helperText={errors.title && 'Title is required'}
        value={title}
        label='Title'
        onChange={(e) => setTitle(e.target.value)}
        name='title'
      />
      <LoadingButton
        variant='contained'
        color='primary'
        onClick={handleSubmit}
        loading={isLoading}
        size='large'
      >
        Submit
      </LoadingButton>
    </FormContainer>
  );
};
