import React, { useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";

const UploadButton = ({ children, setFile }) => (
  <Button
    component="label"
    variant="contained"
    startIcon={<PublishIcon />}
    onChange={(e) => {
      const file = e.target.files[0];
      setFile(file);
    }}
  >
    {children}
    <input type="file" hidden />
  </Button>
);

export default UploadButton;
