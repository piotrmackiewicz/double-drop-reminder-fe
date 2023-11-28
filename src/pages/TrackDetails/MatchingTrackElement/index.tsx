import { Divider, IconButton, ListItem, Typography } from '@mui/material';
import { MatchingTrack } from 'types';
import { ROUTES } from 'router';
import { useModeContext } from 'context/modeContext';
import {
  MatchingTrackLink,
  PreparationModeListItem,
  PreparationModeListItemText,
  ThumbsContainer,
  ThumbsOuterContainer,
} from './MatchingTrackElement.styled';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';

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
  const { id, title, artist, thumbs_up, thumbs_down } = track;
  const { isPreparationMode } = useModeContext();

  const rating = thumbs_up - thumbs_down;
  const percentage = Math.round((thumbs_up / (thumbs_up + thumbs_down)) * 100);
  const totalThumbs = thumbs_up + thumbs_down;

  console.log(title, isRated, totalThumbs);

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
            <Typography variant='body1'>{title}</Typography>
            <Typography variant='body2'>{artist}</Typography>
          </div>
          {/* TODO: rating is not rendered after successful rate */}
          <ThumbsOuterContainer>
            {totalThumbs > 0 && (
              <ThumbsContainer>
                {rating > 0 ? (
                  <ThumbUpOutlinedIcon color='success' />
                ) : (
                  <ThumbDownOutlinedIcon color='error' />
                )}

                <Typography variant='caption'>{`${percentage}% (${totalThumbs})`}</Typography>
              </ThumbsContainer>
            )}
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
          <PreparationModeListItemText primary={title} secondary={artist} />
          {totalThumbs > 0 && (
            <>
              <ThumbsContainer>
                {rating > 0 ? (
                  <ThumbUpOutlinedIcon color='success' />
                ) : (
                  <ThumbDownOutlinedIcon color='error' />
                )}

                <Typography variant='caption'>{`${percentage}% (${totalThumbs})`}</Typography>
              </ThumbsContainer>
            </>
          )}
        </MatchingTrackLink>
      </PreparationModeListItem>
      {!isLast && <Divider />}
    </>
  );
};
