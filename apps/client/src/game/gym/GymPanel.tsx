// 단련의 방 창 (기구 앞에서 F, game/StationWindow): 아직 이 방 기구를 안 썼으면 그 기구 미니게임 → 끝나면 점수로 포인트 → 강화 목록
// 강화 목록: 능력치·무기 숙련·가진 패시브마다 단계 · 단계당 오르는 몫 · 지금까지 오른 몫 · '+' (남은 포인트 사용). 누른 것은 입력 menu (sim/gym)
import { GYM_OP, GYM_RULES, GYM_STATS, gymStep, menuCode, PASSIVES, type GymStat, type PassiveDef } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../../i18n";
import { itemName } from "../../i18n/items";
import { GYM_DEVICE } from "../../i18n/items/station";
import { ItemIcon } from "../itemIcon";
import type { StationView } from "../stationView";
import { BenchPress } from "./BenchPress";
import { LatPull } from "./LatPull";
import { Sandbag } from "./Sandbag";

type Gym = NonNullable<StationView["gym"]>;
/** 퍼센트로 보여 줄 능력치 */
const PCT: readonly GymStat[] = ["damage", "attackSpeed", "moveSpeed", "range", "critChance", "critDamage", "lifesteal", "dodge", "weapon"];
const fmt = (k: GymStat, v: number) => (PCT.includes(k) ? `+${Math.round(v * 1000) / 10}%` : `+${Math.round(v * 10) / 10}`);

export function GymPanel({ gym, lang, t, send }: { gym: Gym; lang: Lang; t: (k: TextKey) => string; send: (code: number) => void }) {
  const done = (score: number) => send(menuCode(GYM_OP.result, gym.device, Math.round(Math.min(1000, score) / 20)));
  if (!gym.used) {
    const Game = [Sandbag, LatPull, BenchPress][gym.device] ?? Sandbag;
    return (
      <div className="gym-panel">
        <p className="gym-how">
          <b>{GYM_DEVICE[gym.device]![lang]}</b> — {t((["gymHowSandbag", "gymHowLat", "gymHowBench"] as const)[gym.device] ?? "gymHowSandbag")}
        </p>
        <Game onDone={done} t={t} />
      </div>
    );
  }
  const up = (a: number) => send(menuCode(GYM_OP.up, a));
  const max = GYM_RULES.MAX_LV;
  return (
    <div className="gym-panel">
      {gym.last && (
        <p className="gym-result">
          {GYM_DEVICE[gym.last.device]![lang]} · {t("gymScore").replace("{n}", String(gym.last.score))} → {t("gymGot").replace("{n}", String(gym.last.pts))}
        </p>
      )}
      <p className="gym-pts">{t("gymPts").replace("{n}", String(gym.pts))}</p>
      <div className="gym-list">
        {GYM_STATS.map((k, i) => {
          const lv = gym.lv[k] ?? 0;
          return (
            <div key={k} className="gym-row">
              <span className="gym-name">{t(`gymStat_${k}` as TextKey)}</span>
              <small>
                Lv {lv}/{max} · {t("gymPer")} {fmt(k, gymStep(k))} · {t("gymNow")} {fmt(k, gymStep(k) * lv)}
              </small>
              <button type="button" disabled={gym.pts <= 0 || lv >= max} onClick={() => up(i)}>
                +
              </button>
            </div>
          );
        })}
        {gym.passives.map((id, i) => {
          const lv = gym.lv[`p:${id}`] ?? 0;
          const hasMods = (((PASSIVES[id] as PassiveDef).mods ?? []) as readonly unknown[]).length > 0;
          const per = hasMods ? t("gymPassiveMods").replace("{n}", String(Math.round(GYM_RULES.passiveBoost * 100))) : t("gymPassivePlain").replace("{n}", String(Math.round(GYM_RULES.passivePlain * 100)));
          return (
            <div key={id} className="gym-row passive">
              <span className="gym-name">
                <ItemIcon item={{ kind: "passive", id }} size={18} /> {itemName("passive", id, lang)}
              </span>
              <small>
                Lv {lv}/{max} · {per}
              </small>
              <button type="button" disabled={gym.pts <= 0 || lv >= max} onClick={() => up(32 + i)}>
                +
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
