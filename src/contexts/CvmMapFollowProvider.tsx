"use client";

import { createContext, useCallback, useContext, useState } from "react";
import useLocate from "@/hooks/useLocate";
import useLocateWatcher from "@/hooks/useLocateWatcher";

interface CvmMapFollowController {
  isWatching: boolean;
  isFollowing: boolean;
  locating: boolean;
  startTrackingAndFollow: () => Promise<void>;
  stopTracking: () => void;
  resumeFollowing: () => void;
  pauseFollowing: () => void;
}

const CvmMapFollowContext = createContext<CvmMapFollowController | null>(null);

export function CvmMapFollowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locate = useLocate();
  const { startWatching, stopWatching, isWatching } = useLocateWatcher();

  const [isFollowing, setIsFollowing] = useState(false);
  const [locating, setLocating] = useState(false);

  const startTrackingAndFollow = useCallback(async () => {
    if (locating) return;

    setLocating(true);
    try {
      await locate();
      startWatching();
      setIsFollowing(true);
    } finally {
      setLocating(false);
    }
  }, [locate, startWatching, locating]);

  const stopTracking = useCallback(() => {
    stopWatching();
    setIsFollowing(false);
  }, [stopWatching]);

  const resumeFollowing = useCallback(() => {
    if (isWatching) {
      setIsFollowing(true);
    }
  }, [isWatching]);

  const pauseFollowing = useCallback(() => {
    setIsFollowing(false);
  }, []);

  return (
    <CvmMapFollowContext.Provider
      value={{
        isWatching,
        isFollowing,
        locating,
        startTrackingAndFollow,
        stopTracking,
        resumeFollowing,
        pauseFollowing,
      }}
    >
      {children}
    </CvmMapFollowContext.Provider>
  );
}

export function useCvmMapFollow() {
  const context = useContext(CvmMapFollowContext);

  if (!context) {
    throw new Error(
      "useCvmMapFollow must be used within 'CvmMapFollowProvider'",
    );
  }
  return context;
}
