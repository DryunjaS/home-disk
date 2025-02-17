import { Button, Box, Modal, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalDeleteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  deleteItem: () => void;
  deleteData?: string[];
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
  open,
  setOpen,
  deleteItem,
  deleteData = [],
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteItem();
    handleClose();
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
          p: 4,
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

        <Typography variant="h6">Вы действительно хотите удалить?</Typography>

        <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
          {deleteData.length > 10 ? (
            <Typography>Удалить все {deleteData.length} элементов?</Typography>
          ) : (
            deleteData.map((item, index) => (
              <Typography key={index}>{item}</Typography>
            ))
          )}
        </Box>

        <Button variant="contained" color="error" onClick={handleDelete}>
          Удалить
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalDelete;
