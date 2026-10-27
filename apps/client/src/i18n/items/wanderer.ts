// 아스칼론 방랑객 글자 (한·영·일): 카타나 이름·설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsWanderer·WANDERER_PERKS와 맞춤)
import type { KatanaStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type WdWeapon = "wdKatana" | "wdIai" | "wdZone" | "wdStorm" | "wdTempest" | "wdCrescent" | "wdTwin" | "wdNodachi" | "wdFlurry" | "wdMoon";
type WdPassive = "wdHone" | "wdDeep" | "wdCalm" | "wdWind" | "wdSheath" | "wdGauge" | "wdRonin" | "wdFocus" | "wdRain" | "wdBlink";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const WD_WEAPON_NAMES: Record<WdWeapon & WeaponId, Names> = {
  wdKatana: c("방랑 카타나", "Wanderer's Katana", "流浪の刀"),
  wdIai: c("발도", "Quick Draw", "抜刀"),
  wdZone: c("무심의 원", "Circle of No-Mind", "無心の円"),
  wdStorm: c("칼날 폭풍", "Blade Storm", "刃の嵐"),
  wdTempest: c("천검란", "Thousand Swords", "千剣乱"),
  wdCrescent: c("초승달 베기", "Crescent Cut", "三日月斬り"),
  wdTwin: c("이도류", "Two Swords", "二刀流"),
  wdNodachi: c("노다치", "Nodachi", "野太刀"),
  wdFlurry: c("연참", "Flurry", "連斬"),
  wdMoon: c("달빛 일섬", "Moonlit Flash", "月光一閃"),
};

/** 카타나 설명 (모양에서 만듦) */
export function katanaDesc(st: KatanaStyle, lang: Lang): string {
  const mode: Record<KatanaStyle["mode"], Names> = {
    slash: (st.hits ?? 1) > 1 ? c(`${st.hits}번 잇따라 벰`, `${st.hits} cuts in a row`, `${st.hits}回続けて斬る`) : st.arc < 0 ? c("길고 넓게 벰", "long, wide cuts", "長く広く斬る") : c("앞쪽을 벰", "cuts ahead", "前方を斬る"),
    iai: c("칼을 뽑으며 앞으로 길게 한 줄", "draws and cuts a long line ahead", "抜きながら前方へ長く一直線"),
    zone: c("1초 가만히 서면 큰 원이 펼쳐지고 원에 들어온 적은 거리와 상관없이 바로 베임 · 대시하면 원 안 적이 모두 멈추고 크게 베이며 앞으로 발도 급습", "stand still 1s to open a wide circle; foes inside are cut instantly at any range · dashing freezes every foe inside, cuts them hard and you quick-draw forward", "1秒じっとすると大きな円が開き、円に入った敵は距離に関係なく即座に斬られる · ダッシュで円の中の敵が全員止まり大きく斬られ、前へ抜刀奇襲"),
    storm: c("꿰뚫고 나아가는 칼날 폭풍을 날림", "sends piercing blade storms", "貫いて進む刃の嵐を放つ"),
    tempest: c("벨 때마다 게이지가 차고, 가득 차면 방 전체에 칼날 폭풍 (공격력 120% × 5)", "cuts fill a gauge; when full, a blade storm hits the whole room (120% × 5)", "斬るたびにゲージが溜まり、満ちると部屋全体に刃の嵐（攻撃力120%×5）"),
    lunge: c("앞으로 길게 내달리고 2초 뒤 지나간 줄의 적이 한꺼번에 베임", "dashes far forward; 2s later every foe on the line is cut at once", "前へ長く駆け抜け、2秒後に通った線上の敵がまとめて斬られる"),
  };
  const parts: Names[] = [mode[st.mode]];
  if (st.waves && st.mode !== "storm") parts.push(c("초승달 검기를 날림", "sends a crescent wave", "三日月の剣気を放つ"));
  return parts.map((p) => p[lang]).join(" · ");
}

export const WD_PASSIVE_NAMES: Record<WdPassive & PassiveId, Names> = {
  wdHone: c("숫돌", "Whetstone", "砥石"),
  wdDeep: c("깊은 상처", "Deep Wound", "深い傷"),
  wdCalm: c("명경지수", "Still Water", "明鏡止水"),
  wdWind: c("바람의 칼", "Wind Blade", "風の刃"),
  wdSheath: c("납도", "Sheathe", "納刀"),
  wdGauge: c("검기 응축", "Condensed Edge", "剣気凝縮"),
  wdRonin: c("낭인의 걸음", "Ronin's Stride", "浪人の歩み"),
  wdFocus: c("집중", "Focus", "集中"),
  wdRain: c("피의 비", "Blood Rain", "血の雨"),
  wdBlink: c("잔월", "Waning Moon", "残月"),
};

export const WD_EFFECTS: Partial<Record<WdPassive & PassiveId, Names>> = {
  wdHone: c("예리함 +{add:pct}%", "Sharpness +{add:pct}%", "鋭さ+{add:pct}%"),
  wdDeep: c("예리함이 터진 적이 받는 피해 25% → {def:pct}%", "Sharpened foes take 25% → {def:pct}% more damage", "鋭さが発動した敵の被ダメージ25% → {def:pct}%"),
  wdCalm: c("가만히 서 있을 때 피해 +{mul:up}% · 무심의 원 +{r:up}%", "+{mul:up}% damage while still · Circle +{r:up}%", "じっとしている時ダメージ+{mul:up}% · 無心の円+{r:up}%"),
  wdWind: c("검기·칼날 폭풍 +{n}", "+{n} wave / blade storm", "剣気・刃の嵐+{n}"),
  wdSheath: c("{rest:sec}초 쉬었다 벤 첫 칼은 피해 {mul}배", "The first cut after {rest:sec}s of rest deals ×{mul}", "{rest:sec}秒休んだ後の最初の一太刀は{mul}倍"),
  wdGauge: c("천검란 게이지가 {mul:up}% 빨리 참", "Thousand Swords gauge fills {mul:up}% faster", "千剣乱のゲージが{mul:up}%早く溜まる"),
  wdRain: c("적을 쓰러뜨리면 둘레 적에게 출혈", "Kills make nearby foes bleed", "敵を倒すと周りの敵に出血"),
  wdBlink: c("대시한 길을 따라 벰 (공격력 {mul:pct}%)", "Cuts along your dash path ({mul:pct}%)", "ダッシュした道に沿って斬る（攻撃力{mul:pct}%）"),
};
