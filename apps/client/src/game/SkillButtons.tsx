// 스킬이 있는 캐릭터(추적자 셋 · 베아트리스·이안·가브리엘·세레나·라파엘·유리엘·미카엘라·네일러 넷)의 스킬 칸: 키 이름(1·2·3·4) · 스킬 이름 · 남은 대기 시간(어두운 덮개). 누르거나 숫자 키로 사용 (모바일도 같은 버튼)
import type { TextKey } from "../i18n";
import type { Controls } from "./controls";
import { keyLabel, useSettings } from "../settings";

// 칸이 셋이면 추적자, 넷이면 베아트리스 · set "ia"면 이안 · "gb"면 가브리엘 · "sn"면 세레나 · "rf"면 라파엘 · "yr"면 유리엘 · "mc"면 미카엘라 · "nl"면 네일러 · "bj"면 백인장 · "rv"면 레이븐 (전용 패시브로 열린 칸만 밝음)
const NAMES: Record<string, TextKey[]> = { 3: ["trSkill1", "trSkill2", "trSkill3"], 4: ["btSkill1", "btSkill2", "btSkill3", "btSkill4"], ia: ["iaSkill1", "iaSkill2", "iaSkill3", "iaSkill4"], gb: ["gbSkill1", "gbSkill2", "gbSkill3", "gbSkill4"], sn: ["snSkill1", "snSkill2", "snSkill3", "snSkill4"], rf: ["rfSkill1", "rfSkill2", "rfSkill3", "rfSkill4"], yr: ["yrSkill1", "yrSkill2", "yrSkill3", "yrSkill4"], mc: ["mcSkill1", "mcSkill2", "mcSkill3", "mcSkill4"], nl: ["nlSkill1", "nlSkill2", "nlSkill3", "nlSkill4"], bj: ["bjSkill1", "bjSkill2", "bjSkill3", "bjSkill4"], rv: ["rvSkill1", "rvSkill2", "rvSkill3", "rvSkill4"] };
const GLYPH: Record<string, string[]> = { 3: ["◎", "⚡", "⋯"], 4: ["☀", "◐", "✕", "♥"], ia: ["〰", "◗", "執", "∞"], gb: ["⛨", "◉", "▣", "✦"], sn: ["❦", "✿", "†", "❀"], rf: ["↶", "☔", "◎", "➶"], yr: ["✚", "⚒", "◯", "✟"], mc: ["⇣", "⇄", "✸", "∞"], nl: ["⟂", "⥅", "✷", "⫶"], bj: ["◉", "♜", "✴", "✝"], rv: ["▦", "♚", "♜", "♛"] };
/** 마우스를 올리면 칸 위에 뜨는 설명 */
const TIPS: Record<string, TextKey[]> = { 3: ["trSkillTip1", "trSkillTip2", "trSkillTip3"], 4: ["btSkillTip1", "btSkillTip2", "btSkillTip3", "btSkillTip4"], ia: ["iaSkillTip1", "iaSkillTip2", "iaSkillTip3", "iaSkillTip4"], gb: ["gbSkillTip1", "gbSkillTip2", "gbSkillTip3", "gbSkillTip4"], sn: ["snSkillTip1", "snSkillTip2", "snSkillTip3", "snSkillTip4"], rf: ["rfSkillTip1", "rfSkillTip2", "rfSkillTip3", "rfSkillTip4"], yr: ["yrSkillTip1", "yrSkillTip2", "yrSkillTip3", "yrSkillTip4"], mc: ["mcSkillTip1", "mcSkillTip2", "mcSkillTip3", "mcSkillTip4"], nl: ["nlSkillTip1", "nlSkillTip2", "nlSkillTip3", "nlSkillTip4"], bj: ["bjSkillTip1", "bjSkillTip2", "bjSkillTip3", "bjSkillTip4"], rv: ["rvSkillTip1", "rvSkillTip2", "rvSkillTip3", "rvSkillTip4"] };

/** core: 성국 핵심 스킬이 각성했으면 그 칸 (금빛으로 빛남) · stages: 여러 번 누르는 스킬의 다음 단계 (칸 구석에 숫자, 네일러) */
export function SkillButtons({ skills, set, core, stages, t, controls }: { skills: number[]; set?: string; core?: number; stages?: number[]; t: (k: TextKey) => string; controls: () => Controls | null }) {
  const keys = useSettings().skillKeys;
  const k = set ?? skills.length;
  return (
    <span className="skill-buttons">
      {skills.map((cd, i) => (
        <span key={i} className="skill-slot">
          <button
            type="button"
            className={`skill-btn ${cd > 0 ? "cooling" : "ready"}${i === core ? " core-awake" : ""}`}
            style={{ "--cd": cd } as React.CSSProperties}
            onPointerDown={(e) => {
              e.preventDefault();
              controls()?.queueSkill(i + 1);
            }}
          >
            <kbd>{keyLabel(keys[i] ?? String(i + 1))}</kbd>
            <b aria-hidden>{GLYPH[k]?.[i]}</b>
            {(stages?.[i] ?? 0) > 0 && <i className="skill-stage">{stages![i]}</i>}
            <small>{t(NAMES[k]?.[i] ?? "trSkill1")}</small>
          </button>
          <span className="skill-tip">
            <b>{t(NAMES[k]?.[i] ?? "trSkill1")}</b> {t(TIPS[k]?.[i] ?? "trSkillTip1")}
          </span>
        </span>
      ))}
    </span>
  );
}
