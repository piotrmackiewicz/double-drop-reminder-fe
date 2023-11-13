import { IconButton, ListItem, ListItemText } from '@mui/material';
import { Track } from 'types';
import DeleteIcon from '@mui/icons-material/Delete';
import { ROUTES } from 'router';
import { useModeContext } from 'context/modeContext';
import {
  MatchingTrackLink,
  PreparationModeListItem,
  PreparationModeListItemText,
} from './MatchingTrackElement.styled';

interface Props {
  track: Track;
  onDeleteMatchingTrack: (track: Track) => void;
}

export const MatchingTrackElement = ({
  track,
  onDeleteMatchingTrack,
}: Props) => {
  const { id, title, artist } = track;
  const { isPreparationMode } = useModeContext();

  if (isPreparationMode) {
    return (
      <ListItem
        secondaryAction={
          <IconButton edge='end' onClick={() => onDeleteMatchingTrack(track)}>
            <DeleteIcon />
          </IconButton>
        }
      >
        <MatchingTrackLink
          to={ROUTES.TrackDetails.replace(':id', id.toString())}
          state={{ track }}
          replace
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
        replace
      >
        <PreparationModeListItemText primary={title} secondary={artist} />
      </MatchingTrackLink>
    </PreparationModeListItem>
  );
};
