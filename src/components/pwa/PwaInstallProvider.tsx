"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { PwaInstallModal } from "@/components/pwa/PwaInstallModal";
import { PwaInstallIosModal } from "@/components/pwa/PwaInstallIosModal";
import {
  dismissPwaPrompt,
  isPwaDismissed,
  markPwaInstalled,
  markPwaModalShownThisSession,
  wasPwaModalShownThisSession,
} from "@/lib/pwa/install-storage";
import { trackPwaInstallEvent } from "@/lib/pwa/install-tracking";
import {
  isIosSafari,
  isPwaInstalled,
} from "@/lib/pwa/detect-platform";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type PwaInstallMode = "native" | "ios" | null;

type PwaInstallContextValue = {
  canInstall: boolean;
  installMode: PwaInstallMode;
  isInstalled: boolean;
  install: () => Promise<boolean>;
  dismissPrompt: () => void;
  acknowledgeIosInstructions: () => void;
  openInstallModal: () => void;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export function usePwaInstall() {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) {
    throw new Error("usePwaInstall must be used within PwaInstallProvider");
  }
  return ctx;
}

export function PwaInstallProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [iosSafari, setIosSafari] = useState(false);
  const [nativeModalOpen, setNativeModalOpen] = useState(false);
  const [iosModalOpen, setIosModalOpen] = useState(false);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      setIsInstalled(isPwaInstalled());
      setIosSafari(isIosSafari());
    });

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      markPwaInstalled();
      setIsInstalled(true);
      setDeferredPrompt(null);
      setNativeModalOpen(false);
      setIosModalOpen(false);
      trackPwaInstallEvent("install_accepted", { source: "appinstalled" });
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        const installed = isPwaInstalled();
        setIsInstalled(installed);
        if (installed) {
          setNativeModalOpen(false);
          setIosModalOpen(false);
        }
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const installMode: PwaInstallMode = useMemo(() => {
    if (isInstalled) return null;
    if (deferredPrompt) return "native";
    if (iosSafari) return "ios";
    return null;
  }, [deferredPrompt, iosSafari, isInstalled]);

  const canInstall = hydrated && installMode !== null && !isInstalled;

  const install = useCallback(async () => {
    if (installMode === "ios") {
      setIosModalOpen(true);
      trackPwaInstallEvent("popup_shown", { source: "user_menu", platform: "ios" });
      return false;
    }
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      markPwaInstalled();
      setDeferredPrompt(null);
      setIsInstalled(true);
      setNativeModalOpen(false);
      trackPwaInstallEvent("install_accepted", { source: "prompt", platform: "android" });
      return true;
    }
    return false;
  }, [deferredPrompt, installMode]);

  const dismissPrompt = useCallback(() => {
    dismissPwaPrompt();
    setNativeModalOpen(false);
    setIosModalOpen(false);
    trackPwaInstallEvent("install_dismissed", {
      platform: installMode ?? "unknown",
    });
  }, [installMode]);

  const acknowledgeIosInstructions = useCallback(() => {
    setIosModalOpen(false);
    trackPwaInstallEvent("install_acknowledged", { platform: "ios" });
  }, []);

  const openInstallModal = useCallback(() => {
    if (!canInstall || !installMode) return;
    if (installMode === "ios") {
      setIosModalOpen(true);
      trackPwaInstallEvent("popup_shown", { source: "user_menu", platform: "ios" });
      return;
    }
    setNativeModalOpen(true);
    trackPwaInstallEvent("popup_shown", { source: "user_menu", platform: "native" });
  }, [canInstall, installMode]);

  useEffect(() => {
    if (!canInstall || !installMode) return;
    if (isPwaDismissed()) return;
    if (wasPwaModalShownThisSession()) return;

    const timer = window.setTimeout(() => {
      if (installMode === "ios") {
        setIosModalOpen(true);
      } else {
        setNativeModalOpen(true);
      }
      markPwaModalShownThisSession();
      trackPwaInstallEvent("popup_shown", { source: "auto", platform: installMode });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [canInstall, installMode]);

  const value = useMemo(
    () => ({
      canInstall,
      installMode,
      isInstalled,
      install,
      dismissPrompt,
      acknowledgeIosInstructions,
      openInstallModal,
    }),
    [
      canInstall,
      installMode,
      isInstalled,
      install,
      dismissPrompt,
      acknowledgeIosInstructions,
      openInstallModal,
    ]
  );

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
      <PwaInstallModal
        open={nativeModalOpen && installMode === "native"}
        onInstall={() => void install()}
        onDismiss={dismissPrompt}
      />
      <PwaInstallIosModal
        open={iosModalOpen && installMode === "ios"}
        onGotIt={acknowledgeIosInstructions}
        onDismiss={dismissPrompt}
      />
    </PwaInstallContext.Provider>
  );
}
