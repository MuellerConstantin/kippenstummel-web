import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  location: { lat: number; lng: number } | null;
  locatedAt: string | null;
}

const initialState: LocationState = {
  location: null,
  locatedAt: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (
      state,
      action: PayloadAction<{ lat: number; lng: number }>,
    ) => {
      state.location = action.payload;
      state.locatedAt = new Date().toISOString();
    },
    clearLocation: (state) => {
      state.location = null;
      state.locatedAt = null;
    },
  },
});

export default locationSlice;
