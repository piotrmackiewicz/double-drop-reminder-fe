import { ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const MatchingTrackLink = styled(Link)`
  width: 100%;
`;

export const PreparationModeListItem = styled(ListItem)`
  padding: 0 !important;
`;

export const PreparationModeListItemText = styled(ListItemText)`
  & > span {
    font-size: 1.5rem;
  }

  & > p {
    font-size: 1rem;
  }
`;
