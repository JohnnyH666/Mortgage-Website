import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "../App.css";

const StaffBookingTable = ({ Bookings }) => {
  const [open, setOpen] = useState(false);
  const [allBookings, setallBookings] = useState([]);
  const [currentBookings, setCurrentBookings] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [token, setToken] = useState("");

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    const day = date.toLocaleDateString(); // format the date as you need
    const hour = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0"); // add leading zero if necessary
    return `${day}, ${hour}:${minutes}`;
  };

  // UseEffect will check to see when the token changes, and adjust the header accordinginly
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userType = JSON.parse(localStorage.getItem("userType"));
    console.log(token, userType);
    if (token && userType) {
      setToken(token);
    }
  }, []);

  const bookings = [
    {
      from: new Date("01-16-2022"),
      to: new Date("01-27-2022"),
      middayCheckout: true,
    },
    {
      from: "06-25-2022",
      to: "07-03-2022",
      middayCheckout: false,
    },
  ];

  const handleDeleteConfirmation = (Bookings) => {
    setCurrentBookings(Bookings);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          "http://localhost:8000/appointment/get_all/",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setallBookings(result.data);
      } catch (error) {
        console.error("Error fetching  packags:", error);
      }
    };
    fetchData();
  }, [token]);

  const handleStatusChange = async (row, status) => {
    try {
      const result = await axios.put(
        `http://localhost:8000/appointment/status`,
        null,
        {
          params: {
            new_status: status,
            appointment_id: row.id,
          },
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setallBookings(
        allBookings.map((p) =>
          p.id === row.id ? { ...p, status: result.data.status } : p
        )
      );
      localStorage.setItem("reloadLocation", window.location.pathname);
    } catch (error) {
      console.error(
        `Error ${
          status === "approved" ? "approving" : "declining"
        } appointment:`,
        error
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    { field: "id", headerName: "Booking ID", width: isMobile ? 70 : 130 },
    {
      field: "customer_email",
      headerName: "Customer Email",
      flex: isMobile ? 0.5 : 1,
      editable: false,
    },
    {
      field: "time",
      headerName: "Booking time",
      flex: isMobile ? 0.5 : 1,
      editable: false,
      renderCell: (params) => {
        return formatDate(params.value); // use the formatDate function
      },
    },
    {
      field: "acceptAction",
      headerName: "Accept",
      sortable: false,
      flex: isMobile ? 0.5 : 1,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        if (
          params.row.status === "approved" ||
          params.row.status === "declined"
        ) {
          return <></>; // Return empty element if already approved or declined
        }
        return (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            textAlign={"center"}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleStatusChange(params.row, "approved")}
            >
              Accept
            </Button>
          </Box>
        );
      },
    },
    {
      field: "declineAction",
      headerName: "Decline",
      sortable: false,
      flex: isMobile ? 0.5 : 1,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        if (
          params.row.status === "approved" ||
          params.row.status === "declined"
        ) {
          return <></>; // Return empty element if already approved or declined
        }
        return (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            textAlign={"center"}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleStatusChange(params.row, "declined")}
            >
              Decline
            </Button>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Current Status",
      flex: isMobile ? 0.5 : 1,
      editable: false,
    },
  ];

  return (
    <>
      {allBookings.length === 0 ? (
        <Typography>No Applications Found!</Typography>
      ) : (
        <Box sx={{ height: 300, width: "160vh" }}>
          <DataGrid
            rows={allBookings}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            getRowClassName={(params) => {
              return params.row.status === "approved"
                ? "approvedRow"
                : params.row.status === "declined"
                ? "declinedRow"
                : "";
            }}
          />
        </Box>
      )}
    </>
  );
};

export default StaffBookingTable;
