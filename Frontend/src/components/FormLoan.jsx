import React, { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import FormInputGroup from "./FormInputGroupLoan";
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

function FormLoan() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [dependents, setDependents] = useState("");
  const [loanLimit, setLoanLimit] = useState(0);
  const [dependentExpenseIncrease, setdependentExpenseIncrease] = useState(0.1);
  const [mortgageFraction, setmortgageFraction] = useState(0.3);
  const [annualInterestRate, setannualInterestRate] = useState(0.0392);
  const [loanTermYears, setloanTermYears] = useState(30);

  function calculateLoanLimit() {
    // Increase expenses for dependents
    const totalExpenses =
      expenses * (1 + dependents * dependentExpenseIncrease);

    // Calculate net income
    const netIncome = income - totalExpenses;

    // Calculate amount available for the mortgage
    const mortgagePayment = netIncome * mortgageFraction;

    // Calculate monthly interest rate
    const monthlyInterestRate = annualInterestRate / 12;

    // Calculate number of payments
    const numPayments = loanTermYears * 12;

    // Calculate loan limit
    const loanLimit =
      (mortgagePayment * (Math.pow(1 + monthlyInterestRate, numPayments) - 1)) /
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numPayments));

    setLoanLimit(loanLimit);
    return loanLimit;
  }

  // function calculateLoanLimit() {

  //   let availableIncome = parseFloat(income) - parseFloat(expenses);

  //   for (let i = 0; i < dependents; i++) {
  //     availableIncome *= 0.95; // decrease by 5% for each dependent
  //   }

  //   const loanLimit = availableIncome * 0.4; // loan payments should not exceed 40% of available income

  //   setLoanLimit(loanLimit)
  //   return loanLimit;
  // }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <FormInputGroup
        placeholder={"Enter your income"}
        prop="$"
        label="Income"
        value={income}
        onInput={(e) => setIncome(e.target.value)}
      />
      <FormInputGroup
        placeholder={"Enter your expenses"}
        prop="$"
        label="Expenses"
        value={expenses}
        onInput={(e) => setExpenses(e.target.value)}
      />
      <FormInputGroup
        placeholder={"Enter the number of dependents"}
        prop="#"
        label="Dependents"
        readOnly={true}
        value={dependents}
        onInput={(e) => setDependents(e.target.value)}
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
          Loan Limit: $ {parseFloat(loanLimit.toFixed(2))}
        </Box>
      </div>

      <Button
        type="submit"
        fullWidth
        onClick={calculateLoanLimit}
        color="primary"
        variant="contained"
        className="btn btn-primary btn-lg w-100 center "
      >
        Calculate
      </Button>
    </form>
  );
}

export default FormLoan;
