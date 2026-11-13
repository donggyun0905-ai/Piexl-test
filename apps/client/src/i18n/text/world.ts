import type { Lang } from "../index";

// 화면 글자: 세계 지도 (world/WorldMode · 장소 이름 world/worldPlaces) · 표지판 글은 `{이름 키}Text`
export const WORLD_TEXT = {
  worldMap: { ko: "세계 지도 (시험 중)", en: "World Map (testing)", ja: "世界地図（テスト中）" },
  worldMapDesc: { ko: "스토리 나라를 걸어 다니는 지도 · 지금은 아스칼론 필드만", en: "Walk the nations of the story · only the Ascalon field for now", ja: "物語の国々を歩く地図・今はアスカロンのフィールドだけ" },
  worldHelp: { ko: "WASD·방향키·누르기로 이동 · F 들어가기·읽기", en: "WASD / arrows / tap to move · F to enter or read", ja: "WASD・矢印キー・タップで移動・Fで入る・読む" },
  worldLoading: { ko: "지도 불러오는 중…", en: "Loading map…", ja: "地図を読み込み中…" },
  worldFail: { ko: "지도를 불러오지 못했어요", en: "Couldn't load the map", ja: "地図を読み込めませんでした" },
  wpEnter: { ko: "던전 들어가기", en: "Enter dungeon", ja: "ダンジョンに入る" },
  wpVisit: { ko: "마을 들어가기", en: "Enter town", ja: "町に入る" },
  wpRead: { ko: "읽기", en: "Read", ja: "読む" },
  wpTownSoon: { ko: "성문이 닫혀 있다. (마을과 이야기 장면은 다음 단계에서 열려요)", en: "The gates are closed. (The town and story scenes open in the next step)", ja: "城門は閉まっている。（町と物語シーンは次の段階で開きます）" },
  wpAscalonCastle: { ko: "아스칼론 성", en: "Ascalon Castle", ja: "アスカロン城" },
  wpDungeon: { ko: "던전 입구", en: "Dungeon entrance", ja: "ダンジョンの入口" },
  wpSignAscalon: { ko: "갈림길 표지판", en: "Crossroads sign", ja: "分かれ道の看板" },
  wpSignAscalonText: { ko: "서쪽: 아스칼론 성 · 북쪽: 던전 입구 · 동쪽: 다리 건너 비르디아", en: "West: Ascalon Castle · North: dungeon entrance · East: across the bridge to Virdia", ja: "西：アスカロン城・北：ダンジョンの入口・東：橋を渡ってヴィルディア" },
  wpSignVirdia: { ko: "국경 표지판", en: "Border sign", ja: "国境の看板" },
  wpSignVirdiaText: { ko: "이 숲 너머는 비르디아. 지금은 길이 막혀 있다.", en: "Beyond this forest lies Virdia. The way is blocked for now.", ja: "この森の向こうはヴィルディア。今は道がふさがっている。" },
} satisfies Record<string, Record<Lang, string>>;
