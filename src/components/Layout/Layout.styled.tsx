import { Button, Container as MuiContainer } from '@mui/material';
import { styled } from 'styled-components';

export const Container = styled(MuiContainer)`
  align-items: start;
  padding-top: 10px;
  width: 100%;
`;

export const BackButtonLink = styled(Button)`
  display: block;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px !important;
  gap: 61px;
`;
