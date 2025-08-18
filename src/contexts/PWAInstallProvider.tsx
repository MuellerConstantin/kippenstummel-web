"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const pwaInstallContext = createContext<{
  isInstallable: boolean;
  isIOSInstallable: boolean;
  promptInstall: () => Promise<boolean>;
} | null>(null);

export function PWAInstallProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOSInstallable, setIsIOSInstallable] = useState(false);

  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isSafari =
      isIOS &&
      /safari/i.test(window.navigator.userAgent) &&
      !/crios|fxios|edgios/i.test(window.navigator.userAgent);
    const isInStandaloneMode =
      "standalone" in window.navigator && window.navigator.standalone;

    if (isIOS && isSafari && !isInStandaloneMode) {
      setIsIOSInstallable(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPromptEvent) return false;
    installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;
    return choice.outcome === "accepted";
  }, [installPromptEvent]);

  return (
    <pwaInstallContext.Provider
      value={{ isInstallable, promptInstall, isIOSInstallable }}
    >
      {children}
    </pwaInstallContext.Provider>
  );
}

export function usePWAInstallPrompt() {
  const context = useContext(pwaInstallContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within a 'PWAInstallProvider'",
    );
  }

  return context;
}
