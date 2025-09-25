// Implement your code for cart reducer

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserCartProducts } from "../../utils/utils";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

// Thunk to update the product quantity in the cart
export const updateProductQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, newQuantity, docRef }, { rejectWithValue }) => {
    try {
      await updateDoc(docRef, {
        [`myCart.${productId}.quantity`]: newQuantity,
      });
      return { productId, newQuantity };
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

// Add product to user's cart
export const addProduct = createAsyncThunk(
  "cart/addToCart",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      const { data, docRef } = await getUserCartProducts(arg.uid);

      const productId = arg.product.id;
      const currentCart = data?.myCart || {};

      // If cart exists then check if the product is already there
      if (currentCart[productId]) {
        // If product exists, dispatch the updateQuantity thunk
        const currentQuantity = currentCart[productId].quantity;
        await dispatch(
          updateProductQuantity({
            docRef,
            productId,
            newQuantity: currentQuantity + 1,
          })
        );
        return;
      }

      // Create a new cart if it does not exist or add a new product
      const newProductData = { ...arg.product, quantity: 1 };

      await setDoc(docRef, {
        myCart: { ...currentCart, [productId]: newProductData },
      });

      return newProductData;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

// Get all products from the user cart
export const getAllProducts = createAsyncThunk(
  "cart/getAllProducts",
  async (arg, { rejectWithValue }) => {
    try {
      const { data } = await getUserCartProducts(arg);
      return data;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

export const removeProductFromCart = createAsyncThunk(
  "cart/removeProductFromCart",
  async (arg, { rejectWithValue }) => {
    try {
      const { data, docRef } = await getUserCartProducts(arg.uid);
      const { myCart: cart } = data;

      if (cart[arg.productId]) delete cart[arg.productId];

      const newCartProducts = { ...cart };
      console.log(newCartProducts);

      await updateDoc(docRef, {
        myCart: newCartProducts,
      });

      return newCartProducts;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (arg, { rejectWithValue }) => {
    try {
      const userCartRef = doc(db, "usersCarts", arg);

      updateDoc(userCartRef, {
        myCart: {},
      });
      return;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

export const purchaseProducts = createAsyncThunk(
  "cart/purchaseProducts",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "userOrders", arg);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      const { data: cartProducts } = await getUserCartProducts(arg);
      const { myCart } = cartProducts;

      // If users orders exist add one new order to the orders list
      if (data) {
        updateDoc(docRef, {
          orders: arrayUnion({ ...myCart, date: Date.now() }),
        });

        dispatch(clearCart(arg));
        return;
      }

      // Create a new orders array if no orders yet
      await setDoc(docRef, {
        orders: [{ ...myCart, date: Date.now() }],
      });

      dispatch(clearCart(arg));
      return;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    loading: false,
    error: null,
    totalPrice: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handles the state for signOutUser
      .addCase(addProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.cart.push(action.payload);
          state.totalPrice += action.payload.price;
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handles the state for signOutUser
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, newQuantity } = action.payload;
        // Update the quantity of the existing product in the cart.
        const existingProduct = state.cart.find(
          (product) => product.id === productId
        );
        if (existingProduct) {
          existingProduct.quantity = newQuantity;
        }
        state.totalPrice = state.cart.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0
        );
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handles the state for getAllProducts
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        const { myCart } = action.payload;
        const cartItems = Object.values(myCart);
        state.totalPrice = cartItems.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0
        );
        state.cart = cartItems;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handles the state for removeProductFromCart
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.cart = Object.values(action.payload);
        state.totalPrice = state.cart.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0
        );
      })

      // Handles the state for purchaseProducts
      .addCase(purchaseProducts.fulfilled, (state) => {
        state.cart = [];
        state.totalPrice = 0;
      })

      // Handles the state for clearCart
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = [];
        state.totalPrice = 0;
      });
  },
});

export const cartReducer = cartSlice.reducer;
export const { setCartItems, setLoading, setError } = cartSlice.actions;
export const cartSelector = (state) => state.cart;
