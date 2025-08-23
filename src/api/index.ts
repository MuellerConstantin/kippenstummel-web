import axios, { InternalAxiosRequestConfig } from "axios";
import type { AppStore } from "@/store";

let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

export const api = axios.create({
  baseURL: "/api/bff",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!store) return config;

  const state = store.getState();

  if (state.ident.token) {
    config.headers["x-ident"] = state.ident.token;
  }

  return config;
});
