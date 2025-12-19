import { GeoCoordinates } from "@/lib/types/geo";
import { createContext, useCallback, useContext, useReducer } from "react";

type CvmMapViewMode = "default" | "register" | "reposition";

const initialDefaultViewState: DefaultViewState = {
  mode: "default",
  showHelpDialog: false,
  showMapSettingsDialog: false,
  showReportDialog: false,
  reporterPosition: null,
};

const initialCvmMapRegisterViewState: CvmMapRegisterViewState = {
  mode: "register",
};

const initialCvmMapRepositionViewState: CvmMapRepositionViewState = {
  mode: "reposition",
};

export interface DefaultViewState {
  mode: "default";
  showHelpDialog: boolean;
  showMapSettingsDialog: boolean;
  showReportDialog: boolean;
  reporterPosition: GeoCoordinates | null;
}

type DefaultViewStateAction =
  | { type: "OPEN_HELP_DIALOG" }
  | { type: "CLOSE_HELP_DIALOG" }
  | { type: "OPEN_MAP_SETTINGS_DIALOG" }
  | { type: "CLOSE_MAP_SETTINGS_DIALOG" }
  | { type: "OPEN_REPORT_DIALOG"; reporterPosition: GeoCoordinates }
  | { type: "CLOSE_REPORT_DIALOG" };

export interface CvmMapRegisterViewState {
  mode: "register";
}

export interface CvmMapRepositionViewState {
  mode: "reposition";
}

export type CvmMapViewState =
  | DefaultViewState
  | CvmMapRegisterViewState
  | CvmMapRepositionViewState;

type CvmMapViewAction =
  | { type: "GOTO_DEFAULT_MODE" }
  | { type: "GOTO_REGISTER_MODE" }
  | { type: "GOTO_REPOSITION_MODE" }
  | DefaultViewStateAction;

function cvmMapViewReducer(
  state: CvmMapViewState,
  action: CvmMapViewAction,
): CvmMapViewState {
  switch (action.type) {
    case "GOTO_DEFAULT_MODE": {
      return initialDefaultViewState;
    }
    case "GOTO_REGISTER_MODE": {
      return initialCvmMapRegisterViewState;
    }
    case "GOTO_REPOSITION_MODE": {
      return initialCvmMapRepositionViewState;
    }
    case "OPEN_HELP_DIALOG": {
      if (state.mode !== "default") return state;
      return { ...state, showHelpDialog: true };
    }
    case "CLOSE_HELP_DIALOG": {
      if (state.mode !== "default") return state;
      return { ...state, showHelpDialog: false };
    }
    case "OPEN_MAP_SETTINGS_DIALOG": {
      if (state.mode !== "default") return state;
      return { ...state, showMapSettingsDialog: true };
    }
    case "CLOSE_MAP_SETTINGS_DIALOG": {
      if (state.mode !== "default") return state;
      return { ...state, showMapSettingsDialog: false };
    }
    case "OPEN_REPORT_DIALOG": {
      if (state.mode !== "default") return state;
      return {
        ...state,
        showReportDialog: true,
        reporterPosition: action.reporterPosition,
      };
    }
    case "CLOSE_REPORT_DIALOG": {
      if (state.mode !== "default") return state;
      return { ...state, showReportDialog: false, reporterPosition: null };
    }
    default: {
      return state;
    }
  }
}

export interface CvmMapController {
  state: CvmMapViewState & { mode: CvmMapViewMode };
  dispatch: React.Dispatch<CvmMapViewAction>;
  goToDefaultMode: () => void;
  goToRegisterMode: () => void;
  goToRepositionMode: () => void;
}

const cvmMapViewContext = createContext<CvmMapController | null>(null);

export function CvmMapViewProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, dispatch] = useReducer(
    cvmMapViewReducer,
    initialDefaultViewState,
  );

  const goToDefaultMode = useCallback(() => {
    dispatch({ type: "GOTO_DEFAULT_MODE" });
  }, []);

  const goToRegisterMode = useCallback(() => {
    dispatch({ type: "GOTO_REGISTER_MODE" });
  }, []);

  const goToRepositionMode = useCallback(() => {
    dispatch({ type: "GOTO_REPOSITION_MODE" });
  }, []);

  return (
    <cvmMapViewContext.Provider
      value={{
        state,
        goToDefaultMode,
        goToRegisterMode,
        goToRepositionMode,
        dispatch,
      }}
    >
      {children}
    </cvmMapViewContext.Provider>
  );
}

export function useCvmMapView() {
  const context = useContext(cvmMapViewContext);

  if (!context) {
    throw new Error("useCvmMapView must be used within a 'CvmMapViewProvider'");
  }

  return context;
}

export function useCvmMapDefaultView() {
  const { state, dispatch } = useCvmMapView();

  if (state.mode !== "default") {
    throw new Error("useDefaultMapView can only be used in default view");
  }

  const openHelpDialog = useCallback(() => {
    dispatch({ type: "OPEN_HELP_DIALOG" });
  }, [dispatch]);

  const closeHelpDialog = useCallback(() => {
    dispatch({ type: "CLOSE_HELP_DIALOG" });
  }, [dispatch]);

  const openMapSettingsDialog = useCallback(() => {
    dispatch({ type: "OPEN_MAP_SETTINGS_DIALOG" });
  }, [dispatch]);

  const closeMapSettingsDialog = useCallback(() => {
    dispatch({ type: "CLOSE_MAP_SETTINGS_DIALOG" });
  }, [dispatch]);

  const openReportDialog = useCallback(
    (reporterPosition: GeoCoordinates) => {
      dispatch({ type: "OPEN_REPORT_DIALOG", reporterPosition });
    },
    [dispatch],
  );

  const closeReportDialog = useCallback(() => {
    dispatch({ type: "CLOSE_REPORT_DIALOG" });
  }, [dispatch]);

  return {
    state: state as DefaultViewState & { mode: "default" },
    openHelpDialog,
    closeHelpDialog,
    openMapSettingsDialog,
    closeMapSettingsDialog,
    openReportDialog,
    closeReportDialog,
  };
}

export function useCvmMapRegisterView() {
  const { state } = useCvmMapView();

  if (state.mode !== "register") {
    throw new Error("useCvmMapRegisterView can only be used in register view");
  }

  return {};
}

export function useCvmMapRepositionView() {
  const { state } = useCvmMapView();

  if (state.mode !== "reposition") {
    throw new Error(
      "useCvmMapRepositionView can only be used in reposition view",
    );
  }

  return {};
}
