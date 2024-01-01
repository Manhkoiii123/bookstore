import React, { useEffect, useState } from "react";
import { callHistoryOrder } from "../../services/api";
import { Table, Tag, Typography } from "antd";
import moment from "moment";
import ReactJson from "react-json-view";
import { useSelector } from "react-redux";
const columns = [
  {
    title: "Stt",
    dataIndex: "stt",
    key: "stt",
    width: "10%",
  },
  {
    title: "Thời Gian ",
    dataIndex: "createdAt",
    key: "fullNcreatedAtame",
  },
  {
    title: "Tổng số tiền",
    dataIndex: "totalPrice",
    key: "totalPrice",
  },
  {
    title: "Trạng thái",
    key: "tags",
    dataIndex: "tags",
    render: (_, record) => {
      return (
        <Tag color="success" key={record.tags}>
          {record.tags}
        </Tag>
      );
    },
  },
  {
    title: "Chi tiết",
    key: "detail",
    width: "40%",
    render: (_, record) => {
      return (
        <ReactJson
          src={record.detail}
          collapsed={true}
          name="Chi tiết đơn mua"
        />
      );
    },
  },
];

const History = () => {
  const user = useSelector((state) => state.account.user);
  const id = user.id;
  const [listHistory, setListHistory] = useState([]);
  const fetchHistory = async () => {
    const res = await callHistoryOrder();
    if (res) {
      const data = res.data.map((item, index) => {
        return {
          stt: index + 1,
          createdAt: moment(item.createdAt).format("DD-MM-YYYY HH:mm:ss"),
          totalPrice: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(item.totalPrice),
          tags: "Thành Công",
          detail: item.detail,
        };
      });
      setListHistory(data);
    }
  };
  useEffect(() => {
    fetchHistory();
  }, [id]);
  //   console.log(listHistory);
  return (
    <div style={{ padding: "20px" }}>
      <Typography>Lịch sử mua hàng</Typography>
      <Table columns={columns} dataSource={listHistory} />
    </div>
  );
};

export default History;
