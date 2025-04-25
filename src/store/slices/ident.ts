import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clear } from "console";

interface IdentState {
  token: string | null;
  identity: string | null;
}

const initialState: IdentState = {
  token: null,
  identity: null,
};

const identSlice = createSlice({
  name: "ident",
  initialState,
  reducers: {
    setIdentity: (
      state,
      action: PayloadAction<{ identity: string; token: string }>,
    ) => {
      state.token = action.payload.token;
      state.identity = action.payload.identity;
    },
    clearIdentity: (state) => {
      state.token = null;
      state.identity = null;
    },
  },
});

export default identSlice;
