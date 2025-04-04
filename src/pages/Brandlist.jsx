import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Modal, Box, Button, IconButton } from "@mui/material";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteABrand, getBrands, resetState } from "../features/brand/brandSlice";

const Brandlist = () => {
  const [open, setOpen] = useState(false);
  const [brandId, setBrandId] = useState("");
  const dispatch = useDispatch();

  // Open and Close Modal Handlers
  const showModal = (id) => {
    setOpen(true);
    setBrandId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(resetState());
    dispatch(getBrands());
  }, [dispatch]);

  const brandState = useSelector((state) => state.brand.brands);

  // Preparing data for Table
  const data1 = brandState.map((brand, index) => ({
    key: index + 1,
    name: brand.title,
    action: (
      <>
        <Link to={`/admin/brand/${brand._id}`} className="fs-3 text-primary">
          <BiEdit />
        </Link>
        <IconButton
          sx={{ marginLeft: 3 }}
          color="error"
          onClick={() => showModal(brand._id)}
        >
          <AiFillDelete />
        </IconButton>
      </>
    ),
  }));

  // Delete Brand Function
  const deleteBrand = (id) => {
    dispatch(deleteABrand(id));
    setOpen(false);
    setTimeout(() => {
      dispatch(getBrands());
    }, 100);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom className="mb-4">
        Brands List
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
          <Typography variant="h6">
            Are you sure you want to delete this brand?
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button onClick={hideModal} sx={{ marginRight: 2 }} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button onClick={() => deleteBrand(brandId)} variant="contained" color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Brandlist;
