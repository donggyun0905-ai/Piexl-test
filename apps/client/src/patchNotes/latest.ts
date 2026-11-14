import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.121",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 실베르 지도 (256×160칸, 북부) — 두꺼운 성벽의 북부 수호성(성채 백인장 · 무기고 기어스 = 레이드 장신구 대장간 · 민가 · 막사·화로) · 북쪽 얼어붙은 싸움터(마물 뼈·부러진 창·투석기·바리케이드) · 맨 위 악마의 문 · 서쪽 얼어붙은 호수 · 동쪽 망루 초소 · 북동 얼음 동굴 던전 · 눈 덮인 침엽수 숲 · 순간 이동석 여섯", "악마의 문 경비원(아수라)에게 말 걸면 타워 디펜스 (스토리에서 연 뒤) · 아스칼론 북쪽 산길 ↔ 실베르 남쪽 입구 (9장부터) · 실베르 주민 대화 · 눈밭·얼음·눈 덮인 돌바닥·요새 성벽·침엽수·망루·화로 등 그림 적용"],
      en: ["World Map (testing): Silber map (256×160 tiles, the north) — the Northern Bastion behind thick walls (keep with Baekinjang · armory with Gears = raid accessory forge · homes · barracks and braziers) · a frozen battlefield to the north (monster bones, broken spears, catapults, barricades) · the Demon Gate at the very top · a frozen lake to the west · a watch post to the east · the Frost Cave dungeon to the northeast · snowy pine forests · six warp stones", "Talk to the Demon Gate guard (Asura) for Tower Defense (once unlocked in the story) · northern mountain pass from Ascalon ↔ Silber's south entrance (from Chapter 9) · talk with the people of Silber · art for snowfields, ice, snowy paving, fortress walls, pines, watchtowers, braziers and more"],
      ja: ["世界地図（テスト中）：シルベルの地図（256×160マス、北部） — 厚い城壁の北部守護城（城館に白刃将・武器庫のギアーズ = レイドアクセサリーの鍛冶・民家・兵舎と火鉢）・北の凍てついた戦場（魔物の骨・折れた槍・投石機・バリケード）・最北の悪魔の門・西の凍った湖・東の見張り台・北東の氷の洞窟のダンジョン・雪の針葉樹の森・転移石6か所", "悪魔の門の衛兵（アスラ）に話しかけるとタワーディフェンス（ストーリーで解放後）・アスカロン北の山道 ↔ シルベル南の入口（第9章から）・シルベルの住人との会話・雪原・氷・雪の石畳・要塞の城壁・針葉樹・見張り台・火鉢などの絵を適用"],
    },
  },
  {
    version: "0.52.120",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 대사막 지도 (256×160칸) — 아스칼론·테라코어(북쪽)와 헬리오스(남쪽)를 잇는 묻힌 돌길 · 야자수 오아시스와 대상 천막 · 태초의 신전 → 광야의 새벽 (스토리에서 연 뒤) · 모래에 묻힌 옛 도시 세레스티아(무너진 성벽·기둥·석상)와 옛 왕묘 던전 · 자갈 벌판·갈라진 땅·선인장·짐승 뼈 · 순간 이동석 여섯", "사막 땅·물건 그림 적용 (모래 언덕·자갈·갈라진 땅·묻힌 돌길·오아시스 · 야자수·선인장·덤불·기둥·석상·뼈·천막) · 테라코어↔헬리오스 임시 사막 길은 대사막을 지나도록 바뀜 (3장부터)"],
      en: ["World Map (testing): Great Desert map (256×160 tiles) — buried stone roads linking Ascalon and Terracore (north) with Helios (south) · a palm oasis and caravan tents · the Temple of the Beginning → Dawn of the Wilds (once unlocked in the story) · Celestia, an old city buried in sand (broken walls, columns, statues) with the Royal Tomb dungeon · gravel plains, cracked earth, cacti and bones · six warp stones", "Desert ground and object art (dunes, gravel, cracked earth, buried road, oasis · palms, cacti, tumbleweeds, columns, statues, bones, tents) · the temporary Terracore↔Helios desert road now passes through the Great Desert (from Chapter 3)"],
      ja: ["世界地図（テスト中）：大砂漠の地図（256×160マス） — アスカロン・テラコア（北）とヘリオス（南）を結ぶ埋もれた石の道・ヤシのオアシスと隊商の天幕・太初の神殿 → 荒野の夜明け（ストーリーで解放後）・砂に埋もれた旧都セレスティア（崩れた城壁・柱・石像）と古の王墓のダンジョン・砂利の平原・ひび割れた大地・サボテン・獣の骨・転移石6か所", "砂漠の地面・物の絵を適用（砂丘・砂利・ひび割れた大地・埋もれた道・オアシス・ヤシ・サボテン・枯れ草・柱・石像・骨・天幕）・テラコア↔ヘリオスの仮の砂漠の道は大砂漠を通るように変更（第3章から）"],
    },
  },
  {
    version: "0.52.119",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 땅·건물 그림 적용 — 아스칼론(길·모래·물·밭·돌바닥·눈·성벽·다리 · 바위·수풀·집·동굴·표지판) · 테라코어(철판 바닥·공장) · 비르디아(숲 바닥·세계수·나무 집) · 헬리오스(대리석·붉은 벽돌·금빛 돌바닥·황금 궁전·제국 집)", "그림 비율에 맞춰 건물 크기 조정: 헬리오스 궁전·제국 집 · 테라코어 공장 · 비르디아 세계수 둘레 숲 바닥"],
      en: ["World Map (testing): ground and building art — Ascalon (roads, sand, water, fields, paving, snow, walls, bridges · rocks, bushes, houses, caves, signs) · Terracore (steel floor, factories) · Virdia (forest floor, World Tree, treehouses) · Helios (marble, red brick, gold-trimmed paving, Golden Palace, imperial homes)", "Building sizes adjusted to fit the art: Helios palace and homes · Terracore factories · forest floor around Virdia's World Tree"],
      ja: ["世界地図（テスト中）：地面・建物の絵を適用 — アスカロン（道・砂・水・畑・石畳・雪・城壁・橋・岩・茂み・家・洞窟・看板）・テラコア（鉄板の床・工場）・ヴィルディア（森の床・世界樹・木の家）・ヘリオス（大理石・赤レンガ・金縁の石畳・黄金宮殿・帝国の家）", "絵の比率に合わせて建物の大きさを調整：ヘリオスの宮殿・帝国の家・テラコアの工場・ヴィルディアの世界樹まわりの森の床"],
    },
  },
];
