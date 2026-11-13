// 캐릭터 정의 (체력·공격력·이동 속도·행운·처음 무기). 무기는 content, 화면 이름은 화면 쪽 번역에서
import type { WeaponId } from "./content";
import { THALASSIA_CHARACTERS } from "./charactersThalassia";
import { SEONGGUK_CHARACTERS } from "./charactersSeongguk";
import { DAWN_CHARACTERS } from "./charactersDawn";
import { SILBER_CHARACTERS } from "./charactersSilber";

/** 전용 무기·아이템을 가질 수 있는 캐릭터 (content.WeaponDef.exclusive · items.PassiveDef.exclusive) */
export type { ExclusiveId } from "./characterIds";

export interface CharacterDef extends Partial<ExtraStats> {
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
  /** 닌자: 표식을 쌓으면 그림자에서 분신이 벰 · 발이 빠름 */
  ninja: { id: "ninja", maxHp: 85, damage: 10, moveSpeed: 1.4, luck: 1, startWeapon: "shuriken" },
  /** 시간술사: 모든 공격을 1초 뒤 그 자리에서 잔상이 한 번 더 함 · 체력 보통 */
  chronomancer: { id: "chronomancer", maxHp: 90, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "pocketwatch" },
  /** 소환술사: 채찍으로 모은 힘으로 소환수를 부름 */
  summoner: { id: "summoner", maxHp: 95, damage: 10, moveSpeed: 1.25, luck: 0, startWeapon: "leatherwhip" },
  /** 풋내기: 맨손으로 시작, 공용 무기·공용 패시브만. 경험치로 레벨이 오르면 스탯을 직접 찍음 */
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
  /** 이드라 (비르디아, 세계수의 아이): 가이아가 대시마다 모습이 바뀜 (sim/idra) */
  idra: { id: "idra", maxHp: 100, damage: 10, moveSpeed: 1.3, luck: 1, startWeapon: "gaia" },
  /** 변희 (비르디아, 만물의 소녀): 든 무기의 동물로 변해 싸움 (sim/morph) */
  byeonhui: { id: "byeonhui", maxHp: 105, damage: 10, moveSpeed: 1.3, luck: 0, startWeapon: "wolfForm" },
  /** 플라이 (비르디아): 날아 급습·발톱 (sim/fly) */
  fly: { id: "fly", maxHp: 85, damage: 11, moveSpeed: 1.5, luck: 0, startWeapon: "glassClaw" },
  /** 장로 (비르디아): 적 자리에 진을 깔아 잠시 뒤 발동 · 느림 (sim/elder) */
  elder: { id: "elder", maxHp: 95, damage: 12, moveSpeed: 1.15, luck: 1, startWeapon: "vineGate" },
  /** 렌 (비르디아): 맨손으로 거대한 토목을 부림 (sim/ren) */
  ren: { id: "ren", maxHp: 120, damage: 12, moveSpeed: 1.15, luck: 0, startWeapon: "renHands" },
  /** 정령사 (비르디아): 매직 미사일 + 작은 정령 셋(30초마다 바뀜) + 대정령 (sim/spirit) */
  spiritist: { id: "spiritist", maxHp: 85, damage: 10, moveSpeed: 1.3, luck: 1, startWeapon: "titanCoreSpirit" },
  /** 역병의사 (헬리오스): 모기떼·연기 구역·쥐떼(흑사병)·죽음의 손아귀 (sim/plague) */
  plague: { id: "plague", maxHp: 100, damage: 10, moveSpeed: 1.25, luck: 1, startWeapon: "mosquitoSwarm" },
  /** 학살자 (헬리오스): 피에 젖은 대낫 5연속 콤보 (sim/slayer) */
  slayer: { id: "slayer", maxHp: 280, damage: 16, moveSpeed: 1.3, luck: 0, startWeapon: "bloodScythe" },
  /** 이터 (헬리오스): 이빨 달린 그림자, 열 가지 공격이 확률로 (sim/eater) */
  eater: { id: "eater", maxHp: 110, damage: 16, moveSpeed: 1.25, luck: 0, startWeapon: "shadowMaw" },
  /** 묵인 (헬리오스): 거대한 몸 · 맞아도 무적 없음 · 방어력 300% 돌진 (sim/mukin) */
  mukin: { id: "mukin", maxHp: 160, damage: 6, moveSpeed: 1.05, luck: 0, startWeapon: "ironHorn" },
  /** 사멸 (헬리오스): 독침 · 독가스 (sim/samyeol) */
  samyeol: { id: "samyeol", maxHp: 95, damage: 11, moveSpeed: 1.35, luck: 1, startWeapon: "tangNeedle" },
  /** 오토마타 (테라코어): 손 레이저 · 자매 인형 · 유도 미사일 (sim/automata) */
  automata: { id: "automata", maxHp: 100, damage: 12, moveSpeed: 1.3, luck: 0, startWeapon: "adFinger" },
  /** 라이더 (테라코어): 오토바이 · 달린 거리 펄스 (sim/rider) */
  rider: { id: "rider", maxHp: 110, damage: 12, moveSpeed: 1.5, luck: 0, startWeapon: "rdHammer" },
  /** 붐버 (테라코어): 터지는 무기 · 예술 연쇄 · 여진 (sim/bomber) */
  bomber: { id: "bomber", maxHp: 105, damage: 12, moveSpeed: 1.25, luck: 0, startWeapon: "bmGrenade" },
  /** 아티팩터 (테라코어): 리펄스 총 · 제작 게이지로 아이템 (sim/artifacter) */
  artifacter: { id: "artifacter", maxHp: 100, damage: 12, moveSpeed: 1.3, luck: 1, startWeapon: "afRepulsor" },
  /** 펑크 (테라코어): 네온과 크롬의 사이버 무기 · 몸에 심는 능력 · 신경 가속(sim/punk) */
  punk: { id: "punk", maxHp: 95, damage: 12, moveSpeed: 1.4, luck: 1, startWeapon: "cyKatana" },
  /** 수집가 (테라코어): 수집 무기 30 = 콤보 (sim/collector) */
  collector: { id: "collector", maxHp: 100, damage: 11, moveSpeed: 1.35, luck: 2, startWeapon: "clBlade" },
  /** 추적자 (아스칼론): 저격총 · 스킬 셋 (sim/tracker) */
  tracker: { id: "tracker", maxHp: 90, damage: 13, moveSpeed: 1.3, luck: 0, startWeapon: "trSniper" },
  /** 잊혀진 자 (아스칼론): 빛 무기 10 · 빛의 고리 → 신족 (sim/forgotten) */
  forgotten: { id: "forgotten", maxHp: 85, damage: 12, moveSpeed: 1.5, luck: 1, startWeapon: "fgGrace", regen: 20, dodge: 0.2 },
  /** 잔영 (아스칼론): 단검 암살자 · 대시 회피 슬로우 (sim/remnant) */
  remnant: { id: "remnant", maxHp: 45, damage: 9, moveSpeed: 1.45, luck: 1, startWeapon: "rmDagger", critChance: 0.45, critDamage: 2.5 },
  /** 방랑객 (아스칼론): 카타나 10 · 예리함 25% (sim/wanderer) */
  wanderer: { id: "wanderer", maxHp: 105, damage: 13, moveSpeed: 1.3, luck: 0, startWeapon: "wdKatana", sharpness: 0.25 },
  /** 영사 (아스칼론): 실 100가닥 장전·얽힘 5면 찢기 (sim/silk) */
  silk: { id: "silk", maxHp: 90, damage: 10, moveSpeed: 1.35, luck: 1, startWeapon: "skThread" },
  /** 풍류사 (아스칼론): 구름을 타고 천자문 글자 · 구절 완성 마법 (sim/pungryu) */
  pungryu: { id: "pungryu", maxHp: 90, damage: 10, moveSpeed: 1.35, luck: 5, startWeapon: "puHeaven" },
  /** 레오 (아스칼론, 영물): 뇌전 발톱 (sim/leo) */
  leo: { id: "leo", maxHp: 120, damage: 12, moveSpeed: 1.4, luck: 1, startWeapon: "leClaw", defense: 5 },
  /** 오닉스 (테라코어, 영물): 칠보 광륜 · 비행 대시 · 보석 7 (sim/onyx) */
  onyx: { id: "onyx", maxHp: 190, damage: 15, moveSpeed: 0.95, luck: 1, startWeapon: "oxHalo", defense: 30 },
  /** 펜리르 (비르디아, 영물): 대검 고정 5연 콤보 (sim/fenrir) */
  fenrir: { id: "fenrir", maxHp: 45, damage: 16, moveSpeed: 1.55, luck: 0, startWeapon: "fnKingBlade", dodge: 0.25, sharpness: 0.25 },
  /** 이클립스 (헬리오스): 태양 ↔ 일식 (sim/eclipse) */
  eclipse: { id: "eclipse", maxHp: 115, damage: 11, moveSpeed: 1.3, luck: 1, startWeapon: "ecAxe" },
  ...THALASSIA_CHARACTERS,
  ...SEONGGUK_CHARACTERS,
  ...DAWN_CHARACTERS,
  ...SILBER_CHARACTERS,
  /** 느아르 (아슈바르): 공허의 검 · 패시브 없음 · 적응력·제약 (sim/noir) */
  noir: { id: "noir", maxHp: 110, damage: 9, moveSpeed: 1.3, luck: 0, startWeapon: "nrBlade" },
  /** 루주 (아슈바르): 장미쌍검 · 혈장미 (sim/rouge) */
  rouge: { id: "rouge", maxHp: 105, damage: 9, moveSpeed: 1.35, luck: 0, startWeapon: "rgBlades" },
  /** 에테르 광부 (히든, 시즌 2): 곡괭이로 적을 캐서 원석 · 대시는 땅굴 (sim/miner) */
  miner: { id: "miner", maxHp: 125, damage: 12, moveSpeed: 1.25, luck: 2, startWeapon: "mnPick", defense: 10 },
  /** 운명의 여행자 (히든, 시즌 2): 모아 쏘는 활 · 모래시계 주사위 운명 (sim/voyager) */
  voyager: { id: "voyager", maxHp: 105, damage: 14, moveSpeed: 1.3, luck: 2, startWeapon: "vyBow" },
  /** 제우스 (히든): 번개 · 천벌 게이지 (sim/zeus) */
  zeus: { id: "zeus", maxHp: 140, damage: 15, moveSpeed: 1.3, luck: 3, startWeapon: "zsBolt" },
  pilgrim: { id: "pilgrim", maxHp: 115, damage: 13, moveSpeed: 1.35, luck: 4, startWeapon: "pgStaff" },
  /** 몰락한 왕 (히든): 츠바이핸더 · 영혼 (sim/fallenKing) */
  fallenKing: { id: "fallenKing", maxHp: 170, damage: 18, moveSpeed: 1.05, luck: 0, startWeapon: "fkZwei" },
  /** 빛의 사도 (한정 · sim/lux) */
  lux: { id: "lux", maxHp: 100, damage: 8, moveSpeed: 1.35, luck: 2, startWeapon: "luxBlade", critChance: 0.12, critDamage: 1.7, sharpness: 0.12 },
  /** 별지기 (히든, 무작위 10%): 별자리를 그려 빛줄기로 태움 (sim/star) */
  stargazer: { id: "stargazer", maxHp: 110, damage: 12, moveSpeed: 1.3, luck: 1, startWeapon: "starStaff" },
  /** 오리 (히든, 무작위 5%): 꽥 음파·새끼 오리 (sim/duck) */
  duck: { id: "duck", maxHp: 130, damage: 12, moveSpeed: 1.4, luck: 2, startWeapon: "rubberDuck" },
  /** 서기관 (히든): 잉크 탄·무기 글자 (sim/scribe) */
  scribe: { id: "scribe", maxHp: 95, damage: 11, moveSpeed: 1.3, luck: 2, startWeapon: "quillPen" },
} as const satisfies Record<string, CharacterDef>;

/** 모든 캐릭터 공통 추가 기본 스탯 (sim/baseStats). 캐릭터 표에 처음 값으로 들어가 관리자에서 캐릭터마다 바꿈 */
export interface ExtraStats {
  /** 치명타 확률 (0~1) · 치명타 피해 배율 */
  critChance: number;
  critDamage: number;
  /** 방어력 (받는 피해 100/(100+방어력)) · 피해 감소 (0~0.9) · 회피 확률 */
  defense: number;
  reduction: number;
  dodge: number;
  /** 재생력 (10초마다 회복) · 흡혈 (준 피해의 비율) */
  regen: number;
  lifesteal: number;
  /** 예리함 (맞힐 때 방어 깎기 + 출혈 확률) · 상태이상 강화 (+비율) · 돈 획득 (+비율) */
  sharpness: number;
  statusPower: number;
  goldGain: number;
}
export const EXTRA_DEFAULTS: ExtraStats = { critChance: 0, critDamage: 1.5, defense: 0, reduction: 0, dodge: 0, regen: 0, lifesteal: 0, sharpness: 0, statusPower: 0, goldGain: 0 };
// 모든 캐릭터에 추가 스탯 처음 값 넣기 (관리자 수치 표에 보이게)
for (const row of Object.values(CHARACTERS)) for (const [k, v] of Object.entries(EXTRA_DEFAULTS)) if (!(k in row)) (row as Record<string, unknown>)[k] = v;

export type CharacterId = keyof typeof CHARACTERS;
/** 숨은 캐릭터: 선택창·순위표·타워 디펜스에는 없고 무작위 캐릭터(10%)·연습장에서만 */
export const HIDDEN_CHARACTERS: readonly CharacterId[] = ["stargazer", "duck", "scribe", "miner", "voyager", "zeus", "pilgrim", "fallenKing", "lux"];
/** 보통 고를 수 있는 캐릭터 (숨은 캐릭터 빼고) · ALL_CHARACTER_IDS는 숨은 캐릭터까지 */
export const ALL_CHARACTER_IDS = Object.keys(CHARACTERS) as CharacterId[];
export const CHARACTER_IDS = ALL_CHARACTER_IDS.filter((id) => !HIDDEN_CHARACTERS.includes(id));

