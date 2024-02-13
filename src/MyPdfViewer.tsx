import React, { useState, useRef } from "react";
import { usePdf } from "@mikecousins/react-pdf";

import { createWorker } from "tesseract.js";
import jsPDF from "jspdf";
import hljs from "highlight.js";
import "highlight.js/styles/default.css"; // Import the default Highlight.js style

import SyntaxHighlighter from "./SyntaxHighlighter";

export const MyPdfViewer = () => {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const codeString = "(num) => num + 1";

  const { pdfDocument, pdfPage } = usePdf({
    file: "resume.pdf",
    page,
    canvasRef,
  });

  function downloadCanvasAsImage() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let canvasImage = canvas.toDataURL("image/png");

    setImageData(canvasImage);

    // this can be used to download any image from webpage to local disk
    // let xhr = new XMLHttpRequest();
    // xhr.responseType = "blob";
    // xhr.onload = function () {
    //   let a = document.createElement("a");
    //   a.href = window.URL.createObjectURL(xhr.response);
    //   a.download = "image_name.png";
    //   a.style.display = "none";
    //   document.body.appendChild(a);
    //   a.click();
    //   a.remove();
    // };
    // xhr.open("GET", canvasImage); // This is to download the canvas Image
    // xhr.send();
  }

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
    hljs.highlightAll();
  });

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

  const reportTemplateRef = useRef(null);

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a2",
      unit: "px",
    });

    // Adding the fonts
    doc.setFont("Inter-Regular", "normal");
    const leftMargin = 50;
    const rightMargin = 50;
    const topMargin = 50;
    const bottomMargin = 50;
    // doc.setMargins(leftMargin, topMargin, rightMargin, bottomMargin);

    if (reportTemplateRef.current != null) {
      doc.html(reportTemplateRef.current, {
        margin: 50,
        async callback(doc) {
          await doc.save("document");
        },
      });
    }
  };
  /*
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
*/
  // const downloadCsv = () => {
  //   const timestamp = new Date().toISOString().replace(/:/g, "-"); // Genera un timestamp con formato "yyyy-MM-ddTHH-mm-ss.sssZ"
  //   const nombreArchivo = `datos_${timestamp}.csv`; // Nombre del archivo con el timestamp
  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const url = URL.createObjectURL(blob);

  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = nombreArchivo;
  //   a.textContent = "Descargar CSV";

  //   a.click();

  //   URL.revokeObjectURL(url);
  // };

  return (
    <div>
      {!pdfDocument && <span>Loading...</span>}
      <canvas id="canvas" ref={canvasRef} />
      {Boolean(pdfDocument && pdfDocument.numPages) && (
        <nav>
          <ul className="pager">
            <li className="download">
              <button
                onClick={() => {
                  downloadCanvasAsImage();
                  // var image = canvas
                  //   .toDataURL("image/png")
                  //   .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.
                  // window.location.href = image;
                  // let canvas1 = document.getElementById("canvas");
                  // let url = canvas1.toDataURL("image/png");
                  // let link = document.createElement("a");
                  // link.download = "filename.png";
                  // link.href = url;
                  // link.click();
                  // var canvas = document.getElementById("canvas");
                  // document.getElementById("theimage").src = canvas.toDataURL();
                  // Canvas2Image.saveAsPNG(canvas);
                }}
              >
                download image
              </button>
            </li>
            <li className="previous">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
            </li>
            <li className="next">
              <button
                disabled={page === pdfDocument?.numPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* <div>
        <h1>Reconocimiento de texto en imagen</h1>
        <input
          type="file"
          name=""
          id=""
          onChange={handleImageChange}
          accept="image/*"
        />
      </div> */}
      {progress < 100 && progress > 0 && (
        <div>
          <div className="progress-label">Progress ({progress}%)</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
      <div className="display-flex">
        <div>
          <img src={imageData} alt="" />
        </div>
        <div ref={reportTemplateRef}>
          {ocr.map((line: string, index: number) => {
            return <p key={index}>{line}</p>;
          })}
        </div>
        <SyntaxHighlighter sourceCode="const a = 3;" />
        <button className="button" onClick={handleGeneratePdf}>
          Generate PDF
        </button>
      </div>
    </div>
  );
};
