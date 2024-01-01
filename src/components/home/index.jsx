import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Rate,
  Tabs,
  Pagination,
} from "antd";
import "./home.scss";
import { useEffect, useState } from "react";
import { callGetBook, getAllCategory } from "../../services/api";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { convertSlug } from "../../utils/helper";
const Home = () => {
  const [form] = useForm();
  const [listBook, setListBook] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-sold");
  const fetchCategory = async () => {
    const res = await getAllCategory();
    if (res && res.data) {
      setListCategory(res.data);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchBook = async () => {
    let params = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      params += `&${filter}`;
    }
    if (sortQuery) {
      params += `&${sortQuery}`;
    }
    const res = await callGetBook(params);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
  };
  useEffect(() => {
    fetchBook();
  }, [current, sortQuery, filter, pageSize]);
  const handleChangeFilter = (changedValues, values) => {
    // cái chages là cái thay đổi mỗi lần bấm
    //còn value là cacs cái còn được tik và giá tiền được nhập => phải lấy được cái gt cate ra và convert sang string nối qua dấu , => join

    if (changedValues.category) {
      //chỉ khi cate của change thay đổi
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        setFilter("");
      }
    }
  };
  //áp dụng cho giá tiền
  const onFinish = (values) => {
    //values này có range và category
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  };

  //lusc goij sẽ phải setup lại cái pagination cho đúng định dạng
  const onChangePagi = (pagination) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1); //đưa về trang đầu
    }
  };

  const items = [
    {
      key: "sort=-sold",
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: "sort=-updatedAt",
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: "sort=price",
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: "sort=-price",
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];
  const handleResetForm = () => {
    form.resetFields();
    setFilter("");
  };

  const nav = useNavigate();
  const handleRedirectBook = (book) => {
    const slug = convertSlug(book.mainText);
    nav(`/book/${slug}?id=${book._id}`);
  };
  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="homepage-container"
        style={{ maxWidth: "100vw", margin: "0 auto", overflow: "hidden" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={4} sm={0} xs={0}>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: 5,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <FilterTwoTone /> Bộ lọc tìm kiếm
                </span>
                <ReloadOutlined
                  title="Reset"
                  onClick={() => handleResetForm()}
                />
              </div>
              <Form
                onFinish={onFinish}
                form={form}
                //values đằng sau nó là cái values lọc luôn
                onValuesChange={(changedValues, values) =>
                  handleChangeFilter(changedValues, values)
                }
              >
                <Form.Item
                  name="category"
                  label="Danh mục sản phẩm"
                  labelCol={{ span: 24 }}
                >
                  <Checkbox.Group>
                    <Row>
                      {listCategory &&
                        listCategory.map((item, index) => {
                          return (
                            <Col
                              span={24}
                              key={index}
                              style={{ paddingBlock: "10px" }}
                            >
                              <Checkbox value={item}>{item}</Checkbox>
                            </Col>
                          );
                        })}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Divider />
                <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 20,
                    }}
                  >
                    <Form.Item name={["range", "from"]}>
                      <InputNumber
                        name="from"
                        min={0}
                        placeholder="đ TỪ"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                    <span>-</span>
                    <Form.Item name={["range", "to"]}>
                      <InputNumber
                        name="to"
                        min={0}
                        placeholder="đ ĐẾN"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Button
                      onClick={() => form.submit()}
                      style={{ width: "100%" }}
                      type="primary"
                    >
                      Áp dụng
                    </Button>
                  </div>
                </Form.Item>
                <Divider />
                <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                  <div>
                    <Rate
                      value={5}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text"></span>
                  </div>
                  <div>
                    <Rate
                      value={4}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={3}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={2}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={1}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col md={20} xs={24}>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: 5,
              }}
            >
              <Row>
                <Tabs
                  defaultActiveKey="sort=-sold"
                  items={items}
                  onChange={(value) => setSortQuery(value)}
                />
              </Row>
              <Row className="customize-row">
                {listBook &&
                  listBook.map((book) => {
                    return (
                      <div
                        className="column"
                        key={book._id}
                        onClick={() => handleRedirectBook(book)}
                      >
                        <div className="wrapper">
                          <div className="thumbnail">
                            <img
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "contain",
                              }}
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }images/book/${book.thumbnail}`}
                              alt="thumbnail book"
                            />
                          </div>
                          <div className="text">{book.mainText}</div>
                          <div className="price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(book.price)}
                          </div>
                          <div className="rating">
                            <Rate
                              value={5}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 10 }}
                            />
                            <span>Đã bán {book.sold}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Row>
              <Divider />
              <Row style={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  current={current}
                  pageSize={pageSize}
                  total={total}
                  responsive
                  onChange={(p, s) => onChangePagi({ current: p, pageSize: s })}
                />
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
