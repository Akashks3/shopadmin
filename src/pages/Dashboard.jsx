import React, { useEffect, useState, useMemo } from "react"; 
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
import { Column } from "@ant-design/plots";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getMonthlyData, getOrders, getYearlyData } from "../features/auth/authSlice";

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
    title: "Product Count",
    dataIndex: "product",
  },
  {
    title: "Total Price",
    dataIndex: "price",
  },
  {
    title: "Total Price After Discount",
    dataIndex: "dprice",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();

  // Selectors
  const monthlyDataState = useSelector((state) => state?.auth?.monthlyData);
  const yearlyDataState = useSelector((state) => state?.auth?.yearlyData);
  const orderState = useSelector((state) => state?.auth?.orders?.orders);

  const [dataMonthly, setDataMonthly] = useState([]);
  const [dataMonthlySales, setDataMonthlySales] = useState([]);
  const [orderData, setOrderData] = useState([]);

  // Authorization token
  const getTokenFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const config3 = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage?.token || ""}`,
      Accept: "application/json",
    },
  };

  // Fetching data
  useEffect(() => {
    dispatch(getMonthlyData(config3));
    dispatch(getYearlyData(config3));
    dispatch(getOrders(config3));
  }, [dispatch]);

  // Data processing for Monthly and Orders
  useEffect(() => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June", "July", 
      "August", "September", "October", "November", "December"
    ];

    const processMonthlyData = () => {
      let data = [], monthlyOrderCount = [];

      monthlyDataState?.forEach((element) => {
        const month = monthNames[element?._id?.month];
        data.push({ type: month, income: element?.amount });
        monthlyOrderCount.push({ type: month, income: element?.count });
      });

      setDataMonthly(data);
      setDataMonthlySales(monthlyOrderCount);
    };

    const processOrderData = () => {
      const data1 = orderState?.map((order, index) => ({
        key: index,
        name: `${order.user.firstname} ${order.user.lastname}`,
        product: order.orderItems?.length,
        price: order?.totalPrice,
        dprice: order?.totalPriceAfterDiscount,
        status: order?.orderStatus,
      }));
      setOrderData(data1);
    };

    processMonthlyData();
    processOrderData();
  }, [monthlyDataState, orderState]);

  // Reusable chart configuration
  const getChartConfig = (data) => ({
    data,
    xField: "type",
    yField: "income",
    color: () => "#ffd333",
    label: {
      position: "middle",
      style: { fill: "#FFFFFF", opacity: 1 },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: { alias: "Month" },
      sales: { alias: "Income" },
    },
  });

  const incomeChartConfig = useMemo(() => getChartConfig(dataMonthly), [dataMonthly]);
  const salesChartConfig = useMemo(() => getChartConfig(dataMonthlySales), [dataMonthlySales]);

  return (
    <div>
      <h3 className="mb-4 title">Dashboard</h3>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white rounded-3">
          <div>
            <p className="desc">Total Income</p>
            <h4 className="mb-0 sub-title">
              Rs.{yearlyDataState?.[0]?.amount || 0}
            </h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <p className="mb-0 desc">Income in Last Year from Today</p>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white rounded-3">
          <div>
            <p className="desc">Total Sales</p>
            <h4 className="mb-0 sub-title">
              {yearlyDataState?.[0]?.count || 0}
            </h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <p className="mb-0 desc">Sales in Last Year from Today</p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items gap-3">
        <div className="mt-4 flex-grow-1 w-50">
          <h3 className="mb-5 title">Income in Last Year from Today</h3>
          <Column {...incomeChartConfig} />
        </div>
        <div className="mt-4 flex-grow-1">
          <h3 className="mb-5 title">Sales in Last Year from Today</h3>
          <Column {...salesChartConfig} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-5 title">Recent Orders</h3>
        <Table columns={columns} dataSource={orderData} />
      </div>
    </div>
  );
};

export default Dashboard;
