import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UsabilityState {
  darkMode: boolean;
  recurringUser: boolean;
  mapView: {
    center: [number, number];
    zoom: number;
  };
  mapFilters?: {
    score?: {
      min?: number;
      max?: number;
    };
  };
}

const initialState: UsabilityState = {
  darkMode: false,
  recurringUser: false,
  mapView: { center: [49.006889, 8.403653], zoom: 14 },
  mapFilters: {},
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
    setMapFilters: (
      state,
      action: PayloadAction<UsabilityState["mapFilters"]>,
    ) => {
      state.mapFilters = action.payload;
    },
    setScoreMapFilters: (
      state,
      action: PayloadAction<{ min: number; max: number }>,
    ) => {
      state.mapFilters = { ...state.mapFilters, score: action.payload };
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
