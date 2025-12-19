import { createContext, useCallback, useContext, useState } from "react";

type CvmMapViewMode = "default" | "register" | "reposition";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DefaultViewState {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CvmMapRegisterViewState {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CvmMapRepositionViewState {}

export type CvmMapViewState =
  | DefaultViewState
  | CvmMapRegisterViewState
  | CvmMapRepositionViewState;

export interface CvmMapController {
  mode: CvmMapViewMode;
  state: CvmMapViewState;
  changeMode: (mode: CvmMapViewMode) => void;
}

const cvmMapViewContext = createContext<CvmMapController | null>(null);

export function CvmMapViewProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mode, setMode] = useState<CvmMapController["mode"]>("default");

  const changeMode = useCallback(
    (mode: CvmMapController["mode"]) => {
      setMode(mode);
    },
    [setMode],
  );

  return (
    <cvmMapViewContext.Provider value={{ mode, changeMode, state: {} }}>
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
  const { mode } = useCvmMapView();

  if (mode !== "default") {
    throw new Error("useDefaultMapView can only be used in default view");
  }

  return {};
}

export function useCvmMapRegisterView() {
  const { mode } = useCvmMapView();

  if (mode !== "register") {
    throw new Error("useCvmMapRegisterView can only be used in register view");
  }

  return {};
}

export function useCvmMapRepositionView() {
  const { mode } = useCvmMapView();

  if (mode !== "reposition") {
    throw new Error(
      "useCvmMapRepositionView can only be used in reposition view",
    );
  }

  return {};
}
