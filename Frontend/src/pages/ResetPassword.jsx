import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const paperStyle = {
    padding: 20,
    height: "40vh",
    width: 280,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "blue" };
  const btstyle = { margin: "8px 0" };
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/login");
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/reset_password/",
        { new_password: password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      toast.success(res.data.message);
      handleClickOpen();
    } catch (error) {
      toast.error(error.response.data.detail);
    }
  };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOpenIcon />
          </Avatar>
          <h2>Reset Your Password</h2>
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          rowGap={2}
        >
          <TextField
            label="New Password"
            type="password"
            placeholder="Enter new password"
            fullWidth
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            fullWidth
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword}
            helperText={
              password !== confirmPassword ? "Passwords do not match" : ""
            }
          />
          <Button
            onClick={handleSubmit}
            type="submit"
            color="primary"
            variant="contained"
            style={btstyle}
            fullWidth
          >
            Submit
          </Button>
        </Grid>
      </Paper>
      <ToastContainer />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Password Reset Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your password has been reset. Please click the button below to login
            with your new password.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Go to Login</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ResetPassword;
