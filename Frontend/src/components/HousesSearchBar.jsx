import React from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const HousesSearchBar = ({
  address,
  setAddress,
  loanApplication,
  setLoanApplication,
  handleSearch,
  loanApplications,
}) => {
  const validateSearch = () => {
    if (!address) {
      toast.error("Enter a valid location");
    } else {
      toast.success("Click on the houses to learn more", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      handleSearch(1);
    }
  };

  return (
    <Paper component="form" sx={{ p: "10px", borderRadius: "1em" }}>
      <Box
        display={"flex"}
        justify-content={"space-evenly"}
        flexDirection={"row"}
        gap="0.5em"
      >
        <TextField
          sx={{ flex: 10 }}
          placeholder="Enter an address"
          inputProps={{ "aria-label": "search houses" }}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />
        <FormControl sx={{ flex: "3" }} fullWidth>
          <InputLabel id="loan-application-label">Loan Application</InputLabel>
          <Select
            labelId="loan-application-label"
            id="loan-application"
            value={loanApplication}
            onChange={(e) => setLoanApplication(e.target.value)}
          >
            {loanApplications.map((loan, index) => (
              <MenuItem value={index} key={index}>
                Application {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton
          type="button"
          sx={{ flex: "0.5", textAlign: "right" }}
          aria-label="search"
          onClick={validateSearch}
        >
          <SearchIcon />
        </IconButton>
      </Box>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Paper>
  );
};

export default HousesSearchBar;
