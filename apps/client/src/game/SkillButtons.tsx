// 스킬이 있는 캐릭터(추적자)의 스킬 칸 셋: 키 이름(1·2·3) · 스킬 이름 · 남은 대기 시간(어두운 덮개) · 2번 남은 횟수. 누르거나 숫자 키로 사용 (모바일도 같은 버튼)
import type { TextKey } from "../i18n";
import type { Controls } from "./controls";

const NAMES: TextKey[] = ["trSkill1", "trSkill2", "trSkill3"];
const GLYPH = ["◎", "⚡", "⋯"];

export function SkillButtons({ skills, uses, t, controls }: { skills: number[]; uses?: number; t: (k: TextKey) => string; controls: () => Controls | null }) {
  return (
    <span className="skill-buttons">
      {skills.map((cd, i) => (
        <button
          key={i}
          type="button"
          className={`skill-btn ${cd > 0 ? "cooling" : "ready"}`}
          style={{ "--cd": cd } as React.CSSProperties}
          onPointerDown={(e) => {
            e.preventDefault();
            controls()?.queueSkill(i + 1);
          }}
        >
          <kbd>{i + 1}</kbd>
          <b aria-hidden>{GLYPH[i]}</b>
          <small>{t(NAMES[i]!)}</small>
          {i === 1 && uses !== undefined && <i className="skill-uses">{uses}</i>}
        </button>
      ))}
    </span>
  );
}
