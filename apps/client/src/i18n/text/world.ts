import type { Lang } from "../index";

// 화면 글자: 세계 지도 (world/WorldMode · 장소 이름 world/worldPlaces) · 표지판 글은 `{이름 키}Text`
export const WORLD_TEXT = {
  worldMap: { ko: "세계 지도 (시험 중)", en: "World Map (testing)", ja: "世界地図（テスト中）" },
  worldMapDesc: { ko: "스토리 나라를 걸어 다니는 지도 · 지금은 아스칼론·테라코어·비르디아·헬리오스·대사막·실베르 (M 나라 지도·순간 이동석)", en: "Walk the nations of the story · Ascalon, Terracore, Virdia, Helios, the Great Desert and Silber for now (M nation map, warp stones)", ja: "物語の国々を歩く地図・今はアスカロン・テラコア・ヴィルディア・ヘリオス・大砂漠・シルベル（M国の地図・転移石）" },
  worldHelp: { ko: "WASD·방향키·누르기로 이동 · F 들어가기·읽기·말 걸기 · B 장비 · C 캐릭터 · M 지도", en: "WASD / arrows / tap to move · F to enter, read or talk · B gear · C character · M map", ja: "WASD・矢印キー・タップで移動・Fで入る・読む・話す・B装備・Cキャラクター・M地図" },
  wmTitle: { ko: "지도", en: "Map", ja: "地図" },
  wmHint: { ko: "만진 이동석(✨)을 누르면 그곳으로 순간 이동 · 흐린 돌은 아직 안 만진 곳", en: "Tap a warp stone you've touched (✨) to teleport there · dim stones haven't been touched yet", ja: "触れた転移石（✨）を押すとそこへ瞬間移動・薄い石はまだ触れていない場所" },
  wmMe: { ko: "지금 있는 곳", en: "You are here", ja: "現在地" },
  worldLoading: { ko: "지도 불러오는 중…", en: "Loading map…", ja: "地図を読み込み中…" },
  worldFail: { ko: "지도를 불러오지 못했어요", en: "Couldn't load the map", ja: "地図を読み込めませんでした" },
  wpEnter: { ko: "던전 들어가기", en: "Enter dungeon", ja: "ダンジョンに入る" },
  wpTalk: { ko: "말 걸기", en: "Talk", ja: "話しかける" },
  wpRead: { ko: "읽기", en: "Read", ja: "読む" },
  wpAscalonCastleText: { ko: "아스칼론 성 광장. 북쪽 안쪽 성의 성채에서 장군이 기다린다. 장군에게 말을 걸면 지금까지 열린 이야기를 들을 수 있다. 동쪽은 상점가, 서쪽은 주거지와 훈련장이다.", en: "Ascalon Castle square. The General waits in the keep of the inner castle to the north; talk to them to hear the story so far. The market lies east, homes and the training ground west.", ja: "アスカロン城の広場。北の内城の城館で将軍が待っている。話しかけるとここまで開いた物語を聞ける。東は商店街、西は住宅地と訓練場。" },
  wnMage: { ko: "던전 입구는 동문 밖 북쪽 바위산에 하나, 서문 밖 숲속에 하나. 거기서 실력을 쌓으면 새 이야기가 열린대요.", en: "There's a dungeon in the rocks north beyond the east gate, and one in the forest past the west gate. Grow stronger there and new chapters open.", ja: "ダンジョンは東門の外の北の岩山に一つ、西門の外の森に一つ。そこで腕を磨けば新しい物語が開くそうです。" },
  wnDrifter: { ko: "떠돌다 보니 여관 일까지 맡게 됐지 뭐야. 쉬어 가. 국경이 열리면 손님도 늘겠지.", en: "Drifted around long enough to end up running the inn. Rest a while. Once the borders open, there'll be more guests.", ja: "さすらってるうちに宿の仕事まで任されちまった。休んでいきな。国境が開けば客も増えるだろう。" },
  wnNovice: { ko: "밭일 끝나면 저도 던전에 가 볼 거예요! 언젠가 장군님처럼 강해지고 싶어요.", en: "Once the farm work's done I'm heading to the dungeon! I want to be as strong as the General someday.", ja: "畑仕事が終わったらぼくもダンジョンに行きます！いつか将軍みたいに強くなりたいです。" },
  wpAscalonCastle: { ko: "아스칼론 성", en: "Ascalon Castle", ja: "アスカロン城" },
  wpDungeon: { ko: "던전 입구", en: "Dungeon entrance", ja: "ダンジョンの入口" },
  wpSignAscalon: { ko: "갈림길 표지판", en: "Crossroads sign", ja: "分かれ道の看板" },
  wpSignAscalonText: { ko: "서쪽: 아스칼론 성 · 북쪽: 바위산 던전 · 동쪽: 테라코어 국경", en: "West: Ascalon Castle · North: mountain dungeon · East: Terracore border", ja: "西：アスカロン城・北：岩山のダンジョン・東：テラコアの国境" },
  wpAscalonKeep: { ko: "아스칼론 성채", en: "Ascalon Keep", ja: "アスカロン城館" },
  wpHouse: { ko: "민가", en: "House", ja: "民家" },
  wpGoIn: { ko: "들어가기", en: "Go in", ja: "入る" },
  wpGoOut: { ko: "나가기", en: "Go out", ja: "出る" },
} satisfies Record<string, Record<Lang, string>>;
