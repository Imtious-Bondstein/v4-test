import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../store";

// Action
export const fetchSpeedLimit = createAsyncThunk("fetchSpeedLimit", async () => {
  const baseURL = "https://apiv4.singularitybd.co";
  const token = store.getState().reducer.auth.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await fetch(
      baseURL + "/api/v4/speed-limit-settings",
      config
    );
    const jsonData = await response.json();

    return jsonData.data;
  } catch (error) {
    console.log("speed-limit store error : ", error);
  }
});

const speedLimitSlice = createSlice({
  name: "speedLimit",
  initialState: {
    isSpeedLimitStoreLoading: false,
    storeSpeedLimit: null,
    isSpeedLimitError: false,
  },
  reducers: {
    CLEAR_SPEED_LIMIT: (state, actions) => {
      state.isSpeedLimitStoreLoading = false;
      state.storeSpeedLimit = null;
      state.isSpeedLimitError = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSpeedLimit.pending, (state, action) => {
      state.isSpeedLimitStoreLoading = true;
    });
    builder.addCase(fetchSpeedLimit.fulfilled, (state, action) => {
      state.isSpeedLimitStoreLoading = false;
      state.storeSpeedLimit = action.payload;
    });
    builder.addCase(fetchSpeedLimit.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.isSpeedLimitError = true;
    });
  },
});

export const { CLEAR_SPEED_LIMIT } = speedLimitSlice.actions;

export default speedLimitSlice.reducer;
