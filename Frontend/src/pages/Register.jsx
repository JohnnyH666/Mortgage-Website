import React, { useState } from "react";
import {
  Avatar,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
  Switch,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios"; // Make sure you have axios installed
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [isStaff, setIsStaff] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleSwitchChange = (event) => {
    setIsStaff(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password != confirmPassword) {
      console.log("THEY ARE NOT EQUAL");
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/register/?firstname=${firstName}&lastname=${lastName}&is_staff=${isStaff}`,
        {
          username: email,
          password: password,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response);
      // if Successful registration, user is navigated to login page and notified that login was successful
      alert("Registration Successful, Navigate to Login By Clicking Here!");
      navigate("/login");
    } catch (error) {
      //If error caught, show error to user via toast
      console.log(error.response.data);
      toast.error(error.response.data["detail"]);
    }
  };

  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: "50vw",
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "blue" };
  const btstyle = { margin: "8px 0" };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign Up</h2>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            rowGap={2}
            alignItems={"center"}
            alignContent={"center"}
          >
            <Grid container columnSpacing={1}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  placeholder="Enter First Name"
                  fullWidth
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  placeholder="Enter Last Name"
                  fullWidth
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
            </Grid>
            <TextField
              label="Email"
              placeholder="Enter email, it's your username"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              placeholder="Enter password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              error={password != confirmPassword}
              helperText={password != confirmPassword ? "Not matching" : ""}
              label="Confirm Password"
              placeholder="Confirm password"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Tooltip
              title="Please only click if registered banking personnel"
              arrow
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isStaff}
                    onChange={handleSwitchChange}
                    name="checkedStaff"
                  />
                }
                label="Are you a banking personnel?"
              />
            </Tooltip>
          </Grid>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={btstyle}
            fullWidth
          >
            Sign up
          </Button>
        </form>
        <Typography>
          {" "}
          Do you already have an account ?<br></br>
          <Link to="/login">Sign in here.</Link>
        </Typography>
      </Paper>
      <ToastContainer />
    </Grid>
  );
};

export default Register;
