// 설정의 스킬 키 바꾸기 (추적자 1·2·3 · 패왕전 1~4): 칸을 누르고 원하는 키를 누르면 바뀜 (Esc는 취소) · 패왕전 스킬마다 바로 사용
import { useEffect, useState } from "react";
import type { TextKey } from "./i18n";
import { getSettings, keyLabel, setSettings, useSettings } from "./settings";

export function SkillKeysRow({ t }: { t: (key: TextKey) => string }) {
  const s = useSettings();
  /** 키를 기다리는 칸 (-1 = 없음) */
  const [wait, setWait] = useState(-1);
  useEffect(() => {
    if (wait < 0) return;
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.code !== "Escape") {
        const keys = [...getSettings().skillKeys];
        // 같은 키가 다른 칸에 있으면 서로 바꿈
        const other = keys.indexOf(e.code);
        if (other >= 0) keys[other] = keys[wait]!;
        keys[wait] = e.code;
        setSettings({ skillKeys: keys });
      }
      setWait(-1);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [wait]);
  return (
    <>
      <div className="setting-row">
        <span>{t("skillKeys")}</span>
        <span className="skill-key-set">
          {s.skillKeys.map((code, i) => (
            <button key={i} type="button" className={`small ${wait === i ? "on" : ""}`} onClick={() => setWait(i)}>
              {i + 1}: {wait === i ? t("pressKey") : keyLabel(code)}
            </button>
          ))}
        </span>
      </div>
      <div className="setting-row">
        <span>{t("pwSkQuick")}</span>
        <span className="skill-key-set">
          {s.quickCast.map((on, i) => (
            <button key={i} type="button" className={`small ${on ? "on" : ""}`} onClick={() => setSettings({ quickCast: s.quickCast.map((v, j) => (j === i ? !v : v)) })}>
              {i + 1}: {on ? t("on") : t("off")}
            </button>
          ))}
        </span>
      </div>
    </>
  );
}
