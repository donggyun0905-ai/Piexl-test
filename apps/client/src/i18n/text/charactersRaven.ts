// 화면 글자: 실베르 레이븐(흑백 체스 왕국의 창기사) 이름·설명 · 스킬 칸 이름·설명 · 패왕전 스킬 이름 · 도전 목표
export const CHARACTER_TEXT_RAVEN = {
  chessRaven: { ko: "레이븐", en: "Raven", ja: "レイヴン" },
  chessCourt: { ko: "왕국의 창", en: "Kingdom Lance", ja: "王国の槍" },
  chessRavenDesc: {
    ko: "실베르의 흑백 체스 왕국 창기사 · 몸 왼쪽엔 백색 퀸, 오른쪽엔 흑색 킹이 늘 떠 있음 · 누르면 킹이 앞으로 나와 바닥을 내려찍고, 다시 누르면 퀸이 앞으로 나와 빛기둥 (계속 번갈아) · 기본 패시브 체크: 킹에게 맞은 적에 체크 → 퀸의 빛기둥이 터뜨리면 체크메이트(공격력 120% 더) · 전용 패시브 20개: 확률 기물 공격 8(폰·나이트·비숍·룩·퀸·킹·폰의 승격·합동 공세) · 스킬 4(숫자 키: 왕국의 체스판·체크메이트·캐슬링·궁극기 그랜드 체크메이트) · 보조 8",
    en: "Silber's lancer of the black-and-white chess kingdom · a white Queen floats at her left and a black King at her right · press to have the King step forward and slam the ground, press again for the Queen's pillar of light (always alternating) · base passive Check: foes hit by the King are put in check → the Queen's pillar pops it for Checkmate (+120% damage) · 20 exclusive passives: 8 chance-based piece attacks (Pawn, Knight, Bishop, Rook, Queen, King, Promotion, Royal Assault) · 4 skills (number keys: Kingdom Board, Checkmate, Castling, ultimate Grand Checkmate) · 8 support",
    ja: "シルベルの白黒チェス王国の槍騎士・体の左に白のクイーン、右に黒のキングが常に浮かぶ・押すとキングが前に出て地面を叩き、もう一度押すとクイーンが前に出て光の柱（ずっと交互）・基本パッシブ チェック：キングに当たった敵にチェック → クイーンの光の柱で弾けるとチェックメイト（攻撃力120%追加）・専用パッシブ20個：確率の駒攻撃8（ポーン・ナイト・ビショップ・ルーク・クイーン・キング・プロモーション・合同攻勢）・スキル4（数字キー：王国のチェス盤・チェックメイト・キャスリング・究極技グランドチェックメイト）・補助8",
  },
  rvSkill1: { ko: "왕국의 체스판", en: "Kingdom Board", ja: "王国のチェス盤" },
  rvSkill2: { ko: "체크메이트", en: "Checkmate", ja: "チェックメイト" },
  rvSkill3: { ko: "캐슬링", en: "Castling", ja: "キャスリング" },
  rvSkill4: { ko: "그랜드 체크메이트", en: "Grand Checkmate", ja: "グランドチェックメイト" },
  rvSkillTip1: {
    ko: "(전용 패시브 '왕국의 체스판'을 먹으면 열림) 몸 둘레 체스판의 칸 12개(적이 선 칸부터)에서 금빛 기둥이 솟음 (공격력 120%) · 판 안의 적은 늘 받는 피해 +10%",
    en: "(Unlocked by the Kingdom Board passive) Golden pillars rise from 12 squares of the board around you (squares with foes first, 120% damage) · foes on the board always take +10% damage",
    ja: "（専用パッシブ「王国のチェス盤」で解放）体の周りのチェス盤のマス12個（敵がいるマスから）に金の柱がそびえる（攻撃力120%）・盤の中の敵は常に被ダメージ+10%",
  },
  rvSkillTip2: {
    ko: "(전용 패시브 '체크메이트'를 먹으면 열림) 가까운 적 둘레에 기물 8개가 길을 막고(묶음 · 보스는 느려짐) 가운데를 8번 친 뒤 마지막 한 방 (공격력 60% × 8 + 250%)",
    en: "(Unlocked by the Checkmate passive) Eight pieces surround the nearest foe and block its escape (held · bosses are slowed), strike the center 8 times, then a final blow (60% x 8 + 250%)",
    ja: "（専用パッシブ「チェックメイト」で解放）近くの敵の周りを駒8つが塞ぎ（拘束・ボスは鈍化）、中央を8回打ってから最後の一撃（攻撃力60%×8＋250%）",
  },
  rvSkillTip3: {
    ko: "(전용 패시브 '캐슬링'을 먹으면 열림) 바라보는 쪽의 룩과 자리를 바꿈 · 최대 체력 30% 방어막 · 0.5초 무적 · 두고 온 룩이 충격파 (공격력 180%)",
    en: "(Unlocked by the Castling passive) Swap places with a Rook ahead · shield of 30% max HP · 0.5s invulnerable · the Rook left behind sends a shockwave (180% damage)",
    ja: "（専用パッシブ「キャスリング」で解放）向いた先のルークと位置を入れ替え・最大体力30%のバリア・0.5秒無敵・残したルークが衝撃波（攻撃力180%）",
  },
  rvSkillTip4: {
    ko: "(전용 패시브 '그랜드 체크메이트'를 먹으면 열림) 방 가득 체스판 · 기물 6종이 차례로 20번 적을 덮침(공격력 90%) · 끝에 킹과 퀸이 방을 가르는 거대한 십자 빛 (공격력 600%)",
    en: "(Unlocked by the Grand Checkmate passive) A board fills the room · six kinds of pieces pounce on foes 20 times (90% damage) · finally the King and Queen split the room with a giant cross of light (600% damage)",
    ja: "（専用パッシブ「グランドチェックメイト」で解放）部屋いっぱいのチェス盤・駒6種が順に20回敵を襲う（攻撃力90%）・最後にキングとクイーンが部屋を裂く巨大な十字の光（攻撃力600%）",
  },
  pwSk_chessRaven1: { ko: "킹 내려찍기", en: "King's Slam", ja: "キングの叩きつけ" },
  pwSk_chessRaven2: { ko: "성역의 대각선", en: "Sanctum Diagonal", ja: "聖域の対角線" },
  pwSk_chessRaven3: { ko: "캐슬링", en: "Castling", ja: "キャスリング" },
  pwSk_chessRaven4: { ko: "그랜드 체크메이트", en: "Grand Checkmate", ja: "グランドチェックメイト" },
  cg_chessRaven: { ko: "최대 체력 {n} 달성", en: "Reach {n} max HP", ja: "最大体力{n}達成" },
};
