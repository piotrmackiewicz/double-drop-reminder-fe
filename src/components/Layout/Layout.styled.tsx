import { Button, Container as MuiContainer } from '@mui/material';
import { styled } from 'styled-components';

export const Container = styled(MuiContainer)`
  padding-top: 50px;
  align-items: start;
  width: 100%;
`;

export const BackButtonLink = styled(Button)`
  display: block;
  margin-bottom: 20px !important;
`;
