import React, { useState } from "react"; 
import { LeftOutlined, OrderedListOutlined, RightOutlined} from "@ant-design/icons";
import { LuBox } from "react-icons/lu";
import { VscSignOut } from "react-icons/vsc";
import { RxDashboard } from "react-icons/rx";
import { IoAddCircle } from "react-icons/io5";

import { RiCustomerService2Fill } from "react-icons/ri";
import { RiCouponLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import { FaBloggerB } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt, BiUserCheck } from "react-icons/bi";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
              localStorage.clear();
              window.location.reload();
            } else {
              navigate(key);
            }
          }}
          items={[
            { key: "", icon: <RxDashboard className="fs-4" />, label: "Dashboard" },
            { key: "customers", icon: <RiCustomerService2Fill  className="fs-4" />, label: "Customers" },
            {
              key: "Catalog",
              icon: <BiCategoryAlt className="fs-4" />,
              label: "Catalog",
              children: [
                { key: "product", icon: <IoAddCircle className="fs-4" />, label: "Add Product" },
                { key: "list-product", icon: <OrderedListOutlined className="fs-4" />, label: "Product List" },
                { key: "brand", icon: <IoAddCircle className="fs-4" />, label: "Brand" },
                { key: "list-brand", icon:<OrderedListOutlined className="fs-4" />, label: "Brand List" },
                { key: "category", icon: <IoAddCircle className="fs-4" />, label: "Category" },
                { key: "list-category", icon: <OrderedListOutlined className="fs-4" />, label: "Category List" },
                { key: "color", icon: <IoAddCircle className="fs-4" />, label: "Color" },
                { key: "list-color", icon: <OrderedListOutlined className="fs-4" />, label: "Color List" }
              ]
            },
            { key: "orders", icon: <LuBox className="fs-4" />, label: "Orders" },
            {
              key: "marketing",
              icon: <RiCouponLine className="fs-4" />,
              label: "Marketing",
              children: [
                { key: "coupon", icon: <IoAddCircle className="fs-4" />, label: "Add Coupon" },
                { key: "coupon-list", icon: <OrderedListOutlined className="fs-4" />, label: "Coupon List" }
              ]
            },
            {
              key: "blogs",
              icon: <FaBloggerB className="fs-4" />,
              label: "Blogs",
              children: [
                { key: "blog", icon: <IoAddCircle className="fs-4" />, label: "Add Blog" },
                { key: "blog-list", icon: <OrderedListOutlined className="fs-4" />, label: "Blog List" },
                { key: "blog-category", icon: <IoAddCircle className="fs-4" />, label: "Add Blog Category" },
                { key: "blog-category-list", icon: <OrderedListOutlined className="fs-4" />, label: "Blog Category List" }
              ]
            },
            { key: "enquiries", icon: <BiUserCheck className="fs-4" />, label: "Enquiries" },
            { key: "signout", icon: <VscSignOut className="fs-4" />, label: "Sign Out" }
          ]}
        />
      </Sider>

      {/* Main Layout */}
      <Layout className="site-layout">
        {/* Header */}
        <Header className="d-flex justify-content-between ps-1 pe-5" style={{ padding: 0, background: colorBgContainer }}>
          {/* Toggle Sidebar */}
          {React.createElement(collapsed ? RightOutlined : LeftOutlined, {
            className: "trigger",
            onClick: () => setCollapsed(!collapsed)
          })}

    
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer
          }}
        >
          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />

          {/* Outlet for dynamic routes */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
