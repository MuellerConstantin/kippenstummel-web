"use client";

import React, { useRef, useEffect } from "react";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { injectStore } from "@/api";
import themeSlice from "@/store/slices/theme";
import identSlice from "./slices/ident";
import privacySlice from "./slices/privacy";
import { CookieBanner } from "@/components/organisms/CookieBanner";

const persistConfig = {
  key: "kippenstummel",
  version: 1,
  storage,
  whitelist: ["theme", "ident", "privacy"],
};

export const rootReducer = combineReducers({
  theme: themeSlice.reducer,
  ident: identSlice.reducer,
  privacy: privacySlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const persistor = persistStore(store);

  persistor.pause();

  return [store, persistor] as const;
};

export type AppStore = ReturnType<typeof makeStore>[0];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

function ThemeSwitcher({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return children;
}

export default function PrivacyCompliantPersistGate({
  children,
  persistor,
  loading,
}: Readonly<{
  children: React.ReactNode;
  persistor: ReturnType<typeof persistStore>;
  loading: React.ReactNode;
}>) {
  const cookiesAllowed = useAppSelector(
    (state) => state.privacy.cookiesAllowed,
  );

  useEffect(() => {
    if (cookiesAllowed) {
      persistor.persist();
    }
  }, [cookiesAllowed, persistor]);

  return (
    <PersistGate persistor={persistor} loading={loading}>
      {children}
      <CookieBanner onConsent={() => persistor.persist()} />
    </PersistGate>
  );
}

export function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<ReturnType<typeof makeStore>>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    injectStore(storeRef.current[0]);
  }

  return (
    <Provider store={storeRef.current[0]}>
      <PrivacyCompliantPersistGate
        loading={null}
        persistor={storeRef.current[1]}
      >
        <ThemeSwitcher>{children}</ThemeSwitcher>
      </PrivacyCompliantPersistGate>
    </Provider>
  );
}
