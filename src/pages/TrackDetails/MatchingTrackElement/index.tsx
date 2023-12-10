import { Divider, IconButton, ListItem, Typography } from '@mui/material';
import { MatchingTrack } from 'types';
import { ROUTES } from 'router';
import { useModeContext } from 'context/modeContext';
import {
  MatchingTrackLink,
  PreparationModeListItem,
  PreparationModeListItemText,
  ThumbsOuterContainer,
} from './MatchingTrackElement.styled';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import { RatingThumb } from 'components/RatingThumb';

interface Props {
  track: MatchingTrack;
  isRated?: boolean;
  isLast?: boolean;
  onRateClick: () => void;
}

export const MatchingTrackElement = ({
  track,
  isRated,
  isLast,
  onRateClick,
}: Props) => {
  const { id, name, artists, thumbs_up, thumbs_down } = track;
  const { isPreparationMode } = useModeContext();
  const percentage = Math.round((thumbs_up / (thumbs_up + thumbs_down)) * 100);

  const handleRateClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onRateClick();
  };

  if (isPreparationMode) {
    return (
      <ListItem>
        <MatchingTrackLink
          to={ROUTES.TrackDetails.replace(':id', id.toString())}
          state={{ track }}
        >
          <div>
            <Typography variant='body1'>{name}</Typography>
            <Typography variant='body2'>{artists.join(', ')}</Typography>
          </div>
          <ThumbsOuterContainer>
            <RatingThumb
              thumbs_up={thumbs_up}
              thumbs_down={thumbs_down}
              percentage={percentage}
            />
            {!isRated ? (
              <IconButton onClick={handleRateClick}>
                <ThumbsUpDownIcon color='primary' />
              </IconButton>
            ) : null}
          </ThumbsOuterContainer>
        </MatchingTrackLink>
      </ListItem>
    );
  }

  return (
    <>
      <PreparationModeListItem>
        <MatchingTrackLink
          to={ROUTES.TrackDetails.replace(':id', id.toString())}
          state={{ track }}
        >
          <PreparationModeListItemText
            primary={name}
            secondary={artists.join(', ')}
          />
          <RatingThumb
            thumbs_up={thumbs_up}
            thumbs_down={thumbs_down}
            percentage={percentage}
          />
        </MatchingTrackLink>
      </PreparationModeListItem>
      {!isLast && <Divider />}
    </>
  );
};
