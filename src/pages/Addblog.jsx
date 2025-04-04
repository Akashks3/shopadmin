import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { TextField, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { createBlogs, getABlog, resetState, updateABlog } from "../features/blogs/blogSlice";
import { getCategories } from "../features/bcategory/bcategorySlice";

const schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  category: yup.string().required("Category is Required"),
});

const AddBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[3];

  const [img, setImg] = useState([]);
  const bCatState = useSelector((state) => state.bCategory.bCategories);
  const blogState = useSelector((state) => state.blogs);

  const {
    isSuccess,
    isError,
    isLoading,
    createdBlog,
    blogName,
    blogDesc,
    blogCategory,
    blogImages,
    updatedBlog,
  } = blogState;

  useEffect(() => {
    if (getBlogId !== undefined) {
      dispatch(getABlog(getBlogId));
      setImg(blogImages);
    } else {
      dispatch(resetState());
    }
  }, [getBlogId]);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  useEffect(() => {
    if (isSuccess && createdBlog) {
      toast.success("Blog Added Successfully!");
    }
    if (isSuccess && updatedBlog) {
      toast.success("Blog Updated Successfully!");
      navigate("/admin/blog-list");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  useEffect(() => {
    formik.values.images = img;
  }, [img]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: blogName || "",
      description: blogDesc || "",
      category: blogCategory || "",
      images: img || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getBlogId !== undefined) {
        const data = { id: getBlogId, blogData: values };
        dispatch(updateABlog(data));
        dispatch(resetState());
      } else {
        dispatch(createBlogs(values));
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
        {getBlogId !== undefined ? "Edit" : "Add"} Blog
      </h3>

      <form onSubmit={formik.handleSubmit}>
        {/* Blog Title */}
        <TextField
          fullWidth
          label="Enter Blog Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          margin="normal"
        />

        {/* Category Select */}
        <FormControl fullWidth margin="normal" error={formik.touched.category && Boolean(formik.errors.category)}>
          <InputLabel>Blog Category</InputLabel>
          <Select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Blog Category"
          >
            <MenuItem value="">Select Blog Category</MenuItem>
            {bCatState.map((category, index) => (
              <MenuItem key={index} value={category.title}>
                {category.title}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{formik.touched.category && formik.errors.category}</FormHelperText>
        </FormControl>

        {/* Blog Description (Rich Text Editor) */}
        <ReactQuill
          theme="snow"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-3"
        />
        {formik.touched.description && formik.errors.description && (
          <div className="error">{formik.errors.description}</div>
        )}

        {/* Image Upload */}
        <div className="bg-white border-1 p-5 text-center mt-3">
          <Dropzone onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        {/* Display Uploaded Images */}
        <div className="showimages d-flex flex-wrap mt-3 gap-3">
          {img?.map((image, index) => (
            <div key={index} className="position-relative">
              <Button
                onClick={() => dispatch(delImg(image.public_id))}
                variant="contained"
                color="error"
                size="small"
                sx={{ position: "absolute", top: 10, right: 10 }}
              >
                X
              </Button>
              <img src={image.url} alt="" width={200} height={200} />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 3 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            `${getBlogId !== undefined ? "Edit" : "Add"} Blog`
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddBlog;
