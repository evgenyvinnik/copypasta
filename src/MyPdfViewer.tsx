import { useState, useRef } from "react";
import { usePdf } from "@mikecousins/react-pdf";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";

export const MyPdfViewer = ({ file }: { file: string }) => {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument } = usePdf({
    file,
    page,
    canvasRef,
  });

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const saveImage = () => {};

  const recognizeText = () => {};

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return pdfDocument ? (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Button
          disabled={page === pdfDocument?.numPages}
          className="next-button"
          variant="contained"
          onClick={nextPage}
        >
          Next Page
        </Button>
        <Button
          sx={{ mx: 1 }}
          disabled={page === 1}
          className="generate-button"
          variant="contained"
          onClick={prevPage}
        >
          Previous Page
        </Button>
        <Button
          sx={{ mx: 1 }}
          className="save-button"
          variant="contained"
          onClick={saveImage}
        >
          Save image
        </Button>
        <Button
          sx={{ mx: 1 }}
          className="recognize-button"
          variant="contained"
          onClick={recognizeText}
        >
          Recognize Text
        </Button>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
      />
      <canvas ref={canvasRef} />
    </Container>
  ) : null;
};
