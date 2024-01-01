import { Divider, Form, Input, Modal, message, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { callUpdateUser } from "../../../services/api";
import { useDispatch, useSelector } from "react-redux";
import {
  doLoginAction,
  doLogoutAction,
} from "../../../redux/account/accountSlice";

const UserUpdate = ({
  isOpenEditUser,
  setIsOpenEditUser,
  dataUserUpdate,
  setDataUserUpdate,
  fetchUser,
}) => {
  const [form] = useForm();
  const user = useSelector((state) => state.account.user);
  //   console.log(dataUserUpdate);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    form.setFieldsValue(dataUserUpdate);
  }, [dataUserUpdate]);
  const onFinish = async (values) => {
    setLoading(true);
    const { fullName, phone } = values;
    const data = {
      _id: dataUserUpdate._id,
      fullName: fullName,
      phone: phone,
    };
    const res = await callUpdateUser(data);
    if (res && res.data) {
      message.success("Update thành công");
      form.resetFields();
      setIsOpenEditUser(false);
      const NewUser = {
        ...dataUserUpdate,
        fullName: fullName,
        phone,
      };
      if (
        dataUserUpdate.role === "ADMIN" &&
        user.email === dataUserUpdate.email
      ) {
        dispatch(doLogoutAction());
        dispatch(doLoginAction(NewUser));
      }
      setLoading(false);
      await fetchUser();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  return (
    <Modal
      title="Cập nhật người dùng"
      open={isOpenEditUser}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        setIsOpenEditUser(false);
        setDataUserUpdate([]);
      }}
      okText="Update"
      cancelText="Cancel"
      maskClosable={false}
      confirmLoading={loading}
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
        >
          <Input disabled />
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

export default UserUpdate;
