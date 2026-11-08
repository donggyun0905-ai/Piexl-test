// 관리자 상태이상 탭의 정리본 데이터: 15종(게임 DotKind) + 피해 없는 상태이상 · 설명·거는 캐릭터·값 찾는 낱말 (문서 docs/STATUS.md)
import type { DotKind } from "@pixel-rogue/shared";

export interface StatusInfo {
  /** 게임 상태이상 피해 종류 (피해 없는 상태이상은 없음) */
  kind?: DotKind;
  label: string;
  /** 성격 */
  type: string;
  /** 동작 한 줄 */
  desc: string;
  /** 거는 캐릭터 (캐릭터 id) */
  users: string[];
  /** 그 밖에 거는 것 (아이템·지형·보스 등) */
  more?: string;
  /** 값 이름을 낱말로 나눴을 때 이 낱말이 있으면 이 상태이상 값 */
  words: string[];
  /** 낱말로 못 찾는 값: "묶음/항목/값 앞부분" */
  paths?: string[];
  /** 낱말이 맞아도 빼는 값 ("묶음/항목/값 앞부분") */
  not?: string[];
}

export const STATUS_INFO: readonly StatusInfo[] = [
  { kind: "bleed", label: "출혈", type: "지속 피해", desc: "맞을 때마다 3초로 다시 걸리고 0.5초마다 피해", users: ["incision", "gunner", "punk", "slayer", "silk", "collector", "brawler", "general", "wanderer", "remnant", "abandoned"], more: "예리함(기본 스탯) · 금기 '피의 대가'", words: ["bleed", "blood", "sharpness"] },
  { kind: "burn", label: "화상", type: "지속 피해", desc: "점화 2초 동안 0.5초마다 공격력의 25% (공용 규칙)", users: ["bomber", "rider", "pungryu", "apostle", "plague", "byeonhui", "scribe", "stargazer", "summoner", "mage", "elementalist", "mystic", "fallenKing"], more: "아이템 '이프리트 발톱'", words: ["burn", "ignite", "fire", "flame", "ember", "napalm", "blaze"] },
  { kind: "poison", label: "독", type: "지속 피해", desc: "걸린 동안 0.5초마다 피해 (세기·시간은 캐릭터마다)", users: ["samyeol", "plague", "fly", "imugi", "byeonhui", "spiritist", "remnant", "idra", "elementalist", "doctor", "ninja"], more: "무기 '전갈 침'·'환영 송곳니' · 아이템 '가시덤불' · 독 지형 · 보스 독", words: ["poison", "venom", "toxic", "gas", "sting"] },
  { kind: "curse", label: "저주", type: "쌓아서 터뜨림", desc: "봉인이 쌓이면 한꺼번에 피해 · 오니 야마타 추가 공격", users: ["mystic", "oni", "scribe"], more: "아이템 '저주받은 승리'", words: ["curse", "hex", "seal"], paths: ["rules/ONI/yamata"] },
  { kind: "storm", label: "폭풍", type: "한 방 추가", desc: "일정 간격으로 베거나 몰아치는 피해", users: ["imugi", "zeus", "mage", "oni", "elder"], more: "광야의 새벽 기술", words: ["storm", "gale"] },
  { kind: "rot", label: "부식", type: "약화", desc: "쌓일수록 받는 피해 증가 (중첩당 +2%) · 더 들어간 몫이 부식 피해", users: ["plague", "apostle", "rider", "ren", "elementalist", "engineer"], more: "부식 지형 · 아이템 '역병 녹'", words: ["rot", "melt", "corrode", "corro", "acid", "decay"], not: ["rules/TERRAIN/corrode"] },
  { kind: "death", label: "죽음", type: "쌓아서 터뜨림", desc: "시간이 끝나거나 쌓이면 큰 피해 (캐릭터마다)", users: ["samyeol", "plague", "oni", "apostle", "slayer", "mystic"], more: "무기 '영혼 송곳' · 금기 '죽음의 폭발' · 보스 움켜쥠", words: ["death", "doom", "reap"] },
  { kind: "hellfire", label: "지옥불", type: "지속 피해", desc: "악의 사도 '이단' 확률로 걸리고 0.5초마다 피해", users: ["apostle"], words: ["hellfire", "heresy"] },
  { kind: "shock", label: "감전", type: "한 방 추가", desc: "번개 추가 공격·번개 진 피해 (제우스는 감전이 쌓일수록 더 아픔)", users: ["oni", "elder", "zeus", "leo", "elementalist", "scribe", "fly", "mystic"], more: "감전 지형 · 보스 번개 해파리", words: ["shock", "lightning", "thunder", "zap", "volt", "spark"] },
  { kind: "frost", label: "서리·빙결", type: "약화", desc: "서리 피해 + 느림·얼림(기절)", users: ["oni", "elder", "fly", "scribe", "stargazer", "mage", "mystic", "elementalist"], more: "아이템 '블리자드 랜스' · 광야의 새벽", words: ["frost", "freeze", "frozen", "ice", "chill", "cold", "snow"] },
  { kind: "tide", label: "물결", type: "약화", desc: "해일 피해 · 밀치기 · 주변 적에게 나눠 줌 · 물 지형은 느림", users: ["oni", "elementalist"], more: "물 지형 · 보스 유령선 선장", words: ["tide", "wet", "water"] },
  { kind: "gold", label: "황금", type: "한 방 추가", desc: "가진 돈에 비례한 피해 (돈을 조금 씀)", users: ["oni"], words: [], paths: ["rules/ONI/gold"] },
  { kind: "radiance", label: "광휘", type: "한 방 추가", desc: "빛 피해 · 밀치기 (잊혀진 자는 걸린 동안 1초마다)", users: ["forgotten", "oni", "imugi", "mystic", "elementalist", "elder"], more: "보스 대천사", words: ["radiance", "radiant", "holy"], paths: ["rules/ONI/genesis"] },
  { kind: "moon", label: "달빛", type: "약화", desc: "최대 5스택(5초) · 걸린 적은 주는 피해 약화 · 맞을 때 스택만큼 확률로 약점 공격(받은 피해의 50% 더, 흰 숫자)", users: ["blast", "lunatic"], more: "성흔 각성 중 모든 공격에 확정 · 루나틱은 달빛 없이도 약점 30%, 표적에 약점이면 확정 치명타 달빛 베기(달빛 2스택)", words: ["moon"], paths: ["rules/MOON"] },
  { kind: "blueflame", label: "청염", type: "지속 피해", desc: "블루 플레임의 모든 공격에 걸림 · 2.5초 동안 0.5초마다 공격력의 32% (보통 화상 25%보다 셈) · 숫자는 아래 진한 파랑 → 위 옅은 파랑", users: ["blueFlame"], more: "전용 아이템 '남는 불꽃'·'영혼 소각'", words: ["blueflame", "bzFlame"] },
  { kind: "voidbolt", label: "공허탄", type: "한 방 추가", desc: "큰 한 방 피해 + 부채꼴로 퍼짐", users: ["oni", "scribe"], words: ["void", "voidbolt"], paths: ["rules/ONI/black"] },
  { label: "치유감소", type: "약화", desc: "걸린 동안 모든 회복·재생 감소 (로그 40%, 지속 6초)", users: [], more: "로그 적 베놈(잠자리) 독가스 · 패왕전 회복 감소 기술", words: ["anti", "healcut"], paths: ["rules/TERRAIN/corrode"] },
  { label: "적이 거는 상태이상 (로그)", type: "플레이어가 받음", desc: "땅 물고기 출혈 · 슬라임 부식(받는 피해↑) · 도플갱어 저주(끝나면 터짐) · 그림자 공포(공격 못 함) · 가디언 기절 · 성기사 속박 · 돌진 멧돼지 느림 · 베놈 독+치유감소", users: [], words: [], paths: ["rules/FOE_STATUS_RULES"] },
  { label: "기절·속박·느림·공포", type: "피해 없음", desc: "기절 = 머리 위 도는 별 · 느림 = 발밑 노란 물결 · 속박 = 몸을 감는 붕대 · 공포 = 머리 위 해골과 식은땀", users: ["crusader", "general", "titan", "abandoned", "elder", "scribe", "pilgrim", "zeus", "mage", "chronomancer", "ren", "apostle", "brawler", "doctor", "stargazer"], more: "진흙·물 지형(느림)", words: ["stun", "root", "slow", "fear", "bind", "sluggish"] },
];

/** 값 이름 → 낱말 ("poisonDmg" → poison·dmg, "BURN_TICKS" → burn·ticks) */
export const keyWords = (key: string) => key.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().split(/[._\d]+/).filter(Boolean);

/** 이 값이 그 상태이상 값인지 */
export const isStatusValue = (info: StatusInfo, group: string, id: string, key: string) =>
  !info.not?.some((p) => `${group}/${id}/${key}`.startsWith(p)) &&
  (keyWords(key).some((w) => info.words.includes(w)) || !!info.paths?.some((p) => `${group}/${id}/${key}`.startsWith(p)));
