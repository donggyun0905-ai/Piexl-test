// 성국 세레나 글자 (한·영·일): 강철 가시 채찍 & 맹독성 에테르 비수 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsSerena·SERENA_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type SnPassive =
  | "snThorn" | "snBarb" | "snNumb" | "snVenom" | "snBloom" | "snChain" | "snReach" | "snSpin" | "snEdge" | "snEther"
  | "snGrace" | "snFatal" | "snTempo" | "snLash" | "snMirage" | "snWing" | "snPerfume" | "snQuiver" | "snNight" | "snMuse";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const SN_WEAPON_NAMES: Record<"snWhip" & WeaponId, Names> = {
  snWhip: c("강철 가시 채찍 & 맹독성 에테르 비수", "Steel Thorn Whip & Venom Ether Daggers", "鋼の棘の鞭＆猛毒のエーテル短剣"),
};

export const SN_PASSIVE_NAMES: Record<SnPassive & PassiveId, Names> = {
  snThorn: c("장미 가시", "Rose Thorns", "薔薇の棘"),
  snBarb: c("미늘", "Barbs", "かえし"),
  snNumb: c("마취 향", "Numbing Incense", "痺れの香"),
  snVenom: c("맹독 꽃", "Venom Blossom", "猛毒の花"),
  snBloom: c("가시 꽃망울", "Thorn Bud", "棘のつぼみ"),
  snChain: c("두 겹 사슬", "Doubled Chain", "二重の鎖"),
  snReach: c("긴 사슬", "Long Chain", "長い鎖"),
  snSpin: c("빠른 손목", "Quick Wrist", "速い手首"),
  snEdge: c("벼린 비수", "Honed Dagger", "研いだ短剣"),
  snEther: c("에테르 결정", "Ether Crystal", "エーテル結晶"),
  snGrace: c("무희의 눈길", "Dancer's Glance", "舞姫の眼差し"),
  snFatal: c("치명적인 입맞춤", "Fatal Kiss", "致命の口づけ"),
  snTempo: c("끝없는 박자", "Endless Tempo", "終わらない拍子"),
  snLash: c("긴 소매", "Long Sleeves", "長い袖"),
  snMirage: c("신기루 베일", "Mirage Veil", "蜃気楼のヴェール"),
  snWing: c("날개 신", "Winged Shoes", "翼の靴"),
  snPerfume: c("매혹의 향수", "Alluring Perfume", "魅惑の香水"),
  snQuiver: c("비수 꾸러미", "Dagger Bundle", "短剣の束"),
  snNight: c("한밤의 무대", "Midnight Stage", "真夜中の舞台"),
  snMuse: c("뮤즈의 축복", "Muse's Blessing", "ミューズの祝福"),
};

export const SN_EFFECTS: Partial<Record<SnPassive & PassiveId, Names>> = {
  snThorn: c("가시 최대 +{more}개", "+{more} max thorns", "棘の最大+{more}"),
  snBarb: c("가시 피해 {mul}배", "{mul}x thorn damage", "棘のダメージ{mul}倍"),
  snNumb: c("마비 시간 {mul}배", "{mul}x Numb duration", "麻痺時間{mul}倍"),
  snVenom: c("마비된 적이 받는 피해 +{taken:pct}% 더", "Numbed foes take +{taken:pct}% more damage", "麻痺した敵が受けるダメージさらに+{taken:pct}%"),
  snBloom: c("가시가 가득 찬 적을 쓰러뜨리면 가시가 터져 둘레 적에게 피해 ({mul:pct}%) · 가시 +{thorns}", "Killing a foe full of thorns bursts them onto nearby foes ({mul:pct}%) · +{thorns} thorns", "棘が満タンの敵を倒すと棘が弾けて周りの敵にダメージ（{mul:pct}%）· 棘+{thorns}"),
  snChain: c("도는 사슬 채찍 +{more}", "+{more} orbiting chain whip", "周回する鎖鞭+{more}"),
  snReach: c("도는 사슬 채찍 반지름 {r}배", "Orbiting chain whips circle {r}x wider", "周回する鎖鞭の半径{r}倍"),
  snSpin: c("도는 사슬 채찍이 같은 적을 {every}배 간격으로 다시 침", "Orbiting chain whips re-hit the same foe at {every}x the interval", "周回する鎖鞭が同じ敵を{every}倍の間隔で再び打つ"),
  snEdge: c("도는 사슬 채찍 피해 {mul}배", "{mul}x orbiting chain whip damage", "周回する鎖鞭のダメージ{mul}倍"),
  snEther: c("빛 피해 추가 {mul}배", "{mul}x bonus light damage", "光ダメージ追加{mul}倍"),
  snGrace: c("치명타 확률 +{crit:pct}%", "+{crit:pct}% crit chance", "会心率+{crit:pct}%"),
  snFatal: c("치명타 배율 +{critMul}", "+{critMul} crit multiplier", "会心倍率+{critMul}"),
  snTempo: c("환혹의 회오리 +{more}번", "Bewitching Whirl sweeps +{more} more time", "幻惑の旋風+{more}回"),
  snLash: c("1·2타 채찍 거리 {r}배", "Lashes 1 and 2 reach {r}x farther", "1・2撃目の鞭の距離{r}倍"),
  snMirage: c("환혹의 스텝 뒤 {ticks:sec}초 동안 주는 피해 {mul}배", "For {ticks:sec}s after Bewitching Step, deal {mul}x damage", "幻惑のステップ後{ticks:sec}秒間、与えるダメージ{mul}倍"),
  snWing: c("환혹의 스텝 거리 {dist}배 · 피해 {mul}배", "Bewitching Step {dist}x distance · {mul}x damage", "幻惑のステップの距離{dist}倍 · ダメージ{mul}倍"),
  snPerfume: c("매혹 반지름 {r}배 · 시간 {ticks}배", "Allure {r}x radius · {ticks}x duration", "魅惑の半径{r}倍 · 時間{ticks}倍"),
  snQuiver: c("맹독 비수 +{more}개 · 더 넓은 부채꼴", "Venom Daggers +{more} · wider cone", "猛毒の短剣+{more}本 · より広い扇形"),
  snNight: c("환혹의 무도 {more:sec}초 더", "Dance of Bewitchment lasts {more:sec}s longer", "幻惑の舞が{more:sec}秒長い"),
  snMuse: c("모든 스킬 대기 -{cd:down}%", "-{cd:down}% all skill cooldowns", "全スキル待機-{cd:down}%"),
};
