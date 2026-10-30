import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translate } from "@/utils/i18n";

const LangContext = createContext({ lang: "en", t: (k) => k, toggle: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const value = useMemo(
    () => ({ lang, t: (key) => translate(lang, key), toggle: () => setLang((l) => (l === "en" ? "km" : "en")) }),
    [lang]
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
export const useLang = () => useContext(LangContext);
