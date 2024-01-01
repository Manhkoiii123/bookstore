import { Row, Col, Rate, Divider, Button, message } from "antd";
import "./book.scss";
import ImageGallery from "react-image-gallery";
import { useEffect, useRef, useState } from "react";
import ModalGallery from "./ModalGallery";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import BookLoader from "./BookLoader";
import { useDispatch, useSelector } from "react-redux";
import { doAddBookAction } from "../../../redux/order/orderSlice";

const ViewDetail = (props) => {
  const user = useSelector((state) => state.account.user);
  const user_id = user.id;
  const { isLoading, data } = props;
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const refGallery = useRef(null);
  const thumbnail = data.thumbnail;
  let sliders = data?.slider || [];
  const image = [thumbnail, ...sliders];
  const images = image.map((item) => {
    return {
      original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
      thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
      originalClass: "original-image",
      thumbnailClass: "thumbnail-image",
    };
  });
  const handleOnClickImage = () => {
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  const onChange = (value) => {
    console.log("changed", value);
  };
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const handleChangeButton = (type) => {
    if (type === "increase") {
      if (currentQuantity === +data.quantity) return; //max
      setCurrentQuantity((prev) => prev + 1);
    }
    if (type === "decrease") {
      if (currentQuantity - 1 <= 0) return; //min = 0
      setCurrentQuantity((prev) => prev - 1);
    }
  };
  const handleChangeInput = (value) => {
    if (!isNaN(value)) {
      if (+value > 0 && +value < +data.quantity) {
        setCurrentQuantity(+value);
      }
    }
  };
  const dispatch = useDispatch();
  const handleAddToCart = (quantity, data) => {
    if (!user_id) {
      message.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    dispatch(
      doAddBookAction({
        quantity,
        detail: data,
        _id: data._id,
        user_id: user_id,
      })
    );
  };
  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-book"
        style={{
          maxWidth: "100vw",
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          {!isLoading ? (
            <>
              <Row gutter={[20, 20]}>
                <Col md={10} sm={0} xs={0}>
                  <ImageGallery
                    ref={refGallery}
                    items={images}
                    showPlayButton={false} //hide play button
                    showFullscreenButton={false} //hide fullscreen button
                    renderLeftNav={() => <></>} //left arrow === <> </>
                    renderRightNav={() => <></>} //right arrow === <> </>
                    slideOnThumbnailOver={true} //onHover => auto scroll images
                    onClick={() => handleOnClickImage()}
                  />
                </Col>
                <Col md={14} sm={24}>
                  <Col md={0} sm={24} xs={24}>
                    <ImageGallery
                      ref={refGallery}
                      items={images}
                      showPlayButton={false} //hide play button
                      showFullscreenButton={false} //hide fullscreen button
                      renderLeftNav={() => <></>} //left arrow === <> </>
                      renderRightNav={() => <></>} //right arrow === <> </>
                      showThumbnails={false}
                    />
                  </Col>
                  <Col span={24}>
                    <div className="author">
                      Tác giả: <a href="#">{data.author}</a>{" "}
                    </div>
                    <div className="title">{data.mainText}</div>
                    <div className="rating">
                      <Rate
                        value={5}
                        disabled
                        style={{ color: "#ffce3d", fontSize: 12 }}
                      />
                      <span className="sold">
                        <Divider type="vertical" />
                        Đã bán {data.sold}
                      </span>
                    </div>
                    <div className="price">
                      <span className="currency">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(data.price)}
                      </span>
                    </div>
                    <div className="delivery">
                      <div>
                        <span className="left-side">Vận chuyển</span>
                        <span className="right-side">Miễn phí vận chuyển</span>
                      </div>
                    </div>
                    <div className="quantity">
                      <span className="left-side">Số lượng</span>
                      <span className="right-side">
                        <button onClick={() => handleChangeButton("decrease")}>
                          <MinusOutlined />
                        </button>
                        <input
                          value={currentQuantity}
                          onChange={(e) => handleChangeInput(e.target.value)}
                        />
                        <button onClick={() => handleChangeButton("increase")}>
                          <PlusOutlined />
                        </button>
                      </span>
                    </div>
                    <div className="buy">
                      <button
                        className="cart"
                        onClick={() => handleAddToCart(currentQuantity, data)}
                      >
                        <BsCartPlus className="icon-cart" />
                        <span>Thêm vào giỏ hàng</span>
                      </button>
                      <button className="now">Mua ngay</button>
                    </div>
                  </Col>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <BookLoader />
            </>
          )}
        </div>
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={images}
        title={"hardcode"}
      />
    </div>
  );
};

export default ViewDetail;
