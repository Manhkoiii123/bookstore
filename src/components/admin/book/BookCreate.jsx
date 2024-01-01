import { PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  theme,
  Select,
  Upload,
  message,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import {
  callCreateBook,
  callUploadBookImg,
  getAllCategory,
} from "../../../services/api";

const BookCreate = ({ openCreateBook, setOpenCreateBook, fetchBooks }) => {
  const [form] = useForm();
  const { token } = theme.useToken();
  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };
  //select cate
  const onChange = (value) => {
    // console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    // console.log("search:", value);
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const onChangeInputNumber = (value) => {
    // console.log("changed", value);
  };

  //upload thumbnail
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpenThumbnail, setPreviewOpenThumbnail] = useState(false);
  const [previewImageThumbnail, setPreviewImageThumbnail] = useState("");
  const [previewTitleThumbnail, setPreviewTitleThumbnail] = useState("");
  const [fileListThumbnail, setFileListThumbnail] = useState([]);
  const handleCancelThumbnail = () => setPreviewOpenThumbnail(false);
  const handlePreviewThumbnail = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImageThumbnail(file.url || file.preview);
    setPreviewOpenThumbnail(true);
    setPreviewTitleThumbnail(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChangeThumbnail = ({ fileList: newFileList }) =>
    setFileListThumbnail(newFileList);
  const uploadButtonThumbnail = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  //upload slider
  const [previewOpenSlider, setPreviewOpenSlider] = useState(false);
  const [previewImageSlider, setPreviewImageSlider] = useState("");
  const [previewTitleSlider, setPreviewTitleSlider] = useState("");
  const [fileListSlider, setFileListSlider] = useState([]);
  const handleCancelSlider = () => setPreviewOpenSlider(false);
  const handlePreviewSlider = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImageSlider(file.url || file.preview);
    setPreviewOpenSlider(true);
    setPreviewTitleSlider(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChangeSlider = ({ fileList: newFileList }) =>
    setFileListSlider(newFileList);
  const uploadButtonSlider = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const [dataThumbnail, setDataThumbnail] = useState([]);
  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);

    if (res && res.data) {
      setDataThumbnail([
        {
          name: res.data.fileUploaded, //tên ảnh be trả về
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra khi upload file");
    }
  };
  const [dataSlider, setDataSlider] = useState([]);
  //file nafy laf thu vien cho
  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBookImg(file);
    if (res && res.data) {
      setDataSlider((prev) => [
        ...prev,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra khi upload file");
    }
  };
  //lấy all category

  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    const res = await getAllCategory();
    if (res && res.data) {
      setCategories(res.data);
    } else {
      setCategories([]);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const options = categories.map((c) => {
    return {
      value: c,
      label: c,
    };
  });
  const onFinish = async (values) => {
    const { mainText, author, price, sold, quantity, category } = values;
    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((i) => i.name);
    const data = {
      thumbnail,
      slider,
      mainText,
      author,
      price,
      sold,
      quantity,
      category,
    };
    const res = await callCreateBook(data);
    if (res && res.data) {
      message.success("Thêm mới thành công 1 quyển sách");
      form.resetFields();
      setDataThumbnail({});
      setDataSlider([]);
      setFileListSlider([]);
      setFileListThumbnail([]);
      setOpenCreateBook(false);
      await fetchBooks();
    } else {
      notification.error({
        message: "Thêm mới thất bại",
        description: res.message,
      });
    }
  };
  //dùng set lại stsate sau khi uplaod mà xóa đi
  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") setDataThumbnail([]);
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };
  return (
    <Modal
      width="60vw"
      title="Tạo mới quyển sách"
      open={openCreateBook}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        setDataThumbnail({});
        setDataSlider([]);
        form.resetFields();
        setFileListSlider([]);
        setFileListThumbnail([]);
        setOpenCreateBook(false);
        // setIsSubmit(false);
      }}
      okText="Tạo mới"
      cancelText="Hủy"
      //   confirmLoading={isSubmit}
    >
      <Divider />
      <Form
        form={form}
        name="advanced_search"
        style={formStyle}
        onFinish={onFinish}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              name={`mainText`}
              label={`Tên sách`}
              rules={[
                { required: true, message: "Tên sách không được để trống!" },
              ]}
            >
              <Input placeholder="Enter mainText " />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              name={`author`}
              label={`Tác giả`}
              rules={[
                { required: true, message: "Tác giả không được để trống!" },
              ]}
            >
              <Input placeholder="Enter author" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[12, 12]}>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              name={`price`}
              label={`Giá tiền`}
              rules={[
                { required: true, message: "Giá tiền không được để trống!" },
              ]}
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={onChangeInputNumber}
                addonAfter="VND"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              name={`category`}
              label={`Thể loại`}
              rules={[
                { required: true, message: "Thể loại không được để trống!" },
              ]}
            >
              <Select
                showSearch
                allowClear
                placeholder="Select a category"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={filterOption}
                options={options}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              width="100%"
              labelCol={{ span: 24 }} //whole column
              name={`quantity`}
              label={`Số lượng`}
              rules={[
                { required: true, message: "Số lượng không được để trống!" },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              name={`sold`}
              label={`Đã bán`}
              rules={[
                { required: true, message: "Đã bán không được để trống!" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              name={`thumbnail`}
              label={`Ảnh Thumbnail`}
            >
              <Upload
                customRequest={handleUploadFileThumbnail}
                listType="picture-card"
                fileList={fileListThumbnail}
                onPreview={handlePreviewThumbnail}
                onChange={handleChangeThumbnail}
                onRemove={(file) => handleRemoveFile(file, "thumbnail")}
              >
                {fileListThumbnail.length >= 1 ? null : uploadButtonThumbnail}
              </Upload>
              <Modal
                open={previewOpenThumbnail}
                title={previewTitleThumbnail}
                footer={null}
                onCancel={handleCancelThumbnail}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImageThumbnail}
                />
              </Modal>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }} //whole column
              name={`slider`}
              label={`Ảnh slider`}
            >
              <Upload
                customRequest={handleUploadFileSlider}
                listType="picture-card"
                fileList={fileListSlider}
                onPreview={handlePreviewSlider}
                onChange={handleChangeSlider}
                onRemove={(file) => handleRemoveFile(file, "slider")}
              >
                {fileListSlider.length >= 8 ? null : uploadButtonSlider}
              </Upload>
              <Modal
                open={previewOpenSlider}
                title={previewTitleSlider}
                footer={null}
                onCancel={handleCancelSlider}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImageSlider}
                />
              </Modal>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BookCreate;
