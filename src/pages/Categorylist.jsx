import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, Box, Button, IconButton } from "@mui/material";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAProductCategory, getCategories, resetState } from "../features/pcategory/pcategorySlice";

const Categorylist = () => {
  const [open, setOpen] = useState(false);
  const [pCatId, setpCatId] = useState("");
  const dispatch = useDispatch();

  // Open and Close Modal Handlers
  const showModal = (id) => {
    setOpen(true);
    setpCatId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getCategories());
  }, [dispatch]);

  const pCatStat = useSelector((state) => state.pCategory.pCategories);

  // Preparing data for Table
  const data1 = pCatStat.map((category, index) => ({
    key: index + 1,
    name: category.title,
    action: (
      <>
        <Link to={`/admin/category/${category._id}`} className="fs-3 text-primary">
          <BiEdit />
        </Link>
        <IconButton sx={{ marginLeft: 3 }} color="error" onClick={() => showModal(category._id)}>
          <AiFillDelete />
        </IconButton>
      </>
    ),
  }));

  // Delete Category Function
  const deleteCategory = (id) => {
    dispatch(deleteAProductCategory(id));
    setOpen(false);
    setTimeout(() => {
      dispatch(getCategories());
    }, 100);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom className="mb-4">
        Product Categories
      </Typography>

      <TableContainer>
        <Table sx={{ minWidth: 650, border: "1px solid #ccc", borderRadius: 1, boxShadow: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>SNo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data1.map((row) => (
              <TableRow key={row.key}>
                <TableCell>{row.key}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Delete Confirmation */}
      <Modal open={open} onClose={hideModal}>
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
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this Product Category?
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button onClick={hideModal} sx={{ marginRight: 2 }} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button onClick={() => deleteCategory(pCatId)} variant="contained" color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Categorylist;
