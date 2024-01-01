import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
const BookViewDetail = ({
  openViewDetail,
  setOpenViewDetail,
  dataDetail,
  setDataDetail,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    if (dataDetail) {
      let imgThumbnail = {},
        imgSlider = [];
      if (dataDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataDetail.thumbnail
          }`,
        };
      }
      if (dataDetail.slider && dataDetail.slider.length > 0) {
        dataDetail.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [dataDetail]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  return (
    <Drawer
      title={`Thông tin chi tiết quuyển sách có id = ${dataDetail._id}`}
      width="70vw"
      placement="right"
      onClose={() => {
        setOpenViewDetail(false);
      }}
      open={openViewDetail}
    >
      <Descriptions title="Thông tin chi tiết" bordered column={2}>
        <Descriptions.Item label="Id">{dataDetail._id}</Descriptions.Item>
        <Descriptions.Item label="Tên sách">
          {dataDetail.mainText}
        </Descriptions.Item>
        <Descriptions.Item label="Tác giả">
          {dataDetail.author}
        </Descriptions.Item>
        <Descriptions.Item label="Số Giá tiền">
          {dataDetail.price}
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng">
          {dataDetail.quantity}
        </Descriptions.Item>
        <Descriptions.Item label="Đã bán">{dataDetail.sold}</Descriptions.Item>

        <Descriptions.Item label="Thể loại" span={2}>
          <Badge status="processing" text={dataDetail.category}></Badge>
        </Descriptions.Item>
        <Descriptions.Item label="Created at">
          {moment(dataDetail.createdAt).format("DD-MM-YYYY HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="Updated at">
          {dataDetail.updatedAt}
        </Descriptions.Item>
      </Descriptions>
      <Divider orientation="left"> Ảnh Books </Divider>
      <>
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        ></Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
      </>
    </Drawer>
  );
};

export default BookViewDetail;
