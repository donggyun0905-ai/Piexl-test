// 레이드 한정 캐릭터 피해 배율 (던전·패왕전에는 없음, 1 = 그대로). 2026-11-10 AI 레이드 1페이즈 3분 측정(동료: 떠돌이·마법사·기계공학자·의사)으로,
// 중간값의 1.6배를 넘는 캐릭터는 그쪽으로 내리고 0.6배보다 낮은 캐릭터는 조금 올림 (combat.damageEnemy가 레이드에서만 곱함)
import { RAID_ROOM } from "./raidTypes";
import { accDealt } from "./accStats";
import type { RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry): 캐릭터마다 레이드에서 주는 피해 배율 */
const R: Record<string, number> = {
  /** 버려진 자들 */
  abandoned: 1,
  /** 악의 사도 */
  apostle: 1,
  /** 아티팩터 */
  artifacter: 1,
  /** 오토마타 */
  automata: 1,
  /** 야수 */
  beast: 1,
  /** 베아트리스 */
  beatrice: 1,
  /** 베두인 */
  bedouin: 1,
  /** 블래스트 */
  blast: 0.71,
  /** 블루 플레임 */
  blueFlame: 1,
  /** 붐버 */
  bomber: 0.67,
  /** 격투가 */
  brawler: 1,
  /** 변희 */
  byeonhui: 1,
  /** 시간술사 */
  chronomancer: 1,
  /** 수집가 */
  collector: 0.74,
  /** 크루세이더 */
  crusader: 1,
  /** 조커 */
  joker: 1,
  /** 쉐도잉 */
  shadowing: 1,
  /** 인형술사 */
  puppeteer: 1,
  /** 래빗 */
  rabbit: 1,
  /** 백령 */
  baekryeong: 1,
  /** 빙설 */
  bingseol: 1,
  /** 아수라 */
  asura: 1,
  baekinjang: 1,
  aria: 1,
  chessRaven: 1,
  gears: 1,
  noir: 1,
  rouge: 1,
  honryeong: 1,
  /** 의사 */
  doctor: 1.25,
  /** 떠돌이 */
  drifter: 1,
  /** 이터 */
  eater: 1,
  /** 이클립스 */
  eclipse: 1,
  /** 장로 */
  elder: 1,
  /** 원소술사 */
  elementalist: 1,
  /** 기계공학자 */
  engineer: 1.13,
  /** 펜리르 */
  fenrir: 0.64,
  /** 플라이 */
  fly: 1,
  /** 잊혀진 자 */
  forgotten: 1,
  /** 가브리엘 */
  gabriel: 1,
  /** 장수 */
  general: 1,
  /** 거너 */
  gunner: 1,
  /** 헬피스트 */
  hellfist: 0.54,
  /** 훅 */
  hook: 1,
  /** 이안 */
  ian: 1,
  /** 이드라 */
  idra: 1,
  /** 이무기 */
  imugi: 1,
  /** 인시전 */
  incision: 0.35,
  /** 레오 */
  leo: 1,
  /** 리바이어 */
  levia: 1,
  /** 루나틱 */
  lunatic: 0.39,
  /** 매드퀸 */
  madQueen: 1,
  /** 마법사 */
  mage: 1,
  /** 미카엘라 */
  michaela: 0.83,
  /** 미류 */
  miryu: 1,
  /** 묵인 */
  mukin: 1,
  /** 음양사 */
  mystic: 1,
  /** 네일러 */
  nailer: 1,
  /** 닌자 */
  ninja: 1,
  /** 풋내기 */
  novice: 1,
  /** 오니 */
  oni: 1,
  /** 오닉스 */
  onyx: 0.63,
  /** 오르카 */
  orca: 1,
  /** 역병의사 */
  plague: 1.16,
  /** 풍류사 */
  pungryu: 1,
  /** 펑크 */
  punk: 1,
  /** 라파엘 */
  rafael: 1,
  /** 잔영 */
  remnant: 1,
  /** 렌 */
  ren: 1,
  /** 라이더 */
  rider: 1,
  /** 사멸 */
  samyeol: 1,
  /** 시저스 */
  scissors: 0.63,
  /** 세레나 */
  serena: 1,
  /** 영사 */
  silk: 0.7,
  /** 실버불렛 */
  silverBullet: 0.4,
  /** 학살자 */
  slayer: 0.66,
  /** 정령사 */
  spiritist: 1,
  /** 소환술사 */
  summoner: 1,
  /** 테일 */
  tail: 1,
  /** 토르켄 */
  thorken: 1,
  /** 거인 */
  titan: 1,
  /** 추적자 */
  tracker: 1,
  /** 방랑객 */
  wanderer: 0.57,
  /** 파수꾼 */
  warden: 1,
  /** 웨이브 */
  wave: 0.58,
  /** 유리엘 */
  yuriel: 1,
};
export { R as RAID_TUNE_RULES };

/** 지금 꺼내 놓은 사람이 주는 피해 배율 (레이드 방에서만, 나머지는 1) */
/** 레이드 장신구 주는 피해(sim/accStats)도 같이 곱함 */
export const raidDmgMul = (s: RunState): number => (s.raidBoss && s.roomId === RAID_ROOM.boss ? (R[s.player.characterId] ?? 1) : 1) * accDealt(s);
