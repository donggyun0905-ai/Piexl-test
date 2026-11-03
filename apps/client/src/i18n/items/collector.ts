// 수집가 글자 (한·영·일): 기본 검 · 수집 무기 30 이름 · 수집 무기 설명(기술 표 CL_ARMS에서 만듦)
import { CL_ARMS, type ClArmId, type ClFx, type ClStyle } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const CL_WEAPON_NAMES = { clBlade: c("수집가의 검", "Collector's Blade", "コレクターの剣") };

export const CL_PASSIVE_NAMES: Record<ClArmId, Names> = {
  clHolySword: c("성검", "Holy Sword", "聖剣"),
  clBloodSword: c("피의 검", "Blood Sword", "血の剣"),
  clIceSword: c("서리 검", "Frost Sword", "霜の剣"),
  clSunSword: c("태양 검", "Sun Sword", "太陽の剣"),
  clVoidSword: c("공허의 검", "Void Sword", "虚空の剣"),
  clChainCleaver: c("사슬 큰칼", "Chain Cleaver", "鎖の大鉈"),
  clKatana: c("붉은 카타나", "Crimson Katana", "紅の刀"),
  clSunStaff: c("태양 지팡이", "Sun Staff", "太陽の杖"),
  clVoidStaff: c("공허 구슬 지팡이", "Void Orb Staff", "虚空珠の杖"),
  clVineStaff: c("덩굴 지팡이", "Vine Staff", "蔦の杖"),
  clWhiteBow: c("흰 날개 활", "White Wing Bow", "白翼の弓"),
  clBloodBow: c("피의 활", "Blood Bow", "血の弓"),
  clIceBow: c("얼음 활", "Ice Bow", "氷の弓"),
  clGoldBow: c("황금 활", "Golden Bow", "黄金の弓"),
  clCrossbow: c("석궁", "Crossbow", "クロスボウ"),
  clPistol: c("쌍열 권총", "Twin-Barrel Pistol", "二連拳銃"),
  clStarTome: c("별의 마법서", "Star Tome", "星の魔導書"),
  clEyeTome: c("눈의 마법서", "Eye Tome", "瞳の魔導書"),
  clGoldFist: c("황금 건틀릿", "Golden Gauntlet", "黄金の籠手"),
  clClaw: c("어둠의 발톱", "Shadow Claw", "闇の鉤爪"),
  clBlueSpear: c("푸른 창", "Azure Spear", "蒼の槍"),
  clRedSpear: c("붉은 창", "Crimson Spear", "紅の槍"),
  clIceSpear: c("얼음 창", "Ice Spear", "氷の槍"),
  clGoldSpear: c("황금 창", "Golden Spear", "黄金の槍"),
  clStoneHammer: c("돌 망치", "Stone Hammer", "石の大槌"),
  clBloodHammer: c("피의 망치", "Blood Hammer", "血の大槌"),
  clBlueAxe: c("푸른 도끼", "Azure Axe", "蒼の斧"),
  clRedAxe: c("붉은 도끼", "Crimson Axe", "紅の斧"),
  clScythe: c("해골 낫", "Skull Scythe", "髑髏の鎌"),
  clCrescent: c("쌍월 칼날", "Twin Crescent", "双月の刃"),
};

const STYLE: Record<ClStyle, (n: number) => Names> = {
  sweep: () => c("등 뒤에서 날아 나와 내 둘레를 한 바퀴 휘돎", "flies off your back and whirls once around you", "背中から飛び出し自分の周りを一周する"),
  reap: () => c("거대한 낫이 앞을 크게 쓸어 벰", "a giant scythe reaps a wide arc ahead", "巨大な鎌が前方を大きく薙ぐ"),
  chop: () => c("노린 적 위로 떨어져 내리찍음", "drops onto the target and slams down", "狙った敵の上に落ちて叩きつける"),
  iai: () => c("앞으로 내달리며 발도", "dashes forward with a drawing cut", "前へ駆け抜けて抜刀"),
  cast: () => c("지팡이가 떠올라 노린 적 자리에 마법", "the staff rises and casts on the target", "杖が浮かび狙った敵の位置に魔法"),
  volley: (n) => (n > 1 ? c(`나타나 ${n}발을 쏨`, `appears and fires ${n} shots`, `現れて${n}発撃つ`) : c("나타나 꿰뚫는 한 발", "appears and fires one piercing bolt", "現れて貫く一撃")),
  throw: (n) => (n > 1 ? c(`던져 앞을 꿰뚫고 ${n}번 벰`, `thrown to pierce ahead, hitting ${n} times`, `投げて前方を貫き${n}回斬る`) : c("던져 앞을 꿰뚫음", "thrown to pierce ahead", "投げて前方を貫く")),
  stars: (n) => c(`둘레 적 ${n}마리 위로 별이 떨어짐`, `stars fall on ${n} nearby foes`, `周りの敵${n}体に星が降る`),
  beam: () => c("책이 펼쳐지며 굵은 빛줄기", "the tome opens and fires a thick beam", "本が開き太い光線"),
  punch: () => c("거대한 주먹이 앞으로 뻗음", "a giant fist punches ahead", "巨大な拳が前へ伸びる"),
  claw: (n) => c(`노린 적을 ${n}번 X자로 할큄`, `claws the target in an X ${n} times`, `狙った敵を${n}回X字に引っかく`),
  whirl: (n) => c(`도끼가 내 둘레를 ${n}바퀴 돌며 벰`, `the axe circles you ${n} times, cutting`, `斧が自分の周りを${n}周して斬る`),
};

const FX: Record<ClFx, (v: number) => Names> = {
  heal: (v) => c(`맞히면 체력 ${v} 회복`, `heals ${v} HP on hit`, `当たると体力${v}回復`),
  leech: (v) => c(`준 피해 ${Math.round(v * 100)}% 회복`, `heals ${Math.round(v * 100)}% of damage`, `与ダメージの${Math.round(v * 100)}%回復`),
  slow: () => c("느려짐", "slows", "鈍化"),
  burn: () => c("불태움", "burns", "炎上"),
  pull: () => c("끌어당김", "pulls foes in", "引き寄せ"),
  push: () => c("밀쳐 냄", "knocks back", "吹き飛ばし"),
  stun: () => c("기절", "stuns", "気絶"),
  root: () => c("묶음", "roots", "拘束"),
  bleed: () => c("출혈", "bleeds", "出血"),
};

/** 수집 무기 설명: 콤보 기술 (모양·피해·추가 효과) */
export function collectorArmDesc(id: ClArmId, lang: Lang): string {
  const a = CL_ARMS[id];
  const parts = [STYLE[a.style](a.n ?? 1)[lang], `${Math.round(a.mul * 100)}%`];
  if (a.fx) parts.push(FX[a.fx](a.val ?? 0)[lang]);
  const head = c("콤보 +1칸 (공격 한 번에 콤보 전체가 이어짐): ", "Combo +1 (one attack chains the whole combo): ", "コンボ+1（一回の攻撃でコンボ全体が続く）：")[lang];
  return head + parts.join(" · ");
}
