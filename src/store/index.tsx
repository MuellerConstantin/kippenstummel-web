"use client";

import React, { useRef, useEffect } from "react";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import Cookies from "js-cookie";
import { PersistGate } from "redux-persist/integration/react";
import localStorage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";
import { injectStore } from "@/api";
import usabilitySlice from "@/store/slices/usability";
import identSlice from "./slices/ident";
import privacySlice from "./slices/privacy";
import locationSlice from "./slices/location";
import sessionSlice from "./slices/session";
import { PrivacySettingsDialog } from "@/components/organisms/PrivacySettingsDialog";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";

const migrations = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  3: (state: any) => {
    if (state?.usability?.recurringUser === true) {
      if (typeof window !== "undefined") {
        Cookies.set("kippenstummel-recurring-user", "1", {
          expires: 365,
          sameSite: "lax",
          path: "/",
        });
      }
    }

    return state;
  },
};

const rootPersistConfig = {
  key: "kippenstummel",
  version: 3,
  storage: localStorage,
  whitelist: ["usability", "ident", "privacy"],
  blacklist: ["session", "location"],
  migrate: createMigrate(migrations, { debug: false }),
};

const sessionPersistConfig = {
  key: "kippenstummel-session",
  version: 1,
  storage: sessionStorage,
};

export const rootReducer = combineReducers({
  usability: usabilitySlice.reducer,
  ident: identSlice.reducer,
  privacy: privacySlice.reducer,
  location: locationSlice.reducer,
  session: persistReducer(sessionPersistConfig, sessionSlice.reducer),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

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
      <AnimatedDialogModal
        isOpen={!cookieSettingsSelected}
        className="max-w-xl"
      >
        <PrivacySettingsDialog />
      </AnimatedDialogModal>
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
