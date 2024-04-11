import React, { useState, useEffect } from "react";
import EditUserLoanApplicationForm from "../components/EditLoanApplicationForm";
import { Fab, Tooltip, Grid, Box, Alert } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

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

function UserLoanApplicationCard({
  index,
  loanApplication,
  editSaved,
  setEditSaved,
}) {
  const [userType, setUserType] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userType = JSON.parse(localStorage.getItem("userType"));
    console.log(token, userType);
    if (token && userType) {
      setToken(token);
      setUserType(userType);
    }
  }, []);
  // Recieves data about loanApplication to render a card showing the application number/id and status of the loan application
  const status = loanApplication["status"];
  const navigate = useNavigate();
  let stateColor = "primary";
  let stateEmoji = "⏳️";
  switch (status) {
    case "pending":
      stateColor = "warning";
      break;
    case "declined":
      stateColor = "error";
      stateEmoji = "";
      break;
    case "approved":
      stateColor = "success";
      break;
  }
  //Manages state for when application form dialog is open or closed
  const [editOpen, setEditOpen] = useState(false);
  //Handles click open for dialog form
  const handleClickOpen = () => {
    setEditOpen(true);
  };
  //Handles closing of dialog form
  const handleClose = () => {
    setEditOpen(false);
  };
  //Manages state of the auto-recommend loan package feature
  const [open, setOpen] = useState(false);
  const [loanPackages, setLoanPackages] = useState([]);

  const handleLoanPackageOpen = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/loan_package/auto_recommend?loan_application_id=${loanApplication?.id}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoanPackages(response.data);
      setOpen(true);
    } catch (error) {
      // If no suitible packages are found, we set loan packages to be empty and tell the user to check out loan packages
      if (error.response.data.detail.includes("No suitable loan package")) {
        setLoanPackages([]);
        setOpen(true);
      } else {
        toast.error("Error getting suitable loan packages!");
      }
    }
  };

  const handleLoanPackageClose = () => {
    setOpen(false);
  };

  const handleCheckOtherPackages = () => {
    navigate("/user-loan packages");
  };

  return (
    <StyledCard>
      <CardContent>
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
            Application {index}
          </Typography>
          <StyledChip
            size="small"
            label={`${
              status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
            }`}
            color={stateColor}
          />
        </Grid>
      </CardContent>
      <CardActions>
        <Grid
          container
          direction={"column"}
          rowGap={1}
          justifyContent={"space-around"}
          alignItems={"flex-end"}
        >
          {status === "approved" ? (
            <Box
              display={"flex"}
              gap={1}
              flexDirection={"column"}
              width={"100%"}
            >
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleLoanPackageOpen}
              >
                See recommended packages
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => {
                  navigate("/search-houses");
                }}
              >
                Look for homes
              </Button>
            </Box>
          ) : (
            <Box width={"100%"}>
              <Button
                variant="contained"
                Button
                size="small"
                color="primary"
                onClick={handleClickOpen}
                fullWidth
              >
                Edit Application
              </Button>
              <EditUserLoanApplicationForm
                open={editOpen}
                handleClose={handleClose}
                selectedLoanApplication={loanApplication}
                editSaved={editSaved}
                setEditSaved={setEditSaved}
              />
            </Box>
          )}
          <Box display={"flex"} gap={3} width={"100%"}>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => {
                navigate("/user-bookings");
              }}
              fullWidth
            >
              Organise Booking
            </Button>
          </Box>
        </Grid>
      </CardActions>
      <Dialog open={open} onClose={handleLoanPackageClose}>
        <DialogTitle>Auto-Recommended Loan Packages</DialogTitle>
        <DialogContent>
          {loanPackages.length === 0 ? (
            <Box>
              <Alert severity="error" style={{ textAlign: "center" }}>
                <Typography variant="body1">
                  Sadly we could not find you any suitable packages.
                </Typography>
                <Typography variant="body2">
                  Please organise a booking with our mortgage specialists so we
                  can create a perfect loan package for your needs!
                </Typography>
                <Button
                  onClick={() => navigate("/user-bookings")}
                  color="primary"
                >
                  Meet with a specialist
                </Button>
              </Alert>
            </Box>
          ) : (
            <>
              <Alert>
                The following are recommended loan packages which match your
                approved loan application details
              </Alert>
              <List>
                {loanPackages.map((loanPackage) => (
                  <ListItem key={loanPackage.id}>
                    <Box margin={"auto"}>
                      <StyledCard>
                        <Box flex={"display"} flexDirection={"row"} padding={2}>
                          <Typography variant="h6">
                            {loanPackage.name}
                          </Typography>
                          <Typography variant="subtitle2">
                            {" "}
                            Interest Rate: {loanPackage.interest_rate}%{" "}
                          </Typography>
                          <Typography variant="subtitle2">
                            {" "}
                            Repayment: ${loanPackage.repayment}{" "}
                          </Typography>
                          <Typography variant="subtitle2">
                            {" "}
                            Period: {loanPackage.period}{" "}
                          </Typography>
                          <Typography variant="subtitle2">
                            {" "}
                            Description: {loanPackage.description}{" "}
                          </Typography>
                          <Typography variant="subtitle2">
                            {" "}
                            Fee: ${loanPackage.fee}{" "}
                          </Typography>
                        </Box>
                      </StyledCard>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCheckOtherPackages}
            color="primary"
          >
            Check out other packages
          </Button>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
}

export default UserLoanApplicationCard;
