import type { Lang } from "../index";

// 화면 글자: 세계 지도 사막 (world/places/desertField) · 표지판 글은 `{이름 키}Text`
export const WORLD_DESERT_TEXT = {
  wpDesert: { ko: "대사막", en: "Great Desert", ja: "大砂漠" },
  wpOasis: { ko: "오아시스", en: "Oasis", ja: "オアシス" },
  wpOasisText: { ko: "사막 한가운데의 맑은 샘. 대상들이 천막을 치고 쉬어 가는 곳이다. 북쪽은 아스칼론·테라코어, 남쪽은 헬리오스로 가는 돌길이 이어진다.", en: "A clear spring in the heart of the desert where caravans pitch their tents to rest. Stone roads lead north to Ascalon and Terracore, and south to Helios.", ja: "砂漠の真ん中の澄んだ泉。隊商が天幕を張って休んでいく場所だ。北はアスカロン・テラコア、南はヘリオスへの石の道が続く。" },
  wpTemple: { ko: "태초의 신전", en: "Temple of the Beginning", ja: "太初の神殿" },
  wpTempleText: { ko: "태초가 봉인되어 있던 사암 신전. 문 안에서는 끝없이 밀려오는 무리와 싸우는 광야의 새벽이 기다린다.", en: "The sandstone temple where the Beginning was once sealed. Inside awaits Dawn of the Wilds, an endless tide of foes.", ja: "太初が封印されていた砂岩の神殿。扉の中では押し寄せる群れと戦う荒野の夜明けが待っている。" },
  wpCelestia: { ko: "세레스티아 옛 도읍", en: "Ruins of Celestia", ja: "セレスティアの旧都" },
  wpCelestiaText: { ko: "모래에 묻혀 버린 옛 나라 세레스티아의 도읍. 무너진 성벽과 기둥만 남았다. 북서쪽 왕묘의 문은 아직 열려 있다.", en: "The capital of Celestia, an old nation swallowed by sand. Only broken walls and columns remain. The royal tomb to the northwest still stands open.", ja: "砂に埋もれた古い国セレスティアの都。崩れた城壁と柱だけが残る。北西の王墓の扉はまだ開いている。" },
  wpTomb: { ko: "옛 왕묘 던전 입구", en: "Royal Tomb dungeon entrance", ja: "古の王墓のダンジョン入口" },
  wpWarpDesertNW: { ko: "아스칼론 길 이동석", en: "Ascalon road warp stone", ja: "アスカロン道の転移石" },
  wpWarpDesertNE: { ko: "테라코어 길 이동석", en: "Terracore road warp stone", ja: "テラコア道の転移石" },
  wpWarpOasis: { ko: "오아시스 이동석", en: "Oasis warp stone", ja: "オアシスの転移石" },
  wpWarpTemple: { ko: "신전 이동석", en: "Temple warp stone", ja: "神殿の転移石" },
  wpWarpCelestia: { ko: "세레스티아 이동석", en: "Celestia warp stone", ja: "セレスティアの転移石" },
  wpWarpDesertSouth: { ko: "헬리오스 길 이동석", en: "Helios road warp stone", ja: "ヘリオス道の転移石" },
  wnDesertBedouin: { ko: "오아시스에선 다들 쉬어 가. 신전 쪽은 밤마다 모래가 울어대니, 갈 거면 단단히 준비하라고.", en: "Everyone rests at the oasis. The sands wail near the temple every night, so prepare well if you're going.", ja: "オアシスではみんな一休みしていく。神殿のほうは毎晩砂が鳴くから、行くならしっかり準備しな。" },
  wnDesertWanderer: { ko: "모래 밑에 한 나라가 통째로 잠들어 있지. 걷다 보면 옛 이야기가 발밑에서 들려온다네.", en: "A whole nation sleeps beneath this sand. Walk long enough and you'll hear old stories underfoot.", ja: "この砂の下には国ひとつが丸ごと眠っている。歩いていると足もとから昔の話が聞こえてくるよ。" },
} satisfies Record<string, Record<Lang, string>>;
