import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Box,
  CardActionArea,
} from "@mui/material";
import styled from "styled-components";
import HotelIcon from "@mui/icons-material/Hotel";
import WcIcon from "@mui/icons-material/Wc";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeIcon from "@mui/icons-material/Home";
import { StyledEngineProvider } from "@mui/material";

const StyledCard = styled(Card)`
  max-width: 50vw;
  margin: auto;
  position: relative;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  transition: 0.3s;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  background-image: url(data:image/png;base64,${(props) => props.imageUrl});
  background-position: center;
  background-size: cover;
  height: 0;
  padding-bottom: 56.25%;
`;

const StyledCardContent = styled(CardContent)`
  text-align: left;
`;

const StyledIconButton = styled(IconButton)`
  color: #000;
`;

function HouseCard({ house }) {
  const {
    images,
    price,
    short_address,
    suburb,
    bedrooms,
    bathrooms,
    parking_spaces,
    property_type,
    url,
  } = house;
  const handleCardClick = () => {
    window.open(url, "_blank");
  };

  return (
    <StyledEngineProvider injectFirst>
      <StyledCard sx={{ borderRadius: "20px" }}>
        <CardActionArea onClick={handleCardClick}>
          <ImageContainer imageUrl={images ? images : ""} />
          <StyledCardContent>
            <Typography gutterBottom variant="h5" component="h2">
              ${parseInt(price).toLocaleString("en-US")}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {short_address}, {suburb}
            </Typography>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Box display="flex" alignItems="center">
                  <StyledIconButton>
                    <HotelIcon fontSize="small" />
                  </StyledIconButton>
                  <Typography variant="subtitle2">{bedrooms}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box display="flex" alignItems="center">
                  <StyledIconButton>
                    <WcIcon fontSize="small" />
                  </StyledIconButton>
                  <Typography variant="subtitle2">{bathrooms}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box display="flex" alignItems="center">
                  <StyledIconButton>
                    <DirectionsCarIcon fontSize="small" />
                  </StyledIconButton>
                  <Typography variant="subtitle2">{parking_spaces}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box display="flex" alignItems="center">
                  <StyledIconButton>
                    <HomeIcon fontSize="small" />
                  </StyledIconButton>
                  <Typography variant="subtitle2">
                    {property_type.charAt(0).toUpperCase() +
                      property_type.slice(1)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </StyledCardContent>
        </CardActionArea>
      </StyledCard>
    </StyledEngineProvider>
  );
}

export default HouseCard;
