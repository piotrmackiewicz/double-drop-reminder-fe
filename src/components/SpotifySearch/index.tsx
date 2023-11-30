import { ListItemButton, ListItemText } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { SpotifySearchTrack } from 'types';
import { searchSpotify } from 'api';
import { CompletionsTextField } from 'components/CompletionsTextField';
import { useAuthContext } from 'context/authContext';

interface Props {
  onCompletionClick: (completion: SpotifySearchTrack) => void;
  disabledCompletionsIds?: string[];
}

export const SpotifySearch = ({
  onCompletionClick,
  disabledCompletionsIds = [],
}: Props) => {
  const { spotifyAccessToken } = useAuthContext();
  const [searchValue, setSearchValue] = useState('');
  const [completions, setCompletions] = useState<SpotifySearchTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifySearchTrack | null>(
    null
  );

  const handleClear = () => {
    setSearchValue('');
    setSelectedTrack(null);
    setCompletions([]);
  };

  const searchHandler = useCallback(async () => {
    if (!searchValue || !spotifyAccessToken || !!selectedTrack) return;
    setIsLoading(true);
    try {
      const result = await searchSpotify(searchValue, spotifyAccessToken);
      setCompletions(result);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedTrack, searchValue, spotifyAccessToken]);

  const handleCompletionClick = (completion: SpotifySearchTrack) => {
    setSelectedTrack(completion);
    setSearchValue(`${completion.artists.join(', ')} - ${completion.name}`);
    setCompletions([]);
    onCompletionClick(completion);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!!selectedTrack) {
      setSelectedTrack(null);
    }
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      searchHandler();
    }, 1000);
    return () => clearTimeout(delayInputTimeoutId);
  }, [searchHandler, searchValue]);

  return (
    <CompletionsTextField
      id='search'
      value={searchValue}
      loading={isLoading}
      onChange={handleInputChange}
      name='search'
      fullWidth
      autoFocus
      placeholder='Search for an artist or track...'
      onClear={handleClear}
      completions={completions}
      completionsListElementRenderer={(completion) => (
        <ListItemButton
          key={completion.id}
          disabled={disabledCompletionsIds.includes(completion.id)}
          onClick={() => handleCompletionClick(completion)}
        >
          <ListItemText
            primary={completion.name}
            secondary={completion.artists.join(', ')}
          />
        </ListItemButton>
      )}
    />
  );
};
