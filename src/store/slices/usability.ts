import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UsabilityState {
  darkMode: boolean;
  recurringUser: boolean;
  mapVariant: "rAll" | "r5p" | "r0P" | "rN8p";
  mapView: {
    center: [number, number];
    zoom: number;
  };
}

const initialState: UsabilityState = {
  darkMode: false,
  recurringUser: false,
  mapVariant: "rN8p",
  mapView: { center: [49.006889, 8.403653], zoom: 14 },
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
      action: PayloadAction<"rAll" | "r5p" | "r0P" | "rN8p">,
    ) => {
      state.mapVariant = action.payload;
    },
    setMapView: (
      state,
      action: PayloadAction<{ center: [number, number]; zoom: number }>,
    ) => {
      state.mapView = action.payload;
    },
  },
});

export default usabilitySlice;
