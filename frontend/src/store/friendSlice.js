// src/features/friendSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import friendService from "../services/friendService";

// ambil daftar teman
export const fetchFriends = createAsyncThunk(
  "friend/fetchFriends",
  async (token, thunkAPI) => {
    try {
      return await friendService.getFriends(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Gagal mengambil daftar teman");
    }
  }
);

// tambah teman
export const addFriend = createAsyncThunk(
  "friend/addFriend",
  async ({ friendIdentifier, token }, thunkAPI) => {
    try {
      return await friendService.addFriend(friendIdentifier, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Gagal tambah teman");
    }
  }
);

const friendSlice = createSlice({
  name: "friend",
  initialState: {
    list: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearFriendMessage: (state) => {
      state.message = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // fetchFriends
    builder.addCase(fetchFriends.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFriends.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(fetchFriends.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // addFriend
    builder.addCase(addFriend.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(addFriend.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });
    builder.addCase(addFriend.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearFriendMessage } = friendSlice.actions;
export default friendSlice.reducer;
