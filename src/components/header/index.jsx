import React, { useEffect, useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Divider, Badge, Drawer, message, Popover, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Space, Avatar } from "antd";
import { useNavigate } from "react-router";
import { callLogout } from "../../services/api";
import "./header.scss";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { Link } from "react-router-dom";
import { convertSlug } from "../../utils/helper";
import UserModalUpdate from "../admin/user/UserModalUpdate";

const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantityInCart, setQuantityInCart] = useState();
  const id = user.id;
  const carts = useSelector((state) => state.order.carts);
  const [bookInCart, setBookInCart] = useState([]);

  useEffect(() => {
    const listBookInCartById = carts.filter((item) => item.user_id === id);
    setBookInCart(listBookInCartById);
    setQuantityInCart(listBookInCartById.length || 0);
  }, [id, carts]);
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
  let items = [
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
  if (user?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }
  const nav = useNavigate();
  const handleRedirectBook = (book) => {
    const slug = convertSlug(book.mainText);
    nav(`book/${slug}?id=${book._id}`);
  };
  const content = () => {
    return (
      <>
        {bookInCart &&
          bookInCart.map((item) => {
            return (
              <div
                onClick={() => handleRedirectBook(item.detail)}
                style={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "flex-start",
                  gap: 10,
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    item.detail.thumbnail
                  }`}
                  style={{ width: 40, height: 40 }}
                />
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    justifyContent: "flex-start",
                  }}
                >
                  <div>{item.detail.mainText}</div>
                  <div>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.detail.price)}
                  </div>
                </div>
              </div>
            );
          })}

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              padding: "5px 8px",
              outline: "none",
              backgroundColor: "#f05d40",
              border: "none",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => nav("/order")}
          >
            Xem giỏ hàng
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              ☰
            </div>
            <div className="page-header__logo">
              <span className="logo" onClick={() => navigate("/")}>
                <FaReact className="rotate icon-react" /> ManhTd
                <VscSearchFuzzy className="icon-search" />
              </span>
              <input
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Popover
                  placement="bottomRight"
                  title="Giỏ hàng"
                  content={content}
                >
                  <Badge count={quantityInCart} size={"small"}>
                    <FiShoppingCart className="icon-cart" />
                  </Badge>
                </Popover>
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}> Tài Khoản</span>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <Avatar
                          size={20}
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/avatar/${user.avatar}`}
                        ></Avatar>
                        Welcome {user?.fullName}
                      </Space>
                    </a>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />

        <p onClick={() => handleLogout()}>Đăng xuất</p>
        <Divider />
      </Drawer>
      <Modal
        title="Cập nhật thông tin"
        width="60vw"
        open={isOpenModalUpdateUser}
        footer={() => <></>}
        maskClosable={false}
        onCancel={handleCancel}
      >
        <UserModalUpdate
          user={user}
          setIsOpenModalUpdateUser={setIsOpenModalUpdateUser}
        />
      </Modal>
    </>
  );
};

export default Header;
