import { useState, useRef } from "react";
import { usePdf } from "@mikecousins/react-pdf";
import Container from "@mui/material/Container";

export const MyPdfViewer = ({ file }: { file: string }) => {
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument, pdfPage } = usePdf({
    file: file,
    page,
    canvasRef,
  });

  return (
    <Container>
      {!pdfDocument && <span>Loading...</span>}
      <canvas id="canvas" ref={canvasRef} />
      {Boolean(pdfDocument && pdfDocument.numPages) && (
        <nav>
          <ul className="pager">
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
    </Container>
  );
};
