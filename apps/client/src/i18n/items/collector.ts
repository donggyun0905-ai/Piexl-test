// 수집가 글자 (한·영·일): 기본 검 · 수집 무기 30 이름 · 수집 무기 설명(기술 표 CL_ARMS에서 만듦)
import { CL_ARMS, type ClArmId, type ClFx } from "@pixel-rogue/shared";
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

/** 무기마다 공격 (sim/collectorMoves와 맞춤) */
const MOVE: Record<ClArmId, Names> = {
  clHolySword: c("빛나는 검격", "a radiant slash", "輝く斬撃"),
  clBloodSword: c("X자로 두 번 베기 (/ → \\)", "an X slash: / then \\", "X字に二回斬る（/ → \\）"),
  clIceSword: c("앞을 내려찍고 그 자리에 얼음 가시", "slams down ahead, raising ice spikes", "前方を叩きつけその場に氷の棘"),
  clSunSword: c("한 바퀴 베기", "a full spinning slash", "一回転斬り"),
  clVoidSword: c("앞을 반원으로 크게 벰", "a huge half-circle slash ahead", "前方を半円に大きく斬る"),
  clChainCleaver: c("공허의 검보다 더 넓은 부채꼴 베기", "a fan slash even wider than the Void Sword", "虚空の剣よりさらに広い扇状斬り"),
  clKatana: c("칼선으로 네 번 연속 베기", "four rapid needle-thin cuts", "刀線で四連続斬り"),
  clSunStaff: c("노린 자리에 태양 빛기둥", "a pillar of sunlight on the target", "狙った位置に太陽の光柱"),
  clVoidStaff: c("노린 자리에 블랙홀 (세 번 끌어당기며 때림)", "a black hole on the target (pulls and hits 3 times)", "狙った位置にブラックホール（3回引き寄せて攻撃）"),
  clVineStaff: c("노린 자리에 덩굴이 솟아 묶음", "vines burst up on the target and bind", "狙った位置に蔦が生えて拘束"),
  clWhiteBow: c("세 방향 유도 화살", "three homing arrows", "三方向の追尾矢"),
  clBloodBow: c("피의 화살 세 줄", "three lines of blood arrows", "血の矢を三本"),
  clIceBow: c("부채꼴로 퍼지는 얼음 화살 다섯 (맞으면 두 갈래로 갈라짐)", "five ice arrows in a fan (split in two on hit)", "扇状に広がる氷の矢5本（当たると二股に分かれる）"),
  clGoldBow: c("모든 적을 꿰뚫는 거대한 마력 화살", "a giant mana arrow that pierces everything", "すべてを貫く巨大な魔力の矢"),
  clCrossbow: c("꿰뚫는 석궁 살 (출혈)", "a piercing bolt (bleed)", "貫くクロスボウの矢（出血）"),
  clPistol: c("산탄 일곱 발이 퍼짐 · 반동으로 뒤로 밀림", "seven pellets spread like a shotgun · recoil knocks you back", "散弾7発が広がる · 反動で後ろへ"),
  clStarTome: c("몸 둘레의 별빛 여덟이 적을 쫓아감", "eight starlights around you chase foes", "体の周りの星明かり8つが敵を追う"),
  clEyeTome: c("모았다가 레이저", "charges, then fires a laser", "溜めてからレーザー"),
  clGoldFist: c("거대한 주먹 지르기 · 뒤로 충격파", "a giant punch · shockwave behind", "巨大な拳の突き · 後ろへ衝撃波"),
  clClaw: c("어둠의 발톱으로 두 번 할퀴기 (/ → \\)", "two dark claw rakes: / then \\", "闇の爪で二回引っかく（/ → \\）"),
  clBlueSpear: c("바닥을 찍고(둘레) → 앞으로 지르기", "strikes the ground (around you) → thrusts ahead", "地面を突き（周囲）→ 前へ突く"),
  clRedSpear: c("검격 → 찌르기", "a slash → a thrust", "斬撃 → 突き"),
  clIceSpear: c("앞으로 사방팔방 열 번 찌르기", "ten rapid thrusts spraying ahead", "前方へ四方八方に十連突き"),
  clGoldSpear: c("찌르기와 검격을 동시에", "a thrust and a slash at once", "突きと斬撃を同時に"),
  clStoneHammer: c("천천히 치켜들었다가 크게 휘둘러 내리침", "slowly raises, then a crushing swing", "ゆっくり振り上げて大きく振り下ろす"),
  clBloodHammer: c("휘두른 뒤 피의 칼날이 날아감", "a swing, then a blood blade flies", "振り回した後に血の刃が飛ぶ"),
  clBlueAxe: c("휘두른 뒤 푸른 검기가 날아감", "a swing, then a blue slash wave flies", "振り回した後に青い剣気が飛ぶ"),
  clRedAxe: c("빠르게 세 번 휘두르기", "three rapid swings", "素早く三回振る"),
  clScythe: c("왼쪽으로 · 위에서 아래로 · 왼쪽에서 오른쪽으로 세 번 휘두르기", "three reaps: leftward · top to bottom · left to right", "左へ · 上から下へ · 左から右へ三回振る"),
  clCrescent: c("되돌아오는 칼날 둘 + 앞으로 검격 두 번", "two returning blades + two slashes ahead", "戻ってくる刃2つ＋前へ斬撃2回"),
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
  const parts = [MOVE[id][lang], `${Math.round(a.mul * 100)}%`];
  if (a.fx) parts.push(FX[a.fx](a.val ?? 0)[lang]);
  const head = c("콤보 +1칸 (공격 한 번에 콤보 전체가 이어짐): ", "Combo +1 (one attack chains the whole combo): ", "コンボ+1（一回の攻撃でコンボ全体が続く）：")[lang];
  return head + parts.join(" · ");
}
