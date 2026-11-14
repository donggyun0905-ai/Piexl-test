import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.116",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 비르디아 지도 (256×160칸) — 생울타리 성벽의 숲속 성(빛나는 세계수 광장 · 장로가 있는 성채 · 정령의 샘 · 약초 가게) · 서문 밖 거대 나무 집 마을 · 동쪽 바다로 흐르는 강과 다리 · 정령의 숲터 · 남서 늪 · 북동 깊은 숲 던전 · 동쪽 해안 · 순간 이동석 여섯", "테라코어 동쪽 끝 ↔ 비르디아 서쪽 끝 국경 통로 · 비르디아 주민(야수·이드라·변희·이무기·정령사·렌·플라이·장로) 대화 · 약초 가게 주인 = 게임 상점 이벤트 효과 탭"],
      en: ["World Map (testing): Virdia map (256×160 tiles) — a forest castle ringed by living hedges (the glowing World Tree plaza · the Elder's keep · the Spirit Spring · an herb shop) · a village of giant treehouses beyond the west gate · a river flowing to the eastern sea with bridges · the Spirit Grove · a southwest marsh · a Deep Forest dungeon to the northeast · the east coast · six warp stones", "Border crossing between Terracore's east end and Virdia's west end · talk with Virdia's people (Beastkin, Idra, Byeonhui, Imugi, Spiritist, Ren, Fly, Elder) · the herb shop keeper opens the game shop's event effects tab"],
      ja: ["世界地図（テスト中）：ヴィルディアの地図（256×160マス） — 生け垣の城壁に囲まれた森の城（光る世界樹の広場・長老のいる城館・精霊の泉・薬草屋）・西門の外に巨大な木の家の村・東の海へ流れる川と橋・精霊の森・南西の沼・北東の深い森のダンジョン・東の海岸・転移石6か所", "テラコア東端 ↔ ヴィルディア西端の国境の道・ヴィルディアの住人（獣人・イドラ・ビョンヒ・イムギ・精霊使い・レン・フライ・長老）との会話・薬草屋の主人 = ゲーム商店のイベント効果タブ"],
    },
  },
  {
    version: "0.52.115",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 테라코어 지도 (256×160칸) — 쇠 성벽 기계 도시(광장의 도는 톱니 기념물 · 굴뚝 연기 오르는 공장 지대와 파이프 · 공방 · 주거지) · 남문 밖 역과 동서 철길 · 콜로세움 · 북동 광산 던전 · 남서 호수 · 비르디아 국경", "아스칼론 동쪽 끝 국경 통로로 테라코어에 걸어서 갈 수 있음 (스토리 2장부터) · 다시 들어오면 마지막에 있던 나라에서 시작", "콜로세움 입구에서 F → 패왕전 · 공방 기술자 = 레이드 장신구 대장간 · 테라코어 순간 이동석 다섯"],
      en: ["World Map (testing): Terracore map (256×160 tiles) — an iron-walled machine city (a turning gear monument in the square · smoking factory chimneys and pipes · workshop · homes) · a station and east-west railway beyond the south gate · the Colosseum · a mine dungeon to the northeast · a lake to the southwest · the Virdia border", "Walk to Terracore through the border road at Ascalon's east edge (from Story Chapter 2) · you resume in the last nation you visited", "Press F at the Colosseum entrance for the Champion Clash · the workshop engineer works as a raid accessory smithy · five warp stones in Terracore"],
      ja: ["世界地図（テスト中）：テラコアの地図（256×160マス） — 鉄の城壁の機械都市（広場の回る歯車の記念碑・煙突から煙が上がる工場地帯とパイプ・工房・住宅地）・南門の外に駅と東西の線路・コロシアム・北東の鉱山ダンジョン・南西の湖・ヴィルディアの国境", "アスカロン東端の国境の道からテラコアへ歩いて行ける（ストーリー第2章から）・次に入ると最後にいた国から始まる", "コロシアムの入口でF → 覇王戦・工房の技術者はレイドアクセサリーの鍛冶屋・テラコアに転移石5つ"],
    },
  },
  {
    version: "0.52.114",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 아스칼론 동쪽 국경 숲가에 기억의 탑 — 문 앞에서 F를 누르면 무한 모드·영웅의 길 중 골라 들어감 (스토리에서 연 뒤에만) · 탑 앞 순간 이동석", "던전 입구 둘은 기본 혼자 하기 그대로"],
      en: ["World Map (testing): the Tower of Memory stands by the forest on Ascalon's eastern border — press F at its door to choose Endless Mode or Hero's Path (once unlocked in the story) · a warp stone by the tower", "The two dungeon entrances still start a regular solo run"],
      ja: ["世界地図（テスト中）：アスカロン東の国境の森のそばに記憶の塔 — 扉の前でFを押すと無限モード・英雄の道から選んで入る（ストーリーで解放後のみ）・塔の前に転移石", "ダンジョンの入口2か所は通常のソロプレイのまま"],
    },
  },
  {
    version: "0.52.113",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 가게 주인에게 말 걸면 게임 상점이 열림 (무기점 뽑기 · 방어구점 스킨 · 물약점 이벤트 효과 · 잡화점 로비 꾸밈) · 대장장이에게 말 걸면 레이드 장신구 장비창·승급·강화·재설정", "세계 지도에서 B로 장비창, C로 걸어 다닐 캐릭터 고르기 (파수꾼 말고도 연 캐릭터 누구나)", "투력: 낀 레이드 장신구로 정해지는 숫자, 지도 왼쪽 위에 보임 — 나중에 지역마다 권장 투력이 생김"],
      en: ["World Map (testing): talk to shopkeepers to open the game shop (weapon shop: gacha · armor shop: skins · potion shop: event effects · general store: lobby decor) · talk to the smith for raid accessory gear, promote, enhance and reroll", "On the World Map, press B for your gear and C to choose which character walks around (any unlocked character, not just the Warden)", "Power: a number set by your equipped raid accessories, shown at the top left of the map — regions will get recommended Power later"],
      ja: ["世界地図（テスト中）：店の主人に話しかけるとゲームの商店が開く（武器屋：ガチャ・防具屋：スキン・薬屋：イベント効果・雑貨屋：ロビー飾り）・鍛冶屋に話しかけるとレイドアクセサリーの装備・昇級・強化・再設定", "世界地図でBで装備画面、Cで歩き回るキャラクターを選べる（ワーデン以外も、解放したキャラなら誰でも）", "戦力：装備したレイドアクセサリーで決まる数値、地図の左上に表示 — のちに地域ごとの推奨戦力が付く"],
    },
  },
  {
    version: "0.52.112",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 아스칼론이 16배 넓어짐 (256×160칸) — 성벽 도시(광장·분수·안쪽 성과 성채·훈련장·주거지) · 상점가(무기점·방어구점·물약점·잡화점) · 장인 거리(대장간·여관) · 성 남쪽 강과 강가 길 · 서쪽 항구 부두 · 강 건너 농촌과 밭 · 남쪽 사막 끝 · 북쪽 바위산 던전과 서쪽 숲 던전 · 동쪽 테라코어 국경", "순간 이동석 다섯 곳(광장·농촌·던전 앞·항구·동쪽 갈림길): 한 번 만진 돌끼리 바로 이동", "가게·대장간·여관 안으로 들어가 주인과 이야기할 수 있음 (사고팔기는 아직 없음)"],
      en: ["World Map (testing): Ascalon is now 16 times larger (256×160 tiles) — walled city (square, fountain, inner castle and keep, training ground, homes) · market street (weapons, armor, potions, general store) · craft street (smithy, inn) · river and bank path south of the castle · western harbor pier · farms across the river · the edge of the southern desert · a mountain dungeon to the north and a forest dungeon to the west · the Terracore border to the east", "Five warp stones (square, farm, dungeon, harbor, east crossroads): travel instantly between stones you've touched", "Step inside the shops, smithy and inn to chat with their keepers (no buying or selling yet)"],
      ja: ["世界地図（テスト中）：アスカロンが16倍の広さに（256×160マス） — 城壁都市（広場・噴水・内城と城館・訓練場・住宅地） · 商店街（武器屋・防具屋・薬屋・雑貨屋） · 職人通り（鍛冶屋・宿屋） · 城の南の川と土手道 · 西の港の桟橋 · 川向こうの農村と畑 · 南の砂漠のはずれ · 北の岩山のダンジョンと西の森のダンジョン · 東のテラコア国境", "転移石5か所（広場・農村・ダンジョン前・港・東の分かれ道）：一度触れた石どうしならすぐ移動", "店・鍛冶屋・宿屋の中に入って主人と話せるように（売り買いはまだなし）"],
    },
  },
  {
    version: "0.52.111",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 아스칼론 풀밭과 나무(둥근 나무 둘·뾰족 나무 둘)를 새 그림으로 — 캐릭터가 잘 보이게 풀밭 색은 차분하게"],
      en: ["World Map (testing): new artwork for Ascalon's grass and trees (two round, two pine) — the grass is toned down so characters stand out"],
      ja: ["世界地図（テスト中）：アスカロンの草原と木（丸い木2・とがった木2）を新しい絵に — キャラクターが見やすいよう草原の色は落ち着いた色に"],
    },
  },
  {
    version: "0.52.110",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 건물 안으로 들어갈 수 있음 — 아스칼론 성 안에 큰 성채가 생기고 장군은 성채 안 왕좌 앞으로 · 집 넷도 문으로 들어가면 민가 안(침대·벽난로·책장) · 문 앞에서 F, 안에서는 아래 문으로 나감"],
      en: ["World Map (testing): you can now go inside buildings — a great keep stands in Ascalon Castle with the General inside before the throne · the four houses open into a home interior (bed, fireplace, bookshelf) · press F at a door, leave through the door at the bottom"],
      ja: ["世界地図（テスト中）：建物の中に入れるように — アスカロン城に大きな城館ができ、将軍は城館の玉座の前に · 4軒の家も扉から民家の中へ（ベッド・暖炉・本棚） · 扉の前でF、中では下の扉から出る"],
    },
  },
];
