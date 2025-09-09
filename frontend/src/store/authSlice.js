import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const data = await authService.register(formData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Terjadi kesalahan saat register");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const data = await authService.login(formData);
      localStorage.setItem("token_pengguna", data.token);
      localStorage.setItem("pengguna", JSON.stringify(data.user));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Terjadi kesalahan saat login");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token_pengguna");
      localStorage.removeItem("pengguna");
      state.user = null;
      state.token = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {

    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
 
  }
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
