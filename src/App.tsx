import "./styles/App.css";
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { AppBar, Toolbar } from "@mui/material";
import TextField from "@mui/material/TextField";
import { DropZone } from "./DropZone";
import Grow from "@mui/material/Grow";
import Divider from "@mui/material/Divider";

import { FileType } from "./constants";

function App() {
  const [textEntered, setTextEntered] = useState<boolean | null>(null);

  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const [components, setComponents] = useState([]);

  useEffect(() => {
    if (text !== "") {
      setTextEntered(true);
      console.log("TEXT");
    } else if (file != null) {
      setTextEntered(false);
      switch (file.type) {
        case FileType.PDF:
          console.log("PDF");
          break;
        case FileType.PNG:
          console.log("PNG");
          break;
        case FileType.TEXT:
        default:
          console.log("TEXT");
          break;
      }

      //addComponent(FileType[file.type as FileType]);
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
              <DropZone setFile={setFile} />
            </Box>
          </Grow>
        </Box>
      </Container>
      <Container>
        <Box sx={{ display: "flex", my: 4 }}>{components}</Box>
      </Container>
    </div>
  );
}

export default App;
