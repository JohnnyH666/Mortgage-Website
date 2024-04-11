import React, { useState, useEffect } from "react";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fab,
  Typography,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import "react-toastify/dist/ReactToastify.css";
import NewUserBookingForm from "../components/NewUserBookingForm";

const UserBookings = () => {
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
  }, []);
  const [open, setOpen] = useState(false);
  //Handles click open for dialog form
  const handleClickOpen = () => {
    setOpen(true);
  };
  //Handles closing of dialog form
  const handleClose = () => {
    setOpen(false);
  };
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/appointment/get_all",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
      } catch (error) {
        toast.error("Error getting bookings!");
      }
    };
    if (token) {
      fetchBookings();
    }
  }, [token, open]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {bookings?.length == 0 ? (
        <Typography variant="h5" gutterBottom={3}>
          No Bookings Found... <br />
          Please make one by clicking the button below
        </Typography>
      ) : (
        <div>
          <Box
            sx={{
              textAlign: "center",
              marginTop: "3em",
              marginBottom: "2em",
              display: "flex",
              flexDirection: "column",
              gap: "0.5em",
            }}
          >
            <Typography variant="h2" fontWeight="bold">
              Bookings
            </Typography>
            <Typography variant="subtitle" fontWeight="bold">
              Make a booking with our own mortgage specialists!
            </Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Manager Email</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.manager_email}</TableCell>
                    <TableCell>
                      {dayjs(booking.time).format("MMMM D, YYYY h:mm A")}
                    </TableCell>
                    <TableCell>{booking.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleClickOpen}
          style={{ marginTop: "2em" }}
        >
          <AddIcon />
        </Fab>
        <NewUserBookingForm open={open} handleClose={handleClose} />
      </Box>

      <ToastContainer />
    </LocalizationProvider>
  );
};

export default UserBookings;
