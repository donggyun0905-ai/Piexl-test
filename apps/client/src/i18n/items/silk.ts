// 아스칼론 영사 글자 (한·영·일): 실 무기 이름·설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsSilk·SILK_PERKS와 맞춤)
import type { PassiveId, SilkStyle, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type SkWeapon = "skThread" | "skTwin" | "skWeb" | "skSteel" | "skCrimson" | "skNeedle" | "skHarp" | "skSpool" | "skMarionette" | "skCocoon";
type SkPassive = "skFast" | "skMore" | "skEdge" | "skRend" | "skTangle" | "skFrenzy" | "skBlood" | "skAgile" | "skHaste" | "skShield";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const SK_WEAPON_NAMES: Record<SkWeapon & WeaponId, Names> = {
  skThread: c("영사의 실", "Silken Thread", "影糸"),
  skTwin: c("쌍실", "Twin Threads", "双糸"),
  skWeb: c("거미줄", "Spider Web", "蜘蛛の巣"),
  skSteel: c("강철실", "Steel Wire", "鋼糸"),
  skCrimson: c("핏빛 실", "Crimson Thread", "緋の糸"),
  skNeedle: c("바늘실", "Needle Thread", "針糸"),
  skHarp: c("하프 현", "Harp Strings", "竪琴の弦"),
  skSpool: c("큰 실패", "Great Spool", "大糸巻き"),
  skMarionette: c("마리오네트", "Marionette", "マリオネット"),
  skCocoon: c("고치", "Cocoon", "繭"),
};

/** 실 무기 설명 (모양에서 만듦) */
export function silkDesc(st: SilkStyle, lang: Lang): string {
  const parts: Names[] = [
    st.n > 1 ? c(`실 ${st.n}가닥을 방 끝에서 끝까지`, `${st.n} threads across the room`, `糸${st.n}本を部屋の端から端まで`) : c("실 한 가닥을 방 끝에서 끝까지", "a thread across the room", "糸1本を部屋の端から端まで"),
    c(`장전 ${st.ammo}가닥`, `${st.ammo} loaded`, `装填${st.ammo}本`),
    c(`얽힘 ${st.stacks}이면 찢기 (${Math.round(st.rendMul * 100)}% + 출혈)`, `${st.stacks} tangles rend (${Math.round(st.rendMul * 100)}% + bleed)`, `絡み${st.stacks}で引き裂く（${Math.round(st.rendMul * 100)}%＋出血）`),
  ];
  if (st.slow) parts.push(c("맞으면 느려짐", "slows on hit", "当たると鈍化"));
  if (st.linger) parts.push(c("실이 1초 동안 남아 계속 벰", "threads linger 1s and keep cutting", "糸が1秒残り斬り続ける"));
  if (st.pull) parts.push(c("찢을 때 둘레 적을 끌어당기고 얽힘 +1", "rending pulls nearby foes and tangles them", "引き裂くと周りの敵を引き寄せ絡み+1"));
  if (st.cocoon) parts.push(c("찢긴 적을 실로 감싸 멈춤", "wraps rent foes in a cocoon", "引き裂いた敵を糸で包み止める"));
  return parts.map((p) => p[lang]).join(" · ");
}

export const SK_PASSIVE_NAMES: Record<SkPassive & PassiveId, Names> = {
  skFast: c("빠른 손", "Quick Hands", "早い手"),
  skMore: c("실타래", "Skein", "糸かせ"),
  skEdge: c("날 선 실", "Edged Thread", "刃の糸"),
  skRend: c("찢는 손", "Rending Hands", "裂く手"),
  skTangle: c("얽힘", "Entangle", "絡み"),
  skFrenzy: c("폭주", "Frenzy", "暴走"),
  skBlood: c("핏방울", "Blood Drop", "血の雫"),
  skAgile: c("가벼운 걸음", "Light Step", "軽い足取り"),
  skHaste: c("손끝 감각", "Fingertip Sense", "指先の感覚"),
  skShield: c("비단 방패", "Silk Shield", "絹の盾"),
};

export const SK_EFFECTS: Partial<Record<SkPassive & PassiveId, Names>> = {
  skFast: c("장전 시간 -{mul:down}%", "Reload time -{mul:down}%", "装填時間-{mul:down}%"),
  skMore: c("장전 수 +{n}", "+{n} threads loaded", "装填数+{n}"),
  skEdge: c("실 피해 +{mul:up}%", "Thread damage +{mul:up}%", "糸のダメージ+{mul:up}%"),
  skRend: c("찢기 피해 +{add:pct}%", "Rend damage +{add:pct}%", "引き裂きダメージ+{add:pct}%"),
  skTangle: c("찢는 데 드는 얽힘 -{n}", "Rend needs {n} fewer tangles", "引き裂きに必要な絡み-{n}"),
  skFrenzy: c("실 연사가 30가닥 → {every}가닥마다", "Thread barrage every 30 → {every} threads", "糸の連射が30本 → {every}本ごと"),
  skBlood: c("찢으면 체력 {heal} 회복", "Rending heals {heal} HP", "引き裂くと体力{heal}回復"),
  skShield: c("장전하는 동안 받는 피해 -{taken:down}%", "-{taken:down}% damage taken while reloading", "装填中の被ダメージ-{taken:down}%"),
};
