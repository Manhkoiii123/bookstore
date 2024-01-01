import React, { useEffect, useState } from "react";
import InputSearchBook from "./InputSearchBook";
import {
  Button,
  Col,
  Popconfirm,
  Row,
  Table,
  Typography,
  message,
  notification,
} from "antd";
import { callDeleteBook, callGetBook } from "../../../services/api";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import moment from "moment/moment";
import BookViewDetail from "./BookViewDetail";
import BookCreate from "./BookCreate";
import BookUpdate from "./BookUpdate";
const BookTable = () => {
  const [listBooks, setListBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [filterSearch, setFilterSearch] = useState("");
  const [sort, setSort] = useState("&sort=-updatedAt");
  const [dataDetail, setDataDetail] = useState({});
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [openCreateBook, setOpenCreateBook] = useState(false);
  useEffect(() => {
    fetchBooks();
  }, [pageSize, current, filterSearch, sort]);
  const fetchBooks = async () => {
    setLoading(true);
    let params = `current=${current}&pageSize=${pageSize}`;
    if (sort) {
      params += `${sort}`;
    }
    if (filterSearch) {
      params += `${filterSearch}`;
    }
    const res = await callGetBook(params);
    if (res && res.data) {
      res.data.result.map((item) => {
        return (item.updatedAt = moment(item.updatedAt).format(
          "DD-MM-YYYY HH:mm:ss"
        ));
      });
      setListBooks(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };

  const handleSearch = (query) => {
    setCurrent(1);
    setFilterSearch(query);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1); //đưa về trang đầu
    }
    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `&sort=${sorter.field}`
          : `&sort=-${sorter.field}`;

      setSort(q);
    }
  };
  const handleDeleteBook = async (id) => {
    const res = await callDeleteBook(id);
    if (res && res.data) {
      message.success("Xóa Thành Công");
      await fetchBooks();
    } else {
      notification.error({
        message: "Xóa Thất Bại",
        description: res.message,
      });
    }
  };
  const [isOpenEditBook, setIsOpenEditBook] = useState(false);
  const [dataBookUpdate, setDataBookUpdate] = useState(null);
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            onClick={() => {
              setDataDetail(record);
              setOpenViewDetail(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <div style={{ display: "flex", gap: "5px" }}>
            <Popconfirm
              placement="leftTop"
              title="Xác nhận xóa quyển sách"
              description="Bạn có chắc chắn muốn xóa quyển sách này ? "
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteBook(record._id)}
            >
              <Button>
                <MdDelete color="red"></MdDelete>
              </Button>
            </Popconfirm>

            <Button
              onClick={() => {
                setIsOpenEditBook(true);
                setDataBookUpdate(record);
              }}
            >
              <CiEdit color="red"></CiEdit>
            </Button>
          </div>
        );
      },
    },
  ];
  const renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>Table Books</Typography>
        <div style={{}}>
          <Button type="primary" onClick={() => setOpenCreateBook(true)}>
            Add New
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearchBook handleSearch={handleSearch} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            className="def"
            columns={columns}
            dataSource={listBooks}
            onChange={onChange}
            rowKey="_id"
            loading={loading}
            pagination={{
              current: current,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showTotal: (total, range) => (
                <div>
                  {range[0]}-{range[1]} trên {total} rows
                </div>
              ),
            }}
          />
        </Col>
      </Row>
      <BookViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
      />
      <BookCreate
        openCreateBook={openCreateBook}
        setOpenCreateBook={setOpenCreateBook}
        fetchBooks={fetchBooks}
      />
      <BookUpdate
        isOpenEditBook={isOpenEditBook}
        setIsOpenEditBook={setIsOpenEditBook}
        dataBookUpdate={dataBookUpdate}
        setDataBookUpdate={setDataBookUpdate}
        fetchBooks={fetchBooks}
      />
    </div>
  );
};

export default BookTable;
