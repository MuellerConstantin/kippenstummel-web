import { createContext, useCallback, useContext, useState } from "react";

type CvmMapViewMode = "default" | "register" | "reposition";

interface CvmMapViewState {
  mode: CvmMapViewMode;
  changeMode: (mode: CvmMapViewMode) => void;
}

const cvmMapViewContext = createContext<CvmMapViewState | null>(null);

export function CvmMapViewProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mode, setMode] = useState<CvmMapViewState["mode"]>("default");

  const changeMode = useCallback(
    (mode: CvmMapViewState["mode"]) => {
      setMode(mode);
    },
    [setMode],
  );

  return (
    <cvmMapViewContext.Provider value={{ mode, changeMode }}>
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
