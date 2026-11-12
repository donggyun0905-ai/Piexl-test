// 피해 출처 이름 (sim/dmgSrc의 "f:파일" → 결과 창·능력치 창 '피해 출처' 줄 이름, 한·영·일)
// 여기 없는 파일(캐릭터 본체 파일 = 기본 공격 등)은 무기 줄에 합침 · 이름이 같은 파일끼리는 한 줄로 합침
import type { Lang } from "../i18n";

type Name = readonly [ko: string, en: string, ja: string];
const SKILL: Name = ["스킬", "Skills", "スキル"];
const SUMMON: Name = ["소환수", "Summons", "召喚獣"];
const OWN: Name = ["전용 아이템 효과", "Exclusive item effects", "専用アイテム効果"];
const WATER: Name = ["물의 기술", "Water arts", "水の技"];
const SPIRIT: Name = ["공생 정령", "Symbiotic spirit", "共生精霊"];
const CORE: Name = ["핵심 스킬 각성", "Core skill awakening", "コアスキル覚醒"];

const NAMES: Record<string, Name> = {
  abandonedKids: ["곁의 두 아이", "Side kids", "そばの二人"],
  abandonedShow: ["특수기", "Special move", "特殊技"],
  allies: ["동료", "Companions", "仲間"],
  apostleFields: ["일곱 죄의 장판", "Seven Sins fields", "七つの罪の領域"],
  awakenCasts: ["각성 증강 기술", "Awakening skills", "覚醒スキル"],
  beatriceSkills: SKILL,
  arBurst: ["여덟 음표 터짐", "Octet Burst", "八音符の破裂"],
  arFinale: ["악보 완성", "Score Complete", "楽譜完成"],
  bjVolley: ["연속 타격 기술", "Multi-hit skills", "連撃スキル"],
  rvCheck: ["체크메이트 (체크)", "Checkmate (Check)", "チェックメイト（チェック）"],
  buildSetFx: ["세트 효과", "Set effects", "セット効果"],
  classTaken: ["반격", "Counter", "反撃"],
  collectorMoves: ["수집 무기", "Collected weapons", "収集武器"],
  crusaderRam: ["성벽 돌진", "Rampart charge", "城壁突進"],
  devilPerks: ["악마의 거래", "Devil's deal", "悪魔の取引"],
  ducklings: ["새끼 오리", "Ducklings", "子ガモ"],
  eclipseZone: ["영역·검격", "Zone & slashes", "領域・斬撃"],
  faction: ["진영 특징", "Faction trait", "陣営特性"],
  factionCore: CORE,
  factionCoreArts: CORE,
  factionSpirit: SPIRIT,
  spiritAllies: SPIRIT,
  gabrielShield: ["보호막 기술", "Shield skills", "シールド技"],
  gabrielSkills: SKILL,
  gunExtras: ["드론·유령 총", "Drones & ghost guns", "ドローン・幽霊銃"],
  hiddenPerks: ["히든 패시브", "Hidden passives", "ヒドゥンパッシブ"],
  hiddenUse: ["히든 사용 아이템", "Hidden consumables", "ヒドゥン使用アイテム"],
  hookShot: ["산탄총", "Shotgun", "ショットガン"],
  hrBeasts: SUMMON,
  hrSpirits: SUMMON,
  summons: SUMMON,
  ianSkills: SKILL,
  imugiArts: ["무기별 추가 공격", "Weapon extra attacks", "武器の追加攻撃"],
  incisionLeap: ["도살 도약", "Butcher's leap", "屠殺跳躍"],
  jokerDraw: ["카드뽑기", "Card draw", "カードドロー"],
  laserGear: ["장치", "Devices", "装置"],
  leoPerks: OWN,
  orbitPerks: OWN,
  pungryuPerks: OWN,
  leviaWhale: ["고래", "Whale", "クジラ"],
  lobbyPet: ["로비 펫", "Lobby pet", "ロビーペット"],
  michaelaSkills: SKILL,
  minerGround: ["원석·광산 붕괴", "Ore & cave-in", "原石・落盤"],
  miryuFlow: ["물길", "Water path", "水路"],
  morphEvo: ["각성 동물", "Awakened beast", "覚醒獣"],
  nailerSkills: SKILL,
  onyxGems: ["보석 반응", "Gem reactions", "宝石反応"],
  orbit: ["회전체", "Orbiters", "回転体"],
  orbitBlades: ["날아가는 검·별", "Flying blades & stars", "飛ぶ剣・星"],
  orbitElements: ["원소 효과", "Element effects", "元素効果"],
  orcaFree: ["해방 상태", "Unleashed state", "解放状態"],
  origin: ["캐릭터 특징", "Character trait", "キャラ特性"],
  pets: ["고양이", "Cats", "猫"],
  pgBag: ["배낭", "Backpack", "リュック"],
  pungryuVerse: ["구절 마법", "Verse magic", "句の魔法"],
  rabbitMarks: ["땅울림·여진", "Tremors & aftershocks", "地鳴り・余震"],
  rafaelSkills: SKILL,
  renEarth: ["대지의 추가 공격", "Earth's extra attacks", "大地の追加攻撃"],
  rune: ["마법 문양", "Magic rune", "魔法紋"],
  sageBody: ["꼬리·주먹", "Tail & fists", "尻尾・拳"],
  sageCloud: ["근두운", "Somersault cloud", "觔斗雲"],
  sageStaff: ["여의봉", "Staff", "如意棒"],
  serenaSkills: SKILL,
  shades: ["그림자 분신", "Shadow clones", "影分身"],
  shadowingSpirits: ["그림 소환", "Painted spirits", "描いた霊"],
  spiritGreat: ["대정령", "Great spirit", "大精霊"],
  tailSea: ["물 상어", "Water sharks", "水のサメ"],
  talisman: ["부적 효과", "Charm effects", "護符効果"],
  trackerSkill: SKILL,
  thorkenBall: ["철구공", "Iron ball", "鉄球"],
  thorkenStorm: ["태풍·천둥", "Typhoon & thunder", "台風・雷"],
  voyagerAbilities: ["운명의 힘", "Fate's aid", "運命の力"],
  waveSkillsA: WATER,
  waveSkillsB: WATER,
  waveSkillsC: WATER,
  waveSkillsD: WATER,
  waveSkillsE: WATER,
  yurielSkills: SKILL,
};
const LANGS: Lang[] = ["ko", "en", "ja"];

/** "f:파일" 출처의 이름 (없으면 null) */
export function srcFileName(key: string, lang: Lang): string | null {
  const n = key.startsWith("f:") ? NAMES[key.slice(2)] : undefined;
  return n ? n[Math.max(0, LANGS.indexOf(lang))]! : null;
}

/** 출처마다 합 → 줄 목록 (많이 준 순서): 이름 없는 파일은 무기 줄("")에, 이름이 같은 파일끼리는 한 줄로 */
export function srcRows(by: Record<string, number> | undefined): [string, number][] {
  const sum = new Map<string, number>();
  const first = new Map<Name, string>();
  for (const [k, v] of Object.entries(by ?? {})) {
    if (!(v > 0)) continue;
    let key = k;
    if (k.startsWith("f:")) {
      const n = NAMES[k.slice(2)];
      key = n ? (first.get(n) ?? (first.set(n, k), k)) : "";
    }
    sum.set(key, (sum.get(key) ?? 0) + v);
  }
  return [...sum.entries()].sort((a, b) => b[1] - a[1]);
}
