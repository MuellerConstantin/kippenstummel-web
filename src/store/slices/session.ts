import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  showMessageBanner: boolean;
  showInstallRequest: boolean;
}

const initialState: SessionState = {
  showMessageBanner: true,
  showInstallRequest: true,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    toggleMessageBannerVisibility: (state) => {
      state.showMessageBanner = !state.showMessageBanner;
    },
    setMessageBannerVisibility: (state, action: PayloadAction<boolean>) => {
      state.showMessageBanner = action.payload;
    },
    toggleInstallRequestVisibility: (state) => {
      state.showInstallRequest = !state.showInstallRequest;
    },
    setInstallRequestVisibility: (state, action: PayloadAction<boolean>) => {
      state.showInstallRequest = action.payload;
    },
  },
});

export default sessionSlice;
