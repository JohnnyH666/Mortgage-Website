import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Stepper,
  Step,
  Select,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  DialogActions,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
  InputAdornment,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Publish as PublishIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import UploadButton from "./UploadButton";
import DocumentationUploadInfo from "./DocumentationUploadInfo";
import styled from "styled-components";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";

const DialogStyled = styled(Dialog)`
  .MuiDialog-paper {
    width: 80%;
    max-width: none;
  }
`;
const paperStyle = {
  padding: 20,
  height: "70vh",
  width: "50vw",
  margin: "20px auto",
};
const avatarStyle = { backgroundColor: "blue" };
const btstyle = { margin: "8px 0" };

function EditLoanPackageForm({ open, handleClose, packages }) {
  const [name, setName] = useState(packages?.name);
  const [description, setDescription] = useState(packages?.description);
  const [interestRate, setInterestRate] = useState(packages?.interest_rate);
  const [loanPeriod, setLoanPeriod] = useState(packages?.period);
  const [repaymentAmount, setRepaymentAmount] = useState(packages?.repayment);
  const [fee, setFee] = useState(packages?.fee);
  const [token, setToken] = useState("");

  const [details, setDetails] = useState({
    applicantName: "Aryan Nataraja",
    loanPackage: "Fixed Loan Package",
    loanDescription:
      "This loan package is in regards to Aryan's new home buyer loan",
    interestRate: 6.6,
    loanPeriod: 36,
    repaymentAmount: 3000000,
    fee: 15000,
  }); // filler data

  const [tempDetails, settempDetails] = useState({
    applicantName: "Aryan Nataraja",
    loanPackage: "Fixed Loan Package",
    loanDescription:
      "This loan package is in regards to Aryan's new home buyer loan",
    interestRate: 6.6,
    loanPeriod: 36,
    repaymentAmount: 3000000,
    fee: 15000,
  }); // filler data

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userType = JSON.parse(localStorage.getItem("userType"));
    console.log(token, userType);
    if (token && userType) {
      setToken(token);
    }
  }, []);

  const handleEditPackage = async () => {
    const processForm = axios({
      method: "put",
      url: "http://localhost:8000/loan_package/edit",
      params: {
        id: packages.id,
      },
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: name,
        description: description,
        interest_rate: parseFloat(interestRate),
        period: parseInt(loanPeriod),
        repayment: parseFloat(repaymentAmount),
        fee: parseFloat(fee),
      },
    });

    try {
      await processForm;
      handleClose(); // Close the dialog box
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DialogStyled open={open} onClose={handleClose}>
      <DialogTitle>Loan Package Form</DialogTitle>
      <DialogContent>
        <Grid container direction="column" gap={3} marginTop={3}>
          <TextField
            type="string"
            label="Package Name"
            value={name}
            onInput={(e) => setName(e.target.value)}
            required
          />
          <TextField
            type="string"
            label="Loan Package Description"
            value={description}
            onInput={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            type="number"
            label="Interest Rate"
            value={interestRate}
            onInput={(e) => setInterestRate(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">%</InputAdornment>
              ),
            }}
            required
          />
          <TextField
            type="number"
            label="Loan Period"
            helperText="In months"
            value={loanPeriod}
            onInput={(e) => setLoanPeriod(e.target.value)}
            required
          />
          <TextField
            type="number"
            label="Repayment Amount"
            value={repaymentAmount}
            onInput={(e) => setRepaymentAmount(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            required
          />
          <TextField
            type="number"
            label="Fee"
            value={fee}
            onInput={(e) => setFee(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            required
          />

          <Button variant="contained" onClick={handleEditPackage}>
            Save
          </Button>
        </Grid>
      </DialogContent>
    </DialogStyled>
  );
}

export default EditLoanPackageForm;
