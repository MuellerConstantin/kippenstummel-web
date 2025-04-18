import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IdentState {
  token: string | null;
}

const initialState: IdentState = {
  token: null,
};

const identSlice = createSlice({
  name: "ident",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export default identSlice;
