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
import EditLoanPackageForm from "./EditLoanPackageForm";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import UserLoanPackageDetails from "./UserLoanPackageDetails";

const UserLoanPackageTable = ({ loanPackages }) => {
  const [open, setOpen] = useState(false);
  const [allLoanPackages, setallLoanPackages] = useState([]);
  const [currentpackages, setCurrentpackages] = useState(null);

  useEffect(() => {
    setallLoanPackages(loanPackages);
  }, [loanPackages]);

  const handleClickOpen = (packages, actionType) => {
    if (actionType === "edit") {
      console.log(packages);
      setCurrentpackages(packages);
      setOpen(true);
    }
    // Handle the delete action separately if needed
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    { field: "id", headerName: "Package ID", width: isMobile ? 70 : 130 },
    {
      field: "name",
      headerName: "Package Name",
      flex: isMobile ? 0.5 : 1,
      editable: false,
    },
    {
      field: "interest_rate",
      headerName: "Interest Rate (%)",
      flex: isMobile ? 0.5 : 1,
      editable: false,
    },
    {
      field: "details",
      headerName: "Details",
      sortable: false,
      flex: isMobile ? 0.5 : 1,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = () => {
          handleClickOpen(params.row, "edit");
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
              View Details
            </Button>
          </Box>
        );
      },
    },
  ];
  //If we find a repayment key inside loan package we add it to table view
  if (allLoanPackages[0]?.repayment) {
    columns.push({
      field: "repayment",
      headerName: "Calculated Repayment",
      flex: isMobile ? 0.5 : 1,
      editable: false,
      renderCell: (params) => (
        <div>
          {/* Adjust the value here */}$
          {parseInt(params.value).toLocaleString("en-US")}
        </div>
      ),
    });
  }

  return (
    <>
      {allLoanPackages.length === 0 ? (
        <Typography>No Applications Found!</Typography>
      ) : (
        <Box sx={{ height: 400, width: "75vw" }}>
          <DataGrid
            rows={allLoanPackages}
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
        <UserLoanPackageDetails
          open={open}
          handleClose={handleClose}
          packages={currentpackages}
        />
      </Dialog>
    </>
  );
};

export default UserLoanPackageTable;
