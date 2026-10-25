// 캐릭터 정의 (체력·공격력·이동 속도·행운·처음 무기). 무기는 content, 화면 이름은 화면 쪽 번역에서
import type { WeaponId } from "./content";

/** 전용 무기·아이템을 가질 수 있는 캐릭터 (content.WeaponDef.exclusive · items.PassiveDef.exclusive) */
export type ExclusiveId = "warden" | "drifter" | "mage" | "mystic" | "engineer" | "elementalist" | "brawler" | "doctor" | "gunner" | "beast" | "ninja" | "chronomancer" | "summoner" | "novice" | "bedouin" | "general" | "imugi" | "apostle" | "stargazer" | "duck" | "abandoned" | "titan" | "oni" | "scribe" | "idra" | "byeonhui" | "fly" | "elder" | "ren" | "spiritist" | "plague" | "slayer" | "eater" | "mukin" | "samyeol" | "automata" | "rider" | "bomber" | "artifacter" | "punk";

export interface CharacterDef {
  id: string;
  maxHp: number;
  damage: number;
  moveSpeed: number;
  luck: number;
  startWeapon: WeaponId;
  /** 있으면 아이템·레벨과 상관없이 최대 체력이 늘 이 값 (거너) */
  fixedHp?: number;
}

export const CHARACTERS = {
  /** 근접 중심 */
  warden: { id: "warden", maxHp: 120, damage: 10, moveSpeed: 1.2, luck: 0, startWeapon: "greatblade" },
  /** 원거리 중심 */
  drifter: { id: "drifter", maxHp: 90, damage: 10, moveSpeed: 1.35, luck: 0, startWeapon: "crossbow" },
  /** 마법: 느린 마법탄이 터져 주변 적까지 맞힘 · 체력 낮음 · 행운 조금 */
  mage: { id: "mage", maxHp: 75, damage: 11, moveSpeed: 1.25, luck: 1, startWeapon: "emberstaff" },
  /** 음양사: 부적을 맞힐 때마다 세다가 무기마다 다른 추가 효과 · 체력 조금 낮음 */
  mystic: { id: "mystic", maxHp: 85, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "handcharm" },
  /** 기계공학자: 레이저를 계속 쏘아 녹임 (빗나가지 않지만 사거리 짧음) */
  engineer: { id: "engineer", maxHp: 100, damage: 10, moveSpeed: 1.25, luck: 0, startWeapon: "beamer" },
  /** 원소술사: 몸 둘레를 도는 구슬로 싸움 (닿으면 피해) · 체력 보통 */
  elementalist: { id: "elementalist", maxHp: 90, damage: 10, moveSpeed: 1.25, luck: 0, startWeapon: "elemorb" },
  /** 격투가: 누를 때마다 이어지는 콤보, 마지막 기술이 강함 · 체력 높음 · 근접 */
  brawler: { id: "brawler", maxHp: 110, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "fist" },
  /** 의사: 공격 회복·초과 치료(sim/heal) · 행운 높음 */
  doctor: { id: "doctor", maxHp: 100, damage: 10, moveSpeed: 1.2, luck: 5, startWeapon: "syringe" },
  /** 거너: 탄창을 다 쓰면 장전하는 총 · 치명타 · 이동 빠름 · 체력 낮음 */
  /** 야수(고양이 수인): 고양이를 데리고 다니며 같이 싸움 · 발이 아주 빠름 */
  beast: { id: "beast", maxHp: 95, damage: 10, moveSpeed: 1.4, luck: 1, startWeapon: "claws" },
  gunner: { id: "gunner", maxHp: 40, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "pistol", fixedHp: 40 },
  /** 닌자: 수리검으로 표식을 쌓으면 적의 그림자에서 분신이 튀어나와 벰 · 발이 빠르고 행운 조금 */
  ninja: { id: "ninja", maxHp: 85, damage: 10, moveSpeed: 1.4, luck: 1, startWeapon: "shuriken" },
  /** 시간술사: 모든 공격을 1초 뒤 그 자리에서 잔상이 한 번 더 함 · 체력 보통 */
  chronomancer: { id: "chronomancer", maxHp: 90, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "pocketwatch" },
  /** 소환술사: 근접 채찍으로 쳐서 모은 힘으로 소환수를 부름 (무기마다 다른 소환수) */
  summoner: { id: "summoner", maxHp: 95, damage: 10, moveSpeed: 1.25, luck: 0, startWeapon: "leatherwhip" },
  /** 풋내기: 맨손으로 시작, 공용 무기·공용 패시브만. 경험치로 레벨이 오르면 스탯을 직접 찍음 (sim/novice) */
  novice: { id: "novice", maxHp: 100, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "fists" },
  /** 베두인: 차크람으로 돌려 베고 던진 뒤 대시로 주움 (sim/bedouin) */
  bedouin: { id: "bedouin", maxHp: 95, damage: 24, moveSpeed: 1.35, luck: 0, startWeapon: "sandChakram" },
  /** 장수: 끊기지 않고 이어지는 창 콤보 (sim/general) */
  general: { id: "general", maxHp: 115, damage: 10, moveSpeed: 1.2, luck: 0, startWeapon: "trainingSpear" },
  /** 이무기: 맞힐 때마다 콤보 (72 오라 · 108 용) (sim/imugi) */
  imugi: { id: "imugi", maxHp: 100, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "imugiSpear" },
  /** 악의 사도: 뒤집힌 십자가 · 일곱 죄 장판 · 영혼으로 회복 (sim/apostle) */
  apostle: { id: "apostle", maxHp: 105, damage: 10, moveSpeed: 1.2, luck: 0, startWeapon: "invertedCross" },
  /** 버려진 자들: 세 아이를 탭으로 바꿔 가며 조합 콤보·특수기 (sim/abandoned) */
  abandoned: { id: "abandoned", maxHp: 100, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "streetKids" },
  /** 거인: 기계팔 탱커, 맞은 피해를 에너지로 모아 강타 (sim/titan) */
  titan: { id: "titan", maxHp: 170, damage: 12, moveSpeed: 1.05, luck: 0, startWeapon: "ironArm" },
  /** 오니: 느리고 센 방망이 + 확률 추가 공격 · 30초 신인족 · 받는 피해 +30% (sim/oni) */
  oni: { id: "oni", maxHp: 150, damage: 36, moveSpeed: 1.15, luck: 0, startWeapon: "thunderClub" },
  /** 이드라 (비르디아, 세계수의 아이): 가이아 하나가 대시마다 대궁·단검·방패·채찍으로 바뀜 · 전용 아이템만 나옴 (sim/idra) */
  idra: { id: "idra", maxHp: 100, damage: 10, moveSpeed: 1.3, luck: 1, startWeapon: "gaia" },
  /** 변희 (비르디아, 만물의 소녀): 든 무기의 동물로 변해 싸움 (sim/morph) */
  byeonhui: { id: "byeonhui", maxHp: 105, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "wolfForm" },
  /** 플라이 (비르디아): 잠자리 날개로 날아 급습(그동안 무적), 지나간 적을 발톱으로 벰 · 아주 빠름 (sim/fly) */
  fly: { id: "fly", maxHp: 85, damage: 11, moveSpeed: 1.5, luck: 0, startWeapon: "glassClaw" },
  /** 장로 (비르디아): 적 자리에 진을 깔아 잠시 뒤 발동 · 느림 (sim/elder) */
  elder: { id: "elder", maxHp: 95, damage: 12, moveSpeed: 1.15, luck: 1, startWeapon: "vineGate" },
  /** 렌 (비르디아): 맨손으로 거대한 토목을 부림 (타격·묶기·날려버리기·짓뭉개기·가두기), 수호 토목이 원거리 탄을 막음 (sim/ren) */
  ren: { id: "ren", maxHp: 120, damage: 12, moveSpeed: 1.15, luck: 0, startWeapon: "renHands" },
  /** 정령사 (비르디아): 매직 미사일 + 작은 정령 셋(30초마다 바뀜) + 대정령 (sim/spirit) */
  spiritist: { id: "spiritist", maxHp: 85, damage: 10, moveSpeed: 1.3, luck: 1, startWeapon: "titanCoreSpirit" },
  /** 역병의사 (헬리오스): 모기떼·연기 구역·쥐떼(흑사병)·죽음의 손아귀 (sim/plague) */
  plague: { id: "plague", maxHp: 100, damage: 10, moveSpeed: 1.25, luck: 1, startWeapon: "mosquitoSwarm" },
  /** 학살자 (헬리오스): 피에 젖은 대낫 5연속 콤보, 기술마다 체력 5 · 체력 280 · 회복 안 됨 · 피의 학살 (sim/slayer) */
  slayer: { id: "slayer", maxHp: 280, damage: 16, moveSpeed: 1.3, luck: 0, startWeapon: "bloodScythe" },
  /** 이터 (헬리오스): 이빨 달린 그림자, 열 가지 공격이 확률로 · 넓고 세지만 느림 · 먹은 적마다 재생력 +0.1 (sim/eater) */
  eater: { id: "eater", maxHp: 110, damage: 16, moveSpeed: 1.25, luck: 0, startWeapon: "shadowMaw" },
  /** 묵인 (헬리오스): 거대한 몸 · 방어력 30 · 맞아도 무적 없음 · 방어력 300% 돌진 · 재생력 10 · 회복약은 천천히 (sim/mukin) */
  mukin: { id: "mukin", maxHp: 160, damage: 6, moveSpeed: 1.05, luck: 0, startWeapon: "ironHorn" },
  /** 사멸 (헬리오스, 사천 당가): 독침, 모든 침에 독 + 죽음 · 침을 많이 던질수록 독가스 (sim/samyeol) */
  samyeol: { id: "samyeol", maxHp: 95, damage: 11, moveSpeed: 1.35, luck: 1, startWeapon: "tangNeedle" },
  /** 오토마타 (테라코어): 처음 자아를 가진 기계 인형. 손의 레이저가 기본 공격 · 자매 인형 · 등 뒤 유도 미사일 (sim/automata) */
  automata: { id: "automata", maxHp: 100, damage: 12, moveSpeed: 1.3, luck: 0, startWeapon: "adFinger" },
  /** 라이더 (테라코어): 오토바이 폭주족. 빠를수록 피해 · 달린 거리 게이지가 차면 범위 펄스 (sim/rider) */
  rider: { id: "rider", maxHp: 110, damage: 12, moveSpeed: 1.5, luck: 0, startWeapon: "rdHammer" },
  /** 붐버 (테라코어): "폭발은 예술이다". 모든 무기가 터짐 · 1초 안에 잇따라 터지면 예술 연쇄로 커짐 · 터져 쓰러진 적 자리에 여진 (sim/bomber) */
  bomber: { id: "bomber", maxHp: 105, damage: 12, moveSpeed: 1.25, luck: 0, startWeapon: "bmGrenade" },
  /** 아티팩터 (테라코어): 푸른빛 문신의 제작자. 리펄스 총 하나 · 쓰러뜨린 적으로 제작 게이지가 차면 아이템을 만듦(숨겨진 아이템 5) (sim/artifacter) */
  artifacter: { id: "artifacter", maxHp: 100, damage: 12, moveSpeed: 1.3, luck: 1, startWeapon: "afRepulsor" },
  /** 펑크 (테라코어): 네온과 크롬의 사이버 무기 · 몸에 심는 능력 · 신경 가속(게이지가 차면 대시로 켜서 시간을 느리게) (sim/punk) */
  punk: { id: "punk", maxHp: 95, damage: 12, moveSpeed: 1.4, luck: 1, startWeapon: "cyKatana" },
  /** 별지기 (히든, 무작위 10%): 별자리를 그려 빛줄기로 태움 (sim/star) */
  stargazer: { id: "stargazer", maxHp: 110, damage: 12, moveSpeed: 1.3, luck: 1, startWeapon: "starStaff" },
  /** 오리 (히든, 무작위 5%): 꽥 음파·새끼 오리 (sim/duck) */
  duck: { id: "duck", maxHp: 130, damage: 12, moveSpeed: 1.4, luck: 2, startWeapon: "rubberDuck" },
  /** 서기관 (히든, 아카식 레코드, 무작위 5%): 잉크 탄으로 기록을 새기고 몇 번째마다 무기의 글자가 발동 (sim/scribe) */
  scribe: { id: "scribe", maxHp: 95, damage: 11, moveSpeed: 1.3, luck: 2, startWeapon: "quillPen" },
} as const satisfies Record<string, CharacterDef>;

export type CharacterId = keyof typeof CHARACTERS;
/** 숨은 캐릭터: 선택창·순위표·타워 디펜스에는 없고 무작위 캐릭터(10%)·연습장에서만 */
export const HIDDEN_CHARACTERS: readonly CharacterId[] = ["stargazer", "duck", "scribe"];
/** 보통 고를 수 있는 캐릭터 (숨은 캐릭터 빼고) · ALL_CHARACTER_IDS는 숨은 캐릭터까지 */
export const ALL_CHARACTER_IDS = Object.keys(CHARACTERS) as CharacterId[];
export const CHARACTER_IDS = ALL_CHARACTER_IDS.filter((id) => !HIDDEN_CHARACTERS.includes(id));

