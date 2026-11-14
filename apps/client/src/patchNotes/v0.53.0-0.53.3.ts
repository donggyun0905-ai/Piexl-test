import type { PatchNote } from "./types";

export const NOTES: PatchNote[] = [
  {
    version: "0.53.3",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중): 나라마다 바람 세기가 달라 나무·대나무·해초·천 깃발·야자수·꽃나무 윗부분이 위로 갈수록 더 휘며 흔들림(비연이 가장 셈, 건물 안은 잔잔) · 나무와 물건에 오른쪽 아래로 눕는 그림자 · 나라별 색 보정과 날씨(실베르 눈 · 비르디아 반딧불 · 사막 모래바람 · 테라코어 그을음) · 헬리오스 붉은 깃발이 바람 세기만큼 출렁임 · 헬리오스 술집 겉모습 그림 · 비연 풍차 언덕과 마을 앞에 하늘을 나는 연"],
      en: ["World Map (testing): each nation has its own wind, so trees, bamboo, kelp, cloth banners, palms and blossom trees bend more toward the top as they sway (strongest in Biyeon, calm indoors) · trees and props cast shadows toward the lower right · per-nation color grading and weather (snow in Silber · fireflies in Virdia · blowing sand in the desert · soot in Terracore) · Helios's red banners ripple with the wind · art for the Helios tavern front · kites flying over Biyeon's windmill hill and village"],
      ja: ["世界地図（テスト中）：国ごとに風の強さが違い、木・竹・海藻・布の旗・ヤシ・花の木が上ほど大きくしなって揺れる（ビヨンが一番強く、建物の中は静か）・木や物に右下へ伸びる影・国ごとの色補正と天気（シルベルの雪・ヴィルディアの蛍・砂漠の砂嵐・テラコアの煤）・ヘリオスの赤い旗が風の強さに合わせてはためく・ヘリオスの酒場の外観の絵・ビヨンの風車の丘と村の前に空を舞う凧"],
    },
  },
  {
    version: "0.53.2",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중): 헬리오스 북문·남문에 탑이 둘 달린 높은 성문 · 비르디아 깊은 숲 길과 정령의 숲 들머리에 뿌리 아치 · 테라코어 공장 지대에 굴뚝 탑과 쇠 창고(역 옆에도 하나) · 공장 지대·광장 바닥에 배수 격자"],
      en: ["World Map (testing): tall twin-towered gates on Helios's north and south entrances · root arches on Virdia's deep forest path and at the Spirit Grove entrance · chimney towers and steel warehouses in Terracore's factory district (plus one by the station) · drainage grates on the factory and square floors"],
      ja: ["世界地図（テスト中）：ヘリオスの北門・南門に塔が二つある高い城門・ヴィルディアの深い森の道と精霊の森の入口に根のアーチ・テラコアの工場地帯に煙突塔と鉄の倉庫（駅の横にも一つ）・工場地帯と広場の床に排水格子"],
    },
  },
  {
    version: "0.53.1",
    date: "2026-11-15",
    items: {
      ko: [
        "세계 지도(시험 중): 건물 안 — 나라마다 민가 안이 달라짐(테라코어 철판·파이프 · 비르디아 고사리·버섯 · 헬리오스 대리석 · 실베르 돌바닥·화로 · 탈라시아 부두 판자·닻, 창고는 상자와 화물 · 해저 산호·조개 · 비연 항아리·바람개비 · 성국 수도원) · 아스칼론(상점가 동쪽)·헬리오스(남쪽 큰길 옆)에 교회(가운데 카펫 통로 끝 제단 · 긴 의자 · 촛대 · 오르간 · 성직자) · 건물 안 나가는 곳에 안쪽 문 그림 · 헬리오스 궁전·가게 대리석 바닥 · 바람골 이름이 비연으로",
      ],
      en: [
        "World Map (testing): interiors — each nation's houses now look different inside (Terracore steel floors and pipes · Virdia ferns and mushrooms · Helios marble · Silber stone floors and braziers · Thalassia dock planks and anchors, warehouses full of crates and cargo · Undersea coral and clams · Biyeon jars and pinwheels · Seongguk monasteries) · new churches in Ascalon (east of the shopping street) and Helios (by the south road) with an altar at the end of a carpeted aisle, pews, candle stands, an organ and a priest · interior exits now show an inner door · marble floors in the Helios palace and shops · Windvale is renamed Biyeon",
      ],
      ja: [
        "世界地図（テスト中）：建物の中 — 国ごとに民家の中が変わりました（テラコア鉄板・パイプ・ヴィルディアのシダ・キノコ・ヘリオスの大理石・シルベルの石床・火鉢・タラシアの桟橋板・錨、倉庫は木箱と荷物・海底のサンゴ・貝・ビヨンの壺・風車・聖国の修道院）・アスカロン（商店街の東）とヘリオス（南の大通りの横）に教会（中央のじゅうたんの通路の先に祭壇・長椅子・燭台・オルガン・聖職者）・建物の出口に内側の扉の絵・ヘリオスの宮殿と店の床が大理石に・風の谷の名前がビヨンに",
      ],
    },
  },
  {
    version: "0.53.0",
    date: "2026-11-15",
    items: {
      ko: [
        "세계 지도(시험 중): 새 지역 여섯 — 지옥(실베르 악마의 문 너머, 9장: 흑요석 성채 안 악마의 문 던전 · 용암 강·호수 · 해골 기둥 · 성채에 가까울수록 초록이 되는 불씨) · 해저 도시(탈라시아 잔교 끝 잠수 종, 9장: 조개 집·공기 방울 돔 마을 · 해저 신전 · 심연 해구 던전 · 거품)",
        "네온 시티(테라코어 역에서 해저 열차, 9장: 열차 안에서 창밖 바다를 보며 5분 뒤 도착 · 빌딩·네온 거리·홀로그램 · 편의점 = 로비 꾸밈 상점 · 지하 데이터 센터 던전 · 비) · 바람골(비르디아 동쪽 해안 나룻배, 9장: 기와 마을·큰 기와집 · 풍차 언덕 · 대나무숲 · 바람 골짜기 던전 · 날리는 꽃잎)",
        "성국(대사막 서남쪽 순례길, 8장: 흰 성벽 성도 · 대성당 안 제단·긴 의자·오르간 · 수도원 · 지하 묘지 던전 · 성스러운 호수) · 새벽의 성흔 아지트(헬리오스 술집 구석 지하 계단, 7장: 무기고·작전실·훈련장·감옥 · 악마 사냥꾼 아홉) · 각 지역 그림 적용 · 나라 지도(M) 색도 지역에 맞춤",
      ],
      en: [
        "World Map (testing): six new regions — Hell (beyond Silber's Demon Gate, Chapter 9: the Demon Gate dungeon inside an obsidian citadel · lava rivers and lakes · skull pillars · embers that turn green near the citadel) · Undersea City (diving bell at the end of Thalassia's pier, Chapter 9: a village of shell houses and bubble domes · Sea Temple · Abyssal Trench dungeon · bubbles)",
        "Neon City (Undersea Train from Terracore Station, Chapter 9: watch the sea through the windows and arrive after 5 minutes · towers, neon streets and holograms · corner store = lobby decor shop · Underground Data Center dungeon · rain) · Windvale (ferry from Virdia's east coast, Chapter 9: tiled-roof village and manor · windmill hill · bamboo grove · Wind Gorge dungeon · drifting petals)",
        "Seongguk (pilgrim road from the Great Desert's southwest, Chapter 8: white-walled Holy City · cathedral with altar, pews and organ · monasteries · Catacombs dungeon · Holy Lake) · Stigmata of Dawn hideout (cellar stairs in the Helios tavern, Chapter 7: armory, war room, training hall and cells · nine demon hunters) · art for every region · region map (M) colors match each region",
      ],
      ja: [
        "世界地図（テスト中）：新しい地域6つ — 地獄（シルベルの悪魔の門の向こう、第9章：黒曜石の城塞の中の悪魔の門ダンジョン・溶岩の川と湖・髑髏の柱・城塞に近いほど緑になる火の粉）・海底都市（タラシアの桟橋の先の潜水鐘、第9章：貝の家と泡のドームの村・海底神殿・深淵の海溝ダンジョン・泡）",
        "ネオンシティ（テラコア駅から海底列車、第9章：車窓の海を眺めて5分後に到着・ビル・ネオン街・ホログラム・コンビニ = ロビー装飾ショップ・地下データセンターダンジョン・雨）・風の谷（ヴィルディア東の海岸から渡し舟、第9章：瓦の村と大きな屋敷・風車の丘・竹林・風の峡谷ダンジョン・舞う花びら）",
        "聖国（大砂漠南西の巡礼路、第8章：白い城壁の聖都・祭壇・長椅子・オルガンのある大聖堂・修道院・地下墓地ダンジョン・聖なる湖）・夜明けの聖痕のアジト（ヘリオスの酒場の隅の地下階段、第7章：武器庫・作戦室・訓練場・牢・悪魔狩り9人）・各地域の絵を適用・国の地図（M）の色も地域に合わせる",
      ],
    },
  },
];
