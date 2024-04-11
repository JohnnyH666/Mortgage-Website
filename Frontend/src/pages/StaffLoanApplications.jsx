import React, { useState, useEffect } from "react";
import { Fab, Tooltip, Grid, Box, Paper, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Add as AddIcon } from "@mui/icons-material";
import styled from "styled-components";
import StaffLoanApplicationTable from "../components/StaffLoanApplicationTable";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

//Main Page for Staff Loan Applications
function StaffLoanApplications() {
  //Manages state for when application form dialog is open or closed
  const [open, setOpen] = useState(false);
  //Handles click open for dialog form
  const handleClickOpen = () => {
    setOpen(true);
  };
  //Handles closing of dialog form
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          style={{ height: "100vh", marginTop: "5vh" }}
        >
          <Box
            sx={{
              textAlign: "center",
              marginBottom: "2em",
              display: "flex",
              flexDirection: "column",
              gap: "0.5em",
            }}
          >
            <Typography variant="h2" fontWeight="bold">
              Loan Applications
            </Typography>
            <Typography variant="subtitle" fontWeight="bold">
              Review page
            </Typography>
          </Box>
          <Paper>
            <StaffLoanApplicationTable />
          </Paper>
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default StaffLoanApplications;
