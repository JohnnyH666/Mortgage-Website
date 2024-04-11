import React, { useState, useEffect } from "react";

import { FcHome } from "react-icons/fc";
import Form from "../components/Form";
import { Avatar, Button, Grid, Paper, TextField } from "@mui/material";

const paperStyle = {
  padding: 20,
  height: "70vh",
  width: 600,
  margin: "20px auto",
};

// The Login component
const LoanCalculator = () => {
  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <h2 className="display-1 my-5">Mortgage Calculator</h2>
        <Form />
      </Paper>
    </Grid>
  );
};

export default LoanCalculator;
