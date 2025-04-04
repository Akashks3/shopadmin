import React, { useEffect } from "react";
import { Table, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getaOrder } from "../features/auth/authSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Product Name",
    dataIndex: "name",
  },
  {
    title: "Brand",
    dataIndex: "brand",
  },
  {
    title: "Count",
    dataIndex: "count",
  },
  {
    title: "Color",
    dataIndex: "color",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
];

const ViewOrder = () => {
  const location = useLocation();
  const orderId = location.pathname.split("/")[3];
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state?.auth?.singleorder || {});

  useEffect(() => {
    if (orderId) {
      dispatch(getaOrder(orderId));
    }
  }, [orderId, dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    message.error("Failed to fetch order details.");
    return <div>Error fetching order data.</div>;
  }

  const data1 = orders?.orderItems?.map((item, index) => ({
    key: index + 1,
    name: item?.product?.title,
    brand: item?.product?.brand,
    count: item?.quantity,
    amount: item?.price,
    color: (
      <div className="col-3">
        <ul
          className="colors ps-0"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            marginBottom: "10px",
            backgroundColor: item?.color?.title,
          }}
        ></ul>
      </div>
    ),
  }));

  return (
    <div>
      <h3 className="mb-4 title">View Order</h3>
      <div>
        {data1?.length > 0 ? (
          <Table columns={columns} dataSource={data1} />
        ) : (
          <p>No order items available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewOrder;
