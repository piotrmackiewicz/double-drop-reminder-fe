import { List } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

interface CompletionsListProps {
  noScroll?: boolean;
}

export const CompletionsList = styled(List)<CompletionsListProps>`
  background-color: white;
  max-height: 200px;
  position: absolute !important;
  width: 100%;
  z-index: 2;
  overflow-y: ${({ noScroll }) => (noScroll ? 'auto' : 'scroll')};
  -webkit-box-shadow: 0px 9px 31px -19px rgba(66, 68, 90, 1);
  -moz-box-shadow: 0px 9px 31px -19px rgba(66, 68, 90, 1);
  box-shadow: 0px 9px 31px -19px rgba(66, 68, 90, 1);
`;

export const CompletionsListLink = styled(Link)`
  width: 100%;
`;
