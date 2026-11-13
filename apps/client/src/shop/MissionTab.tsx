// 상점 미션 탭: 오늘의 일일 미션 3개 (진행 막대 · 받기) · 업적으로 받은 쿠폰
import { uiSfx } from "../audio/uiSounds";
import { useState } from "react";
import type { TextKey } from "../i18n";
import { claim, loadProgress, MISSION_BONUS, MISSION_COUPONS, todayMissions, type MissionKind } from "./missions";
import { achievementCoupons } from "./wallet";

const LABEL: Record<MissionKind, TextKey> = {
  kills: "missionKills",
  boss: "missionBoss",
  floor: "missionFloor",
  gold: "missionGold",
  daily: "missionDaily",
  td: "missionTd",
  runs: "missionRuns",
};

export function MissionTab({ t, onChange }: { t: (k: TextKey) => string; onChange: () => void }) {
  const [, redraw] = useState(0);
  const p = loadProgress();
  return (
    <div className="shop-missions">
      <p className="shop-note">{t("shopHowTo")}</p>
      {todayMissions().map((m) => {
        const v = Math.min(m.goal, p.value[m.kind] ?? 0);
        const done = v >= m.goal;
        const claimed = p.claimed.includes(m.kind);
        return (
          <div key={m.kind} className={`mission${claimed ? " claimed" : ""}`}>
            <span className="mission-text">{t(LABEL[m.kind]).replace("{n}", String(m.goal))}</span>
            <span className="mission-bar" aria-label={`${v} / ${m.goal}`}>
              <span style={{ width: `${(v / m.goal) * 100}%` }} />
            </span>
            <button
              type="button"
              className={done && !claimed ? "primary" : "secondary"}
              disabled={!done || claimed}
              data-sfx="none"
              onClick={() => {
                claim(m.kind);
                uiSfx("uiReward");
                redraw((n) => n + 1);
                onChange();
              }}
            >
              {claimed ? t("shopClaimed") : `${t("shopClaim")} 🎟 ${MISSION_COUPONS}`}
            </button>
          </div>
        );
      })}
      <p className="shop-note">{t("shopBonus").replace("{n}", String(MISSION_BONUS))}</p>
      <p className="shop-note">{t("shopAchCoupons").replace("{n}", String(achievementCoupons()))}</p>
    </div>
  );
}
