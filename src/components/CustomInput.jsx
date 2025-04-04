import React from "react";
import TextField from "@mui/material/TextField";

const CustomInput = (props) => {
  const { type, label, i_id, i_class, name, val, onChng, onBlr } = props;
  
  return (
    <TextField
      type={type}
      label={label}
      id={i_id}
      name={name}
      value={val}
      onChange={onChng}
      onBlur={onBlr}
      variant="outlined"
      fullWidth
      className={i_class} 
    />
  );
};

export default CustomInput;
