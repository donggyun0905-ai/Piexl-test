import type { Lang } from "../index";

// 화면 글자: 세계 지도 (world/WorldMode · 장소 이름 world/worldPlaces) · 표지판 글은 `{이름 키}Text`
export const WORLD_TEXT = {
  worldMap: { ko: "세계 지도 (시험 중)", en: "World Map (testing)", ja: "世界地図（テスト中）" },
  worldMapDesc: { ko: "스토리 나라를 걸어 다니는 지도 · 지금은 아스칼론만 (성 안 마을·이야기·던전 입구)", en: "Walk the nations of the story · Ascalon only for now (castle town, story, dungeon)", ja: "物語の国々を歩く地図・今はアスカロンだけ（城下町・物語・ダンジョン）" },
  worldHelp: { ko: "WASD·방향키·누르기로 이동 · F 들어가기·읽기·말 걸기", en: "WASD / arrows / tap to move · F to enter, read or talk", ja: "WASD・矢印キー・タップで移動・Fで入る・読む・話す" },
  worldLoading: { ko: "지도 불러오는 중…", en: "Loading map…", ja: "地図を読み込み中…" },
  worldFail: { ko: "지도를 불러오지 못했어요", en: "Couldn't load the map", ja: "地図を読み込めませんでした" },
  wpEnter: { ko: "던전 들어가기", en: "Enter dungeon", ja: "ダンジョンに入る" },
  wpTalk: { ko: "말 걸기", en: "Talk", ja: "話しかける" },
  wpRead: { ko: "읽기", en: "Read", ja: "読む" },
  wpAscalonCastleText: { ko: "아스칼론 성 광장. 분수 너머 위쪽에서 장군이 기다린다. 장군에게 말을 걸면 지금까지 열린 이야기를 들을 수 있다.", en: "Ascalon Castle square. The General waits beyond the fountain. Talk to the General to hear the story so far.", ja: "アスカロン城の広場。噴水の向こうで将軍が待っている。将軍に話しかけると、ここまで開いた物語を聞ける。" },
  wnMage: { ko: "북쪽 바위산의 던전 입구, 보이나요? 거기서 실력을 쌓으면 새 이야기가 열린대요.", en: "See the dungeon entrance in the northern rocks? Grow stronger there and new chapters will open.", ja: "北の岩山のダンジョンの入口、見えますか？そこで腕を磨けば新しい物語が開くそうです。" },
  wnDrifter: { ko: "동쪽 다리를 건너면 비르디아지. 지금은 국경이 막혀 있지만… 언젠간 열리겠지.", en: "Cross the eastern bridge and you're in Virdia. The border's closed for now… but not forever.", ja: "東の橋を渡ればヴィルディアだ。今は国境がふさがっているが…いつかは開くさ。" },
  wnNovice: { ko: "저도 언젠가 장군님처럼 강해지고 싶어요! 오늘도 던전에 가 볼 거예요.", en: "I want to be as strong as the General someday! I'm heading to the dungeon again today.", ja: "ぼくもいつか将軍みたいに強くなりたいです！今日もダンジョンに行ってきます。" },
  wpAscalonCastle: { ko: "아스칼론 성", en: "Ascalon Castle", ja: "アスカロン城" },
  wpDungeon: { ko: "던전 입구", en: "Dungeon entrance", ja: "ダンジョンの入口" },
  wpSignAscalon: { ko: "갈림길 표지판", en: "Crossroads sign", ja: "分かれ道の看板" },
  wpSignAscalonText: { ko: "서쪽: 아스칼론 성 · 북쪽: 던전 입구 · 동쪽: 다리 건너 비르디아", en: "West: Ascalon Castle · North: dungeon entrance · East: across the bridge to Virdia", ja: "西：アスカロン城・北：ダンジョンの入口・東：橋を渡ってヴィルディア" },
  wpSignVirdia: { ko: "국경 표지판", en: "Border sign", ja: "国境の看板" },
  wpSignVirdiaText: { ko: "이 숲 너머는 비르디아. 지금은 길이 막혀 있다.", en: "Beyond this forest lies Virdia. The way is blocked for now.", ja: "この森の向こうはヴィルディア。今は道がふさがっている。" },
} satisfies Record<string, Record<Lang, string>>;
