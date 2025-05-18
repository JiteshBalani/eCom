import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProducts: (state, action) => {
      state.quantity += 1;
      state.products.push(action.payload);
      state.total += action.payload.salePrice * action.payload.quantity;
    },
    removeProducts: (state, action) => {
      const productId = action.payload.id;
      const productIndex = state.products.findIndex(
        (product) => product.id === productId
      );
      if (productIndex !== -1) {
        const product = state.products[productIndex];
        state.quantity -= product.quantity;
        state.total -= product.salePrice * product.quantity;
        state.products.splice(productIndex, 1);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((item) => item._id === id);
      if (product) {
        // Adjust total before changing quantity
        state.total -= product.salePrice * product.quantity;
        product.quantity = quantity;
        state.total += product.salePrice * quantity;
      }
    },
    clearCart: (state) => {
      state.quantity = 0;
      state.products = [];
      state.total = 0;
    },
  },
});

export const { addProducts, removeProducts, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
