import { useState, useRef } from "react";
import { usePdf } from "@mikecousins/react-pdf";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import { createWorker } from "tesseract.js";

export const MyPdfViewer = ({ file }: { file: string }) => {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument } = usePdf({
    file,
    page,
    canvasRef,
  });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [ocr, setOCr] = useState("");
  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const saveImage = () => {
    setMessage("Saving image!");
    setOpen(true);

    const canvas = canvasRef.current; // document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas != null) {
      const canvasImage = (canvas as any).toDataURL("image/png");

      if (canvasImage != null) {
        // this can be used to download any image from webpage to local disk
        let xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function () {
          let a = document.createElement("a");
          a.href = window.URL.createObjectURL(xhr.response);
          a.download = "generatedImage.png";
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          a.remove();
        };
        xhr.open("GET", canvasImage); // This is to download the canvas Image
        xhr.send();
        setMessage("Saved image!");
        setOpen(true);
      }
    }
  };

  const recognizeText = async () => {
    setMessage("Starting to recognize text on image!");
    setOpen(true);

    const canvas = canvasRef.current;
    if (canvas != null) {
      const canvasImage = (canvas as any).toDataURL("image/png");

      if (canvasImage != null) {
        const worker = await createWorker("eng", 1, {
          logger: (m: any) => {
            setMessage(
              "Recognition progress: " + parseInt(m.progress * 100 + "", 10)
            );
            setOpen(true);
          },
        });

        const {
          data: { text },
        } = await worker.recognize(canvasImage);

        setMessage("Done recognizing text on image!");
        setOpen(true);
        setOCr(text);
        await worker.terminate();
      }
    }
  };

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
      {ocr}
    </Container>
  ) : null;
};
