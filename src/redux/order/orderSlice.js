import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  carts: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    doAddBookAction: (state, action) => {
      let carts = state.carts;
      const item = action.payload;
      let isExistIndex = carts.findIndex(
        (c) => c._id === item._id && c.user_id === item.user_id
      );
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity =
          carts[isExistIndex].quantity + item.quantity;
        if (
          carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity
        ) {
          carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
        }
      } else {
        carts.push({
          user_id: item.user_id,
          quantity: item.quantity,
          _id: item._id,
          detail: item.detail,
        });
      }
      state.carts = carts;
      message.success("Thêm vào giỏ hàng thành công");
    },
    doUpdateCartAction: (state, action) => {
      let carts = state.carts;
      const item = action.payload;
      let isExistIndex = carts.findIndex(
        (c) => c._id === item._id && c.user_id === item.user_id
      );

      if (isExistIndex > -1) {
        carts[isExistIndex].quantity = item.quantity;
        if (
          carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity
        ) {
          carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
        }
      } else {
        carts.push({
          user_id: item.user_id,
          quantity: item.quantity,
          _id: item._id,
          detail: item.detail,
        });
      }
      state.carts = carts;
    },
    doDeleteAction: (state, action) => {
      let carts = state.carts;
      const item = action.payload;
      let isExistIndex = carts.findIndex(
        (c) => c._id === item._id && c.user_id === item.user_id
      );
      if (isExistIndex > -1) {
        carts.splice(isExistIndex, 1);
      }
      state.carts = carts;
    },
    doDeleteAllBookByUserAction: (state, action) => {
      const item = action.payload;
      let carts = state.carts;
      let bookByUser = carts.filter((c) => c.user_id !== item.user_id);
      state.carts = bookByUser;
    },
  },
  extraReducers: (builder) => {},
});
export const {
  doAddBookAction,
  doUpdateCartAction,
  doDeleteAction,
  doDeleteAllBookByUserAction,
} = orderSlice.actions;

export default orderSlice.reducer;
