import instance from "../utils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
  return instance.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};
export const callLogin = (email, password) => {
  return instance.post("/api/v1/auth/login", {
    username: email,
    password,
  });
};
export const callFetchAccount = () => {
  return instance.get("/api/v1/auth/account");
};
export const callLogout = () => {
  return instance.post("/api/v1/auth/logout");
};

// export const callUser = (params) => {
//   return instance.get("/api/v1/user", {
//     params,
//   });
// };
export const callUser = (params) => {
  return instance.get(`/api/v1/user?${params}`);
};
export const callCreateUser = (fullName, email, password, phone) => {
  return instance.post("/api/v1/user", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callBulkCreateUser = (data) => {
  return instance.post("/api/v1/user/bulk-create", data);
};
export const callUpdateUser = (data) => {
  return instance.put("/api/v1/user", data);
};
export const callDeleteUser = (id) => {
  return instance.delete(`/api/v1/user/${id}`);
};

export const callGetBook = (params) => {
  return instance.get(`/api/v1/book?${params}`);
};
export const callDeleteBook = (id) => {
  return instance.delete(`/api/v1/book/${id}`);
};
export const getAllCategory = () => {
  return instance.get("/api/v1/database/category");
};
export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return instance({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};
export const callCreateBook = (data) => {
  return instance.post("/api/v1/book", data);
};
export const callUpdateBook = (data, id) => {
  return instance.put(`/api/v1/book/${id}`, data);
};
export const callGetBookById = (id) => {
  return instance.get(`/api/v1/book/${id}`);
};
export const callPlaceOrder = (data) => {
  return instance.post("/api/v1/order", {
    ...data,
  });
};
export const callHistoryOrder = () => {
  return instance.get("/api/v1/history");
};
export const callUploadAvatarImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return instance({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};
export const callUpdateUserInfor = (data) => {
  return instance.put(`api/v1/user`, {
    ...data,
  });
};
export const callUpdateUserPassword = (data) => {
  return instance.post(`/api/v1/user/change-password`, {
    ...data,
  });
};
