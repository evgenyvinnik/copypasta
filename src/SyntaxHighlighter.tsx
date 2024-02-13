import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import hljs from "highlight.js";
// import "highlight.js/styles/github.css";
// import excel from 'highlight.js/lib/languages/excel';
import jsPDF from "jspdf";
import Box from "@mui/material/Box";
// hljs.registerLanguage('excel ', excel);
import "highlight.js/styles/github.css";

const SyntaxHighlighter = ({ sourceCode }: { sourceCode: string }) => {
  const [parsedCode, setParsedCode] = useState<string | null>(null);

  useEffect(() => {
    let highlighted = hljs.highlight(sourceCode, { language: "javascript" });
    setParsedCode(highlighted.value);

    //hljs.highlightAll();
  }, [sourceCode]);

  return parsedCode != null ? (
    <>
      <Box
        alignItems="left"
        component="section"
        display="flex"
        sx={{ p: 2, border: "1px dashed grey" }}
      >
        <div dangerouslySetInnerHTML={{ __html: parsedCode }} />
        {/* <pre>
          <code className="language-js">{sourceCode}</code>
        </pre> */}
      </Box>
      <button className="button">Generate PDF another</button>
    </>
  ) : null;

  //     const [parsedCode, setCode] = useState(null);
  //     const anotherRef = useRef(null);
  //     useEffect(() => {
  //         function highlight() {
  //             let highlighted = hljs.highlightAuto(sourceCode);
  //             setCode(highlighted.value);
  //         }
  //         highlight(sourceCode);
  //     }, [sourceCode]);

  //   const handleGeneratePdf = () => {
  //     const doc = new jsPDF({
  //       format: "a2",
  //       unit: "px",
  //     });

  //     // Adding the fonts
  //     doc.setFont("Inter-Regular", "normal");
  //     const leftMargin = 50;
  //     const rightMargin = 50;
  //     const topMargin = 50;
  //     const bottomMargin = 50;
  //     // doc.setMargins(leftMargin, topMargin, rightMargin, bottomMargin);

  //     if (anotherRef.current != null) {
  //       doc.html(anotherRef.current, {
  //         margin: 50,
  //         async callback(doc) {
  //           await doc.save("document");
  //         },
  //       });
  //     }
  //   };

  //     return (
  //         <div>
  //             <pre  ref={anotherRef}
  //                 contentEditable={false}
  //                 className="excel"
  //                 dangerouslySetInnerHTML={{ __html: parsedCode }}
  //             />

  // <button className="button" onClick={handleGeneratePdf}>
  //           Generate PDF another
  //         </button>
  //         </div>
  //     );
};

SyntaxHighlighter.propTypes = {
  sourceCode: PropTypes.string,
};

SyntaxHighlighter.defaultProps = {};

export default React.memo(SyntaxHighlighter);
