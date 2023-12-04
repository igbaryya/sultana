/* eslint-disable */
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { t } from 'i18next';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, confirmLabel }: any) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{confirmLabel}</DialogTitle>
      <DialogContent>
        {t('youthDetails.confirmationModal')}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
		{t('youthDetails.cancelConfirmationModal')}
        </Button>
        <Button onClick={onConfirm} color="secondary">
		{t('youthDetails.submitConfirmationModal')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
