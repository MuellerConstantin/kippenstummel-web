import { GeoCoordinates } from "@/lib/types/geo";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UsabilityState {
  darkMode: boolean;
  recurringUser: boolean;
  mapView: {
    center: GeoCoordinates;
    zoom: number;
  };
  mapFilters?: {
    score?: {
      min?: number;
      max?: number;
    };
  };
  autoLocation?: boolean;
}

const initialState: UsabilityState = {
  darkMode: false,
  recurringUser: false,
  mapView: { center: { latitude: 49.006889, longitude: 8.403653 }, zoom: 14 },
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
      action: PayloadAction<{ center: GeoCoordinates; zoom: number }>,
    ) => {
      state.mapView = action.payload;
    },
    toggleAutoLocation: (state) => {
      state.autoLocation = !state.autoLocation;
    },
    setAutoLocation: (state, action: PayloadAction<boolean>) => {
      state.autoLocation = action.payload;
    },
  },
});

export default usabilitySlice;
