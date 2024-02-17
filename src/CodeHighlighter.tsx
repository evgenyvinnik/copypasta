import { useEffect, useState, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import javascript from "highlight.js/lib/languages/javascript";
import Button from "@mui/material/Button";
import jsPDF from "jspdf";
import { MyPdfViewer } from "./MyPdfViewer";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";

interface CodeHighlighterProps {
  code: string;
  language: string;
}

export const CodeHighlighter = ({ code, language }: CodeHighlighterProps) => {
  const codeRef = useRef<HTMLElement | null>(null);
  const printRef = useRef(null);

  const [file, setFile] = useState<string | null>(null);

  useEffect(() => {
    hljs.registerLanguage("javascript", javascript);
  }, []);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

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

  const copyToClipboard = () => {
    if (codeRef.current) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(code)
          .then(function () {
            setMessage("Copied to Clipboard!");
            setOpen(true);
          })
          .catch(function () {
            setMessage("Failed to copy to Clipboard!");
            setOpen(true);
          });
      }
    }
  };

  const makePdf = (save: boolean) => {
    const doc = new jsPDF({
      orientation: "landscape",
      format: "a4",
      unit: "pt",
    });

    if (printRef.current != null) {
      doc.html(printRef.current, {
        margin: 0,
        jsPDF: doc,
        x: 0,
        y: 0,
        async callback(doc) {
          if (save) {
            const filename = "generatedPdf.pdf";
            await doc.save(filename, { returnPromise: true });
          }

          setFile(doc.output("datauristring"));
          setMessage("Made PDF!");
          setOpen(true);
        },
      });
    }
  };

  const generatePdf = () => {
    makePdf(false);
  };

  const savePdf = () => {
    makePdf(true);
  };

  return code !== "" ? (
    <>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ height: "400px", overflow: "scroll" }}>
            <pre style={{}} ref={printRef}>
              <code ref={codeRef} className={`language-${language}`}>
                {code}
              </code>
            </pre>
          </Box>
          <Button
            className="copy-button"
            variant="contained"
            onClick={copyToClipboard}
          >
            Copy to Clipboard
          </Button>
          <Button
            sx={{ mx: 1 }}
            className="generate-button"
            variant="contained"
            onClick={generatePdf}
          >
            Generate PDF
          </Button>
          <Button className="save-button" variant="contained" onClick={savePdf}>
            save PDF
          </Button>
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={message}
        />
      </Container>
      {file != null ? <MyPdfViewer file={file} /> : null}
    </>
  ) : null;
};
