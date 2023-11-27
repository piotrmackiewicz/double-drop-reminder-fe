import { styled } from 'styled-components';
import { DialogActions as MaterialDialogActions } from '@mui/material';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const LoaderContainer = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;

export const DialogActions = styled(MaterialDialogActions)`
  display: flex;
  justify-content: space-between !important;
  padding: 8px 0 !important;
`;

export const RateButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
`;
