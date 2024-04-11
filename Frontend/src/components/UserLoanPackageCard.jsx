import React, { useState } from "react";
import UserLoanPackageDetails from "./UserLoanPackageDetails";
import { Fab, Tooltip, Grid, Box } from "@mui/material";
import {
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Typography,
} from "@mui/material";
import styled from "styled-components";

const StyledCard = styled(Card)`
  margin: 20px 0;
  min-width: 450px;
  max-width: 50vw;
  background-color: red;
  .MuiCardActions-root {
    justify-content: space-between;
  }
`;

const StyledChip = styled(Chip)`
  width: 40%;
`;

function UserLoanPackageCard({ packageNumber, status, packages }) {
  // Recieves data about loanApplication to render a card showing the application number/id and status of the loan application

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
    <StyledCard>
      <CardContent>
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
            {packageNumber}
          </Typography>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid
          container
          direction={"row"}
          columnGap={2}
          justifyContent={"space-"}
        >
          <>
            <Button
              variant="contained"
              Button
              size="small"
              color="primary"
              onClick={handleClickOpen}
            >
              View Details
            </Button>
            <UserLoanPackageDetails
              open={open}
              handleClose={handleClose}
              packages={packages}
            />
          </>
        </Grid>
      </CardActions>
    </StyledCard>
  );
}

export default UserLoanPackageCard;
