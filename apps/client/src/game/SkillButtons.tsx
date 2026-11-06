// 스킬이 있는 캐릭터(추적자 셋 · 베아트리스 넷)의 스킬 칸: 키 이름(1·2·3·4) · 스킬 이름 · 남은 대기 시간(어두운 덮개). 누르거나 숫자 키로 사용 (모바일도 같은 버튼)
import type { TextKey } from "../i18n";
import type { Controls } from "./controls";
import { keyLabel, useSettings } from "../settings";

// 칸이 셋이면 추적자, 넷이면 베아트리스
const NAMES: Record<number, TextKey[]> = { 3: ["trSkill1", "trSkill2", "trSkill3"], 4: ["btSkill1", "btSkill2", "btSkill3", "btSkill4"] };
const GLYPH: Record<number, string[]> = { 3: ["◎", "⚡", "⋯"], 4: ["☀", "◐", "✕", "♥"] };
/** 마우스를 올리면 칸 위에 뜨는 설명 */
const TIPS: Record<number, TextKey[]> = { 3: ["trSkillTip1", "trSkillTip2", "trSkillTip3"], 4: ["btSkillTip1", "btSkillTip2", "btSkillTip3", "btSkillTip4"] };

export function SkillButtons({ skills, t, controls }: { skills: number[]; t: (k: TextKey) => string; controls: () => Controls | null }) {
  const keys = useSettings().skillKeys;
  return (
    <span className="skill-buttons">
      {skills.map((cd, i) => (
        <span key={i} className="skill-slot">
          <button
            type="button"
            className={`skill-btn ${cd > 0 ? "cooling" : "ready"}`}
            style={{ "--cd": cd } as React.CSSProperties}
            onPointerDown={(e) => {
              e.preventDefault();
              controls()?.queueSkill(i + 1);
            }}
          >
            <kbd>{keyLabel(keys[i] ?? String(i + 1))}</kbd>
            <b aria-hidden>{GLYPH[skills.length]?.[i]}</b>
            <small>{t(NAMES[skills.length]?.[i] ?? "trSkill1")}</small>
          </button>
          <span className="skill-tip">
            <b>{t(NAMES[skills.length]?.[i] ?? "trSkill1")}</b> {t(TIPS[skills.length]?.[i] ?? "trSkillTip1")}
          </span>
        </span>
      ))}
    </span>
  );
}
