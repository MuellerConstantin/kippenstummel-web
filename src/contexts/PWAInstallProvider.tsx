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

  useEffect(() => {
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
    <pwaInstallContext.Provider value={{ isInstallable, promptInstall }}>
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
