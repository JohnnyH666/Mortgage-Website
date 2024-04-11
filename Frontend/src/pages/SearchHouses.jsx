import React, { useEffect, useState } from "react";
import axios from "axios";
import HousesSearchBar from "../components/HousesSearchBar";
import HouseCard from "../components/HouseCard";
import {
  Box,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
  Paper,
  Alert,
  AlertTitle,
} from "@mui/material";

const SearchHouses = () => {
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

  const [address, setAddress] = useState("");
  const [loanApplication, setLoanApplication] = useState("");
  const [loanApplications, setLoanApplications] = useState([]);
  const [homes, setHomes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getLoanApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/get_all_applications/",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoanApplications(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    if (token) {
      getLoanApplications();
    }
  }, [token]);

  const handleSearch = async (page = page) => {
    setLoading(true);
    console.log(loanApplication);
    try {
      const response = await axios.get(`http://localhost:8000/home_recommend`, {
        params: {
          page: page,
          location: address,
          application_id: loanApplications[loanApplication.id],
        },
      });
      setHomes(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    console.log(value);
    setPage(value);
    handleSearch(value);
  };

  return (
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
          House Search
        </Typography>
        <Typography variant="subtitle" fontWeight="bold">
          Find your dream house!
        </Typography>
      </Box>
      <HousesSearchBar
        address={address}
        setAddress={setAddress}
        loanApplication={loanApplication}
        setLoanApplication={setLoanApplication}
        handleSearch={handleSearch}
        loanApplications={loanApplications}
      />
      <Box padding={"3em"}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {loanApplication !== "" ? (
              <Box
                textAlign={"center"}
                justifyContent={"center"}
                alignItems={"center"}
                display={"flex"}
                marginBottom={"2em"}
              >
                <Alert severity="success">
                  <AlertTitle>Nice we got your application!</AlertTitle>
                  Using your selected <b>loan application </b>our search will be
                  looking for homes with your pre-approved amount of: <br></br>
                  <Typography variant="h6">
                    $
                    {parseInt(
                      loanApplications[loanApplication].loan_limit
                    ).toLocaleString("en-US")}
                  </Typography>
                </Alert>
              </Box>
            ) : (
              <></>
            )}
            <Grid container direction={"row"} gap={"25px"}>
              {homes.map((home, index) => (
                <Grid item xs={12} key={index}>
                  <HouseCard house={home} />
                </Grid>
              ))}
            </Grid>
            {homes.length > 0 && (
              <Paper
                sx={{
                  padding: 1,
                  marginTop: "3em",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  count={5}
                  page={page}
                  siblingCount={0}
                  boundaryCount={1}
                  onChange={handlePageChange}
                />
              </Paper>
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default SearchHouses;
