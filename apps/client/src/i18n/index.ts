import { useCallback, useState } from "react";
import { loadText, saveText } from "../storage";
import { TEXT } from "./text";

export type Lang = "ko" | "en" | "ja";
export const LANGS: { id: Lang; label: string }[] = [
  { id: "ko", label: "한국어" },
  { id: "en", label: "English" },
  { id: "ja", label: "日本語" },
];

export type TextKey = keyof typeof TEXT;

export function detectLang(): Lang {
  const saved = loadText("lang");
  if (saved === "ko" || saved === "en" || saved === "ja") return saved;
  const nav = typeof navigator === "undefined" ? "" : navigator.language.toLowerCase();
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("en")) return "en";
  return "ko";
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(detectLang);
  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    saveText("lang", next);
    document.documentElement.lang = next;
  }, []);
  const t = useCallback((key: TextKey) => TEXT[key][lang], [lang]);
  return { lang, setLang, t };
}
