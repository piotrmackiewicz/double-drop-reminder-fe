import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useModeContext } from 'context/modeContext';
import { useState } from 'react';
import { ActionButtons } from './SwitchModeButton.styled';

export const SwitchModeButton = () => {
  const { mode, switchMode } = useModeContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const buttonText =
    mode === 'preparation'
      ? 'Switch to Performance Mode'
      : 'Switch to Preparation Mode';

  const handleSwitchMode = () => {
    if (mode === 'preparation') {
      switchMode();
    } else {
      setShowConfirmDialog(true);
    }
  };

  return (
    <>
      <Button
        variant='outlined'
        onClick={handleSwitchMode}
        color={mode === 'performance' ? 'error' : 'primary'}
      >
        {buttonText}
      </Button>
      <Dialog
        onClose={() => setShowConfirmDialog(false)}
        open={showConfirmDialog}
      >
        <DialogTitle>
          Are you sure you want to switch to Preparation Mode?
        </DialogTitle>
        <DialogActions>
          <ActionButtons>
            <Button
              color='error'
              onClick={() => {
                switchMode();
                setShowConfirmDialog(false);
              }}
              size='large'
            >
              Yes
            </Button>
            <Button
              color='primary'
              onClick={() => setShowConfirmDialog(false)}
              size='large'
            >
              No
            </Button>
          </ActionButtons>
        </DialogActions>
      </Dialog>
    </>
  );
};
