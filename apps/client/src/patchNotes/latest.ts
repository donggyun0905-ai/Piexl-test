import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.57.0",
    date: "2026-11-16",
    items: {
      ko: ["새 한정 스킨 '성탄 눈꽃'(시즌 4 크리스마스, 21명): 입으면 눈꽃이 튀는 타격·색종이가 터지는 처치(보스 MERRY!)·눈 위 장화 발자국·함박눈과 작은 성탄 나무·선물 대기 장면·머리 위 금종·'성탄의 선물!' 별 기둥·눈꽃 피해 숫자·전용 종소리 음악 · 새 한정 스킨 '벨벳 티타임'(시즌 5 메이드·바니, 7명): 장미 꽃잎·하트 타격·하트가 솟는 처치(보스 SERVED!)·구두 굽 자국·체크무늬 바닥과 찻잔 대기 장면·머리 위 리본·'티타임!' 금빛 기둥·장미 리본 피해 숫자·전용 왈츠 · 네온 펄스에 시즌 3 나머지 11명(훅·오르카·웨이브·미류·베아트리스·이안·가브리엘·세레나·미카엘라·유리엘·라파엘) 추가 · 고침: 큰 캐릭터(이클립스·토르켄 등)의 시즌 스킨 그림이 작게 보이던 것 → 기본 캐릭터와 같은 크기로 · 모두 뽑기 한정"],
      en: ["New limited skin 'Snowbell Night' (Season 4 Christmas, 21 characters): snowflake hits, confetti K.O.s (MERRY! on bosses), boot prints in the snow, an idle scene with falling snow, a little tree and gifts, a golden bell overhead, a 'Holiday Gift!' star pillar, snowflake damage numbers and its own bell music · New limited skin 'Velvet Teatime' (Season 5 maids and bunnies, 7 characters): rose petal and heart hits, heart-burst K.O.s (SERVED! on bosses), heel prints, an idle scene with a checkered floor and a teacup, a ribbon overhead, a 'Teatime!' golden pillar, rose ribbon damage numbers and its own waltz · Neon Pulse adds the remaining 11 Season 3 characters (Hook, Orca, Wave, Miryu, Beatrice, Ian, Gabriel, Serena, Michaela, Yuriel, Rafael) · Fix: season skins of large characters (Eclipse, Thorken, etc.) looked smaller than normal; they now match the base size · All gacha only"],
      ja: ["新しい限定スキン「聖夜の雪花」（シーズン4クリスマス、21人）：雪の結晶が散る打撃・紙吹雪が弾ける撃破（ボスはMERRY!）・雪の上のブーツの足跡・ぼたん雪と小さなツリー・贈り物の待機シーン・頭上の金の鐘・「聖夜の贈り物！」星の柱・雪の結晶のダメージ数字・専用の鐘の音楽・新しい限定スキン「ベルベットティータイム」（シーズン5メイド・バニー、7人）：バラの花びら・ハートの打撃・ハートが舞う撃破（ボスはSERVED!）・ヒールの足跡・市松模様の床とティーカップの待機シーン・頭上のリボン・「ティータイム！」金の柱・バラのリボンのダメージ数字・専用ワルツ・ネオンパルスにシーズン3の残り11人（フック・オルカ・ウェーブ・ミリュウ・ベアトリス・イアン・ガブリエル・セレナ・ミカエラ・ユリエル・ラファエル）を追加・修正：大きいキャラ（エクリプス・トルケンなど）のシーズンスキンの絵が小さく見えていた → 基本キャラと同じ大きさに・すべてガチャ限定"],
    },
  },
  {
    version: "0.56.0",
    date: "2026-11-16",
    items: {
      ko: ["시즌 스킨 그림: 범 풍류(시즌 1) 21명·여름 파도(시즌 2) 20명의 스킨 그림과 캐릭터 선택 일러스트를 새로 그린 그림으로 바꿈 · 풋내기 10·15·20레벨, 버려진 자들 세 아이, 학살자 피의 학살, 오토마타 인형, 이클립스 밤 모습도 스킨을 입으면 스킨 그림으로 · 새 한정 스킨 '네온 펄스'(시즌 3 사이버펑크): 영사·풍류사·레오·오닉스·펜리르·이클립스·토르켄·리바이어·테일·매드퀸 (나머지 시즌 3 캐릭터는 그림이 들어오는 대로) · 입으면 글리치 타격·픽셀로 흩어지는 처치(보스 DELETED)·네온 발자국·홀로그램 대기 장면과 드론·데이터 기둥 '오버클럭!'·색이 갈라진 피해 숫자·전용 신스웨이브 음악 · 뽑기 한정 (수집가는 여름 파도도 생김)"],
      en: ["Season skin art: the Tiger Revelry (Season 1, 21 characters) and Summer Splash (Season 2, 20 characters) skins and their character select illustrations now use newly drawn art · The Novice at levels 10/15/20, all three Abandoned children, the Slayer's Blood Massacre form, the Automata doll and Eclipse's night form also show the skin art when skinned · New limited skin 'Neon Pulse' (Season 3 cyberpunk): Silk, Pungryu, Leo, Onyx, Fenrir, Eclipse, Thorken, Levia, Tail and Mad Queen (more Season 3 characters as their art arrives) · Wearing it adds glitch hits, pixel-dissolve K.O.s (DELETED on bosses), neon footprints, a hologram idle scene with a drone, an 'Overclock!' data pillar, chromatic damage numbers and its own synthwave music · Gacha only (the Collector also gets Summer Splash)"],
      ja: ["シーズンスキンの絵：虎の風流（シーズン1、21人）と真夏のしぶき（シーズン2、20人）のスキンとキャラクター選択イラストを新しく描いた絵に・見習いのレベル10・15・20、捨てられた者たちの3人、虐殺者の血の虐殺、オートマタの人形、エクリプスの夜の姿もスキンを着るとスキンの絵に・新しい限定スキン「ネオンパルス」（シーズン3サイバーパンク）：影糸使い・風流士・レオ・オニキス・フェンリル・エクリプス・トルケン・リヴァイア・テイル・マッドクイーン（ほかのシーズン3キャラは絵が入りしだい）・着るとグリッチ打撃・ピクセルに散る撃破（ボスはDELETED）・ネオンの足跡・ホログラムの待機シーンとドローン・データの柱「オーバークロック！」・色ずれダメージ数字・専用シンセウェーブ曲・ガチャ限定（コレクターには真夏のしぶきも）"],
    },
  },
];
