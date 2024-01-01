import React from "react";
import { Button, Col, Form, Input, Row, theme } from "antd";

const AdvancedSearchForm = (props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values) => {
    let query = "";
    if (values.fullName) {
      query += `&fullName=/${values.fullName}/i`;
    }
    if (values.email) {
      query += `&email=/${values.email}/i`;
    }
    if (values.phone) {
      query += `&phone=/${values.phone}/i`;
    }
    if (query) {
      props.handleSearch(query);
    } else {
      props.handleSearch("");
    }
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`fullName`}
            label={`Name`}
          >
            <Input placeholder="Enter fullname filter" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`email`}
            label={`Email`}
          >
            <Input placeholder="Enter email filter" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`phone`}
            label={`Số điện thoại`}
          >
            <Input placeholder="Enter phone filter" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
const InputSearch = (props) => {
  const { handleSearch } = props;
  return (
    <div>
      <AdvancedSearchForm handleSearch={handleSearch} />
    </div>
  );
};

export default InputSearch;
