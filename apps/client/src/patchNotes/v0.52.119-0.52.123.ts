import type { PatchNote } from "./types";

export const NOTES: PatchNote[] = [
  {
    version: "0.52.123",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 건물 안 그림 적용 — 나무·돌·철판 바닥 · 회벽·돌벽 · 붉은 카펫 · 침대·탁자·책장·벽난로·왕좌·긴 식탁·갑옷·기둥·술통·화분·계산대·진열장·무기 걸이·허수아비 (성채·궁전은 돌벽, 공방은 철판, 비르디아 성은 흰 돌바닥, 헬리오스 술집은 술집 나무 바닥·둥근 탁자·바 카운터·돌 벽난로)", "테라코어: 도시 바닥 기름 묻은 돌길·바깥 길 붉은 벽돌·철길 그림 · 광장 가스 가로등과 공장 마당 톱니 기계·증기 탱크·크레인·경비 로봇·파이프·상자 · 역 열차 칸", "비르디아: 성채가 엘프 성 그림으로 · 낙엽 땅 길·맑은 샘물 · 깊은 숲에 빛나는 버드나무 · 성 안 뜰 랜턴 기둥·빛나는 버섯·수풀·꽃 덤불 · 헬리오스 황금 분수·검은 제단·황제 석상 그림 · 실베르 얼어붙은 진흙 땅 그림"],
      en: ["World Map (testing): interior art — wood, stone and steel floors · plaster and stone walls · red carpets · beds, tables, bookshelves, fireplaces, thrones, a banquet table, armor stands, pillars, barrels, potted plants, counters, display shelves, weapon racks and dummies (stone walls in keeps and palaces, steel in the workshop, white stone in Virdia's castle, and tavern floorboards, round tables, a bar counter and a stone fireplace in the Helios tavern)", "Terracore: oily cobblestone city streets, red brick roads and railway art · gas street lamps on the square and gear machines, steam tanks, cranes, guard robots, pipes and crates in the factory yards · a cargo car at the station", "Virdia: the keep is now an elven castle · leafy paths and a clear spring · glowing willows in the deep forest · lantern posts, glowing mushrooms, ferns and flowering bushes in the castle grounds · Helios golden fountains, the black altar and the emperor statue now use art · frozen mud ground art in Silber"],
      ja: ["世界地図（テスト中）：建物の中の絵を適用 — 木・石・鉄板の床・漆喰と石の壁・赤いカーペット・ベッド・テーブル・本棚・暖炉・玉座・長い食卓・鎧・柱・酒樽・鉢植え・カウンター・陳列棚・武器掛け・かかし（城館・宮殿は石の壁、工房は鉄板、ヴィルディアの城は白い石の床、ヘリオスの酒場は酒場の木の床・丸テーブル・バーカウンター・石の暖炉）", "テラコア：街の床は油じみた石畳・外の道は赤レンガ・線路の絵・広場のガス灯と工場の庭の歯車機械・蒸気タンク・クレーン・警備ロボット・パイプ・木箱・駅の貨車", "ヴィルディア：城館がエルフの城の絵に・落ち葉の道・澄んだ泉・深い森に光る柳・城の庭のランタン柱・光るキノコ・シダ・花の茂み・ヘリオスの黄金の噴水・黒い祭壇・皇帝像の絵・シルベルの凍った泥の地面の絵"],
    },
  },
  {
    version: "0.52.122",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 탈라시아 지도 (256×160칸, 대륙 동쪽 끝 무역항) — 강 하구를 낀 항구 도시(젖은 돌 거리 · 생선 노점 광장 · 무역 상회 · 민가 · 창고 아홉 · 다리) · 부두와 바다로 뻗은 잔교 셋(큰 범선·해적선·작은 배가 물결에 흔들림 · 크레인·화물·닻·그물) · 남동 곶 등대(도는 불빛) · 북쪽 해식 동굴 던전 · 순간 이동석 여섯", "대사막 동쪽 끝 ↔ 탈라시아 서쪽 땅길 (9장부터) · 무역 상회 주인 훅 = 게임 상점 뽑기 · 탈라시아 주민 대화 · 부두 판자·젖은 돌·해변·바다·배·창고·등대 등 그림 적용"],
      en: ["World Map (testing): Thalassia map (256×160 tiles, the trading port at the continent's eastern end) — a harbor city on the river mouth (wet stone streets · fish-stall plaza · Trading House · homes · nine warehouses · bridges) · docks with three piers out to sea (a great sailing ship, a pirate ship and small boats bobbing on the waves · cranes, cargo, anchors, nets) · a lighthouse with a turning beam on the southeastern cape · the Sea Cave dungeon to the north · six warp stones", "Land route between the Great Desert's eastern edge and western Thalassia (from Chapter 9) · Trading House keeper Hook opens the game shop gacha · talk with the people of Thalassia · art for dock planks, wet stone, beaches, sea, ships, warehouses, the lighthouse and more"],
      ja: ["世界地図（テスト中）：タラシアの地図（256×160マス、大陸東端の貿易港） — 河口に面した港町（濡れた石の通り・魚の屋台の広場・貿易商会・民家・倉庫9棟・橋）・埠頭と海へ伸びる桟橋3本（大きな帆船・海賊船・小舟が波に揺れる・クレーン・荷物・錨・網）・南東の岬の灯台（回る光）・北の海食洞のダンジョン・転移石6か所", "大砂漠の東端 ↔ タラシア西の陸路（第9章から）・貿易商会の主人フック = ゲームの商店ガチャ・タラシアの住人との会話・埠頭の板・濡れた石・浜辺・海・船・倉庫・灯台などの絵を適用"],
    },
  },
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
