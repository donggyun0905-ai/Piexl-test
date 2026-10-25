// 장로(비르디아) 글자 (한·영·일): 진법 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsElder·ELDER_PERKS와 맞춤)
import type { FormationKind, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type ElderWeapon = "vineGate" | "fiveDaggers" | "crushWalls" | "pitTrap" | "swordRain" | "thunderSeal" | "frostSquare" | "windCage" | "stoneFist" | "heavenPalace";
type ElderPassive = "elSage" | "elExpand" | "elMore" | "elLinger" | "elDouble" | "elStaff" | "elTea" | "elBeard" | "elWard" | "elMaster";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const ELDER_WEAPON_NAMES: Record<ElderWeapon & WeaponId, Names> = {
  vineGate: c("덩굴문", "Vine Gate", "蔓の門"),
  fiveDaggers: c("오검진", "Five-Dagger Array", "五剣陣"),
  crushWalls: c("협벽진", "Crushing Walls", "挟壁陣"),
  pitTrap: c("함정진", "Pit Array", "陥穽陣"),
  swordRain: c("낙검진", "Falling Swords", "落剣陣"),
  thunderSeal: c("뇌인진", "Thunder Seal", "雷印陣"),
  frostSquare: c("빙결진", "Frost Array", "氷結陣"),
  windCage: c("풍뢰진", "Wind Cage", "風籠陣"),
  stoneFist: c("암권진", "Stone Fist Array", "岩拳陣"),
  heavenPalace: c("천원진", "Heavenly Palace Array", "天元陣"),
};

/** 진 설명 (무기 설명 뒤에 붙음) */
export const FORMATION_DESC: Record<FormationKind, Names> = {
  vine: c("초록 문에서 큰 덩굴이 솟아 강타하고 밀침", "A great vine bursts from a green gate, striking and shoving", "緑の門から大きな蔓が伸びて強打し押し出す"),
  daggers: c("단검 다섯이 꽂힌 자리에 1초 동안 불기둥 (불태움)", "Five planted daggers raise a pillar of fire for 1s (burns)", "五本の短剣が刺さった場所に1秒間火柱（燃やす）"),
  walls: c("네모난 벽 둘이 양쪽에서 짓뭉갬 (기절)", "Two square walls crush from both sides (stun)", "四角い壁二つが両側から押し潰す（気絶）"),
  pit: c("구멍이 열려 2초 동안 혼란·기절 + 피해", "A pit opens: 2s of confusion, stuns and damage", "穴が開き2秒間混乱・気絶＋ダメージ"),
  swords: c("1.5초 동안 강철 검이 하늘에서 떨어짐", "Steel swords fall from the sky for 1.5s", "1.5秒間、鋼の剣が空から降る"),
  thunder: c("1.5초 동안 진 안의 적에게 번개가 내리침", "Lightning strikes foes inside for 1.5s", "1.5秒間、陣の中の敵に雷が落ちる"),
  frost: c("진 안의 적을 얼려 1초 멈춤", "Freezes foes inside for 1s", "陣の中の敵を凍らせ1秒停止"),
  wind: c("1.5초 동안 가운데로 빨아들이며 피해", "Pulls foes to the center for 1.5s, dealing damage", "1.5秒間、中央へ吸い込みながらダメージ"),
  fist: c("바위 주먹이 솟아 크게 날려 버림", "A stone fist rises and sends foes flying", "岩の拳がせり上がり大きく吹き飛ばす"),
  heaven: c("네 기둥의 빛이 2초 동안 내리치고 마지막에 큰 폭발", "Four pillars of light strike for 2s, ending in a great blast", "四本の柱の光が2秒間降り注ぎ、最後に大爆発"),
};

export const ELDER_PASSIVE_NAMES: Record<ElderPassive & PassiveId, Names> = {
  elSage: c("지혜", "Wisdom", "知恵"),
  elExpand: c("진 넓히기", "Wider Array", "陣拡張"),
  elMore: c("겹진", "Layered Arrays", "重ね陣"),
  elLinger: c("오래가는 진", "Lasting Array", "長持ちする陣"),
  elDouble: c("쌍진", "Twin Array", "双陣"),
  elStaff: c("지팡이 짚기", "Staff Rap", "杖つき"),
  elTea: c("차 한 잔", "A Cup of Tea", "お茶一杯"),
  elBeard: c("긴 수염", "Long Beard", "長いひげ"),
  elWard: c("결계", "Ward", "結界"),
  elMaster: c("진법 대가", "Array Master", "陣法の達人"),
};

export const ELDER_EFFECTS: Partial<Record<ElderPassive & PassiveId, Names>> = {
  elSage: c("진이 {arm:down}% 빨리 발동", "Arrays trigger {arm:down}% faster", "陣が{arm:down}%早く発動"),
  elExpand: c("진 크기 +{r:up}%", "Array size +{r:up}%", "陣の大きさ+{r:up}%"),
  elMore: c("한 번에 깔 수 있는 진 +{seals}", "+{seals} arrays at once", "同時に敷ける陣+{seals}"),
  elLinger: c("진이 남는 시간 +{dur:up}%", "Arrays last +{dur:up}% longer", "陣が残る時間+{dur:up}%"),
  elDouble: c("{every}번째마다 다른 적 자리에도 진을 하나 더", "Every {every:nth} cast places another array on a second foe", "{every}回目ごとに別の敵の場所にも陣をもう一つ"),
  elStaff: c("진을 깔 때 가까운 적을 지팡이로 때려 밀침 (공격력 {mul:pct}%)", "Casting raps nearby foes with your staff ({mul:pct}% damage, knockback)", "陣を敷く時、近くの敵を杖で叩いて押し出す（攻撃力{mul:pct}%）"),
  elTea: c("가만히 서 있으면 {every:sec}초마다 체력 {heal} 회복", "Standing still heals {heal} HP every {every:sec}s", "じっとしていると{every:sec}秒ごとに体力{heal}回復"),
  elWard: c("내 진 안에 서 있으면 받는 피해 -{taken:down}%", "Take {taken:down}% less damage while standing in your array", "自分の陣の中にいると被ダメージ-{taken:down}%"),
  elMaster: c("진 피해 +{mul:up}%", "Array damage +{mul:up}%", "陣のダメージ+{mul:up}%"),
};
