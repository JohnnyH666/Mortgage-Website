import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const PreviewImage = ({ file, isStaff }) => {
  const [open, setOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [previewFile, setPreviewFile] = useState(null);
  console.log(file);
  useEffect(() => {
    if (typeof file?.content === "string") {
      if (isStaff == true) {
        console.log(file);
        if (file?.title.includes("pdf")) {
          setPreviewFile(`data:application/pdf;base64,${file?.content}`);
        } else {
          setPreviewFile(`data:application/jpeg;base64,${file?.content}`);
        }
      }
    } else if (file instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        setPreviewFile(reader.result);
      };
    }
  }, [file]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const isPDF = previewFile && previewFile.includes("data:application/pdf");
  console.log(previewFile);
  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Preview Image
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"File Preview"}</DialogTitle>
        <DialogContent>
          {isPDF ? (
            <Document file={previewFile} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
          ) : (
            <img
              src={previewFile}
              alt="Uploaded file"
              style={{ width: "100%", height: "auto" }}
            />
          )}
          {numPages && (
            <p>
              Page {pageNumber} of {numPages}
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PreviewImage;
