import React from "react";
import logo from "./logo.svg";
import "./styles/App.css";
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { AppBar, Toolbar } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AcceptMaxFiles } from "./AcceptMaxFiles";

import { createWorker } from "tesseract.js";
// import Pdf from "@mikecousins/react-pdf";
import { MyPdfViewer } from "./MyPdfViewer";

function App() {
  const [value, setValue] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const handleChange = (newValue: File | null) => {
    setValue(newValue);
  };

  const [ocr, setOcr] = React.useState<any[]>([]);
  const [imageData, setImageData] = React.useState<any>(null);
  const [progress, setProgress] = React.useState(0);
  const [csv, setCsv] = React.useState<string>("");

  const convertImageToText = async () => {
    if (!imageData) return;

    const worker = await createWorker("eng", 1, {
      logger: (m: any) => {
        // console.log(m);
        setProgress(parseInt(m.progress * 100 + "", 10));
      },
    });

    // // await (await worker).load();
    // await worker.loadLanguage("en");
    // await worker.initialize("en");

    const {
      data: { text },
    } = await worker.recognize(imageData);

    const lines: any[] = text.split("\n");

    setOcr(lines);

    await worker.terminate();
  };

  React.useEffect(() => {
    setOcr([]);
    convertImageToText();
  }, [imageData]);

  React.useEffect(() => {
    if (!ocr) return;
    let csvString = "";

    ocr.forEach((row: any) => {
      const columns = row.split(" ");
      const priceColumns = columns
        .slice(-2)
        .map((column: any) => column.replace(",", "."));
      const csvRow = [...columns.slice(0, -2), ...priceColumns].join(";");
      csvString += csvRow + "\n";
    });

    setCsv(csvString);
  }, [ocr]);

  function handleImageChange(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setImageData(imageDataUri);
    };
    reader.readAsDataURL(file);
  }

  const downloadCsv = () => {
    const timestamp = new Date().toISOString().replace(/:/g, "-"); // Genera un timestamp con formato "yyyy-MM-ddTHH-mm-ss.sssZ"
    const nombreArchivo = `datos_${timestamp}.csv`; // Nombre del archivo con el timestamp
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    a.textContent = "Descargar CSV";

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>text to pdf to image to text</Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: 4 }}>
          <TextField
            id="outlined-multiline-static"
            label="Enter any text"
            multiline
            fullWidth
            rows={10}
            placeholder="Enter any text"
          />
          <AcceptMaxFiles />{" "}
        </Box>

        <Box sx={{ my: 4 }}>
          <div>
            <h1>Reconocimiento de texto en imagen</h1>
            <input
              type="file"
              name=""
              id=""
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          {progress < 100 && progress > 0 && (
            <div>
              <div className="progress-label">Progress ({progress}%)</div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          <div className="display-flex">
            <div>
              <img src={imageData} alt="" />
              <div className="display-flex">
                <button type="button" onClick={downloadCsv} disabled={!csv}>
                  Descargar CSV
                </button>
              </div>
            </div>
            <div>
              {ocr.map((line: string, index: number) => {
                return <p key={index}>{line}</p>;
              })}
            </div>
          </div>
        </Box>
        <MyPdfViewer />

        {/* 
        <Pdf file="./test.pdf" page={page}>
          {({ pdfDocument, pdfPage, canvas }) => (
            <>
              {!pdfDocument && <span>Loading...</span>}
              {canvas}
              {Boolean(pdfDocument && pdfDocument.numPages) && (
                <nav>
                  <ul className="pager">
                    <li className="previous">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    <li className="next">
                      <button
                        disabled={page === pdfDocument.numPages}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </Pdf> */}
      </Container>
    </div>
  );
}

export default App;
