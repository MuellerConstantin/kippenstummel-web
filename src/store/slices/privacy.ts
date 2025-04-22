import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  cookiesAllowed: boolean | null;
}

const initialState: ThemeState = {
  cookiesAllowed: null,
};

const privacySlice = createSlice({
  name: "privacy",
  initialState,
  reducers: {
    setCookiesAllowed: (state, action: PayloadAction<boolean>) => {
      state.cookiesAllowed = action.payload;
    },
  },
});

export default privacySlice;
