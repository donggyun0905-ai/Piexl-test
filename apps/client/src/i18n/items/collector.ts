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
  slash: (n) => (n > 1 ? c(`앞을 부채꼴로 ${n}번 벰`, `slashes ahead ${n} times`, `前方を扇状に${n}回斬る`) : c("앞을 부채꼴로 벰", "slashes in an arc ahead", "前方を扇状に斬る")),
  dash: () => c("앞으로 내달리며 벰", "dashes forward, cutting through", "前へ駆け抜けて斬る"),
  nova: () => c("내 둘레가 터짐", "bursts all around you", "自分の周りが爆発"),
  orb: () => c("노린 적 자리에 구체가 터짐", "an orb bursts on the target", "狙った敵の位置で球が炸裂"),
  arrows: (n) => c(`화살 ${n}발을 부채꼴로`, `${n} arrows in a fan`, `矢${n}本を扇状に`),
  bolt: () => c("길게 꿰뚫는 한 발", "one long piercing bolt", "長く貫く一撃"),
  shots: (n) => c(`앞으로 ${n}발`, `${n} shots ahead`, `前方へ${n}発`),
  rain: (n) => c(`둘레 적 ${n}마리 위로 별이 떨어짐`, `stars fall on ${n} nearby foes`, `周りの敵${n}体に星が降る`),
  beam: () => c("굵은 빛줄기", "a thick beam", "太い光線"),
  thrust: () => c("길게 찌름", "a long thrust", "長く突く"),
  spin: (n) => c(`둘레를 ${n}번 회전 베기`, `spins ${n} times around you`, `周りを${n}回回転斬り`),
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
  const head = c("콤보 +1칸: ", "Combo +1: ", "コンボ+1：")[lang];
  return head + parts.join(" · ");
}
