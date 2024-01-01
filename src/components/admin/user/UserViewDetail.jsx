import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment/moment";
import React from "react";

const UserViewDetail = (props) => {
  const { dataDetail, setDataDetail, openViewDetail, setOpenViewDetail } =
    props;

  return (
    <Drawer
      title={`Thông tin chi tiết người dùng có id = ${dataDetail._id}`}
      width="50vw"
      placement="right"
      onClose={() => setOpenViewDetail(false)}
      open={openViewDetail}
    >
      <Descriptions title="Thông tin chi tiết" bordered column={2}>
        <Descriptions.Item label="Id">{dataDetail._id}</Descriptions.Item>
        <Descriptions.Item label="Tên hiển thị">
          {dataDetail.fullName}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{dataDetail.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {dataDetail.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Role" span={2}>
          <Badge status="processing" text={dataDetail.role}></Badge>
        </Descriptions.Item>
        <Descriptions.Item label="Created at">
          {moment(dataDetail.createdAt).format("DD-MM-YYYY HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="Update at">
          {dataDetail.updatedAt}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default UserViewDetail;
