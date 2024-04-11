import React from "react";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import blueBanner from "../assets/bluebanner.png";
import logo1 from "../assets/logo1.png";
import { Link } from "react-router-dom";

const HomeCustomer = () => {
  return (
    <div className="home-container">
      <Box
        flexDirection={"row"}
        display={{ xs: "none", sm: "none", md: "flex", lg: "block" }}
      >
        <Box
          className="home-image-container"
          style={{
            position: "relative",
            top: 0,
            left: 0,
            margin: 0,
            zIndex: 2,
            paddingTop: "0px",
            paddingLeft: "37.5vw",
          }}
        >
          <img src={logo1} alt="" style={{ width: "100%", height: "auto" }} />
        </Box>
        <div
          className="home-text-section"
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "4vw",
          }}
        >
          <h1
            className="primary-heading"
            style={{
              fontSize: "clamp(3rem, 2vw, 4rem)",
              color: "#4c4c4c",
              lineHeight: "5rem",
              maxWidth: "50vw",
              position: "absolute",
              top: 0,
              left: 0,
              margin: 0,
              zIndex: 2,
              paddingTop: "20vw",
              paddingLeft: "10vw",
              textAlign: "left",
            }}
          >
            Mortgage Mates
          </h1>
        </div>
      </Box>
      <Grid
        container
        spacing={5}
        rowGap={4}
        justifyContent="center"
        alignItems="center"
        marginTop={{ xs: "5em", md: "-6em" }}
      >
        <Grid item xs={12} md={4}>
          <Link to="/user-loan applications">
            <Card
              className="card-hover"
              sx={{
                height: 150,
                width: { xs: "80vw", sm: "auto" },
                textAlign: "center",
                margin: "0 auto",
              }}
            >
              <CardContent>
                <Typography variant="h6" style={{ marginBottom: "10px" }}>
                  User Loan Applications
                </Typography>
                <Typography variant="body2">
                  Submit a loan application based on your needs
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={12} md={4}>
          <Link to="/user-loan packages">
            <Card
              className="card-hover"
              sx={{
                height: 150,
                width: { xs: "80vw", sm: "auto" },
                textAlign: "center",
                margin: "0 auto",
              }}
            >
              <CardContent>
                <Typography variant="h6" style={{ marginBottom: "10px" }}>
                  User Loan Packages
                </Typography>
                <Typography variant="body2">
                  Browse through our loan packages
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={12} md={4}>
          <Link to="/user-bookings">
            <Card
              className="card-hover"
              sx={{
                height: 150,
                width: { xs: "80vw", sm: "auto" },
                textAlign: "center",
                margin: "0 auto",
              }}
            >
              <CardContent>
                <Typography variant="h6" style={{ marginBottom: "10px" }}>
                  User Bookings
                </Typography>
                <Typography variant="body2">
                  Book in an appointment with one of our banking professionals
                  to discuss your loan
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        <Grid
          container
          spacing={5}
          justifyContent={"center"}
          alignItems="center"
          marginLeft={"auto"}
        >
          <Grid item xs={12} md={4}>
            <Link to="/search-houses">
              <Card
                className="card-hover"
                sx={{
                  height: 150,
                  width: { xs: "80vw", sm: "auto" },
                  textAlign: "center",
                  margin: "0 auto",
                }}
              >
                <CardContent>
                  <Typography variant="h6" style={{ marginBottom: "10px" }}>
                    Search Homes
                  </Typography>
                  <Typography variant="body2">
                    Search through our database of homes to find one the best
                    suits you
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Link to="/loan-calculator">
              <Card
                className="card-hover"
                sx={{
                  height: 150,
                  width: { xs: "80vw", sm: "auto" },
                  textAlign: "center",
                  margin: "0 auto",
                }}
              >
                <CardContent>
                  <Typography variant="h6" style={{ marginBottom: "10px" }}>
                    Calculators
                  </Typography>
                  <Typography variant="body2">
                    Utilise our loan and loan limit calculator to estimate your
                    financial options
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <footer>
        <p>© 2023 Mortgage Mates. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomeCustomer;
