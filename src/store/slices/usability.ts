import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UsabilityState {
  darkMode: boolean;
  recurringUser: boolean;
  mapVariant: "all" | "trusted" | "approved";
}

const initialState: UsabilityState = {
  darkMode: false,
  recurringUser: false,
  mapVariant: "all",
};

const usabilitySlice = createSlice({
  name: "usability",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setRecurringUser: (state, action: PayloadAction<boolean>) => {
      state.recurringUser = action.payload;
    },
    setMapVariant: (
      state,
      action: PayloadAction<"all" | "trusted" | "approved">,
    ) => {
      state.mapVariant = action.payload;
    },
  },
});

export default usabilitySlice;
