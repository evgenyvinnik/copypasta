import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import { createWorker } from "tesseract.js";
import { CodeBlock } from "./CodeBlock";

interface ImagePreviewProps {
  file: string;
}

export const ImagePreview = ({ file }: ImagePreviewProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [ocr, setOCr] = useState("");

  const recognizeText = async () => {
    setMessage("Starting to recognize text on image!");
    setOpen(true);

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
    } = await worker.recognize(file);

    setMessage("Done recognizing text on image!");
    setOpen(true);
    setOCr(text);
    await worker.terminate();
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

  return (
    <>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Button
            sx={{ ml: 1 }}
            className="recognize-button"
            variant="contained"
            onClick={recognizeText}
          >
            Recognize text on the page
          </Button>
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={message}
        />
        <img
          src={file}
          style={{ height: "500px", objectFit: "scale-down" }}
          loading="lazy"
          alt="uploaded file"
        />
      </Container>
      {ocr === "" ? null : <CodeBlock code={ocr} />}
    </>
  );
};
