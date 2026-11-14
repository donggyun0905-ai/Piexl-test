import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.118",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 헬리오스 지도 (256×160칸) — 돌 성벽 제국 도시(붉은 벽돌 큰길 · 대리석 대광장의 황금 분수·깃발·화단 · 황금 궁전(이클립스) · 시장·재봉소·뒷골목 술집 · 뒷골목의 수상한 검은 제단 · 제국 집 주거지) · 북쪽 사막 끝 · 서쪽 농장 · 동쪽 강과 다리 · 남서 버려진 수로 던전 · 남쪽 항구 · 순간 이동석 여섯", "광장 황제 석상 → 레이드 아레나 (스토리에서 연 뒤) · 테라코어 남쪽 사막 ↔ 헬리오스 북쪽 사막 길 (3장부터) · 가게 주인 = 게임 상점 (시장 뽑기 · 재봉소 스킨) · 헬리오스 주민 대화"],
      en: ["World Map (testing): Helios map (256×160 tiles) — a stone-walled imperial city (red-brick avenues · golden fountains, banners and flowerbeds on the marble Grand Plaza · the Golden Palace (Eclipse) · market, tailor and a back-alley tavern · a strange black altar in the back alley · imperial homes) · the desert's edge to the north · farms to the west · a river and bridge to the east · the Abandoned Aqueduct dungeon to the southwest · a harbor to the south · six warp stones", "The emperor's statue in the plaza → Raid Arena (once unlocked in the story) · desert road between southern Terracore and northern Helios (from Chapter 3) · shopkeepers open the game shop (market: gacha · tailor: skins) · talk with the people of Helios"],
      ja: ["世界地図（テスト中）：ヘリオスの地図（256×160マス） — 石の城壁の帝国都市（赤レンガの大通り・大理石の大広場の黄金の噴水・旗・花壇・黄金宮殿（イクリプス）・市場・仕立て屋・裏通りの酒場・裏通りの怪しい黒い祭壇・帝国の家の住宅地）・北の砂漠の端・西の農場・東の川と橋・南西の捨てられた水路のダンジョン・南の港・転移石6か所", "広場の皇帝の石像 → レイドアリーナ（ストーリーで解放後）・テラコア南の砂漠 ↔ ヘリオス北の砂漠の道（第3章から）・店の主人 = ゲームの商店（市場：ガチャ・仕立て屋：スキン）・ヘリオスの住人との会話"],
    },
  },
  {
    version: "0.52.117",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 나라 지도 — M 키(또는 위 지도 버튼)로 열고 닫음 · B 장비창 왼쪽에도 함께 보임 · 내 자리 · 던전·모드 입구·국경 통로 표시", "지도 위 순간 이동석(✨)을 누르면 그곳으로 바로 이동 (한 번 만진 이동석만, 안 만진 돌은 흐리게 · 건물 안에서도 됨)"],
      en: ["World Map (testing): nation map — open and close with M (or the Map button at the top) · also shown to the left of the B gear window · shows where you are, dungeons, mode entrances and border crossings", "Tap a warp stone (✨) on the map to teleport there (only stones you've touched; untouched ones are dimmed · works from inside buildings too)"],
      ja: ["世界地図（テスト中）：国の地図 — Mキー（または上の地図ボタン）で開閉・B装備画面の左にも表示・現在地・ダンジョン・モードの入口・国境の道を表示", "地図の転移石（✨）を押すとそこへすぐ移動（一度触れた転移石のみ、未接触の石は薄く表示・建物の中からも可）"],
    },
  },
  {
    version: "0.52.116",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 비르디아 지도 (256×160칸) — 생울타리 성벽의 숲속 성(빛나는 세계수 광장 · 장로가 있는 성채 · 정령의 샘 · 약초 가게) · 서문 밖 거대 나무 집 마을 · 동쪽 바다로 흐르는 강과 다리 · 정령의 숲터 · 남서 늪 · 북동 깊은 숲 던전 · 동쪽 해안 · 순간 이동석 여섯", "테라코어 동쪽 끝 ↔ 비르디아 서쪽 끝 국경 통로 · 비르디아 주민(야수·이드라·변희·이무기·정령사·렌·플라이·장로) 대화 · 약초 가게 주인 = 게임 상점 이벤트 효과 탭"],
      en: ["World Map (testing): Virdia map (256×160 tiles) — a forest castle ringed by living hedges (the glowing World Tree plaza · the Elder's keep · the Spirit Spring · an herb shop) · a village of giant treehouses beyond the west gate · a river flowing to the eastern sea with bridges · the Spirit Grove · a southwest marsh · a Deep Forest dungeon to the northeast · the east coast · six warp stones", "Border crossing between Terracore's east end and Virdia's west end · talk with Virdia's people (Beastkin, Idra, Byeonhui, Imugi, Spiritist, Ren, Fly, Elder) · the herb shop keeper opens the game shop's event effects tab"],
      ja: ["世界地図（テスト中）：ヴィルディアの地図（256×160マス） — 生け垣の城壁に囲まれた森の城（光る世界樹の広場・長老のいる城館・精霊の泉・薬草屋）・西門の外に巨大な木の家の村・東の海へ流れる川と橋・精霊の森・南西の沼・北東の深い森のダンジョン・東の海岸・転移石6か所", "テラコア東端 ↔ ヴィルディア西端の国境の道・ヴィルディアの住人（獣人・イドラ・ビョンヒ・イムギ・精霊使い・レン・フライ・長老）との会話・薬草屋の主人 = ゲーム商店のイベント効果タブ"],
    },
  },
];
