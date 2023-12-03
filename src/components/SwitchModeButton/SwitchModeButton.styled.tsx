import { Button } from '@mui/material';
import { styled } from 'styled-components';

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const ModeButton = styled(Button)`
  flex-grow: 1;
`;

export const ActionButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
