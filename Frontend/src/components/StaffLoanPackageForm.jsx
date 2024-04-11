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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

function StaffLoanPackageForm({
  open,
  handleClose,
  refreshKey,
  setRefreshKey,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [fee, setFee] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userType = JSON.parse(localStorage.getItem("userType"));
    console.log(token, userType);
    if (token && userType) {
      setToken(token);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const processForm = axios({
      method: "post",
      url: "http://localhost:8000/loan_package/create",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        name: name,
        description: description,
        //loanPackageType: loanPackageType,
        interest_rate: parseFloat(interestRate),
        period: parseInt(loanPeriod),
        repayment: parseFloat(repaymentAmount),
        fee: parseFloat(fee),
      },
    });
    try {
      const form_res = await processForm;
      localStorage.setItem("reloadLocation", window.location.pathname);
      console.log(form_res.data);
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setRefreshKey((oldKey) => oldKey + 1); // Increment refreshKey after creating loan package
      toast.success("Successfully submitted package");
      handleClose();
      handleReset();
      localStorage.setItem("reloadLocation", window.location.pathname);
    }
  };

  const handleReset = () => {
    setName("");
    setLoanPackageType(false);
    setDescription("");
    setInterestRate("");
    setLoanPeriod("");
    setRepaymentAmount("");
    setFee("");
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
          />
          <TextField
            type="string"
            label="Loan Package Description"
            value={description}
            onInput={(e) => setDescription(e.target.value)}
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
          />
          <TextField
            type="number"
            label="Loan Period"
            helperText="In months"
            value={loanPeriod}
            onInput={(e) => setLoanPeriod(e.target.value)}
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
          />

          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </DialogContent>
    </DialogStyled>
  );
}

export default StaffLoanPackageForm;
