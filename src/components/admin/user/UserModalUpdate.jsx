import {
  Col,
  Row,
  Tabs,
  Button,
  message,
  Upload,
  Avatar,
  Form,
  Input,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  doUpdateUserInfoAction,
  doUploadAvatarAction,
} from "../../../redux/account/accountSlice";
import {
  callUpdateUserInfor,
  callUpdateUserPassword,
  callUploadAvatarImg,
} from "../../../services/api";
import { useForm } from "antd/es/form/Form";
const UserModalUpdate = ({ user, setIsOpenModalUpdateUser }) => {
  const dispatch = useDispatch();
  const tempAvatar = useSelector((state) => state.account.tempAvatar);
  //   const user = useSelector((state) => state.account.user);
  const [form] = useForm();
  const init = {
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
  };
  useEffect(() => {
    form.setFieldsValue(init);
  }, [user]);
  const [userAvtar, setUserAvatar] = useState(user?.avatar ?? "");
  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    const res = await callUploadAvatarImg(file);
    if (res && res.data) {
      const newAvatar = res.data.fileUploaded;
      dispatch(doUploadAvatarAction({ avatar: newAvatar }));
      setUserAvatar(newAvatar);
      onSuccess("ok");
    } else {
      onError("lỗi khi upload");
    }
  };
  const propsUpload = {
    name: "file",
    // action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    customRequest: handleUploadAvatar,
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(` file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(` file upload failed.`);
      }
    },
  };
  const onChange = (key) => {
    console.log(key);
  };
  const onFinish = async (values) => {
    const data = {
      _id: user.id,
      phone: values.phone,
      fullName: values.fullName,
      avatar: userAvtar,
    };
    const res = await callUpdateUserInfor(data);
    if (res && res.data) {
      message.success("Update thành công user");
      dispatch(
        doUpdateUserInfoAction({
          avatar: userAvtar,
          phone: values.phone,
          fullName: values.fullName,
        })
      );
      setIsOpenModalUpdateUser(false);
      localStorage.removeItem("access_token");
    } else {
      notification.error({
        message: "Update thất bại",
        description: res.message,
      });
    }
  };

  const [form2] = useForm();
  const init2 = {
    email: user.email,
  };
  useEffect(() => {
    form2.setFieldsValue(init2);
  }, []);
  const onFinish2 = async (values) => {
    const data = {
      email: values.email,
      oldpass: values.password,
      newpass: values.newPassword,
    };
    const res = await callUpdateUserPassword(data);
    if (res && res.data) {
      message.success("Update mật khẩu thành công");
      form2.setFieldValue("password", "");
      form2.setFieldValue("newPassword", "");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  const items = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: (
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={`${
                  import.meta.env.VITE_BACKEND_URL
                }/images/avatar/${tempAvatar}`}
              />
              <Upload {...propsUpload}>
                <Button icon={<UploadOutlined />}>Upload avatar</Button>
              </Upload>
            </div>
          </Col>
          <Col span={12}>
            <Form
              form={form}
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
                label="Tên hiển thị"
                name="fullName"
                rules={[
                  { required: true, message: "Tên không được để trống!" },
                ]}
              >
                <Input />
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
              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              >
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: (
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <Form
              form={form2}
              name="basic"
              // style={{ maxWidth: 600, margin: '0 auto' }}
              onFinish={onFinish2}
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
                label="Mật khẩu hiện tại"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu hiện tại không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu mới không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              >
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default UserModalUpdate;
