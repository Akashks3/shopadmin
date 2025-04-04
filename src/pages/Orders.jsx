import React, { useEffect, useState } from "react"; 
import { Table, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getOrders, updateAOrder } from "../features/auth/authSlice";

const Orders = () => {
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true); // Loading state
  const orderState = useSelector((state) => state?.auth?.orders.orders);
  const orderLoading = useSelector((state) => state?.auth?.orders.loading); // Loading state for orders
  
  useEffect(() => {
    setLoading(true);
    dispatch(getOrders())
      .finally(() => setLoading(false));
  }, [dispatch]);

  const handleOrderStatusChange = (orderId, status) => {
    dispatch(updateAOrder({ id: orderId, status }))
      .then(() => {
        message.success("Order status updated successfully!");
      })
      .catch(() => {
        message.error("Failed to update order status!");
      });
  };

  const columns = [
    {
      title: "SNo",
      dataIndex: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Product",
      dataIndex: "product",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const dataSource = orderState?.map((order, index) => ({
    key: index + 1,
    name: order?.user?.firstname,
    product: (
      <Link to={`/admin/order/${order?._id}`}>View Orders</Link>
    ),
    amount: order?.totalPrice,
    date: new Date(order?.createdAt).toLocaleString(),
    action: (
      <select
        value={order?.orderStatus}
        onChange={(e) => handleOrderStatusChange(order?._id, e.target.value)}
        className="form-control form-select"
      >
        <option value="Ordered" disabled>
          Ordered
        </option>
        <option value="Processed">Processed</option>
        <option value="Shipped">Shipped</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
      </select>
    ),
  }));

  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>
      {loading || orderLoading ? ( // Show a loading spinner while data is loading
        <div className="d-flex justify-content-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={dataSource} />
      )}
    </div>
  );
};

export default Orders;
