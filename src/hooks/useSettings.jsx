import { createContext, useContext, useEffect, useState } from "react";
import { settingsService } from "@/services/settingsService";
import { DEFAULT_SETTINGS } from "@/utils/constants";
import { useLang } from "@/hooks/useLang";

const SettingsContext = createContext({ settings: DEFAULT_SETTINGS, reload: () => {} });

/** Loads Dashboard → Settings once and merges it over the defaults. */
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const { lang } = useLang();
  const reload = () =>
    settingsService
      .get(lang)
      .then((s) => setSettings({ ...DEFAULT_SETTINGS, ...Object.fromEntries(Object.entries(s).filter(([, v]) => v != null)) }))
      .catch(() => {});
  useEffect(() => { reload(); }, [lang]);
  return <SettingsContext.Provider value={{ settings, reload }}>{children}</SettingsContext.Provider>;
}
export const useSettings = () => useContext(SettingsContext);
