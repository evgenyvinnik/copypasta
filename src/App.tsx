import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { AppBar, Toolbar } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AcceptMaxFiles } from "./AcceptMaxFiles";
function App() {
  const [value, setValue] = useState<File | null>(null);

  const handleChange = (newValue: File | null) => {
    setValue(newValue);
  };
  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>text to pdf to image to text</Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: 4 }}>
          <TextField
            id="outlined-multiline-static"
            label="Enter any text"
            multiline
            fullWidth
            rows={10}
            placeholder="Enter any text"
          />
          <AcceptMaxFiles />{" "}
        </Box>
      </Container>
    </div>
  );
}

export default App;
