import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.55.9",
    date: "2026-11-16",
    items: {
      ko: ["세계 지도(시험 중) 지도 전투에서 키운 것이 다음 싸움으로 이어짐: 이무기 콤보, 풋내기·아슈바르 레벨과 경험치, 악의 사도·이터·몰락한 왕·백령의 영혼, 에테르 광부 원석, 별지기의 별, 아티팩터 제작 게이지 등 (같은 캐릭터일 때 · 쓰러지면 처음부터) · 풋내기·아슈바르는 지도 화면 아래에서 레벨업 능력치를 찍을 수 있음 · 근처에 적이 있으면 판 끝에서 2초를 밀어야 도망 (뒷걸음질하다 실수로 도망치지 않게)"],
      en: ["World Map (testing) what you build up in field combat now carries into the next fight: Imugi's combo, the levels and EXP of the Novice and the Ashvar, the souls of the Apostle of Malice, Eater, Fallen King and Baekryeong, the Ether Miner's ore, the Stargazer's stars, the Artifacter's crafting gauge and more (same character only; it resets if you fall) · The Novice and the Ashvar can spend level-up points at the bottom of the map screen · With an enemy nearby you must push against the edge for 2 seconds to flee (so you don't flee by accident while backing off)"],
      ja: ["世界地図（テスト中）フィールド戦闘で育てたものが次の戦いに引き継がれる：イムギのコンボ、見習い・アシュヴァルのレベルと経験値、悪の使徒・イーター・堕ちた王・白霊の魂、エーテル鉱夫の原石、星守りの星、アーティファクターの製作ゲージなど（同じキャラクターのとき・倒れると最初から）・見習い・アシュヴァルは地図画面の下でレベルアップの能力を振れる・近くに敵がいると端で2秒押さないと逃げられない（後ずさりしてうっかり逃げないように）"],
    },
  },
  {
    version: "0.55.8",
    date: "2026-11-16",
    items: {
      ko: ["화면: 던전·연습장·레이드·광야의 새벽·패왕전·타워 디펜스 바닥을 방마다 한 장으로 미리 그려서, 화면 배율에 따라 칸 사이에 보이던 검은 선을 없앰 · 세계 지도도 덩어리 사이 가는 틈을 없앰 · 판자·쇠판 바닥과 지도 바닥 결 8가지의 반복 경계가 어긋나 보이던 것을 고침 · 눈이 아픈 바닥(용암 지대·붉은 빛·진한 보라·덩굴)을 채도와 밝기를 낮춰 차분하게"],
      en: ["Display: dungeon, practice, raid, Dawn of the Wilds, Champion Clash and tower defense floors are now pre-drawn as one image per room, removing the black lines that appeared between tiles at some screen scales · The world map no longer shows thin gaps between chunks · Fixed visible misaligned edges where plank and metal floors and 8 world ground textures repeat · Eye-straining floors (lava, red glow, deep purple, vines) are toned down in color and brightness"],
      ja: ["画面：ダンジョン・練習場・レイド・荒野の夜明け・覇王戦・タワーディフェンスの床を部屋ごとに1枚で先に描き、画面の倍率によってマスの間に見えていた黒い線をなくした・世界地図もかたまりの間の細いすき間をなくした・板張りと鉄板の床、地図の地面8種類の繰り返しの境目がずれて見えていたのを修正・目が疲れる床（溶岩地帯・赤い光・濃い紫・つる）の彩度と明るさを下げて落ち着いた色に"],
    },
  },
  {
    version: "0.55.7",
    date: "2026-11-16",
    items: {
      ko: ["세계 지도(시험 중) 지도 전투를 모두 던전 방식으로: 예전 흰 휘두르기·지도용 대시는 없어짐 · 바깥 필드 어디서든 좌클릭·J 공격, 우클릭·K 대시, 1~4 스킬을 누르면 그 자리가 바로 전투판이 되어 캐릭터 원래 기본 공격·기본 패시브·스킬로 싸움 · 적이 없고 1.5초 동안 아무것도 안 누르면 판이 닫힘 · 지도에서 걸을 때 체력도 던전과 같은 값 (장신구 포함)"],
      en: ["World Map (testing) all field combat now works like the dungeon: the old white swing and map-only dash are gone · Anywhere outdoors, left click / J to attack, right click / K to dash or 1-4 for skills turns that spot into a battlefield and you fight with your character's real basic attack, passives and skills · With no enemies and no input for 1.5 seconds the battlefield closes · Your HP while walking the map matches the dungeon value too (trinkets included)"],
      ja: ["世界地図（テスト中）フィールド戦闘をすべてダンジョン方式に：以前の白い斬撃と地図用ダッシュはなくなる・屋外ならどこでも左クリック・Jで攻撃、右クリック・Kでダッシュ、1〜4でスキルを押すとその場が戦場になり、キャラクター本来の基本攻撃・パッシブ・スキルで戦う・敵がいなくて1.5秒何も押さないと戦場が閉じる・地図を歩くときの体力もダンジョンと同じ値（装身具込み）"],
    },
  },
  {
    version: "0.55.6",
    date: "2026-11-16",
    items: {
      ko: ["세계 지도(시험 중) 지도 전투에 빛 효과(던전과 같은 빛나는 탄·폭발 빛)와 화면 흔들림(설정을 따름) · 휴대폰: 전투판 안에서 누른 곳으로 걷고 공격은 자동 (가까운 적)"],
      en: ["World Map (testing) field combat now has glow effects (the same glowing shots and blasts as the dungeon) and screen shake (follows your settings) · Phones: inside the battlefield, tap to walk there and attacks are automatic (nearest enemy)"],
      ja: ["世界地図（テスト中）フィールド戦闘に光のエフェクト（ダンジョンと同じ光る弾・爆発の光）と画面の揺れ（設定に従う）・スマホ：戦場の中では押した場所へ歩き、攻撃は自動（近くの敵）"],
    },
  },
  {
    version: "0.55.5",
    date: "2026-11-16",
    items: {
      ko: ["세계 지도(시험 중) 새 지도 전투를 모든 곳으로: 사냥터 24곳 · 들판 몬스터 무리 · 필드 보스 12곳 모두 몬스터가 쫓아오면 주변 지도가 전투판이 되고 던전과 같은 계산으로 싸움 · 판 안에 있는 몬스터는 무리가 달라도 함께 싸움 · 필드 보스는 던전 보스 행동·보스 체력 줄 그대로 · 싸우는 동안 위쪽 나라 이름은 숨김"],
      en: ["World Map (testing) the new field combat everywhere: at all 24 hunting grounds, roaming packs and all 12 field bosses, the map around you becomes the battlefield when monsters chase you, using the same rules as the dungeon · Every monster inside the battlefield joins in, even from other packs · Field bosses keep their dungeon boss moves and boss health bar · The country name at the top hides during battle"],
      ja: ["世界地図（テスト中）新しいフィールド戦闘をすべての場所に：狩り場24か所・フィールドの群れ・フィールドボス12体すべてで、モンスターに追われると周りの地図が戦場になりダンジョンと同じ計算で戦う・戦場の中のモンスターは群れが違っても一緒に戦う・フィールドボスはダンジョンのボスの動きとボスの体力バーのまま・戦闘中は上の国名を隠す"],
    },
  },
];
