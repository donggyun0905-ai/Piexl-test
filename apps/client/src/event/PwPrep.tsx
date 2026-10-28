// 패왕전 준비방 (스킬 보기): 왼쪽 고른 캐릭터의 평타·패시브·스킬 1~4 설명(PwSkillList) · 오른쪽 작은 연습장(PwPracticeGame) → 이 캐릭터로 시작
// 무기·패시브 고르기는 없음 (사용 아이템은 경기장에서 주움)
import { CHARACTERS, type CharacterId, type PwLoadout } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { PwPracticeGame } from "./PwPractice";
import { PwSkillList } from "./PwSkillList";

interface Props {
  characterId: CharacterId;
  lang: Lang;
  t: (key: TextKey) => string;
  onStart: (lo: PwLoadout) => void;
  onBack: () => void;
  /** 시작 버튼 대신 보일 글 (랭크전 남은 초 · 친구 방 손님은 방장 기다림) */
  wait?: string;
}

export function PwPrep({ characterId, lang, t, onStart, onBack, wait }: Props) {
  const weapon = CHARACTERS[characterId].startWeapon;
  return (
    <div className="pw-prep-split">
      <div className="pw-prep pw-skills">
        <h2>
          {t(characterId)} · {t("pwSkills")}
        </h2>
        <PwSkillList characterId={characterId} lang={lang} t={t} />
        <p className="hint">{t("pwSkAimHint")}</p>
        <div className="pw-prep-actions">
          {wait === undefined ? (
            <button type="button" className="primary" onClick={() => onStart({ weapon, passives: [], uses: [] })}>
              {t("pwSkReady")}
            </button>
          ) : (
            <b className="pw-prep-wait">{wait}</b>
          )}
          <button type="button" className="ghost" onClick={onBack}>
            {t("back")}
          </button>
        </div>
      </div>
      {/* 작은 연습장: 안의 화면 고정 요소가 이 칸 안에 머물도록 transform으로 가둠 */}
      <div className="pw-mini">
        <PwPracticeGame characterId={characterId} lang={lang} t={t} />
      </div>
    </div>
  );
}
