import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Typography, Box, IconButton } from "@mui/material";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteABlogCat,
  getCategories,
  resetState,
} from "../features/bcategory/bcategorySlice";

const Blogcatlist = () => {
  const [open, setOpen] = useState(false);
  const [blogCatId, setBlogCatId] = useState("");

  const dispatch = useDispatch();

  // Open and Close Modal Handlers
  const showModal = (e) => {
    setOpen(true);
    setBlogCatId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getCategories());
  }, [dispatch]);

  const bCatState = useSelector((state) => state.bCategory.bCategories);

  const data1 = bCatState.map((category, index) => ({
    key: index + 1,
    name: category.title,
    action: (
      <>
        <Link
          to={`/admin/blog-category/${category._id}`}
          className="fs-3 text-primary"
        >
          <BiEdit />
        </Link>
        <IconButton
          sx={{ marginLeft: 3 }}
          color="error"
          onClick={() => showModal(category._id)}
        >
          <AiFillDelete />
        </IconButton>
      </>
    ),
  }));

  // Delete Blog Category
  const deleteBlogCategory = (categoryId) => {
    dispatch(deleteABlogCat(categoryId));
    setOpen(false);
    setTimeout(() => {
      dispatch(getCategories());
    }, 100);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom className="mb-4">
        Blog Categories
      </Typography>

      <Table
        sx={{
          minWidth: 650,
          border: "1px solid #ccc",
          borderRadius: 1,
          boxShadow: 2,
        }}
        aria-label="blog categories table"
      >
        <thead>
          <tr>
            <th>SNo</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data1.map((row,) => (
            <tr key={row.key}>
              <td>{row.key}</td>
              <td>{row.name}</td>
              <td>{row.action}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        open={open}
        onClose={hideModal}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-blog-category-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" id="delete-confirmation-modal">
            Are you sure you want to delete this blog category?
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              onClick={hideModal}
              sx={{ marginRight: 2 }}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteBlogCategory(blogCatId)}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Blogcatlist;
