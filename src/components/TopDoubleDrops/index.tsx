import { CircularProgress, Stack, Typography } from '@mui/material';
import { getTopMatches, getTracks } from 'api';
import { useEffect, useState } from 'react';
import { LoaderContainer } from './TopDoubleDrops.styled';
import { useAuthContext } from 'context/authContext';
import { DetailedMatchWithRating } from 'types';
import { TopDoubleDropElement } from './TopDoubleDropsElement';

export const TopDoubleDrops = () => {
  const { spotifyAccessToken } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [topMatches, setTopMatches] = useState<DetailedMatchWithRating[]>([]);

  useEffect(() => {
    const fetchTopMatches = async () => {
      const topMatches = await getTopMatches();
      console.log(topMatches);

      const allTracksIds = [...topMatches.map((m) => [m.track_1, m.track_2])]
        .flat()
        .filter((val, idx, arr) => arr.indexOf(val) === idx);

      const tracks = await getTracks(allTracksIds, spotifyAccessToken);
      console.log(tracks);

      const topMatchesWithRating: DetailedMatchWithRating[] = topMatches.map(
        (m) => ({
          id: m.id,
          track_1: tracks.find((t) => t.id === m.track_1)!,
          track_2: tracks.find((t) => t.id === m.track_2)!,
          thumbs_up: m.thumbs_up,
          thumbs_down: m.thumbs_down,
          percentage: m.percentage,
        })
      );
      setTopMatches(topMatchesWithRating);
      setLoading(false);
    };
    if (spotifyAccessToken) {
      fetchTopMatches();
    }
  }, [spotifyAccessToken]);

  return (
    <Stack spacing={3}>
      <Typography variant='h4'>Top Double Drops</Typography>
      {loading ? (
        <LoaderContainer>
          {' '}
          <CircularProgress />
        </LoaderContainer>
      ) : (
        <Stack>
          {topMatches.map((m, idx) => (
            <TopDoubleDropElement idx={idx} element={m} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
