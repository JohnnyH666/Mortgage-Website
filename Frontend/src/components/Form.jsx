import React, { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import FormInputGroup from "./FormInputGroup";
import Box from "@mui/material/Box";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
} from "@mui/material";

function Form() {
  const [homeValue, setHomeValue] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanDuration, setLoanDuration] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  function calculateLoanAmount() {
    setLoanAmount(homeValue - downPayment);
    return loanAmount;
  }

  function calculateMonthlyPayment() {
    // Percentage conversion
    function percentageToDecimal(percent) {
      return percent / 12 / 100;
    }

    // years to month conversion
    function yearsToMonths(year) {
      return year * 12;
    }

    setMonthlyPayment(
      (percentageToDecimal(interestRate) * loanAmount) /
        (1 -
          Math.pow(
            1 + percentageToDecimal(interestRate),
            -yearsToMonths(loanDuration)
          ))
    );

    return monthlyPayment;
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <FormInputGroup
        placeholder={"Enter the value of the home"}
        prop="$"
        label="Mortgage Value"
        value={homeValue}
        onInput={(e) => setHomeValue(e.target.value)}
        onkeyup={calculateLoanAmount}
      />
      <FormInputGroup
        placeholder={"Enter your funds"}
        prop="$"
        label="Down Payment"
        value={downPayment}
        onInput={(e) => setDownPayment(e.target.value)}
        onkeyup={calculateLoanAmount}
      />
      <FormInputGroup
        placeholder={"Enter your funds"}
        prop="$"
        label="Loan Amount"
        readOnly={true}
        value={loanAmount}
      />
      <FormInputGroup
        placeholder={"Enter your interest rate"}
        prop="%"
        value={interestRate}
        label="Interest Rate"
        onInput={(e) => setInterestRate(e.target.value)}
      />
      <FormInputGroup
        placeholder={"Enter the duration of your loan in years"}
        prop="Years"
        label="Loan Duration"
        value={loanDuration}
        onInput={(e) => setLoanDuration(e.target.value)}
      />
      <div>
        <Box
          component="div"
          sx={{
            textOverflow: "clip",
            overflow: "hidden",
            my: 2,
            p: 1,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#101010" : "grey.100",
            color: (theme) =>
              theme.palette.mode === "dark" ? "grey.300" : "grey.800",
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark" ? "grey.800" : "grey.300",
            borderRadius: 2,
            fontSize: "0.875rem",
            fontWeight: "700",
          }}
        >
          Monthly payment: $ {parseFloat(monthlyPayment.toFixed(2))}
        </Box>
      </div>

      <Button
        type="submit"
        fullWidth
        onClick={calculateMonthlyPayment}
        color="primary"
        variant="contained"
        className="btn btn-primary btn-lg w-100 center "
      >
        Calculate
      </Button>
    </form>
  );
}

export default Form;
