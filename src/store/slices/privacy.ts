import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PrivacyState {
  cookieSettingsSelected: boolean;
  allowTechnicalCookies: boolean;
  allowAnalyticsCookies: boolean;
  allowPersonalizationCookies: boolean;
  mapOptInAllowed: boolean;
}

const initialState: PrivacyState = {
  cookieSettingsSelected: false,
  allowTechnicalCookies: true,
  allowAnalyticsCookies: false,
  allowPersonalizationCookies: false,
  mapOptInAllowed: false,
};

const privacySlice = createSlice({
  name: "privacy",
  initialState,
  reducers: {
    setCookieSettingsSet: (state, action: PayloadAction<boolean>) => {
      state.cookieSettingsSelected = action.payload;
    },
    acceptAll: (state) => {
      state.cookieSettingsSelected = true;
      state.allowAnalyticsCookies = true;
      state.allowPersonalizationCookies = true;
    },
    declineAll: (state) => {
      state.cookieSettingsSelected = true;
      state.allowAnalyticsCookies = false;
      state.allowPersonalizationCookies = false;
    },
    saveCustom: (
      state,
      action: PayloadAction<{
        allowAnalyticsCookies: boolean;
        allowPersonalizationCookies: boolean;
      }>,
    ) => {
      state.cookieSettingsSelected = true;
      state.allowAnalyticsCookies = action.payload.allowAnalyticsCookies;
      state.allowPersonalizationCookies =
        action.payload.allowPersonalizationCookies;
    },
    setMapOptInAllowed: (state, action: PayloadAction<boolean>) => {
      state.mapOptInAllowed = action.payload;
    },
  },
});

export default privacySlice;
