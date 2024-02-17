import "./styles/App.css";
import { useState, useEffect, ReactElement } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { AppBar, Toolbar } from "@mui/material";
import TextField from "@mui/material/TextField";
import { DropZone } from "./DropZone";
import Grow from "@mui/material/Grow";
import Divider from "@mui/material/Divider";
import { CodeHighlighter } from "./CodeHighlighter";
import { FileType } from "./constants";
import { MyPdfViewer } from "./MyPdfViewer";

function App() {
  const [textEntered, setTextEntered] = useState<boolean | null>(null);

  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const [component, setComponent] = useState<ReactElement<any, any> | null>(
    null
  );

  useEffect(() => {
    if (text !== "") {
      setTextEntered(true);
      setComponent(<CodeHighlighter language="javascript" code={text} />);
    } else if (file != null) {
      setTextEntered(false);
      switch (file.type) {
        case FileType.PDF:
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (!!reader.result) {
              console.log("reader.result", reader.result);
              setComponent(<MyPdfViewer file={reader.result.toString()} />);
            }
          };
          // const result = reader.result;
          //setComponent(<MyPdfViewer file={file.webkitRelativePath} />);
          // var reader = new FileReader();
          // reader.readAsText(file);
          // setComponent(<MyPdfViewer file={reader.result} />);
          // reader.onload = function (e) {
          //   var contents = e?.target?.result;
          //   if (contents != null) {

          //   }
          //   // displayContents(contents);
          // };
          // reader.readAsText(file);

          break;
        case FileType.PNG:
          console.log("PNG");
          break;
        case FileType.TEXT:
        default:
          console.log("TEXT");
          break;
      }
    } else {
      setTextEntered(null);
    }
  }, [text, file]);

  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>
          Mega Converter: text to pdf to image to text to pdf ad infinitum
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ display: "flex", my: 4 }}>
          <Grow
            appear
            in={textEntered !== false}
            style={{ transformOrigin: "0 0 0" }}
            timeout={1000}
          >
            <TextField
              label="Enter any text"
              multiline
              fullWidth
              rows={13}
              value={text}
              onChange={(event) => {
                setText(event.target.value);
              }}
            />
          </Grow>
          {textEntered == null ? (
            <Divider orientation="vertical" variant="middle" flexItem>
              OR
            </Divider>
          ) : null}
          <Grow
            appear
            in={textEntered !== true}
            style={{ transformOrigin: "0 0 0" }}
            timeout={1000}
          >
            <Box>
              <DropZone file={file} setFile={setFile} />
            </Box>
          </Grow>
        </Box>
      </Container>
      {component}
    </div>
  );
}

export default App;
