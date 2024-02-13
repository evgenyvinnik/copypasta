import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import javascript from "highlight.js/lib/languages/javascript";
import Button from "@mui/material/Button";
import jsPDF from "jspdf";

interface CodeHighlighterProps {
  code: string;
  language: string;
}

export const CodeHighlighter = ({ code, language }: CodeHighlighterProps) => {
  const codeRef = useRef<HTMLElement | null>(null);
  const printRef = useRef(null);

  useEffect(() => {
    hljs.registerLanguage("javascript", javascript);
  }, []);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const copyToClipboard = () => {
    if (codeRef.current) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(code)
          .then(function () {
            alert("yeah!"); // success
          })
          .catch(function () {
            alert("err"); // error
          });
      }
    }
  };

  const generatePdf = () => {
    const doc = new jsPDF({
      format: "a2",
      unit: "px",
    });

    // Adding the fonts
    doc.setFont("Inter-Regular", "normal");

    if (printRef.current != null) {
      doc.html(printRef.current, {
        margin: 50,
        jsPDF: doc,
        async callback(doc) {
          const filename = "generatedPdf.pdf";
          await doc.save(filename, { returnPromise: true });

          const a = document.createElement("a");
          a.href = filename;
          // this points to non existing file
          document.body.appendChild(a);
        },
      });
    }
  };

  return code !== "" ? (
    <div>
      <pre ref={printRef}>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
      <Button
        className="copy-button"
        variant="contained"
        data-clipboard-text={code}
        onClick={copyToClipboard}
      >
        Copy to Clipboard
      </Button>
      <Button
        sx={{ left: 4 }}
        className="copy-button"
        variant="contained"
        data-clipboard-text={code}
        onClick={generatePdf}
      >
        Generate PDF
      </Button>
    </div>
  ) : null;
};
