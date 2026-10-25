// 캐릭터 선택창의 금기의 서 버튼 (지금 금기 점수 표시) · 누르면 창
import { tabooPoints } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { TabooBook } from "./TabooBook";
import { loadTaboo, saveTaboo, tabooTier } from "./tabooStore";

export function TabooButton({ t, lang }: { t: (key: TextKey) => string; lang: Lang }) {
  const [value, setValue] = useState(() => loadTaboo() ?? {});
  const [open, setOpen] = useState(false);
  const pts = tabooPoints(value);
  const change = (next: typeof value) => {
    setValue(next);
    saveTaboo(next);
  };
  return (
    <>
      <button type="button" className={`secondary taboo-open taboo-tier-${tabooTier(pts)}`} onClick={() => setOpen(true)}>
        📕 {t("tabooBook")} · {pts > 0 ? t("tabooPts").replace("{n}", String(pts)) : t("tabooOff")}
      </button>
      {open && <TabooBook t={t} lang={lang} value={value} onChange={change} onClose={() => setOpen(false)} />}
    </>
  );
}
