// 지도 사냥터 표 (docs/QUEST.md 다음 할 일 3): 나라 필드 한 곳에 몬스터가 모여 있음 · 잡으면 사냥 퀘스트 숫자가 오름 (progress/quest kills)
// 몬스터 그림은 던전 몬스터 그림 그대로 (game/enemySprites) · 수치는 지도 전투 전용 (던전 sim과 따로, 화면에서만)
import type { TextKey } from "../../i18n";

export interface HuntGround {
  id: string;
  /** 나라 필드 id (worldPlaces REGIONS) */
  region: string;
  /** 가운데 칸 · 반지름(칸): 이 안에서 나고 돌아다님 */
  tx: number;
  ty: number;
  rad: number;
  /** 몬스터 그림 (public/sprites/enemies) */
  kind: string;
  /** 이름 (사냥터 · 몬스터) */
  name: TextKey;
  mob: TextKey;
  /** 한 번에 있는 수 */
  count: number;
  /** 잡힌 뒤 다시 나타나는 시간 (초) */
  respawn: number;
  /** 체력 · 한 번 때리는 피해 · 걷는 속도(픽셀/초) · 몸 반지름 */
  hp: number;
  dmg: number;
  speed: number;
  r: number;
  /** 권장 투력 (표지판·Tab 창에 보임) */
  power: number;
}

export const HUNT_GROUNDS: readonly HuntGround[] = [
  /** 아스칼론 던전 입구 아래 풀밭: 슬라임 (처음 사냥) */
  { id: "slimeMeadow", region: "ascalon", tx: 165, ty: 31, rad: 6, kind: "slime", name: "hgSlime", mob: "hgSlimeMob", count: 6, respawn: 15, hp: 30, dmg: 6, speed: 26, r: 5, power: 100 },
  /** 대사막 북쪽 길가: 하이오크 부락 */
  { id: "orcCamp", region: "desert", tx: 120, ty: 30, rad: 7, kind: "highorc", name: "hgOrc", mob: "hgOrcMob", count: 4, respawn: 30, hp: 110, dmg: 14, speed: 30, r: 9, power: 250 },
  /** 실베르 옛 전장 동쪽: 해골 병사 */
  { id: "boneField", region: "silber", tx: 160, ty: 30, rad: 7, kind: "skelarcher", name: "hgBone", mob: "hgBoneMob", count: 5, respawn: 25, hp: 60, dmg: 12, speed: 34, r: 6, power: 400 },
];

/** 지도 전투 수치 (몬스터·나 공용) */
export const HUNT_RULES = {
  /** 몬스터가 나를 알아채는 거리 (픽셀) */
  aggro: 70,
  /** 사냥터 가운데에서 이만큼(반지름 배) 넘게 멀어지면 돌아감 */
  leash: 1.8,
  /** 몬스터 공격: 예고(초) · 다시 공격까지(초) · 닿는 거리(몸 반지름에 더함) */
  windup: 0.55,
  attackGap: 1.3,
  reach: 10,
  /** 내 공격: 기본 닿는 거리(픽셀) · 부채꼴 반각(라디안) · 다시 휘두르기(초) */
  swingReach: 24,
  swingArc: 1.1,
  swingGap: 0.45,
  /** 대시: 걸린 시간(초) · 속도 배율 · 다시 쓰기(초, 장신구 대시로 줄어듦) */
  dashTime: 0.18,
  dashMul: 3.2,
  dashGap: 1.2,
  /** 안 맞고 이만큼(초) 지나면 1초에 최대 체력의 이 몫씩 회복 */
  restAfter: 4,
  restHeal: 0.08,
  /** 쓰러진 뒤 다시 일어나기까지(초) */
  downTime: 2,
};

export const groundsIn = (region: string): HuntGround[] => HUNT_GROUNDS.filter((g) => g.region === region);
export const groundById = (id: string): HuntGround | undefined => HUNT_GROUNDS.find((g) => g.id === id);
