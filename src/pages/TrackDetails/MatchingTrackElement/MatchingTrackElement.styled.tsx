import { ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const MatchingTrackLink = styled(Link)`
  width: 100%;
  margin: 6px 0;
  display: flex;
  justify-content: space-between;
`;

export const ThumbsOuterContainer = styled.div`
  display: flex;
`;

export const ThumbsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > span {
    text-align: center;
    width: 100px;
  }
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
