import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Define schema with yup for form validation
let schema = yup.object().shape({
  email: yup
    .string()
    .email("Email should be valid")
    .required("Email is Required"),
  password: yup.string().required("Password is Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Set up formik for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  const { isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      navigate("/admin");
    } else if (isError) {
      // Handle the error case
      console.error(message);
    }
  }, [isSuccess, isError, navigate, message]); // Only depend on success and error for navigation
  
  return (
    <Box 
      sx={{
        py: 5,  
        minHeight: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center"
      }}
    >
      <Box 
        sx={{
          width: "100%", 
          maxWidth: 400, 
          backgroundColor: "white",
          border:"2px", 
          borderRadius: 2, 
          p: 4
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
          Login to your account to continue.
        </Typography>
        
        {message && message === "Rejected" && (
          <Typography variant="body2" color="error" align="center">
            You are not an Admin
          </Typography>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
