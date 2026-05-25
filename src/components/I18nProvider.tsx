"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Locale = "es" | "en";

const STORAGE_KEY = "locale";
const DEFAULT_LOCALE: Locale = "es";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** True after the client has read the stored locale. Use this to gate any rendering that depends on the non-default locale, so SSR/CSR match. */
  ready: boolean;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  ready: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    }
    setReady(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, ready }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

export function useSetLocale() {
  return useContext(LocaleContext).setLocale;
}

export function useI18nReady(): boolean {
  return useContext(LocaleContext).ready;
}

/**
 * Inline translation. Renders `es` on the server and on first client paint
 * (matching SSR), then swaps to `en` after hydration if the active locale is
 * English. Prevents hydration mismatches without needing per-page split.
 */
export function T({ es, en }: { es: string; en: string }) {
  const locale = useLocale();
  const ready = useI18nReady();
  return <>{ready && locale === "en" ? en : es}</>;
}

/** Helper for places that need a string (not a node) — same SSR semantics as T. */
export function useTPair(es: string, en: string): string {
  const locale = useLocale();
  const ready = useI18nReady();
  return ready && locale === "en" ? en : es;
}
