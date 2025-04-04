import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  TextField,
  Button,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import {
  createCategory,
  getAProductCategory,
  resetState,
  updateAProductCategory,
} from "../features/pcategory/pcategorySlice";

let schema = yup.object().shape({
  title: yup.string().required("Category Name is Required"),
});

const AddCategory = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getPCatId = location.pathname.split("/")[3];

  const newCategory = useSelector((state) => state.pCategory);
  const {
    isSuccess,
    isError,
    isLoading,
    createdCategory,
    categoryName,
    updatedCategory,
  } = newCategory;

  // Fetch the category if editing
  useEffect(() => {
    if (getPCatId !== undefined) {
      dispatch(getAProductCategory(getPCatId));
    } else {
      dispatch(resetState());
    }
  }, [getPCatId]);

  // Handle success and error states
  useEffect(() => {
    if (isSuccess && createdCategory) {
      toast.success("Category Added Successfully!");
    }
    if (isSuccess && updatedCategory) {
      toast.success("Category Updated Successfully!");
      navigate("/admin/list-category");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: categoryName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getPCatId !== undefined) {
        const data = { id: getPCatId, pCatData: values };
        dispatch(updateAProductCategory(data));
        dispatch(resetState());
      } else {
        dispatch(createCategory(values));
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
        {getPCatId !== undefined ? "Edit" : "Add"} Category
      </h3>
      <form onSubmit={formik.handleSubmit}>
        {/* TextField for category title */}
        <TextField
          fullWidth
          label="Enter Product Category"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          variant="outlined"
          margin="normal"
        />

        {/* Button for submitting the form */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            `${getPCatId !== undefined ? "Edit" : "Add"} Category`
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddCategory;
