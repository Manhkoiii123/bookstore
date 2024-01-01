import { Divider, Modal, Table, notification } from "antd";
import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import * as XLSX from "xlsx";
import { callBulkCreateUser } from "../../../services/api";
import templateFile from "../user/data/template.xlsx?url";
const UserUpload = ({ isOpenUploadUser, setIsOpenUploadUser }) => {
  const [dataExcel, setDataExcel] = useState([]);
  const { Dragger } = Upload;
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };
  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1, //giới hạn sl pt upload
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    //ko upload file nên => antd upload without action
    customRequest: dummyRequest,
    // action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj; //do cos kieeur laf file
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e) {
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]]; // lấy ra cái sheeet 1 do cái execl nó có nheieuf sheet
            const json = XLSX.utils.sheet_to_json(sheet, {
              header: ["fullName", "email", "phone"],
              range: 1, // bỏ đi cái headr row
            });
            if (json && json.length > 0) setDataExcel(json);
          };
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const handleSubmit = async () => {
    const data = dataExcel.map((item) => {
      item.password = "123456";
      return item;
    });
    const res = await callBulkCreateUser(data);
    if (res.data) {
      notification.success({
        description: `Success : ${res.data.countSuccess}, Error: ${res.data.countError}`,
        message: "Import User Successfully!",
      });
      setDataExcel([]);
      setIsOpenUploadUser(false);
      props.fetchUSer();
    } else {
      notification.error({
        description: res.message,
        message: "Error!",
      });
    }
  };
  return (
    <Modal
      width="70%"
      title="Import data user"
      open={isOpenUploadUser}
      onOk={() => handleSubmit()}
      onCancel={() => {
        setDataExcel([]);
        setIsOpenUploadUser(false);
      }}
      okButtonProps={{
        disabled: dataExcel.length < 1,
      }}
      okText="Import data"
      cancelText="Cancel"
      maskClosable={false}
    >
      <Divider />
      <Dragger {...propsUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single upload. Only accept .csv,.xls,.xlsx. or &nbsp;{" "}
          <a onClick={(e) => e.stopPropagation()} href={templateFile} download>
            Download Sample File
          </a>
        </p>
      </Dragger>
      <div style={{ paddingTop: "20px" }}>
        <Table
          dataSource={dataExcel}
          title={() => <span>Dữ liệu upload</span>}
          columns={[
            { dataIndex: "fullName", title: "Tên hiển thị" },
            { dataIndex: "email", title: "Email" },
            { dataIndex: "phone", title: "Số điện thoại" },
          ]}
        />
      </div>
    </Modal>
  );
};

export default UserUpload;
