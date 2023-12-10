import { DetailedMatchWithRating } from 'types';
import {
  Container,
  LeftInfoContainer,
  TracksContainer,
} from './TopDoubleDropsElement.styled';
import { RatingThumb } from 'components/RatingThumb';
import { Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { ROUTES } from 'router';

interface Props {
  idx: number;
  element: DetailedMatchWithRating;
}

export const TopDoubleDropElement = ({ idx, element }: Props) => {
  return (
    <Container>
      <LeftInfoContainer>
        <Typography variant='h3'>{idx + 1}</Typography>
        <TracksContainer>
          <Link to={ROUTES.TrackDetails.replace(':id', element.track_1.id)}>
            <Typography variant='body1'>{element.track_1.name}</Typography>
            <Typography variant='caption'>
              {element.track_1.artists.join(', ')}
            </Typography>
          </Link>
          <Divider />
          <Link to={ROUTES.TrackDetails.replace(':id', element.track_2.id)}>
            <Typography variant='body1'>{element.track_2.name}</Typography>
            <Typography variant='caption'>
              {element.track_2.artists.join(', ')}
            </Typography>
          </Link>
        </TracksContainer>
      </LeftInfoContainer>
      <RatingThumb
        thumbs_up={element.thumbs_up}
        thumbs_down={element.thumbs_down}
        percentage={element.percentage}
      />
    </Container>
  );
};
