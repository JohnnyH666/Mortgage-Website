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

const StaffLoanPackageTable = ({ loanPackages, refreshKey, setRefreshKey }) => {
  const [open, setOpen] = useState(false);
  const [allLoanPackages, setallLoanPackages] = useState([]);
  const [currentpackages, setCurrentpackages] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  //Refresh key to track times to refresh the fetchData for loan packages.
  const [token, setToken] = useState("");

  const handleDeleteConfirmation = (packages) => {
    setCurrentpackages(packages);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userType = JSON.parse(localStorage.getItem("userType"));
    console.log(token, userType);
    if (token && userType) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          "http://localhost:8000/loan_package/get_all/",
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        setallLoanPackages(result.data);
      } catch (error) {
        console.error("Error fetching loan packages:", error);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/loan_package/{loan_package_id}",
        {
          params: {
            id: currentpackages.id,
          },
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setallLoanPackages(
        allLoanPackages.filter((packages) => packages.id !== currentpackages.id)
      );
      setCurrentpackages(null);
      setDeleteDialogOpen(false);
      setRefreshKey((oldKey) => oldKey + 1);
    } catch (error) {
      console.error("Error deleting loan package:", error);
    }
  };

  const handleClickOpen = (packages, actionType) => {
    if (actionType === "edit") {
      console.log(packages);
      setCurrentpackages(packages);
      setOpen(true);
    }
    if (actionType === "delete") {
      handleDeleteConfirmation(packages);
    }
    // Handle the delete action separately if needed
  };

  const handleClose = () => {
    setOpen(false);
    setRefreshKey((oldKey) => oldKey + 1);
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
      field: "editAction",
      headerName: "Edit",
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
              Edit
            </Button>
          </Box>
        );
      },
    },
    {
      field: "deleteAction",
      headerName: "Delete",
      sortable: false,
      flex: isMobile ? 0.5 : 1,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = () => {
          handleClickOpen(params.row, "delete");
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
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      {allLoanPackages.length === 0 ? (
        <Typography>No Applications Found!</Typography>
      ) : (
        <Box sx={{ height: 400, width: "80vw" }}>
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
        <EditLoanPackageForm
          open={open}
          handleClose={handleClose}
          packages={currentpackages}
        />
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this package?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StaffLoanPackageTable;

// <>
//   <TableContainer component={Paper}>
//     <Table sx={{ minWidth: 650 }} aria-label="simple table">
//       <TableHead>
//         <TableRow>
//           <TableCell>Package ID</TableCell>
//           <TableCell>Customer Name</TableCell>
//           <TableCell></TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {loanPackages.map((packages) => (
//           <TableRow
//             key={packages.id}
//             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//           >
//             <TableCell>{packages.id}</TableCell>
//             <TableCell>{packages.customerName}</TableCell>
//             <TableCell>
//               <Button variant="outlined" color="primary" onClick={() => handleClickOpen(packages)}>
//                 Edit Customer Package
//               </Button>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
