import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  totalPrice: 0,
};

const calculateTotalPrice = (menuItem) => {
  return menuItem.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.menuItem = action.payload.menuItem;
      state.totalPrice = action.payload.totalPrice;
    },
    removeFromCart: (state, action) => {
      state.menuItem = state.menuItem.filter(
        (item) => item.menuId !== action.payload
      );
      state.totalPrice = calculateTotalPrice(state.menuItem);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.menuItem.find((item) => item.menuId === id);
      if (item) {
        item.quantity = quantity;
      }
      state.totalPrice = calculateTotalPrice(state.menuItem);
    },
    clearCart: (state) => {
      state.menuItem = [];
      state.totalPrice = 0;
    },
  },
});

export const { setCart, addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
