import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js/lib/core';
import excel from 'highlight.js/lib/languages/excel';
import jsPDF from "jspdf";

hljs.registerLanguage('excel ', excel);

const SyntaxHighlighter = ({ sourceCode }) => {
    const [parsedCode, setCode] = useState(null);
    const anotherRef = useRef(null);
    useEffect(() => {
        function highlight() {
            let highlighted = hljs.highlight('excel', sourceCode);
            setCode(highlighted.value);
        }
        highlight(sourceCode);
    }, [sourceCode]);


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

    if (anotherRef.current != null) {
      doc.html(anotherRef.current, {
        margin: 50,
        async callback(doc) {
          await doc.save("document");
        },
      });
    }
  };

    return (
        <div>
            <pre  ref={anotherRef}
                contentEditable={false}
                className="excel"
                dangerouslySetInnerHTML={{ __html: parsedCode }}
            />

<button className="button" onClick={handleGeneratePdf}>
          Generate PDF another
        </button>
        </div>
    );
};

SyntaxHighlighter.propTypes = {
    sourceCode: PropTypes.string,
};

SyntaxHighlighter.defaultProps = {};

export default React.memo(SyntaxHighlighter);