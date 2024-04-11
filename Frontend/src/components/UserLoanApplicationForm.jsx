import React, { useState, useEffect } from "react";
import {
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
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Publish as PublishIcon,
  AttachMoney as AttachMoneyIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import UploadButton from "./UploadButton";
import DocumentationUploadInfo from "./DocumentationUploadInfo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreviewImageButton from "./PreviewImageButton";

import styled from "styled-components";
import axios from "axios";

const steps = ["About You", "Income", "Expenses", "Upload Documentation"];

const DialogStyled = styled(Dialog)`
  .MuiDialog-paper {
    width: 80%;
    max-width: none;
  }
`;

function UserLoanApplicationForm({ open, handleClose }) {
  //Get user token
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
  }, [token]);

  //State tracking which step the user is on, out of 4 steps (About You, Income, Expenses, Upload Documentation)
  const [activeStep, setActiveStep] = useState(0);
  //Following states track all inputted data this is sent to the backend as JSON OBJEC
  const [aboutYou, setAboutYou] = useState({
    dependentsUnder18: "",
    dependentsOver18: "",
    house: false,
    housePrice: "",
  });
  const [income, setIncome] = useState({
    yearlyIncome: "",
    partnerIncome: "",
    otherEarnings: "",
  });
  const [hasPartner, setHasPartner] = useState(false);
  const [expenses, setExpenses] = useState({
    yearlyExpenses: "",
    yearlyRepayments: "",
  });
  const [identityFile, setIdentityFile] = useState(null);
  const [bankStatementFile, setBankStatementFile] = useState(null);
  const [partnerBankStatementFile, setPartnerBankStatementFile] =
    useState(null);

  //Simple function to handle next button, we don't allow the user to go next unless the all the fields are filled out
  const handleNext = () => {
    if (
      activeStep === 0 &&
      (!aboutYou.dependentsUnder18 ||
        !aboutYou.dependentsOver18 ||
        (aboutYou.house && !aboutYou.housePrice))
    ) {
      alert("Please Fill About You Fields");
      return;
    }
    if (
      activeStep === 1 &&
      (!income.yearlyIncome ||
        !income.otherEarnings ||
        (hasPartner && !income.partnerIncome))
    ) {
      alert("Please Fill Income Fields");
      return;
    }
    if (
      activeStep === 2 &&
      (!expenses.yearlyExpenses || !expenses.yearlyRepayments)
    ) {
      alert("Please Fill Expenses Field");
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //Handle submitting form to the backend
  const handleSubmit = async (event) => {
    if (
      activeStep === 3 &&
      (!identityFile ||
        !bankStatementFile ||
        (hasPartner && !partnerBankStatementFile))
    ) {
      alert("Please Upload Necessary Files!");
      return;
    }
    event.preventDefault();
    //Prepare upload files
    const formData = new FormData();
    console.log(identityFile);
    console.log(bankStatementFile);
    formData.append("files", identityFile);
    formData.append("files", bankStatementFile);
    formData.append("types", "identity,bankStatement");
    if (partnerBankStatementFile != null) {
      console.log(partnerBankStatementFile);
      formData.append("files", partnerBankStatementFile);
      formData.append("types", "partnerBankStatement");
    }
    ///Request to handle uploading form

    const processForm = axios({
      method: "post",
      url: "http://localhost:8000/loan_application/complete",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      params: {
        num_depends_under_18: parseInt(aboutYou.dependentsUnder18),
        num_depends_over_18: parseInt(aboutYou.dependentsOver18),
        own_house: aboutYou.house,
        house_value: aboutYou.housePrice
          ? parseFloat(aboutYou.housePrice)
          : 0.0,
        income_before_tax: parseFloat(income.yearlyIncome),
        income_partner: income.partnerIncome
          ? parseFloat(income.partnerIncome)
          : 0.0,
        income_other: parseFloat(income.otherEarnings),
        living_expenses: parseFloat(expenses.yearlyExpenses),
        loan_repayment_expense: parseFloat(expenses.yearlyRepayments),
        complete: false,
      },
      data: formData,
    });
    // const processFiles = axios({
    //   method: 'post',
    //   url: 'http://localhost:8000/uploadfiles',
    //   headers: {
    //     'accept': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   data: formData
    // })
    try {
      //We now combine both requests into one
      const [form_res] = await Promise.all([processForm]);
      console.log(form_res.data);
      toast.success("Succesfully submitted application");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      handleClose();
      handleReset();
    }
  };

  const handleReset = () => {
    // Here, we're resetting the state for each form field
    setActiveStep(0); // Reset the stepper to the first step

    setAboutYou({
      dependentsUnder18: "",
      dependentsOver18: "",
      house: false,
      housePrice: "",
    });

    setIncome({
      yearlyIncome: "",
      partnerIncome: "",
      otherEarnings: "",
    });

    setHasPartner(false);

    setExpenses({
      yearlyExpenses: "",
      yearlyRepayments: "",
    });

    setIdentityFile(null);
    setBankStatementFile(null);
    setPartnerBankStatementFile(null);
  };

  //As per MaterialUI stepper API, we utilise a simple switch statement to showcase each step.
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Grid container direction="column" gap={3} marginTop={3}>
            <FormControl fullWidth>
              <InputLabel id="has-partner-select">This loan is for</InputLabel>
              <Select
                labelId="has-partner-select"
                id="has-partner-select"
                value={hasPartner}
                label="This loan is for"
                onChange={(e) => setHasPartner(e.target.value)}
              >
                <MenuItem value={false}>It's just me</MenuItem>
                <MenuItem value={true}>There's two of us</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="number"
              label="Dependents Under 18"
              value={aboutYou.dependentsUnder18}
              helperText="Children"
              onChange={(e) =>
                setAboutYou({ ...aboutYou, dependentsUnder18: e.target.value })
              }
            />
            <TextField
              type="number"
              label="Dependents Over 18"
              value={aboutYou.dependentsOver18}
              helperText="Adults"
              onChange={(e) =>
                setAboutYou({ ...aboutYou, dependentsOver18: e.target.value })
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={aboutYou.house}
                  onChange={(e) =>
                    setAboutYou({ ...aboutYou, house: e.target.checked })
                  }
                />
              }
              label="Already found a house you like?"
            />
            {aboutYou.house && (
              <TextField
                type="number"
                label="House Price"
                value={aboutYou.housePrice}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  setAboutYou({ ...aboutYou, housePrice: e.target.value })
                }
              />
            )}
          </Grid>
        );
      case 1:
        return (
          <Grid container direction="column" gap={3} marginTop={3}>
            <TextField
              type="number"
              label="Yearly Income"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
              value={income.yearlyIncome}
              helperText="Annual income before tax"
              onChange={(e) =>
                setIncome({ ...income, yearlyIncome: e.target.value })
              }
            />
            {hasPartner ? (
              <TextField
                type="number"
                label="Partner Income"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
                value={income.partnerIncome}
                helperText="If partner also works enter their annual income before tax (Otherwise enter 0)"
                onChange={(e) =>
                  setIncome({ ...income, partnerIncome: e.target.value })
                }
              />
            ) : (
              ""
            )}
            <TextField
              type="number"
              label="Other Earnings"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
              helperText="Combine all other income including regular bonus, overtime, dividends, rent income for you and your partner"
              value={income.otherEarnings}
              onChange={(e) =>
                setIncome({ ...income, otherEarnings: e.target.value })
              }
            />
          </Grid>
        );
      case 2:
        return (
          <Grid container direction="column" gap={3} marginTop={3}>
            <TextField
              label="Yearly Bills and Living Expenses"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
              value={expenses.yearlyExpenses}
              helperText="(E.g. food, electricity, transport, education, entertainment)"
              onChange={(e) =>
                setExpenses({ ...expenses, yearlyExpenses: e.target.value })
              }
            />
            <TextField
              label="Yearly Loan Repayments"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
              value={expenses.yearlyRepayments}
              helperText="(If either of you already have other loan payments eg. home, personal, student, car loans)"
              onChange={(e) =>
                setExpenses({ ...expenses, yearlyRepayments: e.target.value })
              }
            />
          </Grid>
        );
      case 3:
        return (
          <Box sx={{ marginTop: "2em" }}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              rowGap={3}
            >
              <Box sx={{ textAlign: "center", padding: "0.5em", width: "60%" }}>
                <Typography variant="body1" style={{ marginBottom: "1em" }}>
                  Upload your Identity Document. It should be a
                  government-issued identification such as a passport or
                  driver's license. Acceptable formats are PDF and JPEG, not
                  exceeding 1MB.
                </Typography>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <UploadButton variant="outlined" setFile={setIdentityFile}>
                    Upload Identity
                  </UploadButton>
                  <DocumentationUploadInfo docType={"identity"} />
                </Grid>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  marginRight={4}
                >
                  {identityFile && (
                    <Typography variant="body2" style={{ padding: "0.8em" }}>
                      Uploaded: {identityFile.name}
                    </Typography>
                  )}
                  <PreviewImageButton file={identityFile} />
                </Box>
              </Box>
              <Box sx={{ textAlign: "center", padding: "0.5em", width: "60%" }}>
                <Typography variant="body1" style={{ marginBottom: "1em" }}>
                  Upload your Bank Statement for the last 3 months. This can be
                  a bank statement or any document showing your incomes and
                  expenses for the last 3 months. Acceptable formats are PDF and
                  JPEG, not exceeding 1MB.
                </Typography>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <UploadButton
                    variant="outlined"
                    setFile={setBankStatementFile}
                  >
                    Upload Bank Statement for you
                  </UploadButton>
                  <DocumentationUploadInfo docType={"bankStatement"} />
                </Grid>

                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  marginRight={4}
                >
                  {bankStatementFile && (
                    <Typography variant="body2" style={{ padding: "0.8em" }}>
                      Uploaded: {bankStatementFile.name}
                    </Typography>
                  )}
                  <PreviewImageButton file={bankStatementFile} />
                </Box>
              </Box>
              {hasPartner ? (
                <Box
                  sx={{ textAlign: "center", padding: "0.5em", width: "60%" }}
                >
                  <Typography variant="body1" style={{ marginBottom: "1em" }}>
                    Upload your Partners Bank Statement for the last 3 months.
                    This can be a bank statement or any document showing your
                    partners incomes and expenses for the last 3 months.
                    Acceptable formats are PDF and JPEG, not exceeding 1MB.
                  </Typography>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <UploadButton
                      variant="outlined"
                      setFile={setPartnerBankStatementFile}
                    >
                      Upload Bank Statement for your partner
                    </UploadButton>
                    <DocumentationUploadInfo docType={"bankStatement"} />
                  </Grid>

                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    marginRight={4}
                  >
                    {partnerBankStatementFile && (
                      <Typography variant="body2" style={{ padding: "0.8em" }}>
                        Uploaded: {partnerBankStatementFile.name}
                      </Typography>
                    )}
                    <PreviewImageButton file={partnerBankStatementFile} />
                  </Box>
                </Box>
              ) : (
                ""
              )}
            </Grid>
          </Box>
        );
      default:
        return "Unknown stepIndex";
    }
  };

  return (
    <>
      <DialogStyled open={open} onClose={handleClose}>
        <DialogTitle>Loan Application Form</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={
              activeStep === steps.length - 1 ? handleSubmit : handleNext
            }
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </DialogActions>
      </DialogStyled>
      <ToastContainer />
    </>
  );
}

export default UserLoanApplicationForm;
