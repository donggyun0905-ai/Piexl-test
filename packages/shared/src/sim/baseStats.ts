// 모든 캐릭터 공통 추가 기본 스탯 (캐릭터 표 CHARACTERS에 있음, 관리자 '캐릭터'에서 캐릭터마다 바꿈. 처음 값은 지금 게임과 같게 0 · 치명타 피해 150%)
// 치명타 확률·치명타 피해 · 방어력(받는 피해 100/(100+방어력)) · 피해 감소(%) · 회피(확률) · 재생력(10초마다 회복) · 흡혈(준 피해의 %)
// 예리함(맞힐 때 확률로 적 방어 -25%(받는 피해 +25%) + 출혈) · 상태이상 강화(상태이상 피해 +%) · 돈 획득(+%)
import { HOOK } from "../weaponsHook";
import { gymExtras } from "./gym";
import { boonExtras } from "./boons";
import { CHARACTERS, type ExtraStats } from "../characters";
import { createRng, deriveSeed } from "../rng";
import { healPlayer } from "./combat";
import { applyBleed, updateBleed } from "./gunExtras";
import type { EnemyState, PlayerState, RunState } from "./types";
import { WANDERER_PERKS } from "../itemsWanderer";
import { addEffect, hasPerk, weaponOf } from "./util";
import { hiddenExtras, hiddenOnHit } from "./hiddenPerks";
import { kingExtras } from "./kingForm";
import { growExtras } from "./pwGearStat";
import { luxExtras } from "./lux";
import { devilExtras } from "./devilPerks";
import { bsExtras } from "./bsKit";
import { setExtras, setTaken } from "./buildSets";
import { setOnHit, setTick } from "./buildSetFx";
import { factionHit, factionTick } from "./faction";
import { moonHit } from "./moonlight";
import { fenrirDodged, fenrirExtras } from "./fenrirStats";
import { eclipseExtras } from "./eclipseStats";
import { waveExtras } from "./wave";
import { accExtras, accOnHit, accTick } from "./accStats";
import { noirExtras, noirRegenMul } from "./nrAdapt";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 예리함: 적이 받는 피해 + · 그 시간(틱) */
  SHARP_DEF: 0.25,
  SHARP_TICKS: 180,
  /** 재생력은 이 틱마다 (재생력/10만큼, 곧 10초에 재생력만큼) */
  REGEN_EVERY: 60,
  /** 피해 감소 최대 (90%) */
  REDUCTION_MAX: 0.9,
};
export { R as BASE_STATS_RULES };

/** 지금 캐릭터의 추가 기본 스탯 */
export function extraOf(p: PlayerState): ExtraStats {
  const base = kingExtras(p) ?? (CHARACTERS[p.characterId] as unknown as ExtraStats);
  // 히든 아이템(금기된 아티팩트·신의 파편)이 더한 몫
  const add = hiddenExtras(p);
  // 패왕전 성장 대결: 장비·증강·레벨 (sim/pwGearStat)
  const grow = growExtras(p);
  // 빛의 사도: 빛의 조각 몫 (sim/lux)
  const lux = luxExtras(p);
  // 단련의 방 강화 (sim/gym)
  const gym = gymExtras(p);
  // 시련의 방 등에서 받은 몫 (sim/boons)
  const boon = boonExtras(p);
  // 악마의 거래 (sim/devilPerks)
  const devil = devilExtras(p);
  // 빌드 세트 효과 (sim/buildSets)
  const set = setExtras(p);
  // 펜리르 벼린 송곳니·노장의 투혼 (sim/fenrirStats)
  const fen = fenrirExtras(p);
  // 이클립스 태양 모습 치명타 (sim/eclipseStats)
  const ecl = eclipseExtras(p);
  // 웨이브 물의 기술 5개마다 방어력 (sim/wave)
  const wv = waveExtras(p);
  // 레이드 장신구 (sim/accStats)
  const acc = accExtras(p);
  // 빙설 영역강화 방어력 (sim/bsKit)
  const ice = bsExtras(p);
  // 느아르 적응력 레벨·승격 방어력·재생력 (sim/nrAdapt)
  const nr = noirExtras(p);
  if (!add && !grow && !lux && !gym && !boon && !devil && !set && !fen && !ecl && !wv && !acc && !ice && !nr) return base;
  const out = { ...base };
  for (const a of [add, grow, lux, gym, boon, devil, set, fen, ecl, wv, acc, ice, nr]) for (const k of Object.keys(a ?? {}) as (keyof ExtraStats)[]) out[k] += a![k] ?? 0;
  return out;
}

const roll = (s: RunState, tag: string, n: number) => createRng(deriveSeed(s.seed, tag, s.tick, n)).nextFloat();

/** 회피: 확률로 피해를 받지 않음 */
export function dodged(s: RunState): boolean {
  const d = extraOf(s.player).dodge;
  if (d <= 0 || roll(s, "dodge", 0) >= d) return false;
  addEffect(s, { kind: "ring", x: s.player.x, y: s.player.y, dirX: 0, dirY: 0, size: 10, maxTicks: 10 });
  fenrirDodged(s);
  return true;
}

/** 방어력·피해 감소로 줄인 받는 피해 */
export function extraTaken(p: PlayerState, taken: number): number {
  const ex = extraOf(p);
  if (ex.defense > 0) taken *= 100 / (100 + ex.defense);
  if (ex.reduction > 0) taken *= 1 - Math.min(R.REDUCTION_MAX, ex.reduction);
  return setTaken(p, taken);
}

/** 예리함이 걸린 적이 더 받는 피해 (방랑객 깊은 상처: 더 크게) + 훅 갈고리 약화 스택 */
export const sharpBonus = (s: RunState, e: EnemyState) =>
  ((e.sharpT ?? 0) > s.tick ? (hasPerk(s.player, "wdDeep") ? WANDERER_PERKS.wdDeep.def : R.SHARP_DEF) : 0) + (e.hkMark ?? 0) * HOOK.markTaken;

/** 적을 맞힌 뒤: 흡혈 · 예리함 (확률로 방어 깎기 + 출혈) */
export function onHitExtra(s: RunState, e: EnemyState, dmg: number): void {
  const ex = extraOf(s.player);
  if (dmg <= 0) return;
  hiddenOnHit(s, e, dmg);
  factionHit(s, e);
  moonHit(s, e, dmg);
  setOnHit(s, e, dmg);
  accOnHit(s, e, dmg);
  if (ex.lifesteal > 0) healPlayer(s, dmg * ex.lifesteal);
  // 예리함 (방랑객 숫돌: 더 자주) · 터지면 칼빛 효과
  const sharp = ex.sharpness + (hasPerk(s.player, "wdHone") ? WANDERER_PERKS.wdHone.add : 0);
  if (sharp > 0 && e.hp > 0 && roll(s, "sharp", e.id) < sharp) {
    e.sharpT = s.tick + R.SHARP_TICKS;
    applyBleed(e);
    addEffect(s, { kind: "wdSharp", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 6, maxTicks: 12 });
  }
}

/** 상태이상 피해 배율 · 돈 획득 배율 */
export const statusMul = (p: PlayerState) => 1 + extraOf(p).statusPower;
export const goldMul = (p: PlayerState) => 1 + extraOf(p).goldGain;

/** 틱마다: 재생력 · 예리함 출혈 (거너는 총에서 이미 출혈을 셈) */
export function extraTick(s: RunState): void {
  const p = s.player;
  const ex = extraOf(p);
  // 느아르 제약의 재생 가속: 더 빨리 참
  if (ex.regen > 0 && s.tick % R.REGEN_EVERY === 0 && p.hp > 0) healPlayer(s, (ex.regen / 10) * (R.REGEN_EVERY / 60) * noirRegenMul(p));
  const bleeds = ex.sharpness > 0 || weaponOf(p).kind === "gun";
  if (ex.sharpness > 0 && weaponOf(p).kind !== "gun") updateBleed(s);
  setTick(s, bleeds);
  factionTick(s);
  accTick(s);
}
