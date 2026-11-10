// 적 정의 (졸개·보스·허수아비 수치, 층마다 보스). content에서 다시 내보냄
import { RAID_ENEMIES, type RaidFoeKind } from "./enemyDefsRaid";
import { S3_ENEMIES, type CerbKind, type LevKind, type S3BossKind, type S3PropKind } from "./enemyDefsS3";
export type { CerbKind, LevKind, S3BossKind, S3PropKind };
export { CERB_TRIO } from "./enemyDefsS3";

export type MinionKind = S3PropKind | "crawler" | "spitter" | "charger" | "mortar" | "gnat" | "guardian" | "paladin" | "tower" | "fort" | "ruinblade" | "chaosblade" | "soul" | "ghost" | StalkerKind | NewFoeKind | TdMinionKind;
/** 시즌 2 새 몬스터 (sim/stalkers): 도플갱어 · 베놈 · 땅 물고기 · 그림자 */
export type StalkerKind = "doppel" | "venom" | "landfish" | "lurker";
/** 시즌 3 새 몬스터 (sim/newFoes): 폭발풍뎅이 · 스켈레톤 궁병 · 쇠사슬 간수 · 하이오크 */
export type NewFoeKind = "bombbug" | "skelarcher" | "chainward" | "highorc";
/** 타워 디펜스에만 나오는 적 (sim/tdWaves) */
export type TdMinionKind = "slime" | "runner" | "bat" | "beetle" | "golem" | "shaman" | "eggsac" | "wisp";
/** 보스: 1·2층(1단계) 강철 거구·검은 기사·얍삽한 활잡이·두꺼비 왕·불도롱뇽 · 3·4층(2단계) 무리 여왕·세이렌·켄타우로스·하드플랜트·번개 해파리 · 5·6층(3단계) 공허의 눈·데스·검신·천사장·유령선 선장 */
export type BossKind = "hulk" | "knight" | "archer" | "toad" | "salamander" | "brood" | "siren" | "centaur" | "plant" | "jelly" | "seer" | "reaper" | "swordgod" | "archangel" | "captain" | S3BossKind | LastBossKind;
/** 라스트 보스 (6층을 깬 뒤 골라서 도전, 7층 큰 보스방) */
export type LastBossKind = "dragon" | "godeater" | "plight" | "pdark" | "umbra" | "demigod" | "sage" | "cerberus" | "leviathan" | "asmodeus";
/** 고를 수 있는 라스트 보스 (태초의 빛을 고르면 태초의 어둠도 같이 나옴) */
export const LAST_BOSSES: readonly LastBossKind[] = ["dragon", "godeater", "plight"];
/** 시즌 2 라스트 보스 (미리 만든 것: 6층 도전·연습장에서만, 무한·영웅의 길·타워 디펜스·레이드에는 아직 안 나옴) */
export const S2_LAST_BOSSES: readonly LastBossKind[] = ["umbra", "demigod", "sage"];
/** 시즌 3 라스트 보스 (6층 도전·연습장에서만): 켈베로스 · 레비아탄 · 아스모데우스의 화신체 */
export const S3_LAST_BOSSES: readonly LastBossKind[] = ["cerberus", "leviathan", "asmodeus"];
/** 검은 잔영이 차례로 부르는 거대한 짐승 셋 (sim/bossUmbra) */
export type BeastKind = "sandworm" | "scorpion" | "roc";
export const UMBRA_BEASTS: readonly BeastKind[] = ["sandworm", "scorpion", "roc"];
/** 짐승마다 흰 보호막 (최대 체력에 곱함) */
export const UMBRA_WARD: Partial<Record<BeastKind, number>> = { scorpion: 0.5 };
/** 연습장 전용: 움직이지도 공격하지도 않는 허수아비 */
export type EnemyKind = MinionKind | BossKind | BeastKind | CerbKind | LevKind | RaidFoeKind | "dummy" | "fighter";

export interface EnemyDef {
  kind: EnemyKind;
  hp: number;
  radius: number;
  speed: number;
  /** 몸에 닿았을 때 피해 */
  contactDamage: number;
  /** 처치하면 얻는 돈 */
  gold: number;
  boss?: boolean;
  /** 방패: 이만큼 맞아야 깨지고, 그 전에는 피해를 받지 않음 */
  shield?: number;
  /** 받아 넘기기(패링): 맞을 때 이 확률로 피해 없음 */
  parry?: number;
}

export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  dummy: { kind: "dummy", hp: 99999, radius: 8, speed: 0, contactDamage: 0, gold: 0 },
  /** 패왕전 AI 캐릭터: 체력·공격은 캐릭터마다 (sim/paewangAi). 처형·즉사 효과를 받지 않게 보스로 침 */
  fighter: { kind: "fighter", hp: 100, radius: 6, speed: 0, contactDamage: 0, gold: 0, boss: true },
  /** 다가와서 몸으로 부딪힘 */
  crawler: { kind: "crawler", hp: 30, radius: 5, speed: 0.55, contactDamage: 10, gold: 1 },
  /** 거리를 두고 탄을 쏨 */
  spitter: { kind: "spitter", hp: 22, radius: 5, speed: 0.4, contactDamage: 6, gold: 1 },
  /** 멀리서 플레이어 자리에 붉은 표시를 남기고, 잠시 뒤 그 자리가 터짐 (표시 밖으로 피하면 됨) */
  mortar: { kind: "mortar", hp: 34, radius: 5, speed: 0.3, contactDamage: 6, gold: 2 },
  /** 잠깐 멈췄다가 돌진 */
  charger: { kind: "charger", hp: 42, radius: 6, speed: 0.35, contactDamage: 14, gold: 2 },
  /** 6마리 무리로 다님. 약하고 플레이어의 절반 빠르기 (sim/minions에서 플레이어 이동 속도 기준) */
  gnat: { kind: "gnat", hp: 9, radius: 3, speed: 1.3, contactDamage: 5, gold: 0 },
  /** 방패 3번을 먼저 깨야 피해가 들어감. 돌진한 뒤 앞쪽을 크게 휘두름 */
  guardian: { kind: "guardian", hp: 48, radius: 6, speed: 0.4, contactDamage: 10, gold: 3, shield: 3 },
  /** 천사장이 부르는 성기사: 단단하게 다가옴 */
  paladin: { kind: "paladin", hp: 40, radius: 6, speed: 0.42, contactDamage: 11, gold: 2 },
  /** 천사장 탑: 네 모서리에 서 있고 차례가 된 것만 맞음 */
  tower: { kind: "tower", hp: 90, radius: 7, speed: 0, contactDamage: 0, gold: 0 },
  /** 숨은 시련 구조물 조각 (sim/hiddenKit) */
  fort: { kind: "fort", hp: 400, radius: 10, speed: 0, contactDamage: 0, gold: 0, boss: true },
  // 타워 디펜스에서 처음 나온 적 (타워 디펜스는 tdDefs 수치로 길을 따라 걸어옴 · 던전 행동은 sim/critters)
  /** 슬라임: 가장 흔한 적 */
  slime: { kind: "slime", hp: 30, radius: 5, speed: 0.42, contactDamage: 8, gold: 1 },
  /** 도마뱀: 빠르고 약함 */
  runner: { kind: "runner", hp: 20, radius: 4, speed: 0.85, contactDamage: 7, gold: 1 },
  /** 박쥐: 떼로 날아오는 아주 약한 적 */
  bat: { kind: "bat", hp: 11, radius: 3, speed: 0.7, contactDamage: 5, gold: 0 },
  /** 딱정벌레: 등껍질(방패)을 몇 번 깨야 피해가 들어감 */
  beetle: { kind: "beetle", hp: 46, radius: 6, speed: 0.36, contactDamage: 12, gold: 2, shield: 4 },
  /** 바위 골렘: 아주 단단하고 느림 */
  golem: { kind: "golem", hp: 170, radius: 8, speed: 0.24, contactDamage: 16, gold: 4 },
  /** 주술사: 가끔 주변 적의 체력을 채워 줌 */
  shaman: { kind: "shaman", hp: 42, radius: 5, speed: 0.38, contactDamage: 6, gold: 2 },
  /** 알주머니: 터지면 작은 슬라임 셋 */
  eggsac: { kind: "eggsac", hp: 64, radius: 6, speed: 0.32, contactDamage: 8, gold: 2 },
  /** 도깨비불: 가끔 앞으로 순간이동 */
  wisp: { kind: "wisp", hp: 34, radius: 4, speed: 0.48, contactDamage: 9, gold: 2 },
  // 시즌 2 새 몬스터 (sim/stalkers)
  /** 도플갱어: 나와 같은 모습. 내 무기가 멀리 쏘면 거리를 두고 쏘고, 아니면 다가와 벰 */
  doppel: { kind: "doppel", hp: 70, radius: 6, speed: 0.6, contactDamage: 8, gold: 3 },
  /** 베놈: 독잠자리. 이리저리 날며 독가스를 퍼뜨림 (부식독: 회복·재생 40% 감소) */
  venom: { kind: "venom", hp: 34, radius: 5, speed: 0.6, contactDamage: 7, gold: 2 },
  /** 땅 물고기: 땅속에서 따라오다 솟구쳐 다른 자리로 뛰어듦 (뛰어오른 동안만 맞음) */
  landfish: { kind: "landfish", hp: 30, radius: 6, speed: 0.75, contactDamage: 9, gold: 2 },
  /** 그림자: 희미하게 비치며 등 뒤로 돌아가 큰 한 방 */
  lurker: { kind: "lurker", hp: 30, radius: 5, speed: 0.7, contactDamage: 5, gold: 3 },
  // 시즌 3 새 몬스터 (sim/newFoes)
  /** 폭발풍뎅이: 빠르게 달려와 달라붙음(닿아도 피해 없음) → 1.5초 뒤 폭발 + 화상. 대시로 떼어 냄 */
  bombbug: { kind: "bombbug", hp: 26, radius: 5, speed: 1.35, contactDamage: 0, gold: 2 },
  /** 스켈레톤 궁병: 얇은 선으로 겨눔 → 깜빡이면 매우 빠른 화살 (큰 피해) */
  skelarcher: { kind: "skelarcher", hp: 40, radius: 6, speed: 0.5, contactDamage: 6, gold: 3 },
  /** 쇠사슬 간수: 사슬 길 예고 → 맞으면 피해 + 끌어당김 */
  chainward: { kind: "chainward", hp: 70, radius: 7, speed: 0.45, contactDamage: 8, gold: 3 },
  /** 하이오크: 큰 도끼 반원 휘두르기 · 체력이 적을수록 빠르고 셈 */
  highorc: { kind: "highorc", hp: 110, radius: 12, speed: 0.5, contactDamage: 8, gold: 4 },
  /** 보스: 다가오다 돌진, 멈출 때 사방으로 탄 */
  hulk: { kind: "hulk", hp: 420, radius: 11, speed: 0.45, contactDamage: 16, gold: 20, boss: true },
  /** 보스: 거리를 두고 기는 적을 부르고 부채꼴로 탄 */
  brood: { kind: "brood", hp: 520, radius: 10, speed: 0.35, contactDamage: 14, gold: 25, boss: true },
  /** 보스: 순간이동하며 도는 고리 모양 탄 */
  seer: { kind: "seer", hp: 620, radius: 9, speed: 0.3, contactDamage: 14, gold: 30, boss: true },
  /** 보스: 검으로 3연속 베기 · 찌르며 돌진 (sim/bossesKnight) */
  knight: { kind: "knight", hp: 440, radius: 10, speed: 0.5, contactDamage: 14, gold: 20, boss: true },
  /** 보스: 거리를 두고 벽에 튕기는 화살, 가까이 오면 뒤로 뜀 */
  archer: { kind: "archer", hp: 380, radius: 8, speed: 0.55, contactDamage: 10, gold: 20, boss: true },
  /** 보스: 벽에 튕기는 음표가 돌고, 맞으면 끌려감 · 노래 탄 */
  siren: { kind: "siren", hp: 540, radius: 9, speed: 0.35, contactDamage: 12, gold: 25, boss: true },
  /** 보스: 3연속 돌진 찌르기 → 사방 창 던지기 → 크게 휘두르며 찌르기 */
  centaur: { kind: "centaur", hp: 580, radius: 11, speed: 0.5, contactDamage: 16, gold: 25, boss: true },
  /** 보스: 거의 움직이지 않고 바닥 범위 공격 · 솟아오르는 덩굴 내려찍기 */
  plant: { kind: "plant", hp: 620, radius: 12, speed: 0.15, contactDamage: 14, gold: 25, boss: true },
  /** 보스: 큰 낫 휘두르기 · 등 뒤로 순간이동해 한 바퀴 베기 */
  reaper: { kind: "reaper", hp: 640, radius: 10, speed: 0.42, contactDamage: 16, gold: 30, boss: true },
  /** 보스: 방 전체에 빛나는 검기 격자 (빛나지 않는 칸으로 피함) · 일섬 */
  swordgod: { kind: "swordgod", hp: 620, radius: 9, speed: 0.45, contactDamage: 14, gold: 30, boss: true },
  /** 보스: 성기사 소환 · 빛기둥 */
  archangel: { kind: "archangel", hp: 600, radius: 10, speed: 0.3, contactDamage: 12, gold: 30, boss: true },
  /** 시즌 2 1단계 보스: 늪의 두꺼비 왕 (뛰어 내려찍기 · 혀로 끌어당기기 · 진흙탄, sim/bossToad) */
  toad: { kind: "toad", hp: 460, radius: 12, speed: 0.4, contactDamage: 15, gold: 20, boss: true },
  /** 시즌 2 1단계 보스: 불도롱뇽 (용암 웅덩이로 잠수했다 튀어나옴 · 지나간 자리 불길, sim/bossSalamander) */
  salamander: { kind: "salamander", hp: 420, radius: 10, speed: 0.55, contactDamage: 14, gold: 20, boss: true },
  /** 시즌 2 2단계 보스: 번개 해파리 (물을 감전시킴 · 떠다니는 전기 방울, sim/bossJelly) */
  jelly: { kind: "jelly", hp: 560, radius: 11, speed: 0.3, contactDamage: 12, gold: 25, boss: true },
  /** 시즌 2 3단계 보스: 유령선 선장 (대포 줄 포격 · 닻 던져 끌기 · 밀물 · 물에 빠진 선원, sim/bossCaptain) */
  captain: { kind: "captain", hp: 660, radius: 10, speed: 0.4, contactDamage: 16, gold: 30, boss: true },
  ...S3_ENEMIES,
  ...RAID_ENEMIES,
  /** 라스트 보스: 멸망의 용 (sim/bossDragon) */
  /** 라스트 보스: 갓이터 (대검 두 자루를 먼저 부숴야 맞음, sim/bossHades·bossBlades) */
  godeater: { kind: "godeater", hp: 2800, radius: 24, speed: 0.3, contactDamage: 18, gold: 100, boss: true, parry: 0.4 },
  /** 갓이터의 파괴의 검 · 혼돈의 검 (보스처럼 체력 막대) · 혼돈이 풀어놓는 영혼 */
  ruinblade: { kind: "ruinblade", hp: 1280, radius: 11, speed: 0.8, contactDamage: 14, gold: 0, parry: 0.4 },
  chaosblade: { kind: "chaosblade", hp: 1280, radius: 11, speed: 0.8, contactDamage: 14, gold: 0, parry: 0.4 },
  soul: { kind: "soul", hp: 42, radius: 5, speed: 0.45, contactDamage: 10, gold: 0 },
  /** 라스트 보스: 태초의 빛 · 태초의 어둠 (둘이 체력을 반씩, sim/bossPrimeval·bossLight·bossDark) */
  plight: { kind: "plight", hp: 1800, radius: 18, speed: 0.3, contactDamage: 14, gold: 50, boss: true },
  pdark: { kind: "pdark", hp: 1800, radius: 18, speed: 0.3, contactDamage: 14, gold: 50, boss: true },
  /** 어둠의 유령: 맞지 않고, 닿으면 어둠이 짙어짐 */
  ghost: { kind: "ghost", hp: 9999, radius: 6, speed: 0.4, contactDamage: 0, gold: 0 },
  dragon: { kind: "dragon", hp: 9600, radius: 24, speed: 0.35, contactDamage: 20, gold: 100, boss: true },
  /** 시즌 2 라스트 보스 검은 잔영: 맞지 않고 위에서 지켜봄. 체력 = 세 짐승 체력의 합 (막대 하나를 세 칸으로, sim/bossUmbra) */
  umbra: { kind: "umbra", hp: 7000, radius: 12, speed: 0, contactDamage: 0, gold: 100, boss: true },
  /** 시즌 2 라스트 보스 괴력난신: 거인만 한 반신, 맨주먹으로 1대1 (sim/bossDemigod·demigodUlts) */
  demigod: { kind: "demigod", hp: 9000, radius: 13, speed: 1.05, contactDamage: 16, gold: 100, boss: true },
  /** 시즌 2 마지막 라스트 보스 제천대성: 근두운을 탄 반신, 몸(꼬리·주먹·여의봉)과 근두운이 따로 공격 (sim/bossSage·sageBody·sageStaff·sageCloud) */
  sage: { kind: "sage", hp: 9000, radius: 14, speed: 1.1, contactDamage: 16, gold: 100, boss: true },
  /** 데스웜: 땅속에서 예고 없이 다가와 갑자기 솟음 (sim/bossWorm) */
  sandworm: { kind: "sandworm", hp: 2000, radius: 39, speed: 1.1, contactDamage: 18, gold: 0, boss: true },
  /** 거대 전갈: 움직이는 표시로 땅속을 기어다니다 꼬리 찌르기(독) · 앞으로만 밀고 오는 돌진(집게에 붙잡힘). 셋 중 탱커: 체력이 많고 흰 보호막(UMBRA_WARD) */
  scorpion: { kind: "scorpion", hp: 3000, radius: 39, speed: 0.8, contactDamage: 16, gold: 0, boss: true },
  /** 거대 매: 늘 하늘에 있다가 내려찍기 · 세 줄 활강. 피하면 떨어져 경직 (sim/bossRoc) */
  roc: { kind: "roc", hp: 2000, radius: 42, speed: 0, contactDamage: 14, gold: 0, boss: true },
};

export { BOSS_TIERS, bossForFloor } from "./bossTiers";
