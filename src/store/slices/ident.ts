import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IdentState {
  token: string | null;
  identity: string | null;
  secret: string | null;
}

const initialState: IdentState = {
  token: null,
  identity: null,
  secret: null,
};

const identSlice = createSlice({
  name: "ident",
  initialState,
  reducers: {
    setIdentity: (
      state,
      action: PayloadAction<{ identity: string; secret: string }>,
    ) => {
      state.secret = action.payload.secret;
      state.identity = action.payload.identity;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearIdentity: (state) => {
      state.token = null;
      state.identity = null;
      state.secret = null;
    },
  },
});

export default identSlice;
