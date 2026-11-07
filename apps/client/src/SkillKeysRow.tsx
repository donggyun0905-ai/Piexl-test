// 설정의 스킬 키 바꾸기 (스킬형 캐릭터·패왕전 1~4) · 사용 아이템 키 (기본 Q·E): 칸을 누르고 원하는 키나 마우스 휠 클릭·옆 버튼을 누르면 바뀜 (Esc는 취소) · 패왕전 스킬마다 바로 사용
import { useEffect, useState } from "react";
import type { TextKey } from "./i18n";
import { getSettings, keyLabel, mouseCode, setSettings, useSettings } from "./settings";

export function SkillKeysRow({ t }: { t: (key: TextKey) => string }) {
  const s = useSettings();
  /** 키를 기다리는 칸 (-1 = 없음 · 0~3 스킬 · 10·11 사용 아이템) */
  const [wait, setWait] = useState(-1);
  useEffect(() => {
    if (wait < 0) return;
    /** 기다리던 칸에 키(또는 마우스 버튼 코드)를 넣음 · 같은 키가 다른 칸에 있으면 서로 바꿈 */
    const assign = (code: string) => {
      const use = wait >= 10;
      const keys = [...(use ? getSettings().useKeys : getSettings().skillKeys)];
      const at = use ? wait - 10 : wait;
      const other = keys.indexOf(code);
      if (other >= 0) keys[other] = keys[at]!;
      keys[at] = code;
      setSettings(use ? { useKeys: keys } : { skillKeys: keys });
    };
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.code !== "Escape") assign(e.code);
      setWait(-1);
    };
    // 마우스 휠 클릭·옆 버튼 (왼쪽·오른쪽 클릭은 공격·대시라 안 받음) · 옆 버튼을 뗄 때 브라우저 뒤로 가기를 막고 끝냄
    let got = "";
    const onDown = (e: MouseEvent) => {
      got = mouseCode(e.button);
      if (got) e.preventDefault();
    };
    const onUp = (e: MouseEvent) => {
      if (!got || mouseCode(e.button) !== got) return;
      e.preventDefault();
      assign(got);
      setWait(-1);
    };
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("mousedown", onDown, true);
    window.addEventListener("mouseup", onUp, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("mousedown", onDown, true);
      window.removeEventListener("mouseup", onUp, true);
    };
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
        <span>{t("useKeys")}</span>
        <span className="skill-key-set">
          {s.useKeys.map((code, i) => (
            <button key={i} type="button" className={`small ${wait === 10 + i ? "on" : ""}`} onClick={() => setWait(10 + i)}>
              {i + 1}: {wait === 10 + i ? t("pressKey") : keyLabel(code)}
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
