import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import recover_password from "./recover_password";
import blueBanner from "../assets/bluebanner.png";
import logo1 from "../assets/logo1.png";

const Home = () => {
  return (
    <div className="home-container">
      <div
        className="home-banner-container"
        style={{
          flexDirection: "column-reverse",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="home-bannerImage-container"
          style={{
            marginLeft: "55vw",
            marginTop: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <img src={blueBanner} alt="" />
        </div>
        <div
          className="home-image-container"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            margin: 0,
            zIndex: 2,
            paddingTop: "0px",
            paddingLeft: "37.5vw",
            float: "right",
          }}
        >
          <img src={logo1} alt="" />
        </div>
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
          <footer>
            <p>© 2023 Mortgage Mates. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home;
