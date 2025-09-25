import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/firebase";

// To get all the products from the DB
export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (arg, { rejectWithValue }) => {
    try {
      const productsRef = collection(db, "products");
      const productsSnapshot = await getDocs(query(productsRef));

      const productsData = productsSnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      return productsData;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
    filteredProducts: [],
  },
  reducers: {
    setFilteredProducts: (state, action) => {
      const {
        searchQuery,
        priceRange,
        categories: { mensFashion, womensFashion, jewelery, electronics },
      } = action.payload;

      let filteredData = state.products;
      if (searchQuery) {
        filteredData = filteredData.filter((product) => {
          return product.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        });
      }
      if (mensFashion || womensFashion || jewelery || electronics) {
        filteredData = filteredData.filter((product) => {
          if (mensFashion && product.category === "men's clothing") {
            return true;
          }
          if (womensFashion && product.category === "women's clothing") {
            return true;
          }
          if (electronics && product.category === "electronics") {
            return true;
          }
          if (jewelery && product.category === "jewelery") {
            return true;
          }
          return false;
        });
      }

      if (priceRange) {
        filteredData = filteredData.filter((product) => {
          return product.price < priceRange;
        });
      }

      state.filteredProducts = [...filteredData];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.filteredProducts = action.payload;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilteredProducts } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
export const productSelector = (state) => state.products;
