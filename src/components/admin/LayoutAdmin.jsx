import React, { useState } from "react";
import {
  AppstoreOutlined,
  ExceptionOutlined,
  HeartTwoTone,
  TeamOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, message, Avatar, Modal } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./layout.scss";
import { useDispatch, useSelector } from "react-redux";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";
import UserModalUpdate from "./user/UserModalUpdate";

const { Content, Sider } = Layout;

const items = [
  {
    label: <Link to="/admin">DashBoard</Link>,
    key: "DashBoard",
    icon: <AppstoreOutlined />,
  },
  {
    label: <span>Manage Users</span>,
    icon: <UserOutlined />,
    children: [
      {
        label: <Link to="/admin/user">CRUD</Link>,
        key: "crud",
        icon: <TeamOutlined />,
      },
      {
        label: "Files1",
        key: "file1",
        icon: <TeamOutlined />,
      },
    ],
  },
  {
    label: <Link to="/admin/book">Manage Books</Link>,
    key: "book",
    icon: <ExceptionOutlined />,
  },
  {
    label: <Link to="/admin/order">Manage Orders</Link>,
    key: "order",
    icon: <DollarCircleOutlined />,
  },
];

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };
  const [isOpenModalUpdateUser, setIsOpenModalUpdateUser] = useState(false);
  const handleOk = () => {
    setIsOpenModalUpdateUser(false);
  };
  const handleCancel = () => {
    setIsOpenModalUpdateUser(false);
  };
  const itemsDropdown = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setIsOpenModalUpdateUser(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: (
        <Link to="/" style={{ cursor: "pointer" }}>
          Trang chủ
        </Link>
      ),
      key: "dashboard",
    },
    {
      label: (
        <Link to="/history" style={{ cursor: "pointer" }}>
          Lịch sử mua hàng
        </Link>
      ),
      key: "history",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];
  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-admin">
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ height: 32, margin: 16, textAlign: "center" }}>Admin</div>
        <Menu
          defaultSelectedKeys={[activeMenu]}
          mode="inline"
          items={items}
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>
      <Layout>
        <div className="admin-header">
          <span>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </span>
          <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                    user.avatar
                  }`}
                ></Avatar>
                Welcome {user?.fullName}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Content>
          <Outlet />
          <Modal
            title="Basic Modal"
            width="60vw"
            open={isOpenModalUpdateUser}
            footer={() => <></>}
            maskClosable={false}
          >
            <UserModalUpdate
              user={user}
              setIsOpenModalUpdateUser={setIsOpenModalUpdateUser}
            />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
