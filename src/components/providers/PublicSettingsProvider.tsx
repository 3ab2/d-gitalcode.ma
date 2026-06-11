"use client";

import { createContext, useContext } from "react";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/lib/site-settings";

const PublicSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function PublicSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <PublicSettingsContext.Provider value={settings}>
      {children}
    </PublicSettingsContext.Provider>
  );
}

export function usePublicSettings(): SiteSettings {
  return useContext(PublicSettingsContext);
}
