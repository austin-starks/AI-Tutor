import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { atom } from "jotai";
import * as React from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  width: "40%",
  minWidth: "400px",
  maxWidth: "700px",
  height: "70%",
};

export enum ModalType {
  Authentication = "Authentication",
  Payment = "Payment",
  Referral = "Referral",
}

export const modalAtom = atom<ModalType | "">("");

interface ModalProps {
  open: boolean;
  handleClose: (
    event: React.MouseEvent<HTMLButtonElement>,
    reason: string
  ) => void;
  children: React.ReactNode;
}

export default function BasicModal(props: ModalProps) {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{props.children}</Box>
    </Modal>
  );
}
