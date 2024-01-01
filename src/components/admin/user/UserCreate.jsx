import { Divider, Form, Input, Modal, message, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { callCreateUser } from "../../../services/api";

const UserCreate = ({ isOpenCreateUser, setIsOpenCreateUser }) => {
  const [form] = useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const onFinish = async (values) => {
    const { fullName, password, email, phone } = values;
    setIsSubmit(true);
    const res = await callCreateUser(fullName, email, password, phone);
    if (res && res.data) {
      message.success("Thêm mới thành công");
      form.resetFields();
      setIsOpenCreateUser(false);
      setIsSubmit(false);
      await props.fetchUser();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };
  return (
    <Modal
      title="Tạo mới người dùng"
      open={isOpenCreateUser}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        form.resetFields();
        setIsOpenCreateUser(false);
        setIsSubmit(false);
      }}
      okText="Tạo mới"
      cancelText="Hủy"
      confirmLoading={isSubmit}
    >
      <Divider />
      <Form name="basic" form={form} onFinish={onFinish} autoComplete="off">
        <Form.Item
          labelCol={{ span: 24 }} //whole column
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Họ tên không được để trống!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }} //whole column
          label="Email"
          name="email"
          rules={[{ required: true, message: "Email không được để trống!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }} //whole column
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }} //whole column
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: true,
              message: "Số điện thoại không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreate;
