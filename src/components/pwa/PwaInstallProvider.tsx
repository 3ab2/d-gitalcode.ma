"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PwaInstallModal } from "@/components/pwa/PwaInstallModal";
import {
  dismissPwaPrompt,
  isPwaDismissed,
  isPwaMarkedInstalled,
  markPwaInstalled,
  markPwaModalShownThisSession,
  wasPwaModalShownThisSession,
} from "@/lib/pwa/install-storage";
import { trackPwaInstallEvent } from "@/lib/pwa/install-tracking";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function detectInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    isPwaMarkedInstalled() ||
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

type PwaInstallContextValue = {
  canInstall: boolean;
  isInstalled: boolean;
  install: () => Promise<boolean>;
  dismissPrompt: () => void;
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
  const [modalOpen, setModalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setIsInstalled(detectInstalled());

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      markPwaInstalled();
      setIsInstalled(true);
      setDeferredPrompt(null);
      setModalOpen(false);
      trackPwaInstallEvent("install_accepted", { source: "appinstalled" });
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const canInstall = hydrated && Boolean(deferredPrompt) && !isInstalled;

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      markPwaInstalled();
      setDeferredPrompt(null);
      setIsInstalled(true);
      setModalOpen(false);
      trackPwaInstallEvent("install_accepted", { source: "prompt" });
      return true;
    }
    return false;
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    dismissPwaPrompt();
    setModalOpen(false);
    trackPwaInstallEvent("install_dismissed");
  }, []);

  const openInstallModal = useCallback(() => {
    if (!canInstall) return;
    setModalOpen(true);
    trackPwaInstallEvent("popup_shown", { source: "user_menu" });
  }, [canInstall]);

  useEffect(() => {
    if (!canInstall) return;
    if (isPwaDismissed()) return;
    if (wasPwaModalShownThisSession()) return;

    const timer = window.setTimeout(() => {
      setModalOpen(true);
      markPwaModalShownThisSession();
      trackPwaInstallEvent("popup_shown", { source: "auto" });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [canInstall]);

  const value = useMemo(
    () => ({
      canInstall,
      isInstalled,
      install,
      dismissPrompt,
      openInstallModal,
    }),
    [canInstall, isInstalled, install, dismissPrompt, openInstallModal]
  );

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
      <PwaInstallModal
        open={modalOpen && canInstall}
        onInstall={() => void install()}
        onDismiss={dismissPrompt}
      />
    </PwaInstallContext.Provider>
  );
}
