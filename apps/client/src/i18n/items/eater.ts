// 이터(헬리오스) 글자 (한·영·일): 그림자 무기 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsEater·EATER_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type EaterPassive = "eaGluttony" | "eaHunger" | "eaMaw" | "eaFang" | "eaAbyss" | "eaDevour" | "eaFeast" | "eaFrenzy" | "eaShade" | "eaEcho";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const EATER_WEAPON_NAMES: Record<"shadowMaw" & WeaponId, Names> = {
  shadowMaw: c("이빨 달린 그림자", "Fanged Shadow", "牙ある影"),
};

/** 무기 설명 (무기 설명 뒤에 붙음) */
export const MAW_DESC = c(
  "누를 때마다 열 가지 중 하나가 확률로: 그림자 베기 · 검기 셋 · 물어뜯기 · 심연의 괴물 · 그림자 창 · 뒤에서 솟는 창 연타 · X자 가르기 · 돌진해 씹기 · 세 번 씹기 · 땅에서 솟아 낚아채기(약한 적은 삼킴) · 먹은 적마다 재생력 +0.1 (상한 100) · 재생력 10마다 공격력 +3 · 모든 공격이 범위",
  "Each press picks one of ten at random: shadow slash · three blades · bite · abyssal beast · shadow spear · spear barrage from behind · X-cut · dash bite · triple bite · ambush from below (swallows weak foes) · +0.1 regen per foe eaten (max 100) · +3 damage per 10 regen · every attack hits an area",
  "押すたびに10種のどれかが確率で：影斬り · 剣気3つ · 噛みつき · 深淵の怪物 · 影の槍 · 背後からの槍連打 · X字斬り · 突進噛み · 三度噛み · 地中からの捕食（弱った敵は丸呑み）· 喰った敵ごとに再生力+0.1（上限100）· 再生力10ごとに攻撃力+3 · すべての攻撃が範囲",
);

export const EATER_PASSIVE_NAMES: Record<EaterPassive & PassiveId, Names> = {
  eaGluttony: c("폭식", "Gluttony", "暴食"),
  eaHunger: c("끝없는 허기", "Endless Hunger", "果てなき飢え"),
  eaMaw: c("커다란 아가리", "Gaping Maw", "大きな顎"),
  eaFang: c("이빨 갈기", "Whetted Fangs", "牙研ぎ"),
  eaAbyss: c("심연의 부름", "Call of the Abyss", "深淵の呼び声"),
  eaDevour: c("통째로 삼키기", "Devour Whole", "丸呑み"),
  eaFeast: c("포식", "Feast", "捕食"),
  eaFrenzy: c("굶주린 광기", "Starved Frenzy", "飢えた狂気"),
  eaShade: c("그림자 몸", "Shadow Body", "影の体"),
  eaEcho: c("메아리", "Echo", "こだま"),
};

export const EATER_EFFECTS: Partial<Record<EaterPassive & PassiveId, Names>> = {
  eaGluttony: c("먹을 때마다 재생력이 두 배로 참", "Each foe eaten adds twice the regen", "喰うたびに再生力が2倍たまる"),
  eaHunger: c("재생력 상한 {max}", "Regen cap becomes {max}", "再生力の上限{max}"),
  eaMaw: c("공격 범위 +{mul:up}%", "Attack reach +{mul:up}%", "攻撃範囲+{mul:up}%"),
  eaFang: c("물어뜯기·심연·세 번 씹기·낚아채기 피해 +{mul:up}%", "Bite, abyss, triple bite and ambush damage +{mul:up}%", "噛みつき・深淵・三度噛み・捕食のダメージ+{mul:up}%"),
  eaAbyss: c("심연·낚아채기가 두 배로 자주, 심연이 더 넓게", "Abyss and ambush come twice as often, and the abyss is wider", "深淵・捕食が2倍出やすく、深淵が広く"),
  eaDevour: c("모든 물기가 체력 {below:pct}% 이하인 일반 적을 삼킴", "Every bite swallows normal foes at or below {below:pct}% HP", "すべての噛みつきが体力{below:pct}%以下の通常の敵を丸呑み"),
  eaFeast: c("적을 먹으면 체력 {heal} 회복", "Heal {heal} HP for each foe eaten", "敵を喰うと体力{heal}回復"),
  eaFrenzy: c("먹은 적 {per}마리마다 공격 속도 +{speed:pct}% (최대 +{max:pct}%)", "Attack speed +{speed:pct}% per {per} foes eaten (max +{max:pct}%)", "喰った敵{per}体ごとに攻撃速度+{speed:pct}%（最大+{max:pct}%）"),
  eaShade: c("받는 피해 -{taken:down}%", "Damage taken -{taken:down}%", "被ダメージ-{taken:down}%"),
  eaEcho: c("{chance:pct}% 확률로 공격이 한 번 더", "{chance:pct}% chance to attack once more", "{chance:pct}%の確率でもう一度攻撃"),
};
