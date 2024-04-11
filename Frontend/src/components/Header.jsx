import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import mainLogo from "../assets/logo.png";

const theme = createTheme({
  palette: {
    darkblue: {
      main: "#023047",
      contrastText: "#fff",
    },
    lightblue: {
      main: "#8ecae6",
      contrastText: "#fff",
    },
  },
});

const StyledAppBar = styled(AppBar)`
  flex-grow: 1;
  position: fixed;
  top: 0;
  z-index: 9999;
  width: 100%;
`;

const StyledMenuButton = styled(IconButton)`
  margin-right: 2px;
`;

const StyledTypography = styled(Typography)`
  flex-grow: 1;
`;

const StyledDrawer = styled(Drawer)`
  width: 250px;
  flex-shrink: 0;
`;

const Header = ({ token, setToken, userType, setUserType }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userType = JSON.parse(localStorage.getItem("userType"));
    console.log(token, userType);
    if (token && userType) {
      setToken(token);
      setUserType(userType);
    }
  }, [token]);

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const staffLinks = [
    "Home",
    "Staff Loan Applications",
    "Staff Loan Packages",
    "Staff Bookings",
  ];

  const customerLinks = [
    "Home Customer",
    "User Loan Applications",
    "User Loan Packages",
    "User Bookings",
    "Search Houses",
  ];

  const initialLinks = ["Login", "Register"];
  let links = initialLinks;

  if (token) {
    links = userType === "staffs" ? staffLinks : customerLinks;
  }

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.setItem("token", "");
    localStorage.setItem("userType", "");
    localStorage.clear();
    setToken("");
    setUserType("");
    navigate("/");
  };

  const [state, setState] = useState({
    open: false,
  });

  const toggleDrawer = (open) => (event) => {
    setState({ open });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openCalculatorMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {[...links, "Loan Limit", "Loan Calculator"].map((link, index) => (
          <ListItem
            key={index}
            component={Link}
            to={`/${link.toLowerCase().replace(" ", "-")}`}
          >
            <ListItemText primary={link} />
          </ListItem>
        ))}
        {token && (
          <ListItem component={Link} to="/my-profile">
            <ListItemText primary="My Profile" />
          </ListItem>
        )}
        {token && (
          <ListItem button>
            <ListItemText
              component={Button}
              primary="Logout"
              onClick={handleLogout}
            />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <StyledAppBar>
      <Toolbar>
        {isMobile && (
          <React.Fragment>
            <StyledMenuButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </StyledMenuButton>
            <StyledDrawer
              anchor="left"
              open={state.open}
              onClose={toggleDrawer(false)}
            >
              {list()}
            </StyledDrawer>
          </React.Fragment>
        )}
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <Box>
            {!isMobile &&
              links.map((link, index) => (
                <Button
                  color="inherit"
                  component={Link}
                  to={`/${link.toLowerCase().replace(" ", "-")}`}
                  key={index}
                  sx={{ fontSize: "12px" }}
                >
                  {link}
                </Button>
              ))}
            {!isMobile && token && userType === "customers" && (
              <React.Fragment>
                <Button
                  color="inherit"
                  aria-controls="calculator-menu"
                  aria-haspopup="true"
                  aria-expanded={openCalculatorMenu ? "true" : undefined}
                  onClick={handleMenuClick}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ fontSize: "12px" }}
                >
                  Calculators
                </Button>
                <Menu
                  id="calculator-menu"
                  anchorEl={anchorEl}
                  open={openCalculatorMenu}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    "aria-labelledby": "calculators-button",
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/loan-calculator"
                    onClick={handleMenuClose}
                  >
                    Loan Calculator
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/loan-limit"
                    onClick={handleMenuClose}
                  >
                    Loan Limit
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </Box>
          <Box display={"flex"} gap={1}>
            <ThemeProvider theme={theme}>
              {!isMobile && token && (
                <Button
                  color="darkblue"
                  variant="contained"
                  component={Link}
                  to="/my-profile"
                  sx={{ fontSize: "12px", fontWeight: "800" }}
                >
                  My Profile
                </Button>
              )}
              {!isMobile && token && (
                <Button
                  color="darkblue"
                  variant="contained"
                  onClick={handleLogout}
                  sx={{ fontSize: "12px", fontWeight: "800" }}
                >
                  Logout
                </Button>
              )}
            </ThemeProvider>
          </Box>
        </Grid>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
