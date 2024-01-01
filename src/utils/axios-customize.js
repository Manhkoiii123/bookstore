import axios from "axios";
const baseUrl = import.meta.env.VITE_BACKEND_URL;
const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
instance.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
};
const handleRefreshToken = async () => {
  const res = await instance.get("api/v1/auth/refresh");
  if (res && res.data) return res.data.access_token;
  else return null;
};
//phòng trường hợp cứ trả về 401 xong lặp vô hạn
const NO_RETRY_HEADER = "x-no-retry";
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  },
  async function (error) {
    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      //chỉ chạy 1 lần thôi => đặt cờ nếu ko có thì mới chạy. trong đây gán luôn 1 cái => ko chạy lần 2 nữa
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = "true"; // như 1 cái flag đánh dấu
      if (access_token) {
        error.config.headers["Authorization"] = `Bearer ${access_token}`;
        localStorage.setItem("access_token", access_token);
        return instance.request(error.config);
      }
    }
    if (
      error.config &&
      error.response &&
      +error.response.status === 400 &&
      error.config.url === "/api/v1/auth/refresh"
    ) {
      window.location.href = "/login";
    }
    return error?.response?.data ?? Promise.reject(error);
  }
);
export default instance;
