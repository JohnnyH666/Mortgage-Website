import React, { useState, useEffect } from "react";
import {
  Fab,
  Tooltip,
  Grid,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import styled from "styled-components";
import UserLoanPackageCard from "../components/UserLoanPackageCard";
import axios from "axios";
import StaffLoanPackageTable from "../components/StaffLoanPackageTable";
import UserLoanPackageTable from "../components/UserLoanPackageTable";
import StaffLoanPackageForm from "../components/StaffLoanPackageForm";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Add as AddIcon,
  Publish as PublishIcon,
  AttachMoney as AttachMoneyIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
const WhiteBorderTextField = styled(TextField)`
  .MuiFilledInput-root {
    color: white !important;
    border-bottom: 1px solid #1565c0 !important;
  }
`;

//Main Page for User Loan Applications
function UserLoanPackages() {
  //Manages state for when application form dialog is open or closed
  const [allLoanPackages, setAllLoanPackages] = useState([]);
  const [searchLoanAmount, setSearchLoanAmount] = useState("");

  useEffect(() => {
    getAllLoanPackages();
  }, []);

  const getAllLoanPackages = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8000/loan_package/get_all/",
        {
          headers: {
            accept: "application/json",
          },
        }
      );

      setAllLoanPackages(result.data);
    } catch (error) {
      console.error("Error fetching loan packages:", error);
    }
  };

  const searchLoanPackages = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8000/loan_package/input_search?loan_amount=${searchLoanAmount}`,
        {
          headers: {
            accept: "application/json",
          },
        }
      );

      setAllLoanPackages(result.data);
    } catch (error) {
      console.error("Error fetching loan packages:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchLoanAmount(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchLoanAmount !== "") {
      searchLoanPackages();
    } else {
      getAllLoanPackages();
    }
  };

  return (
    <>
      <Grid>
        <Alert>
          {" "}
          Enter a custom loan amount to quickly see how our loan packages
          matches your loan limit
        </Alert>
        <Box
          mb={2}
          padding={5}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
        >
          <WhiteBorderTextField
            label="Enter a loan amount"
            type="number"
            variant="filled"
            value={searchLoanAmount}
            onChange={handleSearchChange}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "white" }}>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchClick}
          >
            Calculate
          </Button>
        </Box>
        <Paper>
          <UserLoanPackageTable loanPackages={allLoanPackages} />
        </Paper>
      </Grid>
    </>
  );
}

export default UserLoanPackages;
