import {
  Box,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { getMatchesByIds, getTracks, getUserRating } from 'api';
import { useEffect, useState } from 'react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { useAuthContext } from 'context/authContext';
import { DetailedMatch } from 'types';
import { LoaderContainer } from './MyAccount.styled';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const MyAccount = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbUpMatches, setDetailedThumbUpMatches] = useState<DetailedMatch[]>(
    []
  );
  const [thumbDownMatches, setDetailedThumbDownMatches] = useState<
    DetailedMatch[]
  >([]);
  const { spotifyAccessToken } = useAuthContext();

  const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const fetchUserMatches = async () => {
      setIsLoading(true);
      const result = await getUserRating();
      const thumbUpMatchesIds = result
        .filter((match) => match.rating === true)
        .map((u) => u.match_id);
      const thumbDownMatchesIds = result
        .filter((match) => match.rating === false)
        .map((u) => u.match_id);
      const thumbUpMatches = await getMatchesByIds(thumbUpMatchesIds);
      const thumbDownMatches = await getMatchesByIds(thumbDownMatchesIds);
      const allTracksIds = [
        ...thumbUpMatches.map((m) => [m.track_1, m.track_2]),
        ...thumbDownMatches.map((m) => [m.track_1, m.track_2]),
      ]
        .flat()
        .filter((val, idx, arr) => arr.indexOf(val) === idx);

      const allTracks = await getTracks(allTracksIds, spotifyAccessToken);
      const detailedThumbUpMatches = thumbUpMatches.map((m) => ({
        ...m,
        track_1: allTracks.find((t) => t.id === m.track_1)!,
        track_2: allTracks.find((t) => t.id === m.track_2)!,
      }));
      const detailedThumbDownMatches = thumbDownMatches.map((m) => ({
        ...m,
        track_1: allTracks.find((t) => t.id === m.track_1)!,
        track_2: allTracks.find((t) => t.id === m.track_2)!,
      }));
      setDetailedThumbUpMatches(detailedThumbUpMatches);
      setDetailedThumbDownMatches(detailedThumbDownMatches);
      setIsLoading(false);
    };

    fetchUserMatches();
  }, [spotifyAccessToken]);

  return (
    <Stack gap='16px'>
      <Typography variant='h4'>My Double Drops</Typography>
      {isLoading ? (
        <LoaderContainer>
          <CircularProgress />
        </LoaderContainer>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label='basic tabs example'
              variant='fullWidth'
            >
              <Tab label={<ThumbUpOutlinedIcon />} />
              <Tab label={<ThumbDownOutlinedIcon />} />
            </Tabs>
          </Box>
          <CustomTabPanel value={selectedTab} index={0}>
            {JSON.stringify(thumbUpMatches)}
          </CustomTabPanel>
          <CustomTabPanel value={selectedTab} index={1}>
            {JSON.stringify(thumbDownMatches)}
          </CustomTabPanel>
        </>
      )}
    </Stack>
  );
};
