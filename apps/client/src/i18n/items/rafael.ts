// 성국 라파엘 글자 (한·영·일): 천공의 마도 복합 대궁 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsRafael·RAFAEL_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type RfPassive =
  | "rfScope" | "rfReach" | "rfPierce" | "rfSteady" | "rfHead" | "rfBrand" | "rfHunt" | "rfSpotter" | "rfShard" | "rfTwin"
  | "rfEye" | "rfRain" | "rfTail" | "rfThunder" | "rfFeather" | "rfFocus" | "rfLance" | "rfWrath" | "rfHalo" | "rfPrayer";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const RF_WEAPON_NAMES: Record<"rfBow" & WeaponId, Names> = {
  rfBow: c("천공의 마도 복합 대궁 (에테르 스코프)", "Celestial Magitech Compound Bow (Ether Scope)", "天空の魔導複合大弓（エーテルスコープ）"),
};

export const RF_PASSIVE_NAMES: Record<RfPassive & PassiveId, Names> = {
  rfScope: c("정밀 스코프", "Precision Scope", "精密スコープ"),
  rfReach: c("긴 시위", "Long Bowstring", "長い弦"),
  rfPierce: c("관통 화살촉", "Piercing Arrowhead", "貫通の鏃"),
  rfSteady: c("숨 고르기", "Steady Breath", "息を整える"),
  rfHead: c("머리를 노려라", "Aim for the Head", "頭を狙え"),
  rfBrand: c("사냥꾼의 낙인", "Hunter's Brand", "狩人の烙印"),
  rfHunt: c("지휘관 사냥", "Commander Hunt", "指揮官狩り"),
  rfSpotter: c("빌린 시야", "Borrowed Sight", "借りた視界"),
  rfShard: c("파편 화살", "Shard Arrow", "破片の矢"),
  rfTwin: c("두 번째 표적", "Second Mark", "二つ目の標的"),
  rfEye: c("폭풍의 눈", "Eye of the Storm", "嵐の目"),
  rfRain: c("끝없는 비", "Endless Rain", "終わらない雨"),
  rfTail: c("순풍", "Tailwind", "追い風"),
  rfThunder: c("뇌전 화살", "Thunder Arrow", "雷電の矢"),
  rfFeather: c("바람 깃", "Wind Fletching", "風の矢羽"),
  rfFocus: c("집중", "Focus", "集中"),
  rfLance: c("넓은 빛살", "Broad Ray", "広い光条"),
  rfWrath: c("천벌", "Heaven's Wrath", "天罰"),
  rfHalo: c("후광 화살", "Halo Arrow", "後光の矢"),
  rfPrayer: c("바람의 기도", "Prayer of Wind", "風の祈り"),
};

export const RF_EFFECTS: Partial<Record<RfPassive & PassiveId, Names>> = {
  rfScope: c("초장거리 피해 최대 +{bonus:pct}% (원래 60%)", "Ultra-range damage up to +{bonus:pct}% (was 60%)", "超長距離ダメージ最大+{bonus:pct}%（元60%）"),
  rfReach: c("화살 거리 {len}배", "{len}x arrow range", "矢の距離{len}倍"),
  rfPierce: c("1·2타 화살이 적 {more}명 더 꿰뚫음", "Arrows 1 and 2 pierce {more} more foe", "1・2撃目の矢が敵を{more}体多く貫く"),
  rfSteady: c("{still:sec}초 가만히 서 있으면 피해 {mul}배", "Deal {mul}x damage after standing still for {still:sec}s", "{still:sec}秒立ち止まるとダメージ{mul}倍"),
  rfHead: c("3타 저격 피해 {mul}배", "{mul}x Snipe damage", "3撃目の狙撃ダメージ{mul}倍"),
  rfBrand: c("표적이 받는 피해 +{taken:pct}% (원래 25%)", "Marked foes take +{taken:pct}% damage (was 25%)", "標的が受けるダメージ+{taken:pct}%（元25%）"),
  rfHunt: c("표적을 쓰러뜨리면 남은 스킬 대기 -{refund:pct}% (원래 30%)", "Killing the mark cuts remaining skill cooldowns by {refund:pct}% (was 30%)", "標的を倒すと残りのスキル待機-{refund:pct}%（元30%）"),
  rfSpotter: c("1·2타 화살도 앞쪽 표적을 향함", "Arrows 1 and 2 also aim at a mark ahead", "1・2撃目の矢も前方の標的へ向かう"),
  rfShard: c("표적을 맞히면 둘레 적에게 파편 ({mul:pct}%)", "Hitting the mark sprays shards at nearby foes ({mul:pct}%)", "標的に当てると周りの敵に破片（{mul:pct}%）"),
  rfTwin: c("표적 {n}명 (두 번째로 강한 적도)", "{n} marks (the second strongest foe too)", "標的{n}体（2番目に強い敵も）"),
  rfEye: c("폭풍 화살비 반지름 {r}배", "Storm Volley {r}x radius", "嵐の矢の雨の半径{r}倍"),
  rfRain: c("폭풍 화살비 +{more}번", "Storm Volley +{more} waves", "嵐の矢の雨+{more}回"),
  rfTail: c("바람 걸음 거리 {dist}배", "Wind Step {dist}x distance", "風の歩みの距離{dist}倍"),
  rfThunder: c("저격에 맞은 적에게 번개 ({mul:pct}%)", "Snipe strikes foes with lightning ({mul:pct}%)", "狙撃に当たった敵に雷（{mul:pct}%）"),
  rfFeather: c("1·2타 화살이 밀쳐내고 {slow:sec}초 느리게 함", "Arrows 1 and 2 knock back and slow for {slow:sec}s", "1・2撃目の矢が押し出し{slow:sec}秒遅くする"),
  rfFocus: c("에테르 스코프 {more:sec}초 더", "Ether Scope lasts {more:sec}s longer", "エーテルスコープが{more:sec}秒長い"),
  rfLance: c("천공의 빛 화살 폭 {w}배", "Arrow of Heaven {w}x width", "天空の光の矢の幅{w}倍"),
  rfWrath: c("천공의 빛 화살 피해 {mul}배", "{mul}x Arrow of Heaven damage", "天空の光の矢のダメージ{mul}倍"),
  rfHalo: c("화살마다 빛 피해 추가 ({mul:pct}%)", "Every arrow deals bonus light damage ({mul:pct}%)", "矢ごとに光ダメージ追加（{mul:pct}%）"),
  rfPrayer: c("모든 스킬 대기 -{cd:down}%", "-{cd:down}% all skill cooldowns", "全スキル待機-{cd:down}%"),
};
