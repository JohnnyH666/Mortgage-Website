import React, { useState, useEffect } from "react";
import { Fab, Tooltip, Grid, Box, Typography } from "@mui/material";
import axios from "axios";
import { Add as AddIcon } from "@mui/icons-material";
import styled from "styled-components";
import UserLoanApplicationForm from "../components/UserLoanApplicationForm";
import UserLoanApplicationCard from "../components/UserLoanApplicationCard";
//Places FAB buttons on the bottom right of screen
const AddButton = styled(Fab)`
  position: fixed;
  top: 0vh;
  left: 0vw;
`;
//Main Page for User Loan Applications
function UserLoanApplications() {
  const [loanApplications, setLoanApplications] = useState([]);
  const [userType, setUserType] = useState("");
  const [token, setToken] = useState("");
  // UseEffect will check to see when the token changes, and adjust the header accordinginly
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userType = JSON.parse(localStorage.getItem("userType"));

    console.log(token, userType);
    if (token && userType) {
      setToken(token);
      setUserType(userType);
    }
  }, []);
  //Manages state for when application form dialog is open or closed
  const [open, setOpen] = useState(false);
  const [editSaved, setEditSaved] = useState(false);
  //Handles click open for dialog form
  const handleClickOpen = () => {
    setOpen(true);
  };
  //Handles closing of dialog form
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getLoanApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/get_all_applications/",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoanApplications(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    const getUserFiles = async () => {};
    if (token) {
      getLoanApplications();
    }
  }, [token, open, editSaved]);

  return (
    <>
      <Grid>
        {loanApplications.length === 0 ? (
          <Typography variant="h5" sx={{ padding: "1em" }}>
            No Loan Applications Made! <br></br>Click the <b>Plus Button </b>
            below to begin.{" "}
          </Typography>
        ) : (
          loanApplications.map((app, index) => {
            return (
              <UserLoanApplicationCard
                index={index}
                loanApplication={app}
                editSaved={editSaved}
                setEditSaved={setEditSaved}
              />
            );
          })
        )}
      </Grid>
      <Tooltip title="Create Loan Application" aria-label="create">
        <AddButton color="primary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </AddButton>
      </Tooltip>
      <UserLoanApplicationForm open={open} handleClose={handleClose} />
    </>
  );
}

export default UserLoanApplications;
