import * as React from "react";
import { Fab, Tooltip, Grid, Box, Paper, Typography } from "@mui/material";
import StaffBookingsTable from "../components/StaffBookingsTable";

//Main Page for Staff Loan Applications
function StaffBookings() {
  return (
    <div>
      <Box
        sx={{
          textAlign: "center",
          marginBottom: "2em",
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
        }}
      >
        <Typography variant="h2" fontWeight="bold">
          My Appointments
        </Typography>
        <Typography variant="subtitle" fontWeight="bold"></Typography>
      </Box>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Paper>
            <StaffBookingsTable />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default StaffBookings;
