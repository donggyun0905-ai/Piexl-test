// 단련의 방 창 (기구 앞에서 F, game/StationWindow): 아직 이 방 기구를 안 썼으면 설명 + '시작하기' → 그 기구 미니게임 → 끝나면 점수로 포인트 → 강화 목록
// 강화 목록: 능력치·무기 숙련·가진 패시브마다 단계 · 단계당 오르는 몫 · 지금까지 오른 몫 · '+' (남은 포인트 사용). 누른 것은 입력 menu (sim/gym)
import { GYM_OFF, GYM_OP, GYM_RULES, GYM_STATS, gymStep, menuCode, RAID_OP, type GymStat } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../../i18n";
import { GYM_DEVICE } from "../../i18n/items/station";
import type { StationView } from "../stationView";
import { useEffect, useState } from "react";
import { play } from "../../audio/sound";
import { BenchPress } from "./BenchPress";
import { GymPassiveRow } from "./GymPassiveRow";
import { useGymKeys, useGymPause } from "./gymKit";
import { LatPull } from "./LatPull";
import { Sandbag } from "./Sandbag";
import { GymDemo } from "./GymDemo";

type Gym = NonNullable<StationView["gym"]>;
/** 퍼센트로 보여 줄 능력치 */
const PCT: readonly GymStat[] = ["damage", "attackSpeed", "moveSpeed", "range", "critChance", "critDamage", "lifesteal", "dodge", "weapon"];
const fmt = (k: GymStat, v: number) => (PCT.includes(k) ? `+${Math.round(v * 1000) / 10}%` : `+${Math.round(v * 10) / 10}`);

export function GymPanel({ gym, lang, t, send }: { gym: Gym; lang: Lang; t: (k: TextKey) => string; send: (code: number) => void }) {
  const [sent, setSent] = useState(false);
  // 설명을 읽고 '시작하기'를 눌러야 미니게임 시작
  const [started, setStarted] = useState(false);
  // 미니게임 동안 게임 시간 멈춤 (혼자 하는 판)
  useGymPause(!gym.used && !sent);
  // 미니게임이 끝난 뒤에도 잠깐 F·Space·이동 키를 막음: 연타하던 키가 게임으로 넘어가 창이 닫히거나 캐릭터가 걸어 나가지 않게
  const [guard, setGuard] = useState(false);
  useGymKeys(() => {}, guard);
  useEffect(() => {
    if (!guard) return;
    const id = window.setTimeout(() => setGuard(false), 1500);
    return () => clearTimeout(id);
  }, [guard]);
  const done = (score: number) => {
    setSent(true);
    setGuard(true);
    send(menuCode(GYM_OP.result, gym.device, Math.round(Math.min(1000, score) / 20)));
  };
  if (!gym.used) {
    const Game = [Sandbag, LatPull, BenchPress][gym.device] ?? Sandbag;
    return (
      <div className="gym-panel">
        <p className="gym-how">
          <b>{GYM_DEVICE[gym.device]![lang]}</b> — {t((["gymHowSandbag", "gymHowLat", "gymHowBench"] as const)[gym.device] ?? "gymHowSandbag")}
        </p>
        {started ? (
          <Game onDone={done} t={t} />
        ) : (
          <>
            <GymDemo device={gym.device} t={t} />
            <button type="button" className="gym-start" onClick={() => setStarted(true)}>
              {t("gymStartBtn")}
            </button>
          </>
        )}
      </div>
    );
  }
  const up = (a: number) => {
    play("gymUp");
    send(menuCode(GYM_OP.up, a));
  };
  // 레이드: 잘못 찍은 포인트 되돌리기 (sim/raidPrep)
  const down = gym.raid ? (a: number) => send(menuCode(RAID_OP.gymDown, a)) : undefined;
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
          if (GYM_OFF.includes(k)) return null;
          const lv = gym.lv[k] ?? 0;
          const off = gym.blocked.includes(k);
          // 오니: 공격력·공격 속도·사거리(무기 숙련 포함)는 최대 체력·재생력·효과 범위로 바뀌어 오름
          const oni = gym.oni && (k === "damage" || k === "attackSpeed" || k === "range" || k === "weapon");
          return (
            <div key={k} className={`gym-row${off ? " off" : ""}`}>
              <span className="gym-name">{t(`gymStat_${k}` as TextKey)}</span>
              <small>
                {off ? t("gymNoEffect") : `Lv ${lv}/${max} · ${t("gymPer")} ${fmt(k, gymStep(k))} · ${t("gymNow")} ${fmt(k, gymStep(k) * lv)}`}
                {oni && ` · ${t("gymOni")}`}
              </small>
              {down && (
                <button type="button" className="gym-minus" aria-label={t("raidGymMinus")} disabled={lv <= 0} onClick={() => down(i)}>
                  −
                </button>
              )}
              <button type="button" disabled={off || gym.pts <= 0 || lv >= max} onClick={() => up(i)}>
                +
              </button>
            </div>
          );
        })}
        {gym.passives.map((id, i) => (
          <GymPassiveRow key={id} id={id} lv={gym.lv[`p:${id}`] ?? 0} max={max} canUp={gym.pts > 0} lang={lang} t={t} onUp={() => up(32 + i)} onDown={down && (() => down(32 + i))} />
        ))}
      </div>
    </div>
  );
}
