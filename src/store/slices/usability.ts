import { DEFAULT_MAP_ZOOM } from "@/lib/shared/constants";
import { GeoCoordinates } from "@/lib/shared/types/geo";
import Cookies from "js-cookie";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Starting point for the theme, used until the user has made a choice of their
 * own. Resolves to `false` on the server, which is only safe as long as nothing
 * server rendered reads it: today the `PersistGate` renders its children in the
 * browser only. Should that change, the initial value has to reach the server
 * some other way, or the theme toggle hydrates out of sync.
 */
function prefersDarkMode(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

interface UsabilityState {
  darkMode: boolean;
  recurringUser: boolean;
  mapView: {
    center: GeoCoordinates;
    zoom: number;
  };
  mapFilters?: {
    score?: {
      min?: number;
      max?: number;
    };
  };
  autoLocation?: boolean;
}

const initialState: UsabilityState = {
  darkMode: prefersDarkMode(),
  recurringUser: false,
  mapView: {
    center: { latitude: 49.006889, longitude: 8.403653 },
    zoom: DEFAULT_MAP_ZOOM,
  },
  mapFilters: {},
};

const usabilitySlice = createSlice({
  name: "usability",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setRecurringUser: (state, action: PayloadAction<boolean>) => {
      state.recurringUser = action.payload;
    },
    setMapFilters: (
      state,
      action: PayloadAction<UsabilityState["mapFilters"]>,
    ) => {
      state.mapFilters = action.payload;
    },
    setScoreMapFilters: (
      state,
      action: PayloadAction<{ min: number; max: number }>,
    ) => {
      state.mapFilters = { ...state.mapFilters, score: action.payload };
    },
    setMapView: (
      state,
      action: PayloadAction<{ center: GeoCoordinates; zoom: number }>,
    ) => {
      state.mapView = action.payload;
    },
    toggleAutoLocation: (state) => {
      state.autoLocation = !state.autoLocation;
    },
    setAutoLocation: (state, action: PayloadAction<boolean>) => {
      state.autoLocation = action.payload;
    },
  },
});

export const syncRecurringUserCookie = (recurringUser: boolean) => {
  if (recurringUser) {
    Cookies.set("kippenstummel-recurring-user", "1", {
      expires: 365,
      sameSite: "lax",
      path: "/",
    });
  } else {
    Cookies.remove("kippenstummel-recurring-user", { path: "/" });
  }
};

export default usabilitySlice;
