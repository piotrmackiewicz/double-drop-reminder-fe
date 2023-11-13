import { Box } from '@mui/material';
import { styled } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const SelectedTrackBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 4px 9px 11px;
  border: 2px solid rgb(25, 118, 210);
  border-radius: 4px;
`;
