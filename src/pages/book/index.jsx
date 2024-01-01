import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/admin/book/ViewDetail";
import { callGetBookById } from "../../services/api";
import { useEffect, useState } from "react";

const BookPage = () => {
  let location = useLocation();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  let params = new URLSearchParams(location.search);
  const id = params?.get("id");
  const getDetail = async () => {
    setIsLoading(true);
    const res = await callGetBookById(id);
    if (res && res.data) {
      setData(res.data);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getDetail();
  }, [id]);
  return (
    <div style={{ backgroundColor: "#efefef" }}>
      <ViewDetail data={data} isLoading={isLoading} />
    </div>
  );
};
export default BookPage;
