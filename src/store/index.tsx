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
import usabilitySlice from "@/store/slices/usability";
import identSlice from "./slices/ident";
import privacySlice from "./slices/privacy";
import locationSlice from "./slices/location";
import { Modal } from "@/components/atoms/Modal";
import { PrivacySettingsDialog } from "@/components/organisms/PrivacySettingsDialog";
import { AnimatePresence } from "framer-motion";

const persistConfig = {
  key: "kippenstummel",
  version: 2,
  storage,
  whitelist: ["usability", "ident", "privacy"],
};

export const rootReducer = combineReducers({
  usability: usabilitySlice.reducer,
  ident: identSlice.reducer,
  privacy: privacySlice.reducer,
  location: locationSlice.reducer,
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
  const darkMode = useAppSelector((state) => state.usability.darkMode);

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
  const cookieSettingsSelected = useAppSelector(
    (state) => state.privacy.cookieSettingsSelected,
  );

  useEffect(() => {
    if (cookieSettingsSelected) {
      persistor.persist();
      persistor.flush();
    }
  }, [cookieSettingsSelected, persistor]);

  return (
    <PersistGate persistor={persistor} loading={loading}>
      {children}
      <AnimatePresence>
        {!cookieSettingsSelected && (
          <Modal
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            isOpen={!cookieSettingsSelected}
            className="max-w-xl"
          >
            <PrivacySettingsDialog />
          </Modal>
        )}
      </AnimatePresence>
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
