import React, { useEffect } from "react";
import { TextField, Button, Box, FormHelperText } from "@mui/material"; 
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createColor,
  getAColor,
  resetState,
  updateAColor,
} from "../features/color/colorSlice";

let schema = yup.object().shape({
  title: yup.string().required("Color is Required"),
});

const Addcolor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getColorId = location.pathname.split("/")[3];
  const newColor = useSelector((state) => state.color);
  const {
    isSuccess,
    isError,
    createdColor,
    updatedColor,
    colorName,
  } = newColor;

  useEffect(() => {
    if (getColorId !== undefined) {
      dispatch(getAColor(getColorId));
    } else {
      dispatch(resetState());
    }
  }, [getColorId, dispatch]);

  useEffect(() => {
    if (isSuccess && createdColor) {
      toast.success("Color Added Successfully!");
    }
    if (isSuccess && updatedColor) {
      toast.success("Color Updated Successfully!");
      navigate("/admin/list-color");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, createdColor, updatedColor, navigate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: colorName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getColorId !== undefined) {
        const data = { id: getColorId, colorData: values };
        dispatch(updateAColor(data));
        dispatch(resetState());
      } else {
        dispatch(createColor(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getColorId !== undefined ? "Edit" : "Add"} Color
      </h3>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Color Input Field */}
          <TextField
            label="Enter Product Color"
            type="color"
            id="color"
            value={formik.values.title}
            onChange={formik.handleChange("title")}
            onBlur={formik.handleBlur("title")}
            variant="outlined"
            fullWidth
            size="small"
          />
          {formik.touched.title && formik.errors.title && (
            <FormHelperText error>{formik.errors.title}</FormHelperText>
          )}
          
      
          <Button
            variant="contained"
            color="info"
            type="submit"
            sx={{ borderRadius: 3, marginTop: 3 }}
          >
            {getColorId !== undefined ? "Edit" : "Add"} Color
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Addcolor;
