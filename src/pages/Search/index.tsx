import { ListItemButton, ListItemText, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { search } from 'api';
import { CompletionsListLink, TrackNotFoundItem } from './Search.styled';
import { ROUTES } from 'router';
import { CompletionsTextField } from 'components/CompletionsTextField';
import { Track } from 'types';
import { Logo } from 'components/Logo';
import { SwitchModeButton } from 'components/SwitchModeButton';
import { useModeContext } from 'context/modeContext';

export const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [completions, setCompletions] = useState<Track[]>([]);
  const [apiCallSuccess, setApiCallSuccess] = useState(false);
  const { isPreparationMode } = useModeContext();

  const handleClear = () => {
    setApiCallSuccess(false);
    setSearchValue('');
  };

  const searchHandler = useCallback(async () => {
    setApiCallSuccess(false);
    const result = await search(searchValue);
    setApiCallSuccess(true);
    setCompletions(result.data);
  }, [searchValue]);

  useEffect(() => {
    if (searchValue.length === 0) {
      setCompletions([]);
      setApiCallSuccess(false);
      return;
    }

    const delayInputTimeoutId = setTimeout(() => {
      searchHandler();
    }, 300);
    return () => clearTimeout(delayInputTimeoutId);
  }, [searchHandler, searchValue]);

  return (
    <Stack spacing={3}>
      <SwitchModeButton />
      {isPreparationMode && <Logo />}
      <CompletionsTextField
        id='search'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        name='search'
        fullWidth
        autoFocus
        placeholder='Search for an artist or track...'
        onClear={handleClear}
        completions={completions}
        completionsListElementRenderer={(completion) => (
          <CompletionsListLink
            to={ROUTES.TrackDetails.replace(':id', completion.id.toString())}
            state={{ track: completion }}
          >
            <ListItemButton>
              <ListItemText
                primary={completion.title}
                secondary={completion.artist}
              />
            </ListItemButton>
          </CompletionsListLink>
        )}
        showNoCompletionsHint={apiCallSuccess}
        noCompletionsHintRenderer={() =>
          isPreparationMode ? (
            <CompletionsListLink to={ROUTES.AddTrack}>
              <ListItemButton>
                <ListItemText primary='No track found? Click here to add new one!' />
              </ListItemButton>
            </CompletionsListLink>
          ) : completions.length === 0 ? (
            <TrackNotFoundItem primary='Track not found :(' />
          ) : null
        }
      />
    </Stack>
  );
};
