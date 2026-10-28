// 패왕전 스킬 칸 넷 (아래쪽 장비 줄): 키 · 아이콘 · 남은 대기(덮개와 초) · 조준 중 빛남 · 침묵이면 잠김
// PC: 칸을 누르면 숫자 키와 같음 (조준 모드 또는 바로 사용) · 올리면 설명 · 모바일: 누르면 바라보는 쪽으로 바로
import { kitOf, type CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import { skillLines, skillName } from "../event/pwSkillText";
import type { TextKey } from "../i18n";
import { keyLabel, useSettings } from "../settings";
import type { Controls } from "./controls";
import { ItemIcon } from "./itemIcon";
import { ItemTip, tipPos, type TipPos } from "./ItemTip";

export interface PwSkillView {
  chr: CharacterId;
  /** 스킬마다 남은 대기 0~1 · 남은 초 */
  cds: number[];
  left: number[];
  /** 조준 중인 스킬 (-1 = 없음) */
  armed: number;
  silenced: boolean;
}

export function PwSkillBar({ view, t, touchMode, controls }: { view: PwSkillView; t: (k: TextKey) => string; touchMode: boolean; controls: () => Controls | null }) {
  const keys = useSettings().skillKeys;
  const kit = kitOf(view.chr);
  const [tip, setTip] = useState<{ k: number; pos: TipPos } | null>(null);
  if (!kit) return null;
  const use = (k: number) => {
    const c = controls();
    if (!c) return;
    const n = touchMode ? k + 1 : c.arm.key(k + 1);
    if (n) c.queueSkill(n);
  };
  return (
    <span className="pw-skill-bar">
      {kit.skills.map((def, k) => (
        <button
          key={k}
          type="button"
          className={`pw-skill ${view.cds[k]! > 0 ? "cooling" : "ready"} ${view.armed === k ? "armed" : ""} ${view.silenced ? "silenced" : ""} ${k === 3 ? "ult" : ""}`}
          style={{ "--cd": view.cds[k], "--tint": def.tint } as React.CSSProperties}
          onPointerDown={(e) => {
            e.preventDefault();
            use(k);
          }}
          onMouseEnter={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            if (!touchMode) setTip({ k, pos: tipPos(r.left + r.width / 2, r.top - 4, 0, false) });
          }}
          onMouseLeave={() => setTip(null)}
        >
          <ItemIcon item={{ kind: "weapon", id: def.icon }} size={26} />
          {!touchMode && <kbd>{keyLabel(keys[k] ?? String(k + 1))}</kbd>}
          {view.left[k]! > 0 && <b className="pw-skill-left">{view.left[k]}</b>}
        </button>
      ))}
      {tip && (
        <ItemTip pos={tip.pos} icon={{ kind: "weapon", id: kit.skills[tip.k]!.icon }} name={skillName(view.chr, tip.k, t)} desc="">
          {skillLines(kit.skills[tip.k]!, t).map((l) => (
            <div key={l}>{l}</div>
          ))}
        </ItemTip>
      )}
    </span>
  );
}
