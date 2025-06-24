import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import identSlice from "@/store/slices/ident";
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

type RefreshSubscriberCallback = (
  error: Error | AxiosError | null,
  token: string | null,
) => void;

let isRefreshingIdent = false;
let identRefreshSubscribers: RefreshSubscriberCallback[] = [];

const subscribeIdentRefresh = (callback: RefreshSubscriberCallback) => {
  identRefreshSubscribers.push(callback);
};

const onIdentRefreshed = (token: string) => {
  identRefreshSubscribers.forEach((callback) => callback(null, token));
  identRefreshSubscribers = [];
};

const onIdentRefreshFailed = (error: Error | AxiosError) => {
  identRefreshSubscribers.forEach((callback) => callback(error, null));
  identRefreshSubscribers = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!store) return config;

  const state = store.getState();

  if (state.ident.token) {
    config.headers["x-ident"] = state.ident.token;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (!store) return Promise.reject(err);

    const { response, config } = err;

    if (response && config.url !== "/ident") {
      if (
        response.status === 401 &&
        response.data?.code === "INVALID_IDENT_TOKEN_ERROR" &&
        !config._retryRefresh
      ) {
        config._retryRefresh = true;
        const state = store.getState();

        if (state.ident.identity && state.ident.secret) {
          if (!isRefreshingIdent) {
            isRefreshingIdent = true;

            try {
              const refreshRes = await api.post<{
                identity: string;
                token: string;
              }>("/ident", {
                identity: state.ident.identity,
                secret: state.ident.secret,
              });

              store.dispatch(
                identSlice.actions.setToken(refreshRes.data.token),
              );

              onIdentRefreshed(refreshRes.data.token);
              return api(config);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (refeshError: any) {
              onIdentRefreshFailed(refeshError);
              return Promise.reject(refeshError);
            } finally {
              isRefreshingIdent = false;
            }
          }

          return new Promise((resolve, reject) => {
            subscribeIdentRefresh((error, token) => {
              if (error) {
                reject(error);
              } else {
                config.headers["x-ident"] = token;
                resolve(api(config));
              }
            });
          });
        }
      }
    }

    return Promise.reject(err);
  },
);
