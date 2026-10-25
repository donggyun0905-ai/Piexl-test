// 업적 이름·조건 설명·묶음 이름 (한·영·일)
import { achievementDef, type AchievementCategory, type AchievementId } from "@pixel-rogue/shared";
import type { Lang } from "./index";
import { itemName } from "./items";
import { TEXT } from "./text";
import { charactersFor } from "../characterGoals";

type Names = Record<Lang, string>;
type Row = [ko: string, en: string, ja: string];

const n = (name: Row, desc: Row) => ({
  name: { ko: name[0], en: name[1], ja: name[2] },
  desc: { ko: desc[0], en: desc[1], ja: desc[2] },
});

const NAMES: Record<AchievementId, { name: Names; desc: Names }> = {
  // 진행
  floor2: n(["첫 계단", "First Steps", "最初の階段"], ["2층에 도착하기", "Reach floor 2", "2階に到達する"]),
  floor3: n(["중턱", "Halfway Up", "中腹"], ["3층에 도착하기", "Reach floor 3", "3階に到達する"]),
  floor4: n(["깊은 곳으로", "Going Deeper", "深みへ"], ["4층에 도착하기", "Reach floor 4", "4階に到達する"]),
  floor5: n(["어둠 너머", "Beyond the Dark", "闇の向こう"], ["5층에 도착하기", "Reach floor 5", "5階に到達する"]),
  floor6: n(["마지막 층", "Final Floor", "最上階"], ["6층에 도착하기", "Reach floor 6", "6階に到達する"]),
  clearRun: n(["탈출", "Escape", "脱出"], ["6층까지 클리어", "Clear all 6 floors", "6階までクリア"]),
  // 전투
  kills30: n(["몸풀기", "Warm-Up", "準備運動"], ["한 판에 적 30 처치", "Defeat 30 enemies in one run", "1回で敵を30体倒す"]),
  kills70: n(["싸움꾼", "Brawler", "喧嘩屋"], ["한 판에 적 70 처치", "Defeat 70 enemies in one run", "1回で敵を70体倒す"]),
  hunter: n(["사냥꾼", "Hunter", "狩人"], ["한 판에 적 120 처치", "Defeat 120 enemies in one run", "1回で敵を120体倒す"]),
  kills170: n(["폭풍", "Storm", "嵐"], ["한 판에 적 170 처치", "Defeat 170 enemies in one run", "1回で敵を170体倒す"]),
  // 보스
  firstBoss: n(["첫 사냥", "First Hunt", "初めての狩り"], ["보스를 처음 쓰러뜨리기", "Defeat a boss", "ボスを初めて倒す"]),
  boss3: n(["거물 사냥", "Big Game", "大物狩り"], ["한 판에 보스 3마리 쓰러뜨리기", "Defeat 3 bosses in one run", "1回でボスを3体倒す"]),
  flawlessBoss: n(["무결점", "Untouched", "無傷"], ["보스방에서 한 번도 맞지 않고 보스 쓰러뜨리기", "Defeat a boss without taking a hit", "ボス部屋で一度も被弾せずにボスを倒す"]),
  flawless3: n(["완벽한 춤", "Perfect Dance", "完璧な舞"], ["한 판에 보스 3마리를 맞지 않고 쓰러뜨리기", "Defeat 3 bosses without a hit in one run", "1回でボス3体を被弾せずに倒す"]),
  // 돈·상점
  rich: n(["두둑한 주머니", "Deep Pockets", "ふくらんだ財布"], ["한 판에 돈 150 벌기", "Earn 150 gold in one run", "1回で150ゴールド稼ぐ"]),
  gold300: n(["금맥", "Gold Vein", "金脈"], ["한 판에 돈 300 벌기", "Earn 300 gold in one run", "1回で300ゴールド稼ぐ"]),
  hoard: n(["저금통", "Piggy Bank", "貯金箱"], ["돈 100을 한꺼번에 가지고 있기", "Hold 100 gold at once", "100ゴールドを一度に持つ"]),
  shopper: n(["단골손님", "Regular Customer", "常連客"], ["한 판에 상점에서 4번 사기", "Buy 4 items in one run", "1回でショップで4回買う"]),
  bigSpender: n(["큰손", "Big Spender", "太っ腹"], ["한 판에 돈 150 쓰기", "Spend 150 gold in one run", "1回で150ゴールド使う"]),
  // 아이템
  passives5: n(["수집가", "Collector", "収集家"], ["패시브 5개 가지기", "Hold 5 passives", "パッシブを5つ持つ"]),
  passives10: n(["보물 창고", "Treasure Vault", "宝物庫"], ["패시브 10개 가지기", "Hold 10 passives", "パッシブを10個持つ"]),
  fullHands: n(["두 손 가득", "Hands Full", "両手いっぱい"], ["사용 아이템 칸 두 개를 모두 채우기", "Fill both item slots", "アイテム枠を2つとも埋める"]),
  // 캐릭터
  clearWarden: n(["파수꾼의 귀환", "Warden's Return", "番人の帰還"], ["파수꾼으로 클리어", "Clear as the Warden", "番人でクリア"]),
  clearDrifter: n(["떠돌이의 귀환", "Drifter's Return", "流れ者の帰還"], ["떠돌이로 클리어", "Clear as the Drifter", "流れ者でクリア"]),
  clearMage: n(["마법사의 귀환", "Mage's Return", "魔法使いの帰還"], ["마법사로 클리어", "Clear as the Mage", "魔法使いでクリア"]),
  clearMystic: n(["음양사의 귀환", "Talisman Master's Return", "陰陽師の帰還"], ["음양사로 클리어", "Clear as the Talisman Master", "陰陽師でクリア"]),
  clearGunner: n(["사격 종료", "Cease Fire", "撃ち方やめ"], ["거너로 클리어", "Clear as the Gunner", "ガンナーでクリア"]),
  clearBeast: n(["야생의 부름", "Call of the Wild", "野生の呼び声"], ["야수로 클리어", "Clear as the Beastkin", "獣人でクリア"]),
  clearNinja: n(["그림자 속으로", "Into the Shadows", "影の中へ"], ["닌자로 클리어", "Clear as the Ninja", "忍者でクリア"]),
  clearSummoner: n(["군단의 주인", "Lord of the Horde", "軍団の主"], ["소환술사로 클리어", "Clear as the Summoner", "召喚術師でクリア"]),
  clearNovice: n(["풋내기 졸업", "No Longer a Novice", "見習い卒業"], ["풋내기로 클리어", "Clear as the Novice", "見習いでクリア"]),
  clearBedouin: n(["모래바람의 주인", "Master of the Sandstorm", "砂嵐の主"], ["베두인으로 클리어", "Clear as the Bedouin", "ベドウィンでクリア"]),
  clearGeneral: n(["천하무쌍", "Peerless Under Heaven", "天下無双"], ["장수로 클리어", "Clear as the General", "武将でクリア"]),
  clearImugi: n(["승천한 용", "The Dragon Ascends", "昇天した龍"], ["이무기로 클리어", "Clear as the Imugi", "イムギでクリア"]),
  clearDuck: n(["꽥꽥 대모험", "Quack Quest", "ガーガー大冒険"], ["오리로 클리어", "Clear as the Duck", "アヒルでクリア"]),
  clearScribe: n(["마지막 한 줄", "The Final Line", "最後の一行"], ["서기관으로 클리어", "Clear as the Scribe", "書記官でクリア"]),
  clearAbandoned: n(["다시 모인 골목", "The Alley Reunited", "再び集まる路地"], ["버려진 자들로 클리어", "Clear as the Abandoned", "捨てられた者たちでクリア"]),
  clearOni: n(["신인족의 강림", "Descent of the Shinin", "神人族の降臨"], ["오니로 클리어", "Clear as the Oni", "鬼でクリア"]),
  clearTitan: n(["무너지지 않는 거인", "The Unfallen Titan", "倒れぬ巨人"], ["거인으로 클리어", "Clear as the Titan", "巨人でクリア"]),
  clearApostle: n(["타락의 끝", "End of the Fall", "堕落の果て"], ["악의 사도로 클리어", "Clear as the Apostle of Malice", "悪の使徒でクリア"]),
  clearChronomancer: n(["시간을 지배한 자", "Master of Time", "時を統べる者"], ["시간술사로 클리어", "Clear as the Chronomancer", "時間術師でクリア"]),
  clearDoctor: n(["퇴원 수속", "Discharged", "退院手続き"], ["의사로 클리어", "Clear as the Doctor", "医者でクリア"]),
  clearEngineer: n(["기술자의 귀환", "Engineer's Return", "技術者の帰還"], ["기계공학자로 클리어", "Clear as the Engineer", "エンジニアでクリア"]),
  clearBrawler: n(["격투가의 귀환", "Brawler's Return", "格闘家の帰還"], ["격투가로 클리어", "Clear as the Brawler", "格闘家でクリア"]),
  clearElementalist: n(["원소의 귀환", "Elements Return", "元素の帰還"], ["원소술사로 클리어", "Clear as the Elementalist", "元素術師でクリア"]),
  clearAll: n(["모두의 탈출", "Everyone Escapes", "全員脱出"], ["모든 캐릭터로 클리어", "Clear with every character", "全キャラクターでクリア"]),
  // 도전
  fastClear: n(["질풍", "Gale", "疾風"], ["12분 안에 클리어", "Clear within 12 minutes", "12分以内にクリア"]),
  swiftClear: n(["번개", "Lightning", "稲妻"], ["10분 안에 클리어", "Clear within 10 minutes", "10分以内にクリア"]),
  thrift: n(["빈손 여행", "Empty-Handed", "手ぶらの旅"], ["상점에서 아무것도 사지 않고 클리어", "Clear without buying anything", "ショップで何も買わずにクリア"]),
  closeCall: n(["구사일생", "Close Call", "九死に一生"], ["체력 10 이하로 클리어", "Clear with 10 HP or less", "体力10以下でクリア"]),
  suddenClear: n(["한 번도 안 맞고", "Not a Scratch", "かすり傷なし"], ["일일 도전 서든데스 클리어", "Clear a Daily Sudden Death run", "デイリーのサドンデスをクリア"]),
  // 누적
  runs10: n(["모험가", "Adventurer", "冒険者"], ["10판 하기", "Play 10 runs", "10回プレイする"]),
  runs50: n(["베테랑", "Veteran", "ベテラン"], ["50판 하기", "Play 50 runs", "50回プレイする"]),
  wins5: n(["단골 탈출", "Frequent Escapee", "脱出の常連"], ["5번 클리어", "Clear 5 times", "5回クリアする"]),
  wins20: n(["탑의 주인", "Master of the Tower", "塔の主"], ["20번 클리어", "Clear 20 times", "20回クリアする"]),
  kills1000: n(["천 번의 일격", "A Thousand Blows", "千の一撃"], ["적 1,000 처치 (누적)", "Defeat 1,000 enemies in total", "敵を累計1,000体倒す"]),
  kills5000: n(["전설의 사냥꾼", "Legendary Hunter", "伝説の狩人"], ["적 5,000 처치 (누적)", "Defeat 5,000 enemies in total", "敵を累計5,000体倒す"]),
  bosses10: n(["보스 수집", "Boss Collector", "ボス収集"], ["보스 10마리 처치 (누적)", "Defeat 10 bosses in total", "ボスを累計10体倒す"]),
  bosses50: n(["보스의 악몽", "Bane of Bosses", "ボスの悪夢"], ["보스 50마리 처치 (누적)", "Defeat 50 bosses in total", "ボスを累計50体倒す"]),
  gold1000: n(["저축왕", "Saver", "貯蓄家"], ["돈 1,000 벌기 (누적)", "Earn 1,000 gold in total", "累計1,000ゴールド稼ぐ"]),
  gold5000: n(["대부호", "Tycoon", "大富豪"], ["돈 5,000 벌기 (누적)", "Earn 5,000 gold in total", "累計5,000ゴールド稼ぐ"]),
};

const CATEGORY: Record<AchievementCategory, Names> = {
  progress: { ko: "진행", en: "Progress", ja: "進行" },
  combat: { ko: "전투", en: "Combat", ja: "戦闘" },
  boss: { ko: "보스", en: "Bosses", ja: "ボス" },
  wealth: { ko: "돈·상점", en: "Gold & Shop", ja: "お金・ショップ" },
  build: { ko: "아이템", en: "Items", ja: "アイテム" },
  character: { ko: "캐릭터", en: "Characters", ja: "キャラクター" },
  challenge: { ko: "도전", en: "Challenges", ja: "チャレンジ" },
  career: { ko: "누적", en: "Lifetime", ja: "累計" },
};

const UNLOCK_LABEL: Names = { ko: "해금", en: "Unlocks", ja: "解放" };

export function achievementName(id: string, lang: Lang): string {
  return NAMES[id as AchievementId]?.name[lang] ?? id;
}

export function achievementDesc(id: string, lang: Lang): string {
  return NAMES[id as AchievementId]?.desc[lang] ?? "";
}

export function categoryName(c: AchievementCategory, lang: Lang): string {
  return CATEGORY[c][lang];
}

/** "해금: 아이템·캐릭터 이름" (해금이 없으면 빈 글자) */
export function achievementUnlock(id: string, lang: Lang): string {
  const u = achievementDef(id)?.unlock;
  const names = [...(u ? [u.kind === "character" ? TEXT[u.id][lang] : itemName(u.kind, u.id, lang)] : []), ...charactersFor(id).map((c) => `${TEXT[c][lang]} ${CHAR_TAG[lang]}`)];
  return names.length ? `${UNLOCK_LABEL[lang]}: ${names.join(", ")}` : "";
}

/** 캐릭터 해금 표시 */
const CHAR_TAG: Record<Lang, string> = { ko: "(캐릭터)", en: "(character)", ja: "（キャラ）" };
