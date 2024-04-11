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

function UserLoanPackageDetails({ open, handleClose, packages }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [fee, setFee] = useState("");

  const [details, setDetails] = useState({
    name: name,
    loanDescription:
      "This loan package is in regards to Aryan's new home buyer loan",
    interestRate: 6.6,
    loanPeriod: 36,
    repaymentAmount: 3000000,
    fee: 15000,
  }); // filler data

  return (
    <DialogStyled open={open} onClose={handleClose}>
      <DialogTitle>Loan Package Details</DialogTitle>
      <DialogContent>
        <Grid container direction="column" gap={3} marginTop={3}>
          <TextField
            type="string"
            label="Package Name"
            value={packages.name}
            disabled
          />
          <TextField
            type="string"
            label="Loan Package Description"
            value={packages.description}
            disabled
          />
          <TextField
            type="number"
            label="Interest Rate"
            value={packages.interest_rate}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">%</InputAdornment>
              ),
            }}
          />
          <TextField
            type="number"
            label="Loan Period"
            helperText="In months"
            value={packages.period}
            disabled
          />
          <TextField
            type="number"
            label="Repayment Amount"
            value={packages.repayment}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <TextField
            type="number"
            label="Fee"
            value={packages.fee}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
      </DialogContent>
    </DialogStyled>
  );
}

export default UserLoanPackageDetails;
