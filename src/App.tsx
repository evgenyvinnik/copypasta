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
import { ImagePreview } from "./ImagePreview";
import { isStringNullOrWhitespaceOnly } from "./utils";

function App() {
  const [textEntered, setTextEntered] = useState<boolean | null>(null);

  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const [component, setComponent] = useState<ReactElement<any, any> | null>(
    null
  );

  useEffect(() => {
    if (!isStringNullOrWhitespaceOnly(text)) {
      setTextEntered(true);
      setComponent(<CodeHighlighter code={text} />);
    } else if (file != null) {
      setTextEntered(false);
      let reader = new FileReader();
      switch (file.type) {
        case FileType.PDF:
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (!!reader.result) {
              setComponent(<MyPdfViewer file={reader.result.toString()} />);
            }
          };
          break;
        case FileType.PNG:
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (!!reader.result) {
              setComponent(<ImagePreview file={reader.result.toString()} />);
            }
          };
          break;
        case FileType.TEXT:
        default:
          reader.readAsText(file);
          reader.onload = () => {
            if (!!reader.result) {
              setComponent(<CodeHighlighter code={reader.result.toString()} />);
            }
          };
          break;
      }
    } else {
      setTextEntered(null);
      setComponent(null);
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
