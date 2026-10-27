// 아스칼론 잊혀진 자 글자 (한·영·일): 빛 무기 이름·설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsForgotten·FORGOTTEN_PERKS와 맞춤)
import type { LightStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type FgWeapon = "fgGrace" | "fgTathagata" | "fgSpear" | "fgNova" | "fgRain" | "fgWing" | "fgPrism" | "fgHalo" | "fgJudge" | "fgDawn";
type FgPassive = "fgMemory" | "fgEcho" | "fgPillar" | "fgMany" | "fgBless" | "fgShine" | "fgCross" | "fgPulse" | "fgHeal" | "fgAfter";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const FG_WEAPON_NAMES: Record<FgWeapon & WeaponId, Names> = {
  fgGrace: c("빛의 손길", "Touch of Light", "光の手"),
  fgTathagata: c("여래신장", "Tathagata Palm", "如来神掌"),
  fgSpear: c("빛의 창", "Spear of Light", "光の槍"),
  fgNova: c("성광", "Holy Flash", "聖光"),
  fgRain: c("빛비", "Light Rain", "光の雨"),
  fgWing: c("빛의 날개", "Wings of Light", "光の翼"),
  fgPrism: c("프리즘", "Prism", "プリズム"),
  fgHalo: c("후광", "Halo", "後光"),
  fgJudge: c("심판의 빛", "Light of Judgment", "審判の光"),
  fgDawn: c("새벽 베기", "Dawn Cleave", "暁の斬撃"),
};

/** 빛 무기 설명 (모양에서 만듦) */
export function lightDesc(st: LightStyle, lang: Lang): string {
  const n = st.n;
  const shape: Record<LightStyle["pattern"], Names> = {
    bolt: c(`빛 탄 ${n}갈래`, `${n} light bolts`, `光弾${n}本`),
    beam: n > 1 ? c(`갈라지는 빛줄기 ${n}`, `${n} split light beams`, `分かれる光線${n}本`) : c("모두 꿰뚫는 빛줄기", "a light beam that pierces all", "すべて貫く光線"),
    nova: c("몸 둘레로 빛이 터짐", "light bursts around you", "体の周りで光が弾ける"),
    fall: c(`하늘에서 빛 십자가 ${n}개가 떨어짐`, `${n} light crosses fall from the sky`, `空から光の十字架${n}つが落ちる`),
    slash: c("앞쪽을 넓게 가르는 빛의 검", "a wide sword of light ahead", "前方を広く斬る光の剣"),
  };
  const parts: Names[] = [shape[st.pattern]];
  if (st.ring) parts.push(c(`사방으로 빛 탄 ${st.ring}`, `${st.ring} bolts in all directions`, `四方へ光弾${st.ring}`));
  if (st.slow) parts.push(c("맞으면 느려짐", "slows on hit", "当たると鈍化"));
  return parts.map((p) => p[lang]).join(" · ");
}

export const FG_PASSIVE_NAMES: Record<FgPassive & PassiveId, Names> = {
  fgMemory: c("잊힌 기억", "Forgotten Memory", "忘れられた記憶"),
  fgEcho: c("신의 잔향", "Echo of the Gods", "神の残響"),
  fgPillar: c("빛기둥 강화", "Brighter Pillars", "光柱強化"),
  fgMany: c("늘어나는 기둥", "More Pillars", "増える光柱"),
  fgBless: c("신의 가호", "Divine Ward", "神の加護"),
  fgShine: c("광휘", "Radiance", "光輝"),
  fgCross: c("성흔", "Stigma", "聖痕"),
  fgPulse: c("빛의 박동", "Pulse of Light", "光の鼓動"),
  fgHeal: c("깨어남", "Awakening", "目覚め"),
  fgAfter: c("잔광", "Afterglow", "残光"),
};

export const FG_EFFECTS: Partial<Record<FgPassive & PassiveId, Names>> = {
  fgMemory: c("빛의 고리가 {kills}번 맞히면 참 (원래 40)", "The ring of light fills after {kills} hits (was 40)", "光の輪が{kills}回の命中で満ちる（元は40）"),
  fgEcho: c("신족 10초 → {ticks:sec}초", "Divine form 10s → {ticks:sec}s", "神族10秒 → {ticks:sec}秒"),
  fgPillar: c("빛기둥 피해 30% → {mul:pct}%", "Pillar damage 30% → {mul:pct}%", "光柱のダメージ30% → {mul:pct}%"),
  fgMany: c("빛기둥 +{n}", "+{n} pillars", "光柱+{n}"),
  fgBless: c("신족인 동안 받는 피해 -{taken:down}%", "-{taken:down}% damage taken in divine form", "神族の間、被ダメージ-{taken:down}%"),
  fgShine: c("빛 공격이 광휘를 남김 (1초마다 피해의 {mul:pct}%, {ticks:sec}초)", "Light attacks leave radiance ({mul:pct}% of the hit per second for {ticks:sec}s)", "光の攻撃が光輝を残す（毎秒ダメージの{mul:pct}%、{ticks:sec}秒）"),
  fgCross: c("{every}번째 공격마다 가까운 적 위로 빛 십자가 (공격력 {mul:pct}%)", "Every {every}th attack drops a light cross on a nearby foe ({mul:pct}%)", "{every}回目の攻撃ごとに近くの敵へ光の十字架（攻撃力{mul:pct}%）"),
  fgHeal: c("신족이 될 때 최대 체력 {hp:pct}% 회복", "Heal {hp:pct}% max HP on entering divine form", "神族になる時、最大体力の{hp:pct}%回復"),
  fgAfter: c("신족이 끝날 때 둘레에 큰 빛 폭발 (공격력 {mul:pct}%)", "A great burst of light when divine form ends ({mul:pct}%)", "神族が終わる時、周りに大きな光の爆発（攻撃力{mul:pct}%）"),
};
