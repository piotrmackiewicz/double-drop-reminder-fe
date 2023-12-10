import { ThumbsContainer } from './RatingThumb.styled';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { Typography } from '@mui/material';

interface Props {
  thumbs_up: number;
  thumbs_down: number;
  percentage: number;
}

export const RatingThumb = ({ thumbs_up, thumbs_down, percentage }: Props) => {
  const rating = thumbs_up - thumbs_down;
  const totalThumbs = thumbs_up + thumbs_down;

  if (totalThumbs === 0) {
    return null;
  }

  return (
    <ThumbsContainer>
      {rating > 0 ? (
        <ThumbUpOutlinedIcon color='success' />
      ) : (
        <ThumbDownOutlinedIcon color='error' />
      )}

      <Typography variant='caption'>{`${percentage}% (${totalThumbs})`}</Typography>
    </ThumbsContainer>
  );
};
