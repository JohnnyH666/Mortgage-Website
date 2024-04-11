import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// The Login component
const Login = ({ token, setToken, userType, setUserType }) => {
  // Set up username and password states to hold input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: "50vw",
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "blue" };
  const btstyle = { margin: "8px 0" };

  useEffect(() => {
    if (token && userType) {
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("userType", JSON.stringify(userType));
      localStorage.setItem("userName", JSON.stringify(username));
    }
  }, [token, userType]);

  // Function to handle login when button is clicked
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // Send a post request to the server for token validation
      const response = await axios.post(
        `http://localhost:8000/token`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // If the request is successful, store the token and userType in localStorage
      setToken(response.data.access_token);
      setUserType(response.data.usertype);
    } catch (error) {
      // Log any error that occurs during the request
      console.log("Error during login: " + error.response.data);
      toast.error(error.response.data["detail"]);
    }
  };

  useEffect(() => {
    if (userType === "staffs") {
      navigate("/home");
    } else if (userType === "customers") {
      navigate("/home-customer");
    }
  }, [userType, navigate]);

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign in</h2>
        </Grid>
        <form onSubmit={handleLogin}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            rowGap={2}
          >
            <TextField
              label="Email"
              placeholder="Enter email"
              fullWidth
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              placeholder="Enter password"
              type="password"
              fullWidth
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={btstyle}
              fullWidth
            >
              Sign in
            </Button>
          </Grid>
        </form>
        <Typography>
          <Link to="/recover_password">Forgot password?</Link>
        </Typography>
        <Typography>
          {" "}
          Don't have an account ?<Link to="/register">Sign up?</Link>
        </Typography>
      </Paper>
      <ToastContainer />
    </Grid>
  );
};

export default Login;
