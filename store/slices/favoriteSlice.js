import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../store";

// Action
export const fetchFavoriteLists = createAsyncThunk(
  "fetchFavorites",
  async () => {
    const baseURL = "https://apiv4.singularitybd.co";
    const token = store.getState().reducer.auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const response = await fetch(
        baseURL + "/api/v4/analytics-summary/favourite-page-list",
        config
      );
      const jsonData = await response.json();
      // console.log("favorite list store", jsonData.favorite_pages);
      return jsonData.favorite_pages;
    } catch (error) {
      console.log("favorite list store", error);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    isStoreLoading: false,
    storeFavoriteLists: null,
    isError: false,
  },
  reducers: {
    SET_FAVORITE: (state, actions) => {
      state.isStoreLoading = true;
      state.storeFavoriteLists = actions.payload.favorites;
      state.isStoreLoading = false;
    },
    CLEAR_FAVORITE: (state, actions) => {
      state.isStoreLoading = false;
      state.storeFavoriteLists = null;
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFavoriteLists.pending, (state, action) => {
      state.isStoreLoading = true;
    });
    builder.addCase(fetchFavoriteLists.fulfilled, (state, action) => {
      state.isStoreLoading = false;
      state.storeFavoriteLists = action.payload;
    });
    builder.addCase(fetchFavoriteLists.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.isError = true;
    });
  },
});

export const { SET_FAVORITE, CLEAR_FAVORITE } = favoriteSlice.actions;

export default favoriteSlice.reducer;
