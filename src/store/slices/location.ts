import { GeoCoordinates } from "@/lib/types/geo";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  location: GeoCoordinates | null;
  locatedAt: string | null;
  isWatching?: boolean;
}

const initialState: LocationState = {
  location: null,
  locatedAt: null,
  isWatching: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<GeoCoordinates>) => {
      state.location =
        !action.payload || !action.payload.latitude || !action.payload.longitude
          ? null
          : action.payload;
      state.locatedAt = new Date().toISOString();
    },
    clearLocation: (state) => {
      state.location = null;
      state.locatedAt = null;
    },
    setIsWatching: (state, action: PayloadAction<boolean>) => {
      state.isWatching = action.payload;
    },
  },
});

export default locationSlice;
