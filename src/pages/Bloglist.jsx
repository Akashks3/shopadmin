import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Typography, Box, IconButton } from "@mui/material";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteABlog, getBlogs, resetState } from "../features/blogs/blogSlice";
import { delImg } from "../features/upload/uploadSlice";

const Bloglist = () => {
  const [open, setOpen] = useState(false);
  const [blogId, setBlogId] = useState("");

  const dispatch = useDispatch();

  // Open and Close Modal Handlers
  const showModal = (id) => {
    setOpen(true);
    setBlogId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getBlogs());
  }, [dispatch]);

  const getBlogState = useSelector((state) => state.blogs.blogs);

  // Preparing data for Table
  const data1 = getBlogState.map((blog, index) => ({
    key: index + 1,
    name: blog.title,
    category: blog.category,
    action: (
      <>
        <Link to={`/admin/blog/${blog.id}`} className="fs-3 text-primary">
          <BiEdit />
        </Link>
        <IconButton
          sx={{ marginLeft: 3 }}
          color="error"
          onClick={() => showModal(blog._id)}
        >
          <AiFillDelete />
        </IconButton>
      </>
    ),
  }));

  // Delete Blog Function
  const deleteBlog = (id) => {
    dispatch(deleteABlog(id));
    dispatch(delImg(id));
    setOpen(false);
    setTimeout(() => {
      dispatch(getBlogs());
    }, 100);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom className="mb-4">
        Blogs List
      </Typography>

      <Table
        sx={{
          minWidth: 650,
          border: "1px solid #ccc",
          borderRadius: 1,
          boxShadow: 2,
        }}
        aria-label="blogs list"
      >
        <thead>
          <tr>
            <th>SNo</th>
            <th>Title</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data1.map((row) => (
            <tr key={row.key}>
              <td>{row.key}</td>
              <td>{row.name}</td>
              <td>{row.category}</td>
              <td>{row.action}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Delete Confirmation */}
      <Modal
        open={open}
        onClose={hideModal}
        aria-labelledby="delete-blog-modal"
        aria-describedby="delete-blog-description"
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
          <Typography variant="h6" id="delete-blog-modal">
            Are you sure you want to delete this blog?
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
              onClick={() => deleteBlog(blogId)}
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

export default Bloglist;
