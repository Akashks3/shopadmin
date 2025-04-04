import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const CustomModal = (props) => {
  const { open, hideModal, performAction, title } = props;

  return (
    <Dialog open={open} onClose={hideModal}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <p>{title}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideModal} color="primary">
          Cancel
        </Button>
        <Button onClick={performAction} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
