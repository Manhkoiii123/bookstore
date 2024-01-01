import React, { useEffect, useState } from "react";
import {
  Button,
  Popconfirm,
  Table,
  Typography,
  message,
  notification,
} from "antd";
import { Row, Col } from "antd";
import InputSearch from "./InputSearch";
import { callDeleteUser, callUser } from "../../../services/api";
import { MdDelete } from "react-icons/md";
import UserViewDetail from "./UserViewDetail";
import UserCreate from "./UserCreate";
import UserUpload from "./UserUpload";
import * as XLSX from "xlsx";
import { CiEdit } from "react-icons/ci";
import UserUpdate from "./UserUpdate";
const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPagesize] = useState(5);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dataDetail, setDataDetail] = useState({});

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, filterSearch, sort]);
  const fetchUser = async () => {
    setIsLoading(true);
    let params = `current=${current}&pageSize=${pageSize}`;
    if (filterSearch) {
      params += `${filterSearch}`;
    }
    if (sort) {
      params += `${sort}`;
    }
    const res = await callUser(params);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleSearch = (query) => {
    setCurrent(1);
    setFilterSearch(query);
  };

  //export execl
  const handleExportData = () => {
    if (listUser.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(listUser);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "ExportDataUser.xlsx");
    }
  };
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [isOpenCreateUser, setIsOpenCreateUser] = useState(false);
  const [isOpenUploadUser, setIsOpenUploadUser] = useState(false);
  const [isOpenEditUser, setIsOpenEditUser] = useState(false);
  const [dataUserUpdate, setDataUserUpdate] = useState({});
  const handleDeleteUser = async (uid) => {
    const res = await callDeleteUser(uid);
    if (res && res.data) {
      message.success("Xóa Thành Công");
      await fetchUser();
    } else {
      notification.error({
        message: "Xóa Thất Bại",
        description: res.message,
      });
    }
  };

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
      title: "Tên hiển thị",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <div style={{ display: "flex", gap: "5px" }}>
            <Popconfirm
              placement="leftTop"
              title="Xác nhận xóa người dùng"
              description="Bạn có chắc chắn muốn xóa user này ? "
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteUser(record._id)}
            >
              <Button>
                <MdDelete color="red"></MdDelete>
              </Button>
            </Popconfirm>

            <Button
              onClick={() => {
                setIsOpenEditUser(true);
                setDataUserUpdate(record);
              }}
            >
              <CiEdit color="red"></CiEdit>
            </Button>
          </div>
        );
      },
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPagesize(pagination.pageSize);
      setCurrent(1); //đưa về trang đầu
    }
    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `&sort=${sorter.field}`
          : `&sort=-${sorter.field}`;

      setSort(q);
    }
    if (sorter.order === undefined) {
      setSort("");
    }
  };
  const renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>Table list User</Typography>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="primary" onClick={() => handleExportData()}>
            Export
          </Button>
          <Button type="primary" onClick={() => setIsOpenUploadUser(true)}>
            Import
          </Button>
          <Button type="primary" onClick={() => setIsOpenCreateUser(true)}>
            Add New
          </Button>
        </div>
      </div>
    );
  };
  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch handleSearch={handleSearch} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            className="def"
            columns={columns}
            dataSource={listUser}
            onChange={onChange}
            rowKey="_id"
            loading={isLoading}
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
      <UserCreate
        isOpenCreateUser={isOpenCreateUser}
        setIsOpenCreateUser={setIsOpenCreateUser}
        fetchUser={fetchUser}
      />
      <UserViewDetail
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
      />
      <UserUpload
        isOpenUploadUser={isOpenUploadUser}
        setIsOpenUploadUser={setIsOpenUploadUser}
        fetchUser={fetchUser}
      />
      <UserUpdate
        isOpenEditUser={isOpenEditUser}
        setIsOpenEditUser={setIsOpenEditUser}
        dataUserUpdate={dataUserUpdate}
        setDataUserUpdate={setDataUserUpdate}
        fetchUser={fetchUser}
      />
    </>
  );
};
export default UserTable;
