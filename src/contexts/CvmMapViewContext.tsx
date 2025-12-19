import { createContext, useCallback, useContext, useReducer } from "react";

type CvmMapViewMode = "default" | "register" | "reposition";

const initialDefaultViewState: DefaultViewState = { mode: "default" };

const initialCvmMapRegisterViewState: CvmMapRegisterViewState = {
  mode: "register",
};

const initialCvmMapRepositionViewState: CvmMapRepositionViewState = {
  mode: "reposition",
};

export interface DefaultViewState {
  mode: "default";
}

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

type CvmMapViewAction = { type: "CHANGE_MODE"; mode: CvmMapViewMode };

function cvmMapViewReducer(
  state: CvmMapViewState,
  action: CvmMapViewAction,
): CvmMapViewState {
  switch (action.type) {
    case "CHANGE_MODE": {
      switch (action.mode) {
        case "default": {
          return initialDefaultViewState;
        }
        case "register": {
          return initialCvmMapRegisterViewState;
        }
        case "reposition": {
          return initialCvmMapRepositionViewState;
        }
      }
    }
    default: {
      return state;
    }
  }
}

export interface CvmMapController {
  state: CvmMapViewState & { mode: CvmMapViewMode };
  dispatch: React.Dispatch<CvmMapViewAction>;
  changeMode: (mode: CvmMapViewMode) => void;
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

  const changeMode = useCallback((mode: CvmMapViewMode) => {
    dispatch({ type: "CHANGE_MODE", mode });
  }, []);

  return (
    <cvmMapViewContext.Provider value={{ state, changeMode, dispatch }}>
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
  const { state } = useCvmMapView();

  if (state.mode !== "default") {
    throw new Error("useDefaultMapView can only be used in default view");
  }

  return {};
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
