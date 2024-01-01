import { Button, Divider, Form, Input, message, notification } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./register.scss";
import { callLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlice";

const LoginPage = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async (values) => {
    const { email, password } = values;
    setIsLoading(true);
    const res = await callLogin(email, password);
    setIsLoading(false);
    if (res?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(doLoginAction(res.data.user));
      message.success("Đăng nhập thành công");
      nav("/");
    } else {
      notification.error({
        message: "Đăng nhập thất bại",
        description: res.message,
        duration: 3,
      });
    }
  };

  return (
    <div className="register-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng Nhập</h2>
              <Divider />
            </div>
            <Form
              name="basic"
              // style={{ maxWidth: 600, margin: '0 auto' }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              >
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Đăng Nhập
                </Button>
              </Form.Item>
              <Divider>Or</Divider>
              <p className="text text-normal">
                Chưa có tài khoản ?
                <span>
                  <Link to="/register"> Đăng Kí </Link>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
