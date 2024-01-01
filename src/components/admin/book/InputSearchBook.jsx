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
    if (values.mainText) {
      query += `&mainText=/${values.mainText}/i`;
    }
    if (values.author) {
      query += `&author=/${values.author}/i`;
    }
    if (values.category) {
      query += `&category=/${values.category}/i`;
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
            name={`mainText`}
            label={`Tên sách`}
          >
            <Input placeholder="Enter mainText filter" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`author`}
            label={`Tác giả`}
          >
            <Input placeholder="Enter author filter" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`category`}
            label={`Thể loại`}
          >
            <Input placeholder="Enter category filter" />
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
const InputSearchBook = (props) => {
  const { handleSearch } = props;
  return (
    <div>
      <AdvancedSearchForm handleSearch={handleSearch} />
    </div>
  );
};

export default InputSearchBook;
