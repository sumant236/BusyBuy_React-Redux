import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

// thunk for creating new User
export const createUser = createAsyncThunk(
  "auth/createUser",
  async (arg, { rejectWithValue }) => {
    try {
      // 1. Create the user
      const userCredentials = await createUserWithEmailAndPassword(
        arg.auth,
        arg.email,
        arg.password
      );

      // 2. Update the user's profile with the provided name
      await updateProfile(userCredentials.user, {
        displayName: arg.name,
      });
      const user = userCredentials.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
    } catch (e) {
      return rejectWithValue(e.code);
    }
  }
);

// thunk for creating Sign In user
export const signInUser = createAsyncThunk(
  "auth/signIn",
  async (arg, { rejectWithValue }) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        arg.auth,
        arg.email,
        arg.password
      );
      const user = userCredentials.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
    } catch (e) {
      return rejectWithValue(e.code);
    }
  }
);

// thunk for creating Sign Out user
export const signOutUser = createAsyncThunk(
  "async/signOut",
  async (arg, { rejectWithValue }) => {
    try {
      return await signOut(arg);
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null, isAuthReady: false },
  reducers: {
    setAuthuser: (state, action) => {
      if (action.payload) state.user = action.payload;
      else {
        state.user = null;
      }
    },
    setAuthReady: (state, action) => {
      state.isAuthReady = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handles the state for createUser
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handles the state for signInUser
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handles the state for signOutUser
      .addCase(signOutUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signOutUser.fulfilled, (state, action) => {
        state.user = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const authReducer = authSlice.reducer;
export const { setAuthuser, setAuthReady } = authSlice.actions;
export const authSelector = (state) => state.auth;
