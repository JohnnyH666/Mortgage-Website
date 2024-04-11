import React, { useState } from "react";
import { Fab, Tooltip, Grid, Box, Typography, Paper } from "@mui/material"; // Added Typography and Paper
import { Add as AddIcon } from "@mui/icons-material";
import styled from "styled-components";
import StaffLoanPackageForm from "../components/StaffLoanPackageForm";
import StaffLoanPackageTable from "../components/StaffLoanPackageTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const AddButton = styled(Fab)`
  position: fixed;
  top: 2vh;
  left: 0vw;
`;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function StaffLoanPackages() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="stretch"
        style={{ height: "70vh", marginTop: "5vh" }}
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
            Loan Packages
          </Typography>
        </Box>
        <Paper>
          <StaffLoanPackageTable
            refreshKey={refreshKey}
            setRefreshKey={setRefreshKey}
          />
        </Paper>
      </Grid>

      <Tooltip title="Create Loan Application" aria-label="create">
        <AddButton color="primary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </AddButton>
      </Tooltip>
      <StaffLoanPackageForm
        open={open}
        handleClose={handleClose}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
      />
    </>
  );
}

export default StaffLoanPackages;
