// 미카엘라 무기마다 기술 (그림 무기 번호 = michaelaWeaponList 차례: 창 0~20 · 검 21~36, 무기 모양·분위기를 보고 정함)
// c: 누르고 있을 때 3연격 기술 셋 · t: 무기에 몸이 닿거나 대시로 순간 이동해 들 때 연달아 나가는 기술 둘. 기술 계산은 sim/michaelaMoves
export type McMove = "slash" | "slam" | "sweep" | "spin" | "thrust" | "lunge" | "throw" | "fan" | "cross" | "quake" | "rise" | "whirl" | "skyfall" | "pierce";
/** 효과 번호 차례 (화면이 같은 차례로 그림) */
export const MC_MOVE_IDS: readonly McMove[] = ["slash", "slam", "sweep", "spin", "thrust", "lunge", "throw", "fan", "cross", "quake", "rise", "whirl", "skyfall", "pierce"];

type Set = { c: readonly [McMove, McMove, McMove]; t: readonly [McMove, McMove] };
const w = (c0: McMove, c1: McMove, c2: McMove, t0: McMove, t1: McMove): Set => ({ c: [c0, c1, c2], t: [t0, t1] });

export const MC_WEAPON_MOVES: readonly Set[] = [
  // ── 창 ──
  w("thrust", "thrust", "throw", "lunge", "thrust"), // 0 은빛 창: 찌르고 던지기
  w("thrust", "sweep", "throw", "sweep", "throw"), // 1 청강 창: 휘두르고 던지기
  w("sweep", "thrust", "throw", "slam", "sweep"), // 2 흑적 도끼창: 내려찍고 휘두르기
  w("thrust", "thrust", "pierce", "spin", "pierce"), // 3 수정 구슬 창: 돌리고 꿰뚫기
  w("thrust", "thrust", "fan", "slam", "fan"), // 4 홍염 삼지창: 내려찍고 세 갈래 던지기
  w("thrust", "rise", "throw", "rise", "thrust"), // 5 은적 창: 올려베고 찌르기
  w("thrust", "sweep", "pierce", "pierce", "spin"), // 6 금빛 꼬인 창: 꿰뚫고 돌리기
  w("sweep", "sweep", "whirl", "whirl", "throw"), // 7 보라 낫창: 회오리 치고 던지기
  w("thrust", "slash", "throw", "lunge", "cross"), // 8 은 십자창: 돌진하고 X 베기
  w("thrust", "thrust", "fan", "fan", "thrust"), // 9 은 갈래창: 세 갈래 던지고 찌르기
  w("lunge", "thrust", "throw", "lunge", "throw"), // 10 가는 은창: 돌진하고 던지기
  w("thrust", "rise", "pierce", "pierce", "throw"), // 11 금보라 창: 꿰뚫고 던지기
  w("sweep", "thrust", "quake", "quake", "slam"), // 12 흑창: 땅 가르고 내려찍기
  w("thrust", "sweep", "skyfall", "skyfall", "thrust"), // 13 비취 창: 칼비 부르고 찌르기
  w("thrust", "thrust", "quake", "slam", "quake"), // 14 흑금 창: 내려찍고 땅 가르기
  w("thrust", "sweep", "throw", "rise", "throw"), // 15 백청 창: 올려베고 던지기
  w("thrust", "slash", "pierce", "cross", "pierce"), // 16 금은 창: X 베고 꿰뚫기
  w("thrust", "thrust", "fan", "spin", "fan"), // 17 하늘색 창: 돌리고 세 갈래 던지기
  w("sweep", "thrust", "throw", "slam", "throw"), // 18 홍염 창: 내려찍고 던지기
  w("thrust", "rise", "skyfall", "skyfall", "pierce"), // 19 금빛 창: 칼비 부르고 꿰뚫기
  w("thrust", "sweep", "throw", "lunge", "sweep"), // 20 은 창: 돌진하고 휘두르기
  // ── 검 ──
  w("slam", "sweep", "quake", "slam", "sweep"), // 21 은적 대검: 내려찍고 휘두르기
  w("cross", "slash", "spin", "cross", "rise"), // 22 흑적 마검: X 베고 올려베기
  w("slash", "slash", "pierce", "slash", "pierce"), // 23 수정 검: 베고 꿰뚫기
  w("slash", "rise", "skyfall", "rise", "skyfall"), // 24 금주황 검: 올려베고 칼비
  w("slam", "slam", "quake", "slam", "quake"), // 25 적갈 대검: 내려찍고 땅 가르기
  w("slash", "cross", "pierce", "cross", "pierce"), // 26 백금 검: X 베고 꿰뚫기
  w("slash", "slash", "lunge", "lunge", "slash"), // 27 남색 장검: 돌진하고 베기
  w("slash", "thrust", "throw", "slash", "throw"), // 28 흑남 검: 베고 던지기
  w("sweep", "sweep", "whirl", "whirl", "sweep"), // 29 자수정 낫검: 회오리 치고 휘두르기
  w("cross", "spin", "slam", "spin", "cross"), // 30 흑적 마검: 돌리고 X 베기
  w("slash", "slash", "skyfall", "skyfall", "slash"), // 31 금흑 검: 칼비 부르고 베기
  w("slash", "rise", "spin", "rise", "spin"), // 32 보주 검: 올려베고 돌리기
  w("thrust", "slash", "pierce", "pierce", "slash"), // 33 청흑 검: 꿰뚫고 베기
  w("lunge", "slash", "quake", "lunge", "quake"), // 34 청 기계 장검: 돌진하고 땅 가르기
  w("slash", "slash", "throw", "slash", "throw"), // 35 백적 검: 베고 던지기
  w("sweep", "cross", "whirl", "whirl", "cross"), // 36 초승달 검: 회오리 치고 X 베기
];
