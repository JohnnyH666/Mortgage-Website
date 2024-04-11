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
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const steps = ["About You", "Income", "Expenses", "Upload Documentation"];

const DialogStyled = styled(Dialog)`
  .MuiDialog-paper {
    width: 80%;
    max-width: none;
  }
`;

function EditUserLoanApplicationForm({
  open,
  handleClose,
  selectedLoanApplication,
  editSaved,
  setEditSaved,
}) {
  if (open == true) {
    console.log("Opening edit for" + selectedLoanApplication.id);
  }
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

  useEffect(() => {
    setEditSaved(false);
    handleReset();
  }, [open, editSaved]);

  const {
    id,
    own_house,
    income_before_tax,
    income_other,
    loan_repayment_expense,
    loan_limit,
    manager_email,
    num_depends_under_18,
    num_depends_over_18,
    house_value,
    income_partner,
    living_expesnes,
    complete,
    customer_email,
    status,
  } = selectedLoanApplication;

  const [applicationFiles, setApplicationFiles] = useState([]);

  //Get files for particular loan application
  // useEffect(() => {
  //   const getApplicationFiles = async () => {
  //     try{
  //     const res = await axios.post(
  //       'http://localhost:8000/get_files_by_app_id/', "", {
  //         params:{
  //           "application_id": selectedLoanApplication.id
  //         },
  //         headers: {
  //           accept: 'application/json',
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/x-www-form-urlencoded'
  //         },
  //       }
  //     )
  //     setApplicationFiles(res.data)
  //     }
  //     catch (error){
  //       toast.error("Error getting user files!");
  //     }
  //   }
  //   if(selectedLoanApplication.id && token!="" && open==){
  //     getApplicationFiles()
  //   }
  // }, [open, token])

  const handleReset = () => {
    // Here, we're resetting the state for each form field
    setActiveStep(0); // Reset the stepper to the first step
    setChanged(false);
    setAboutYou({
      dependentsUnder18: num_depends_under_18,
      dependentsOver18: num_depends_over_18,
      house: own_house,
      housePrice: house_value,
    });

    setIncome({
      yearlyIncome: income_before_tax,
      partnerIncome: income_partner,
      otherEarnings: income_other,
    });

    setHasPartner(income_partner ? true : false);

    setExpenses({
      yearlyExpenses: living_expesnes,
      yearlyRepayments: loan_repayment_expense,
    });

    setIdentityFile(null);
    setBankStatementFile(null);
    setPartnerBankStatementFile(null);
  };

  const [changed, setChanged] = useState(false);
  //State tracking which step the user is on, out of 4 steps (About You, Income, Expenses, Upload Documentation)
  const [activeStep, setActiveStep] = useState(0);
  //Following states track all inputted data this is sent to the backend as JSON OBJEC
  const [aboutYou, setAboutYou] = useState({
    dependentsUnder18: num_depends_under_18,
    dependentsOver18: num_depends_over_18,
    house: own_house,
    housePrice: house_value,
  });

  const [income, setIncome] = useState({
    yearlyIncome: income_before_tax,
    partnerIncome: income_partner,
    otherEarnings: income_other,
  });

  const [hasPartner, setHasPartner] = useState(income_partner ? true : false);

  const [expenses, setExpenses] = useState({
    yearlyExpenses: living_expesnes,
    yearlyRepayments: loan_repayment_expense,
  });

  const [identityFile, setIdentityFile] = useState("");
  const [bankStatementFile, setBankStatementFile] = useState("");
  const [partnerBankStatementFile, setPartnerBankStatementFile] = useState("");

  const [tempaboutYou, settempAboutYou] = useState({
    dependentsUnder18: num_depends_under_18,
    dependentsOver18: num_depends_over_18,
    house: own_house,
    housePrice: house_value,
  });

  const [tempincome, settempIncome] = useState({
    yearlyIncome: income_before_tax,
    partnerIncome: income_partner,
    otherEarnings: income_other,
  });

  const [temphasPartner, settempHasPartner] = useState(false); // Again, no direct equivalent in the selectedLoanApplication object.

  const [tempexpenses, settempExpenses] = useState({
    yearlyExpenses: living_expesnes,
    yearlyRepayments: loan_repayment_expense,
  });

  const [tempidentityFile, settempIdentityFile] = useState("");
  const [tempbankStatementFile, settempBankStatementFile] = useState("");
  const [temppartnerBankStatementFile, settempPartnerBankStatementFile] =
    useState("");
  //Simple function to handle next button, we don't allow the user to go next unless the all the fields are filled out
  const handleNext = () => {
    if (
      activeStep === 0 &&
      (!aboutYou.dependentsUnder18 ||
        !aboutYou.dependentsOver18 ||
        (aboutYou.house && !aboutYou.housePrice))
    ) {
      alert("Please fill all the fields");
      return;
    }
    if (
      activeStep === 1 &&
      (!income.yearlyIncome ||
        !income.otherEarnings ||
        (hasPartner && !income.partnerIncome))
    ) {
      alert("Please fill all the fields");
      return;
    }
    if (
      activeStep === 2 &&
      (!expenses.yearlyExpenses || !expenses.yearlyRepayments)
    ) {
      alert("Please fill all the fields");
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const checkboxStyle = { paddingTop: 1, paddingRight: 800, paddingBottom: 10 };

  //Handle submitting form to the backend
  const handleSaveApplication = async () => {
    ///Request to handle uploading form
    const processForm = axios({
      method: "put",
      url: "http://localhost:8000/loan_application/edit",
      params: {
        application_id: id,
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
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
    });
    //Request to upload files
    const formData = new FormData();
    console.log(identityFile);
    console.log(bankStatementFile);
    formData.append("files", identityFile);
    formData.append("files", bankStatementFile);
    // if(partnerBankStatementFile != ""){
    //   formData.append('files', partnerBankStatementFile);
    // }
    const processFiles = axios({
      method: "post",
      url: "http://localhost:8000/uploadfiles",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    try {
      //We now combine both requests into one
      const [form_res, file_res] = await Promise.all([
        processForm,
        processFiles,
      ]);
      console.log(form_res.data);
      console.log(file_res.data);
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      toast.success("Succesfully submitted application");
      handleClose();
      setEditSaved(true);
      handleReset();
    }
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
                onChange={(e) => {
                  setHasPartner(e.target.value);
                }}
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
              onChange={(e) => {
                setAboutYou({ ...aboutYou, dependentsUnder18: e.target.value });
                setChanged(true);
              }}
            />
            <TextField
              type="number"
              label="Dependents Over 18"
              value={aboutYou.dependentsOver18}
              helperText="Adults"
              onChange={(e) => {
                setAboutYou({ ...aboutYou, dependentsOver18: e.target.value });
                setChanged(true);
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={aboutYou.house}
                  onChange={(e) => {
                    setChanged(true);
                    setAboutYou({ ...aboutYou, house: e.target.checked });
                  }}
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
                onChange={(e) => {
                  setAboutYou({ ...aboutYou, housePrice: e.target.value });
                  setChanged(true);
                }}
              />
            )}
            {changed ? (
              <>
                <button
                  onClick={(e) => {
                    setAboutYou({ ...tempaboutYou });
                    setHasPartner({ ...temphasPartner });
                    setChanged(false);
                  }}
                >
                  Cancel
                </button>

                <button onClick={handleSaveApplication}> Save</button>
              </>
            ) : null}
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
              onChange={(e) => {
                setIncome({ ...income, yearlyIncome: e.target.value });
                setChanged(true);
              }}
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
                onChange={(e) => {
                  setIncome({ ...income, partnerIncome: e.target.value });
                  setChanged(true);
                }}
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
              onChange={(e) => {
                setIncome({ ...income, otherEarnings: e.target.value });
                setChanged(true);
              }}
            />
            {changed ? (
              <>
                <button
                  onClick={(e) => {
                    setIncome({ ...tempincome });
                    setChanged(false);
                  }}
                >
                  Cancel
                </button>

                <button onClick={handleSaveApplication}> Save</button>
              </>
            ) : null}
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
              onChange={(e) => {
                setExpenses({ ...expenses, yearlyExpenses: e.target.value });
                setChanged(true);
              }}
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
              onChange={(e) => {
                setExpenses({ ...expenses, yearlyRepayments: e.target.value });
                setChanged(true);
              }}
            />
            {changed ? (
              <>
                <button
                  onClick={(e) => {
                    setExpenses({ ...tempexpenses });
                    setChanged(false);
                  }}
                >
                  Cancel
                </button>

                <button onClick={handleSaveApplication}>Save</button>
              </>
            ) : null}
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
                {identityFile && (
                  <Typography variant="body2" style={{ padding: "0.8em" }}>
                    Uploaded: {identityFile.name}
                  </Typography>
                )}
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
                {bankStatementFile && (
                  <Typography variant="body2" style={{ padding: "0.8em" }}>
                    Uploaded: {bankStatementFile.name}
                  </Typography>
                )}
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
                  {partnerBankStatementFile && (
                    <Typography variant="body2" style={{ padding: "0.8em" }}>
                      Uploaded: {partnerBankStatementFile.name}
                    </Typography>
                  )}
                </Box>
              ) : (
                ""
              )}
              {changed ? (
                <>
                  {" "}
                  <button>Cancel</button>{" "}
                  <button onClick={handleSaveApplication}> Save</button>{" "}
                </>
              ) : null}
            </Grid>
          </Box>
        );
      default:
        return "Unknown stepIndex";
    }
  };

  return (
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
          onClick={activeStep === steps.length - 1 ? handleClose : handleNext}
        >
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </DialogActions>
      <ToastContainer />
    </DialogStyled>
  );
}

export default EditUserLoanApplicationForm;
