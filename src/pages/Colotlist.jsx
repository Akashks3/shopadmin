import React, { useEffect, useState } from "react"; 
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteAColor, getColors } from "../features/color/colorSlice";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";

const Colorlist = () => {
  const [open, setOpen] = useState(false);
  const [colorId, setcolorId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setcolorId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);
  
  const colorState = useSelector((state) => state.color.colors);
  
  const data1 = colorState.map((color, index) => ({
    key: index + 1,
    Color: (
      <div className="col-3">
        <ul
          className="colors ps-0"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            marginBottom: "10px",
            backgroundColor: color.title,
          }}
        ></ul>
      </div>
    ),
    action: (
      <>
        <Link to={`/admin/color/${color._id}`} className="fs-3 text-danger">
          <BiEdit />
        </Link>
        <IconButton
          className="ms-3 fs-3 text-danger"
          onClick={() => showModal(color._id)}
        >
          <AiFillDelete />
        </IconButton>
      </>
    ),
  }));

  const deleteColor = (e) => {
    dispatch(deleteAColor(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getColors());
    }, 100);
  };

  return (
    <div>
      <h3 className="mb-4 title">Colors</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data1.map((row) => (
              <TableRow key={row.key}>
                <TableCell>{row.key}</TableCell>
                <TableCell>{row.Color}</TableCell>
                <TableCell>{row.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteColor(colorId);
        }}
        title="Are you sure you want to delete this color?"
      />
    </div>
  );
};

export default Colorlist;
