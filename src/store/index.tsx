"use client";

import React, {
  useRef,
  useEffect,
  useCallback,
  useContext,
  useSyncExternalStore,
  createContext,
} from "react";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
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
  type Persistor,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import localStorage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";
import { injectStore } from "@/lib/client/api";
import usabilitySlice, {
  syncRecurringUserCookie,
} from "@/store/slices/usability";
import identSlice from "./slices/ident";
import privacySlice from "./slices/privacy";
import locationSlice from "./slices/location";
import sessionSlice from "./slices/session";
import { PrivacySettingsDialog } from "@/components/organisms/PrivacySettingsDialog";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";

const migrations = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  3: (state: any) => {
    syncRecurringUserCookie(state?.usability?.recurringUser === true);

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

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: usabilitySlice.actions.setRecurringUser,
  effect: async (action) => {
    // Syncs the recurring user state to a cookie to make it accessible in server components and on the initial page load
    syncRecurringUserCookie(action.payload);
  },
});

listenerMiddleware.startListening({
  predicate: (action) => action.type === REHYDRATE,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as {
      usability?: { recurringUser?: boolean };
      privacy?: { cookieSettingsSelected?: boolean };
    };

    // Renews the recurring user cookie on app start if the user is recurring, to prevent it from expiring while the user is active
    syncRecurringUserCookie(state.usability?.recurringUser === true);
  },
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
      })
        .concat()
        .concat(listenerMiddleware.middleware),
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

const PersistorContext = createContext<Persistor | null>(null);

function usePersistor(): Persistor {
  const persistor = useContext(PersistorContext);

  if (!persistor) {
    throw new Error("usePersistor must be used below a StoreProvider");
  }

  return persistor;
}

/**
 * Whether redux-persist has restored the persisted state. Server renders and
 * the very first client render report `false`, so anything that would briefly
 * show default state instead of the user's own can hold back until it is true.
 */
export function useRehydrated(): boolean {
  const persistor = usePersistor();

  const subscribe = useCallback(
    (onStoreChange: () => void) => persistor.subscribe(onStoreChange),
    [persistor],
  );

  return useSyncExternalStore(
    subscribe,
    () => persistor.getState().bootstrapped,
    () => false,
  );
}

/**
 * Withholds its children until the persisted state is restored.
 */
export function RehydrationBoundary({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const persistor = usePersistor();

  return (
    <PersistGate persistor={persistor} loading={null}>
      {children}
    </PersistGate>
  );
}

/**
 * Asks for cookie settings until they have been made, and starts persisting
 * once they allow it. The dialog waits for rehydration, otherwise returning
 * visitors would see it flash open before their stored choice arrives.
 */
function PrivacySettingsGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const persistor = usePersistor();
  const rehydrated = useRehydrated();

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
    <>
      {children}
      <AnimatedDialogModal
        isOpen={rehydrated && !cookieSettingsSelected}
        className="max-w-xl"
      >
        <PrivacySettingsDialog />
      </AnimatedDialogModal>
    </>
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

    if (
      process.env.NODE_ENV !== "production" &&
      typeof window !== "undefined"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__getState__ = () => storeRef.current?.[0].getState();
    }
  }

  return (
    <Provider store={storeRef.current[0]}>
      <PersistorContext.Provider value={storeRef.current[1]}>
        <PrivacySettingsGuard>
          <ThemeSwitcher>{children}</ThemeSwitcher>
        </PrivacySettingsGuard>
      </PersistorContext.Provider>
    </Provider>
  );
}
