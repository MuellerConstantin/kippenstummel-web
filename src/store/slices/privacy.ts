import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PrivacyState {
  cookiesAllowed: boolean | null;
  mapOptInAllowed: boolean | null;
}

const initialState: PrivacyState = {
  cookiesAllowed: null,
  mapOptInAllowed: null,
};

const privacySlice = createSlice({
  name: "privacy",
  initialState,
  reducers: {
    setCookiesAllowed: (state, action: PayloadAction<boolean>) => {
      state.cookiesAllowed = action.payload;
    },
    setMapOptInAllowed: (state, action: PayloadAction<boolean>) => {
      state.mapOptInAllowed = action.payload;
    },
  },
});

export default privacySlice;
