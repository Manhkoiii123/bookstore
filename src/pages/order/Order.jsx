import {
  Col,
  Divider,
  InputNumber,
  Row,
  Empty,
  Steps,
  Form,
  Input,
  Typography,
  Radio,
  Space,
  Result,
  Button,
  message,
} from "antd";
import "./order.scss";
import { SmileOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  doDeleteAction,
  doUpdateCartAction,
} from "../../redux/order/orderSlice";
import PaymentPage from "../../components/book/PaymentPage";
import { Link } from "react-router-dom";

const ViewOrder = () => {
  const user = useSelector((state) => state.account.user);
  const id = user.id;
  const carts = useSelector((state) => state.order.carts);
  const [bookInCart, setBookInCart] = useState([]);
  const dispatch = useDispatch();
  const [quantityInCart, setQuantityInCart] = useState();
  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    const listBookInCartById = carts.filter((item) => item.user_id === id);
    setBookInCart(listBookInCartById || []);
    setQuantityInCart(listBookInCartById.length || 0);
  }, [id, carts]);
  const totalPrice = bookInCart?.reduce((total, acc) => {
    return (total += acc.detail.price * acc.quantity);
  }, 0);
  const handleOnChangeInput = (value, book) => {
    if (value === 0) {
      dispatch(
        doDeleteAction({
          quantity: 0,
          detail: book,
          _id: book._id,
          user_id: id,
        })
      );
    }
    if (!value && value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({
          quantity: value,
          detail: book,
          _id: book._id,
          user_id: id,
        })
      );
    }
  };

  const handleDelete = (book) => {
    dispatch(
      doDeleteAction({
        quantity: 0,
        detail: book,
        _id: book._id,
        user_id: id,
      })
    );
  };
  const handleBuy = () => {
    setCurrentStep(1);
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={24} md={24}>
            <div className="order-book" style={{ width: "100%" }}>
              <Steps
                size="default"
                current={currentStep}
                items={[
                  {
                    title: "Đơn hàng",
                  },
                  {
                    title: "Đặt hàng",
                  },
                  {
                    title: "Thanh toán",
                  },
                ]}
              />
            </div>
          </Col>

          {currentStep !== 2 && (
            <>
              <Col md={18} xs={24}>
                {bookInCart.length > 0 &&
                  bookInCart.map((item) => {
                    return (
                      <div className="order-book">
                        <div className="book-content">
                          <img
                            src={`${
                              import.meta.env.VITE_BACKEND_URL
                            }/images/book/${item.detail.thumbnail}`}
                          />
                          <div className="title">{item.detail.mainText}</div>
                          <div className="price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.detail.price)}
                          </div>
                        </div>
                        <div className="action">
                          <div className="quantity">
                            <InputNumber
                              value={item.quantity}
                              onChange={(value) =>
                                handleOnChangeInput(value, item)
                              }
                            />
                          </div>
                          <div className="sum">
                            Tổng:{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.detail.price * item.quantity)}
                          </div>
                          <DeleteOutlined onClick={() => handleDelete(item)} />
                        </div>
                      </div>
                    );
                  })}
                {bookInCart.length === 0 && (
                  <div
                    className="order-book"
                    style={{ justifyContent: "center" }}
                  >
                    <Empty
                      imageStyle={{ height: 120 }}
                      description={
                        <span style={{ color: "#cccccc" }}>
                          Không có sản phẩm trong giỏ hàng
                        </span>
                      }
                    />
                  </div>
                )}
              </Col>
              <Col md={6} xs={24}>
                <div className="order-sum">
                  {currentStep === 0 && (
                    <>
                      <div className="calculate">
                        <span> Tạm tính</span>
                        <span>
                          {" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(totalPrice)}
                        </span>
                      </div>
                      <Divider style={{ margin: "10px 0" }} />
                      <div className="calculate">
                        <span> Tổng tiền</span>
                        <span className="sum-final">
                          {" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(totalPrice)}
                        </span>
                      </div>
                      <Divider style={{ margin: "10px 0" }} />
                      <button
                        disabled={bookInCart.length === 0}
                        className="order-button"
                        onClick={() => handleBuy()}
                      >
                        Mua Hàng ({bookInCart.length})
                      </button>
                    </>
                  )}
                  {currentStep === 1 && (
                    <PaymentPage
                      user={user}
                      bookInCart={bookInCart}
                      totalPrice={totalPrice}
                      setCurrentStep={setCurrentStep}
                    ></PaymentPage>
                  )}
                </div>
              </Col>
            </>
          )}

          {currentStep === 2 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Result
                icon={<SmileOutlined />}
                title="Thanh Toán Thành Công!"
                extra={[
                  <Button type="primary" key="console">
                    <Link to="/history">Xem lịch sử mua hàng</Link>
                  </Button>,
                  <Button key="buy">
                    <Link to="/">Trang chủ</Link>
                  </Button>,
                ]}
              />
            </div>
          )}
        </Row>
      </div>
    </div>
  );
};

export default ViewOrder;
