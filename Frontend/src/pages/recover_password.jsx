import React, { useState } from "react";
import { Avatar, Button, Grid, Paper, TextField } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Recover_password() {
  const paperStyle = {
    padding: 20,
    height: "40vh",
    width: 280,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "blue" };
  const btstyle = { margin: "8px 0" };

  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendRecoverEmail = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/forgot_password/${email}`
      );
      toast.success(res.data["message"]);
      handleClickOpen();
      console.log(res);
    } catch (error) {
      console.log("Error during login: " + error.response.data);
      toast.error(error.response.data["detail"]);
    }
  };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOpenIcon />
          </Avatar>
          <h2>Recover Password</h2>
          <p align="Left">Enter your existing email address:</p>
        </Grid>
        <TextField
          label="Email"
          placeholder="Enter email"
          fullWidth
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></TextField>
        <Button
          onClick={sendRecoverEmail}
          type="submit"
          color="primary"
          variant="contained"
          style={btstyle}
          fullWidth
        >
          Send Recovery Email
        </Button>
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Email Sent"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A recovery email has been sent to <b>{email}</b>. Please check your
            inbox.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Grid>
  );
}

export default Recover_password;
