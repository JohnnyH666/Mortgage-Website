import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import identity from "../assets/identity.jpg";
import bankstatement from "../assets/bankstatement.jpg";

const documentsInfo = {
  identity: {
    name: "Identity",
    description: `• The document must be government-issued and photo-bearing, such as a passport or driver's license.\n
       • Both the photo and any text or identifying information must be clearly visible, without any obstruction or blurring.\n
      • The document must be current and not expired.\n
      • The document should include your full name and date of birth.\n
      • The entire document should be in the frame, without any cropping or cutting off of edges.\n
      • File format must be JPEG or PDF.\n
      • File size should not exceed 1MB.\n
      • The document must be in colour, not black and white.\n
      • If the document has information on both sides (e.g. a driver's license), ensure to upload images of both sides.\n
      • Ensure the image of the document is straight and upright, not at
      `,
    exampleImg: identity,
  },
  bankStatement: {
    name: "Bank Statement",
    description: `• The document should be a PDF of your bank statement from the last three months. \n
      • The bank statement must clearly show your name, your bank's name, and your account number. \n
      • The bank statement must list all transactions for the period. \n
      • Ensure that all pages of the statement are included. \n
      • The file size must not exceed 5 MB.`,
    exampleImg: bankstatement,
  },
};

const DocumentationUploadInfo = ({ docType }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <InfoIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{`${documentsInfo[docType].name} Verification Upload`}</DialogTitle>
        <DialogContent sx={{}}>
          <Box
            component="div"
            sx={{
              whiteSpace: "pre-line",
              fontSize: "0.9em",
              lineHeight: "1em",
            }}
          >
            {documentsInfo[docType].description}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop={3}
          >
            <img
              src={documentsInfo[docType].exampleImg}
              alt={`${docType} example`}
              style={{ maxWidth: "100%", height: "400px" }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentationUploadInfo;
