import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Box,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";

const NewUserBookingForm = ({ open, handleClose }) => {
  const [userType, setUserType] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userType = JSON.parse(localStorage.getItem("userType"));
    console.log(token, userType);
    if (token && userType) {
      setToken(token);
      setUserType(userType);
    }
  }, []);

  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(
    staff.length ? staff[0].email : ""
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/staff/get_all")
      .then((res) => {
        setStaff(res.data);
      })
      .catch((error) => {
        toast.error("Error fetching staff details!");
      });
  }, []);

  function combineDateAndTime(date, time) {
    return dayjs(date)
      .hour(dayjs(time).hour())
      .minute(dayjs(time).minute())
      .toDate();
  }

  const handleSubmit = () => {
    const bookingData = {
      time: dayjs(combineDateAndTime(selectedDate, selectedTime)).format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
      manager_email: selectedStaff,
    };
    console.log(bookingData);
    axios
      .post("http://localhost:8000/appointment/create", bookingData, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Booking created successfully!");
        setSelectedStaff("");
        setSelectedDate(null);
        setSelectedTime(null);
        handleClose();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error creating booking! " + error.response?.data.detail);
      });
  };

  const disableUnavailableHours = (time) => {
    const hour = dayjs(time).hour();
    return hour < 9 || hour >= 17;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Booking</DialogTitle>
        <DialogContent style={{ padding: "2em" }}>
          <Box display={"flex"} flexDirection={"column"} gap={3}>
            <FormControl>
              <InputLabel>Staff Member</InputLabel>
              <Select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                style={{ width: "300px" }}
                fullWidth
              >
                {staff.map((s) => (
                  <MenuItem value={s.email}>{s.firstname}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedStaff && (
              <DatePicker
                style={{ width: "300px" }}
                label="Select Date"
                inputVariant="outlined"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                disablePast
                fullWidth
              />
            )}
            {selectedDate && (
              <TimePicker
                style={{ width: "300px" }}
                label="Select Time"
                inputVariant="outlined"
                value={selectedTime}
                minutesStep={60}
                onChange={(time) => setSelectedTime(time)}
                ampm={false}
                shouldDisableTime={disableUnavailableHours}
                fullWidth
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </LocalizationProvider>
  );
};

export default NewUserBookingForm;
