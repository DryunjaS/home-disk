import { useState } from "react";
import { Button, TextField, Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ModalRename = ({ open, setOpen, update, getCatalogs }) => {
  const [newName, setNewName] = useState("");

  const handleClose = () => {
    setOpen(false);
    setNewName("");
  };

  const handleRename = () => {
    if (newName.trim()) {
      update(newName);
      handleClose();
      getCatalogs("");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 350,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "gray",
          }}
        >
          <CloseIcon />
        </IconButton>

        <h2>Новое название</h2>
        <TextField
          label="Название"
          variant="outlined"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button variant="contained" onClick={handleRename}>
          Изменить
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalRename;
