import {
  Divider,
  Form,
  Input,
  Radio,
  Space,
  Typography,
  message,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import "../../pages/order/order.scss";
import { doDeleteAllBookByUserAction } from "../../redux/order/orderSlice";
import { useDispatch } from "react-redux";
import { callPlaceOrder } from "../../services/api";

const { TextArea } = Input;
const PaymentPage = ({ user, bookInCart, totalPrice, setCurrentStep }) => {
  const [form] = useForm();
  //select thanh toán
  const [valuePayment, setValuePayment] = useState(1);
  const onChangePayment = (e) => {
    setValuePayment(e.target.value);
  };
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    const detailOrder = bookInCart.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      };
    });
    const data = {
      name: values.usename,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: detailOrder,
    };
    const res = await callPlaceOrder(data);
    if (res && res.data) {
      setCurrentStep(2);
      dispatch(
        doDeleteAllBookByUserAction({
          user_id: user.id,
        })
      );
      bookInCart.map(async (item) => {
        // console.log(item);
        const data = {
          thumbnail: item.detail.thumbnail,
          slider: item.detail.slider,
          mainText: item.detail.mainText,
          author: item.detail.author,
          price: item.detail.price,
          sold: item.detail.sold + item.quantity,
          quantity: item.detail.quantity - item.quantity,
          category: item.detail.category,
        };
        await callUpdateBook(data, item._id);
        await fetchBooks();
      });
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  const init = {
    usename: user.fullName,
    email: user.email,
    phone: user.phone,
  };
  useEffect(() => {
    form.setFieldsValue(init);
  }, []);
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        labelCol={{ span: 24 }}
        label="Username"
        name="usename"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        label="Phone"
        name="phone"
        rules={[
          {
            required: true,
            message: "Please input your phone number!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        label="Địa chỉ"
        name="address"
        rules={[
          {
            required: true,
            message: "Please input your phone address!",
          },
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item name="payment">
        <Typography>Hình thức thanh toán</Typography>
        <Radio.Group onChange={onChangePayment} value={valuePayment}>
          <Space direction="vertical">
            <Radio value={1}>Thanh toán bằng tiền mặt</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
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
        // onClick={() => form.submit()}
        style={{ width: "100%" }}
        className="order-button"
      >
        Đặt hàng ({bookInCart.length})
      </button>
    </Form>
  );
};

export default PaymentPage;
