import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../store";

//=======sanitize vehicle data=======
const processVehiclesData = (data) => {
  const modifiedData = data.map((group) => {
    const modifiedVehicles = group.vehicles.map((vehicle) => {
      const status = vehicle.v_status && vehicle.v_status.includes('-') ? vehicle.v_status.split('-')[0] : vehicle.v_status;
      return { ...vehicle, v_status: status };
    });
    return { ...group, vehicles: modifiedVehicles };
  });
  return modifiedData;
}

// Action
export const fetchVehicleLists = createAsyncThunk("fetchVehicles", async () => {
  const baseURL = "https://apiv4.singularitybd.co";
  const token = store.getState().reducer.auth.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await fetch(baseURL + "/api/v4/vehicle-list", config);
    const jsonData = await response.json();
    console.log("---- vehicle store res", jsonData.data);
    //======process vehicle status=======
    return processVehiclesData(jsonData.data);
  } catch (error) {
    console.log("vehicle list store", error);
  }
});

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    isStoreLoading: false,
    storeVehicleLists: null,
    isError: false,
  },
  reducers: {
    CLEAR_VEHICLE: (state, actions) => {
      state.isStoreLoading = false;
      state.storeVehicleLists = null;
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVehicleLists.pending, (state, action) => {
      state.isStoreLoading = true;
    });
    builder.addCase(fetchVehicleLists.fulfilled, (state, action) => {
      state.isStoreLoading = false;
      state.storeVehicleLists = action.payload;
    });
    builder.addCase(fetchVehicleLists.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.isError = true;
    });
  },
});

export const { CLEAR_VEHICLE } = vehicleSlice.actions;

export default vehicleSlice.reducer;
