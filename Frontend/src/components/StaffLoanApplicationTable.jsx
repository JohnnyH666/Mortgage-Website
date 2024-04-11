import React, { useState, useEffect } from "react";
import {
  Box,
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
  TextField,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import PreviewImageButton from "./PreviewImageButton";

const StaffLoanApplicationTable = () => {
  //Store the retrieved loan applications
  const [loanApplications, setLoanApplications] = useState([]);
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

  //Track mobile for responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [currentApplicationFiles, setCurrentApplicationFiles] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        "http://localhost:8000/get_all_loan_applications/",
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoanApplications(result.data);
    };
    fetchData();
  }, [token, open]);

  useEffect(() => {
    const getUserFiles = async (email) => {
      const result = await axios.get("http://localhost:8000/user_documents/", {
        params: {
          customer_email: currentApplication?.customer_email,
        },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(result);
      setCurrentApplicationFiles(result.data);
    };
    if (currentApplication) {
      getUserFiles(currentApplication?.customer_email);
    }
  }, [currentApplication]);

  const handleClickOpen = (application) => {
    setCurrentApplication(application);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetStatus = async (status) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/set_application_status/`,
        null,
        {
          params: {
            status,
            application_id: currentApplication.id,
          },
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Sucessfully updated application!");
      setToken(JSON.parse(localStorage.getItem("token")));
      setOpen(close);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.detail);
    }
  };

  const columns = [
    { field: "id", headerName: "Application ID", width: isMobile ? 70 : 130 },
    {
      field: "customer_email",
      headerName: "Customer Email",
      flex: isMobile ? 0.5 : 1,
      editable: false,
    },
    {
      field: "status",
      headerName: "Application Status",
      flex: isMobile ? 0.5 : 1,
      editable: false,
    },
    {
      field: "action",
      headerName: "Review",
      sortable: false,
      flex: isMobile ? 0.5 : 1,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = () => {
          handleClickOpen(params.row);
        };

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
              onClick={() => onClick()}
            >
              Review
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      {loanApplications.length === 0 ? (
        <Typography>No Applications Found!</Typography>
      ) : (
        <Box sx={{ height: 400, width: "80vw" }}>
          <DataGrid
            rows={loanApplications}
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
          />
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Application Review</DialogTitle>
        <DialogContent>
          <Grid container direction={"column"} rowGap={2}>
            <TextField
              label="Customer Email"
              value={currentApplication?.customer_email}
              fullWidth
              disabled
            />
            <TextField
              label="Number of Dependents Under 18"
              value={currentApplication?.num_depends_under_18}
              fullWidth
              disabled
            />
            <TextField
              label="Number of Dependents Over 18"
              value={currentApplication?.num_depends_over_18}
              fullWidth
              disabled
            />
            {currentApplication?.own_house ? (
              <TextField
                label="House Value"
                value={currentApplication?.house_value}
                fullWidth
                disabled
              />
            ) : (
              " "
            )}
            <TextField
              label="Income Partner"
              value={currentApplication?.income_partner}
              fullWidth
              disabled
            />
            <TextField
              label="Living Expenses"
              value={currentApplication?.living_expesnes}
              fullWidth
              disabled
            />
            <TextField
              label="Income Before Tax"
              value={currentApplication?.income_before_tax}
              fullWidth
              disabled
            />
            <TextField
              label="Other Income"
              value={currentApplication?.income_other}
              fullWidth
              disabled
            />
            <TextField
              label="Loan Repayment Expense"
              value={currentApplication?.loan_repayment_expense}
              fullWidth
              disabled
            />
            {currentApplicationFiles ? (
              <PreviewImageButton
                file={
                  currentApplicationFiles[currentApplicationFiles?.length - 1]
                }
                isStaff={true}
              />
            ) : (
              "Loading.."
            )}
            {currentApplicationFiles ? (
              <PreviewImageButton
                file={
                  currentApplicationFiles[currentApplicationFiles?.length - 2]
                }
                isStaff={true}
              />
            ) : (
              "Loading.."
            )}
            {/* {currentApplicationFiles ? <PreviewImageButton file={currentApplicationFiles[0]?.content}/> : "Loading.."} */}
            {/* <PreviewImageButton file={currentApplicationFiles[0]?.content}/> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          {currentApplication?.status === "pending" && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleSetStatus("approved")}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleSetStatus("declined")}
              >
                Decline
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default StaffLoanApplicationTable;
