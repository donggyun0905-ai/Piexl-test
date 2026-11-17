import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.57.3",
    date: "2026-11-17",
    items: {
      ko: ["관리자 페이지: 'AI 측정' 추가 — 봇이 캐릭터마다(히든 제외) 로그 1~6층과 최종보스(아스모데우스의 화신체)를 돌고 클리어 시간·쓰러진 횟수·준 피해·받은 피해·회복·보스 잡은 시간 평가표를 냄 (밸런스 조정용, 게임 플레이는 그대로)"],
      en: ["Admin page: added 'AI Benchmark' — a bot plays floors 1-6 and the final boss (Avatar of Asmodeus) with each character (hidden ones excluded) and produces a table of clear time, deaths, damage dealt and taken, healing and boss kill time (for balancing; gameplay is unchanged)"],
      ja: ["管理ページ：「AI測定」を追加 — ボットがキャラごと（隠しキャラを除く）にローグ1〜6階と最終ボス（アスモデウスの化身）をプレイし、クリア時間・倒れた回数・与ダメージ・被ダメージ・回復・ボス撃破時間の評価表を出します（バランス調整用、ゲームプレイはそのまま）"],
    },
  },
  {
    version: "0.57.2",
    date: "2026-11-17",
    items: {
      ko: ["세계 지도(시험 중): 메인 화면의 '플레이'를 누르면 바로 세계 지도로 들어감 · 지도에서 Tab을 누르면 '콘텐츠 모음' 창 — 혼자 하기 · 함께·겨루기 · 이벤트·그 밖으로 묶은 카드를 누르면 그 콘텐츠로 바로 들어감(이어하기·튜토리얼·연습장 포함, 잠긴 것은 여는 조건 표시) · 사냥터·최종보스·갈 수 있는 곳 정보는 아래에 접어 둠"],
      en: ["World Map (testing): pressing Play on the main screen now goes straight to the World Map · Press Tab on the map for the new Content Hub: cards grouped into Solo, Together & Versus, and Events & More take you straight into that mode (including Continue, Tutorial and Practice; locked ones show how to unlock) · Hunting grounds, final bosses and reachable places are folded away at the bottom"],
      ja: ["世界地図（テスト中）：メイン画面の「プレイ」を押すとすぐ世界地図に入ります・地図でTabを押すと「コンテンツ一覧」— ひとりで・いっしょに/対戦・イベント/その他にまとめたカードを押すと、そのコンテンツにすぐ入れます（続きから・チュートリアル・練習場も、ロック中は開放条件を表示）・狩り場・最終ボス・行ける場所の情報は下に折りたたみ"],
    },
  },
  {
    version: "0.57.1",
    date: "2026-11-17",
    items: {
      ko: ["세계 지도(시험 중) 전투: 싸움이 열릴 때 생기던 네모난 빛 테두리가 길을 막던 것 고침 → 전투 판을 화면의 세 배쯤으로 넓히고 테두리를 없앰 · 판 끝까지 가면 기다리지 않고 바로 빠져나감 · 화면 근처 몬스터만 싸움에 들어오고 멀리 있던 몬스터는 다가가면 합류 · 둘레에 몬스터가 없을 때 대시만 눌러서는 전투가 열리지 않음"],
      en: ["World Map (testing) battles: the glowing square border that appeared when a fight started no longer blocks your way; the battle area is now about three times the screen and the border is gone · Reaching the edge lets you leave at once · Only monsters near the screen join the fight, and those farther away join as you approach · Dashing alone no longer starts a battle when no monsters are around"],
      ja: ["世界地図（テスト中）の戦闘：戦いが始まると出ていた四角い光の枠が道をふさいでいたのを修正 → 戦闘エリアを画面の約3倍に広げ、枠をなくしました・エリアの端まで行くと待たずにすぐ抜けられます・画面の近くのモンスターだけが戦いに入り、遠くのモンスターは近づくと合流・まわりにモンスターがいないとき、ダッシュだけでは戦闘が始まりません"],
    },
  },
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
