import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import javascript from "highlight.js/lib/languages/javascript";
// import diff from 'highlight.js/lib/languages/excel';
hljs.registerLanguage("javascript", javascript);

interface CodeHighlighterProps {
  code: string;
  language: string;
}

export const CodeHighlighter = ({ code, language }: CodeHighlighterProps) => {
  const codeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }

    // const copyToClipboard = () => {
    //   if (codeRef.current) {
    //     const textArea = document.createElement("textarea");
    //     textArea.value = code;
    //     document.body.appendChild(textArea);
    //     textArea.select();

    //     try {
    //       document.execCommand("copy");
    //       alert("Code copied to clipboard!");
    //     } catch (err) {
    //       console.error("Unable to copy code:", err);
    //     } finally {
    //       document.body.removeChild(textArea);
    //     }
    //   }
    // };

    // // Attach the copy-to-clipboard function to a button
    // const copyButton = document.querySelector(".copy-button");
    // if (copyButton) {
    //   copyButton.addEventListener("click", copyToClipboard);
    // }

    // return () => {
    //   if (copyButton) {
    //     copyButton.removeEventListener("click", copyToClipboard);
    //   }
    // };
  }, [code, language]);

  return (
    <div>
      {/* <button className="copy-button" data-clipboard-text={code}>
        Copy to Clipboard
      </button> */}
      <pre>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};
