// 히든 아이템 고르는 창 (sim/hiddenDice.hiddenPick): 저주받은 주사위 숫자 1~6 · 테라포밍 이 층 보스
// 누른 것은 controls.queueMenu → 입력 menu (기록·협동에서도 같은 결과)
import { menuCode, PICK_OP, TERRA_BOSSES } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { enemyName } from "../i18n/enemies";
import type { Controls } from "./controls";

interface Props {
  pick: "curse" | "terra";
  lang: Lang;
  t: (key: TextKey) => string;
  controls: () => Controls | null;
}

export function HiddenPicker({ pick, lang, t, controls }: Props) {
  const send = (code: number) => controls()?.queueMenu(code);
  const curse = pick === "curse";
  return (
    <div className={`hd-picker ${pick}`} role="dialog" aria-label={t(curse ? "hdPickCurse" : "hdPickTerra")}>
      <b>{t(curse ? "hdPickCurse" : "hdPickTerra")}</b>
      <div className="hd-picker-list">
        {curse
          ? [1, 2, 3, 4, 5, 6].map((n) => (
              <button key={n} type="button" className="hd-die" onClick={() => send(menuCode(PICK_OP.curse, n))}>
                {n}
              </button>
            ))
          : TERRA_BOSSES.map((kind, i) => (
              <button key={kind} type="button" onClick={() => send(menuCode(PICK_OP.terra, i))}>
                {enemyName(kind, lang)}
              </button>
            ))}
      </div>
    </div>
  );
}
