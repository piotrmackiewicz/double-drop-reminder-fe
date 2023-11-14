import { ListItem, ListItemText } from '@mui/material';
import { Track } from 'types';
import { ROUTES } from 'router';
import { useModeContext } from 'context/modeContext';
import {
  MatchingTrackLink,
  PreparationModeListItem,
  PreparationModeListItemText,
} from './MatchingTrackElement.styled';

interface Props {
  track: Track;
}

export const MatchingTrackElement = ({ track }: Props) => {
  const { id, title, artist } = track;
  const { isPreparationMode } = useModeContext();

  if (isPreparationMode) {
    return (
      <ListItem>
        <MatchingTrackLink
          to={ROUTES.TrackDetails.replace(':id', id.toString())}
          state={{ track }}
        >
          <ListItemText primary={title} secondary={artist} />
        </MatchingTrackLink>
      </ListItem>
    );
  }

  return (
    <PreparationModeListItem>
      <MatchingTrackLink
        to={ROUTES.TrackDetails.replace(':id', id.toString())}
        state={{ track }}
      >
        <PreparationModeListItemText primary={title} secondary={artist} />
      </MatchingTrackLink>
    </PreparationModeListItem>
  );
};
