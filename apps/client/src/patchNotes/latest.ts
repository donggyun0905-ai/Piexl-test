import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.202",
    date: "2026-10-28",
    items: {
      ko: ["효과 다듬기 1: 이벤트 상점 테마 효과·범 풍류·여름 파도 — 맞힐 때 섬광·빛 베기, 처치 때 큰 빛, 대기 때 발밑 문양이 돌고 조각이 내 둘레를 돎, 걸음 자국이 은은히 빛남, 탄 꼬리가 빛줄기로 · 피해 숫자가 튀어나오며 좌우로 비껴 뜨고 큰 피해는 금빛, 테마 데미지 스킨은 빛 번짐"],
      en: ["Effects polish 1: event shop theme effects, Tiger and Summer — flashes and light slashes on hit, big bursts on kills, a spinning sigil and orbiting bits while idle, softly glowing footprints, light-streak shot trails · damage numbers pop out and drift sideways, big hits turn gold, theme damage skins glow"],
      ja: ["エフェクト調整1: イベントショップのテーマ効果・虎・夏 — ヒット時の閃光と光の斬撃、撃破時の大きな光、待機時に足元の紋様が回り周りを欠片が回る、足跡がほのかに光る、弾の尾が光の筋に · ダメージ数字が弾けて左右にずれ、大ダメージは金色、テーマのダメージスキンは光がにじむ"],
    },
  },
  {
    version: "0.48.201",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 전용 패시브: 대부분의 캐릭터 패시브를 대결에 맞게 바꿈 (예: 파수꾼 수호 보호막 · 장수 기세 기절 · 사멸 5번째 3배 · 역병의사 회복 감소 · 악의 사도 오라 · 변희·이드라 스킬 순환 버프) · 스킬 보기 패시브 칸에 설명",
        "패왕전 밸런스: 역할 상성(전사 > 암살자·마법사, 원딜 > 전사, 암살자·마법사·원딜은 서로 비슷)에 맞게 AI 대결을 많이 돌려 캐릭터 받는 피해·역할 상성 수치를 다시 맞춤",
      ],
      en: [
        "Champion Clash passives: most character passives reworked for duels (e.g. Warden guardian shield · General momentum stun · Samyeol 3x every 5th hit · Plague Doctor healing cut · Apostle aura · Byeonhui/Idra skill-cycle buffs) · shown in the passive slot",
        "Champion Clash balance: retuned damage taken per character and role matchup values from many AI duels toward the role matchups (Warrior > Assassin/Mage, Marksman > Warrior, Assassin/Mage/Marksman close to even)",
      ],
      ja: [
        "覇王戦専用パッシブ: ほとんどのキャラのパッシブを対戦向けに変更 (例: 守護者のシールド · 将軍の気勢気絶 · 四滅の5回目3倍 · 疫病医の回復減少 · 悪の使徒のオーラ · 変姫・イドラのスキル循環バフ) · パッシブ欄に説明",
        "覇王戦バランス: 役割相性(戦士 > 暗殺者・魔法使い、遠距離 > 戦士、暗殺者・魔法使い・遠距離はほぼ互角)に合わせ、AI対戦を多数回してキャラの被ダメと相性数値を再調整",
      ],
    },
  },
  {
    version: "0.48.200",
    date: "2026-10-28",
    items: {
      ko: ["패왕전 '모든 캐릭터 둘러보기' (연습장 아래): 역할 탭 · 캐릭터 카드를 누르면 평타·패시브·스킬 1~4 설명 창 · '연습장에서 해 보기'로 바로 써 봄"],
      en: ["Champion Clash 'Browse all characters' (below the Training Ground): role tabs · tap a character card for its basic attack, passive and skills 1–4 · 'Try in the Training Ground' to play it right away"],
      ja: ["覇王戦「全キャラを見る」(練習場の下): 役割タブ · キャラカードを押すと通常攻撃・パッシブ・スキル1~4の説明 · 「練習場で試す」ですぐ使える"],
    },
  },
  {
    version: "0.48.199",
    date: "2026-10-28",
    items: {
      ko: [
        "타워 디펜스: 타워에 체력이 생겨 지나가는 적이 가까운 타워를 때림 (보스는 더 아프게) · 최종 보스가 나오면 파동이 퍼지며 모든 타워 체력 −10%",
        "타워는 캐릭터마다 하나만 (같은 캐릭터 둘 안 됨) · 타워를 눌러 돈으로 수리 · 부서진 캐릭터는 30초 동안 '재건축 중'",
        "타워 디펜스 이펙트가 넓은 맵에서도 보이게: 타워가 공격하면 그 캐릭터 색으로 빛나는 베기, 적이 맞으면 불똥, 타워가 맞으면 붉은 섬광 · 깎인 타워 머리 위 체력 줄",
      ],
      en: [
        "Tower Defense: towers now have HP and passing enemies hit nearby towers (bosses hit harder) · when a final boss appears, a shockwave takes 10% HP from every tower",
        "Only one tower per character (no duplicates) · tap a tower to repair it with gold · a destroyed character is 'Rebuilding' for 30 seconds",
        "Tower Defense effects are visible on the wide map: towers flash a glowing slash in their character's color when attacking, enemies spark when hit, towers flash red when hit · damaged towers show an HP bar",
      ],
      ja: [
        "タワーディフェンス: タワーに体力がつき、通る敵が近くのタワーを攻撃 (ボスはより痛い) · 最終ボスが出ると波動が広がり全タワーの体力−10%",
        "タワーはキャラごとに1つだけ (同じキャラ2体は不可) · タワーを押してお金で修理 · 壊れたキャラは30秒間「再建中」",
        "タワーディフェンスのエフェクトを広いマップでも見えるように: タワーが攻撃するとキャラの色で光る斬撃、敵が当たると火花、タワーが当たると赤い閃光 · 削れたタワーの頭上に体力バー",
      ],
    },
  },
  {
    version: "0.48.198",
    date: "2026-10-28",
    items: {
      ko: ["패왕전 잔영 기본 공격: 뒤로 물러나던 것을 마우스에 가장 가까운 상대(사거리 안) 등 뒤로 순간이동해 숨었다가 그 상대를 찌르게 바꿈 (사거리 안에 상대가 없으면 제자리에서 숨었다가 앞을 찌름)"],
      en: ["Champion Clash Remnant basic attack: instead of stepping back, it now blinks behind the opponent nearest your cursor (in range), hides, then stabs that opponent (with no one in range it hides in place and stabs ahead)"],
      ja: ["覇王戦の残影の通常攻撃: 後ろに下がる代わりに、カーソルに一番近い相手(射程内)の背後へ瞬間移動して隠れ、その相手を突くように変更 (射程内に相手がいなければその場で隠れて前方を突く)"],
    },
  },
  {
    version: "0.48.197",
    date: "2026-10-28",
    items: {
      ko: [
        "미니 게임 새 단장: 카드 게임은 펠트 테이블과 진짜 같은 트럼프 카드(구석 숫자·가운데 무늬·뒤집히며 나옴), 주사위는 점이 찍힌 주사위와 굴림, 슬롯은 돌아가는 릴과 당첨 빛, 하이로우는 지난 카드 기록",
        "사과 상자 → '별사탕 상자': 숫자마다 색이 다른 별사탕, 터질 때 반짝이와 +점수, 한 번에 많이 묶으면 보너스, 남은 시간 막대, 최고 기록",
        "블록 쌓기 → '룬 블록': 빛나는 룬 무늬 돌(색은 무작위), 놓일 자리 표시, 다음 돌, 단계가 오를수록 빨라짐, 점수·최고 기록, 줄을 지우면 번쩍",
        "숫자 타일·조커 게임도 테이블·타일·카드 모양 다듬음 · 로비 게임기 그림도 새 이름에 맞춤",
      ],
      en: [
        "Mini game makeover: card games get a felt table and real playing cards (corner indexes, center suit, flip-in), dice show proper pips and roll, slots have spinning reels and a win glow, High-Low shows recent cards",
        "Apple Box → 'Star Candy Box': candies colored by number, sparkles and +points when they pop, bonus for big boxes, a time bar and best score",
        "Block Stack → 'Rune Drop': stones with glowing rune marks (random colors), landing preview, next piece, levels that speed up, points and best score, flashing line clears",
        "Number Tiles and Joker Game tables, tiles and cards polished too · lobby machine art updated to match the new names",
      ],
      ja: [
        "ミニゲームを一新: カードゲームはフェルトのテーブルと本物らしいトランプ (隅の数字・中央の柄・めくれて登場)、サイコロは目のあるサイコロと転がり、スロットは回るリールと当たりの光、ハイ&ローは直前のカード履歴",
        "リンゴ箱 → 「金平糖の箱」: 数字ごとに色が違う金平糖、はじけるときのきらめきと+点数、一度に多く囲むとボーナス、残り時間バー、ベスト記録",
        "ブロック積み → 「ルーンブロック」: 光るルーン模様の石 (色はランダム)、落下位置表示、次の石、レベルが上がるほど速く、スコア・ベスト記録、ライン消去で光る",
        "数字タイル・ジョーカーゲームもテーブル・タイル・カードを調整 · ロビーのゲーム機の絵も新しい名前に合わせた",
      ],
    },
  },
  {
    version: "0.48.196",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전 점수판(Tab)에 치유량(이 판에 받은 회복) 칸 추가",
        "랭크전 상대를 찾거나 대기실에서 기다리는 동안 미니 게임 8가지를 눌러서 바로 할 수 있음",
        "친구 방 패왕전: 밴픽이 끝나면 랭크전처럼 스킬 설명·작은 연습장 준비방이 저절로 뜨고, 방장은 거기서 대결 시작 (손님은 방장을 기다림, 뒤로 가면 대기실)",
      ],
      en: [
        "Added a Healed column (healing received this match) to the Champion Clash scoreboard (Tab)",
        "While searching for a Ranked match or waiting in its lobby, you can play any of 8 mini games",
        "Champion Clash friend rooms: after the draft, the skill list and small practice area open automatically like Ranked, and the host starts the match from there (guests wait for the host; going back returns to the lobby)",
      ],
      ja: [
        "覇王戦スコアボード (Tab) に回復量 (この試合で受けた回復) の列を追加",
        "ランク戦の相手探し中や待機部屋で待つ間、ミニゲーム8種をすぐに遊べる",
        "友だち部屋の覇王戦: バンピック後、ランク戦のようにスキル説明・小さな練習場の準備画面が自動で開き、部屋主がそこで対決開始 (ゲストは部屋主を待つ、戻ると待機部屋)",
      ],
    },
  },
];
