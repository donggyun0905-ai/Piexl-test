// 캐릭터 설명: 실베르 (레이븐) · 한·영·일 (수치는 weaponsRaven·itemsRaven과 맞춤) — silber6.ts가 커서 나눔
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER7: Guide = {
  chessRaven: [
    "실베르 · 레이븐 '흑백 체스 왕국의 창기사' · 체력 95 · 공격력 9 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 패시브 하나마다 능력치가 더 오름)",
    "무기 1 (왕국의 창): 몸 왼쪽에 백색 퀸, 오른쪽에 흑색 킹이 늘 떠 있음 · 누르면 킹이 앞으로 나와 바닥을 내려찍고(공격력 100%) → 다음엔 퀸이 앞으로 나와 빛기둥(130%) → 다시 킹부터 계속 번갈아",
    "기본 패시브 체크: 킹에게 맞은 적에 체크(4초, 머리 위 금빛 왕관) → 퀸의 빛기둥이 체크된 적을 맞히면 체크메이트: 금빛 왕관이 터지며 공격력 120% 더",
    "확률 기물 공격 8 (공격마다 확률): 폰 진군(금빛 폰 5~8개 돌진) · 나이트 도약(L자로 뛰어 내려찍기) · 비숍 대각선(양쪽 대각선 광선) · 룩 철벽(밀어내는 돌진) · 퀸 칙령(8방향 검격) · 킹 심판(하늘에서 짓누름·기절) · 폰의 승격(거대한 퀸으로 폭발) · 왕실의 합동 공세(나이트 → 비숍 → 룩)",
    "스킬 4 (전용 패시브를 먹으면 숫자 키 1~4가 열림): 1 왕국의 체스판(몸 둘레 체스판, 판 안 적 받는 피해 +10% · 칸 12개 금빛 기둥) · 2 체크메이트(기물 8개가 포위·묶고 가운데를 일제히) · 3 캐슬링(룩과 자리 바꾸기·방어막·충격파) · 4 그랜드 체크메이트(방 가득 체스판 · 기물 6종 20번 · 끝에 거대한 십자 빛)",
    "보조 8: 앙파상(폰 강화·멈춤) · 왕실 근위대(기물 공격 확률 +5%p) · 왕의 철퇴(킹 범위·기절) · 여왕의 광휘(빛기둥 둘 더) · 연쇄 체크(체크가 옮겨 붙음) · 템포(스킬 대기 감소) · 스테일메이트(받는 피해 -12%·방어막 강화) · 갬빗(처치하면 회복·금빛 폰)",
    "요령: 킹 → 퀸 차례를 지키며 같은 적을 노리면 체크메이트가 계속 터짐 · 체스판을 먹었다면 적을 판 안에 두고 싸우기",
  ],
};

export const GUIDE_EN_SILBER7: Guide = {
  chessRaven: [
    "Silber · Raven, lancer of the black-and-white chess kingdom · HP 95 · damage 9 · move 1.2 · luck 1 · weak at first but stronger with every passive (faction trait: each passive raises stats further)",
    "1 weapon (Kingdom Lance): a white Queen always floats at her left and a black King at her right · press and the King steps forward to slam the ground (100%) → next the Queen steps forward for a pillar of light (130%) → then the King again, always alternating",
    "Base passive Check: foes hit by the King are put in check (4s, a golden crown overhead) → when the Queen's pillar hits a checked foe it's Checkmate: the crown bursts for +120% damage",
    "8 chance-based piece attacks (on attack): Pawn March (5-8 golden pawns charge) · Knight Leap (L-shaped jump and slam) · Bishop Diagonal (beams on both diagonals) · Rook Rampart (shoving charge) · Queen's Decree (slashes in 8 directions) · King's Judgment (crush from the sky, stun) · Promotion (explodes as a giant queen) · Royal Joint Assault (knight → bishop → rook)",
    "4 skills (exclusive passives unlock number keys 1-4): 1 Kingdom Board (a board around you, foes on it take +10% · golden pillars on 12 squares) · 2 Checkmate (eight pieces surround, hold and strike the center) · 3 Castling (swap with a rook, shield, shockwave) · 4 Grand Checkmate (a board fills the room · six kinds of pieces strike 20 times · a giant cross of light at the end)",
    "8 support: En Passant (stronger pawns, brief stop) · Royal Guard (+5%p piece attack chance) · King's Mace (bigger slam, stun) · Queen's Radiance (two more pillars) · Chain Check (check spreads) · Tempo (shorter skill cooldowns) · Stalemate (-12% damage taken, stronger shield) · Gambit (heal on kill, golden pawn)",
    "Tip: keep the King → Queen rhythm on the same foe so Checkmate keeps popping · with the Board, fight with foes inside it",
  ],
};

export const GUIDE_JA_SILBER7: Guide = {
  chessRaven: [
    "シルベル・レイヴン「白黒チェス王国の槍騎士」・体力95・攻撃力9・移動1.2・幸運1・最初は弱いがパッシブを取るほど強くなる（陣営の特徴：パッシブ1つごとに能力値がさらに上がる）",
    "武器1（王国の槍）：体の左に白のクイーン、右に黒のキングが常に浮かぶ・押すとキングが前に出て地面を叩き（攻撃力100%）→ 次はクイーンが前に出て光の柱（130%）→ またキングから、ずっと交互",
    "基本パッシブ チェック：キングに当たった敵にチェック（4秒、頭上に金の王冠）→ クイーンの光の柱がチェック中の敵に当たるとチェックメイト：王冠が弾けて攻撃力120%追加",
    "確率の駒攻撃8（攻撃ごとに確率）：ポーン進軍（金のポーン5〜8体が突進）・ナイト跳躍（L字に跳んで叩きつけ）・ビショップ対角線（両対角線の光線）・ルーク鉄壁（押し出す突進）・クイーン勅令（8方向の剣撃）・キング審判（天から押し潰す・気絶）・昇格（巨大なクイーンで爆発）・王室の合同攻勢（ナイト→ビショップ→ルーク）",
    "スキル4（専用パッシブで数字キー1〜4が解放）：1 王国のチェス盤（体の周りの盤、盤の中の敵は被ダメージ+10%・マス12個に金の柱）・2 チェックメイト（駒8つが包囲・拘束して中央を一斉に）・3 キャスリング（ルークと位置交換・バリア・衝撃波）・4 グランドチェックメイト（部屋いっぱいの盤・駒6種が20回・最後に巨大な十字の光）",
    "補助8：アンパッサン（ポーン強化・停止）・王室近衛隊（駒攻撃の確率+5%p）・王の鉄槌（キングの範囲・気絶）・女王の光輝（光の柱がさらに2本）・連鎖チェック（チェックが移る）・テンポ（スキル待機減少）・ステイルメイト（被ダメージ-12%・バリア強化）・ギャンビット（撃破で回復・金のポーン）",
    "コツ：同じ敵にキング→クイーンの順を守るとチェックメイトが続けて弾ける・チェス盤を取ったら敵を盤の中に入れて戦う",
  ],
};
