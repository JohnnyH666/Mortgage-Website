import { TextField } from "@mui/material";
import React from "react";
import { InputAdornment } from "@mui/material";

function FormInputGroupLimit({
  text,
  icon,
  placeholder,
  value,
  onInput,
  onkeyup,
  readOnly = false,
  prop,
  label,
}) {
  return (
    <div>
      <TextField
        margin="dense"
        fullWidth
        label={label}
        type="number"
        value={value}
        placeholder={placeholder}
        onInput={onInput}
        onKeyUp={onkeyup}
        readOnly={readOnly}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{prop}</InputAdornment>
          ),
        }}
      />
    </div>
  );
}

export default FormInputGroupLimit;
