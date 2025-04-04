import React, { useEffect } from "react";
import { Table, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../features/cutomers/customerSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
  },
];

const Customers = () => {
  const dispatch = useDispatch();

  // State from the store
  const { customers, loading, error } = useSelector((state) => state.customer);

  // Fetch users data on component mount
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Handle loading and error state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    message.error("Failed to fetch customer data.");
    return <div>Error fetching customer data.</div>;
  }


  const data1 = customers
    .filter((customer) => customer.role !== "admin")
    .map((customer) => ({
      key: customer._id, 
      name: `${customer.firstname} ${customer.lastname}`,
      email: customer.email,
      mobile: customer.mobile,
    }));

  return (
    <div>
      <h3 className="mb-4 title">Customers</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Customers;
