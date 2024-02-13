import React from "react";
import classnames from "classnames";
// import { useDropzone } from "react-dropzone";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import "./styles/animate-dropzone.css";
import "./styles/dropzone.css";

export function AcceptMaxFiles(_props: any) {
  const {
    acceptedFiles,
    isDragActive,
    fileRejections,
    getRootProps,
    getInputProps,
    open,
  } = useDropzone({
    maxFiles: 1,
  });

  const dropzoneClass = "";
  const multiple = false;

  const acceptedFileItems = acceptedFiles.map((file: File) => (
    <li key={file.webkitRelativePath}>
      {file.name} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.webkitRelativePath}>
        {file.name} - {file.size} bytes
        <ul>
          {errors.map((e) => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    );
  });
  const className = "custom-wrapper";
  const isInvalid = false;
  const clickAnywhereForUpload = true;
  return (
    <section className="container">
      <div
        className={classnames([
          `dropzone-container`,
          className,
          isDragActive ? "drag-active" : "",
          isInvalid ? "invalid" : "",
        ])}
        onClick={clickAnywhereForUpload ? open : () => {}}
        {...getRootProps()}
      >
        <div className="topbottom" />
        <div className="leftright" />
        <div className={`dropzone ${dropzoneClass}`}>
          <div className="instruction">
            <p>Drag and drop your files here.</p>
            {
              <div>
                <button className="uploadBtn" onClick={open}>
                  Click Here
                </button>
              </div>
            }
          </div>
        </div>

        <input {...getInputProps()} multiple={multiple} />
      </div>
      {/* <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(1 files are the maximum number of files you can drop here)</em>
      </div> */}
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        {/* <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul> */}
      </aside>
    </section>
  );
}
