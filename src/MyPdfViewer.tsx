import React, { useState, useRef } from "react";
import { usePdf } from "@mikecousins/react-pdf";

export const MyPdfViewer = () => {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument, pdfPage } = usePdf({
    file: "resume.pdf",
    page,
    canvasRef,
  });

  function downloadCanvasAsImage() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let canvasImage = canvas.toDataURL("image/png");

    // this can be used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function () {
      let a = document.createElement("a");
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = "image_name.png";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open("GET", canvasImage); // This is to download the canvas Image
    xhr.send();
  }

  return (
    <div>
      {!pdfDocument && <span>Loading...</span>}
      <canvas id="canvas" ref={canvasRef} />
      {Boolean(pdfDocument && pdfDocument.numPages) && (
        <nav>
          <ul className="pager">
            <li className="previous">
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
    </div>
  );
};
