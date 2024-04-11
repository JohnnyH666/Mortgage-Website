import React, { useState, useEffect } from "react";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const MyProfile = () => {
  const [user, setUser] = useState({}); // filler data
  const [userType, setUserType] = useState("");
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  // UseEffect will check to see when the token changes, and adjust the header accordinginly
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userType = JSON.parse(localStorage.getItem("userType"));
    const userName = JSON.parse(localStorage.getItem("userName"));
    console.log(token, userType);
    if (token && userType) {
      setToken(token);
      setUserType(userType);
      setUser({
        userName: userName,
        userType: userType,
      });
    }
  }, [token]);
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const bodyParameters = {
      old_password: oldPassword,
      new_password: newPassword,
    };
    //Make request to change password
    try {
      const response = await axios.post(
        "http://localhost:8000/change_password/",
        bodyParameters,
        config
      );
      toast.success(response.data["message"]);
      console.log(response.data["message"]);
      //Close only when sucessfully password changed
      setOpen(false);
    } catch (error) {
      // Log any error that occurs during the request
      console.log(
        "Error during reset password: " + error.response.data["detail"]
      );
      toast.error(error.response.data["detail"]);
    }
    // clear password fields
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleClickShowPassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 280,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#1976D2" };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AccountCircleIcon />
          </Avatar>
          <h2>My Profile</h2>
        </Grid>
        <Grid
          container
          direction="column"
          rowGap={2}
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            margin="dense"
            label="User Name"
            type="text"
            fullWidth
            value={user.userName}
            disabled
          />
          <TextField
            margin="dense"
            label="User Type"
            type="text"
            fullWidth
            value={user.userType}
            disabled
          />
          <Grid style={{ marginTop: "90%" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              fullWidth
            >
              Reset Password
            </Button>
          </Grid>
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To reset your password, please enter your current password and
              your new password.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Old Password"
              type={showPassword.old ? "text" : "password"}
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleClickShowPassword("old")}>
                      {showPassword.old ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="dense"
              label="New Password"
              type={showPassword.new ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleClickShowPassword("new")}>
                      {showPassword.new ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="dense"
              label="Confirm New Password"
              type={showPassword.confirm ? "text" : "password"}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("confirm")}
                    >
                      {showPassword.confirm ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleResetPassword} color="primary">
              Reset Password
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
      <ToastContainer />
    </Grid>
  );
};

export default MyProfile;
