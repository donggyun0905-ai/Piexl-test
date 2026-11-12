import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.44",
    date: "2026-11-12",
    items: {
      ko: [
        "새 캐릭터 레이븐 (실베르): 흑백 체스 왕국의 창기사 · 몸 왼쪽엔 백색 퀸, 오른쪽엔 흑색 킹이 늘 떠 있음 · 누르면 킹이 앞으로 나와 바닥을 내려찍고, 다시 누르면 퀸이 앞으로 나와 빛기둥 (계속 번갈아)",
        "레이븐 기본 패시브 체크: 킹에게 맞은 적 머리 위에 금빛 왕관(체크) → 퀸의 빛기둥이 맞히면 체크메이트 (공격력 120% 더)",
        "레이븐 전용 패시브 20: 확률 기물 공격 8(폰 진군·나이트 도약·비숍 대각선·룩 철벽·퀸 칙령·킹 심판·폰의 승격·왕실의 합동 공세) · 스킬 4(숫자 키: 1 왕국의 체스판 · 2 체크메이트 · 3 캐슬링 · 4 궁극기 그랜드 체크메이트) · 보조 8(앙파상·왕실 근위대·왕의 철퇴·여왕의 광휘·연쇄 체크·템포·스테일메이트·갬빗)",
        "레이븐 그림·체스 기물 6종·금빛 빛 효과·아이콘·효과음·캐릭터 설명·업적·패왕전 스킬",
        "아리아 꾸밈: 음표마다 제 색 빛 꼬리와 반짝임 · 공격할 때 지휘봉 금빛 궤적 · 악기 발밑 빛 고리와 연주 음파 · 몸 둘레 오선 빛 · 음표·폭죽·악기에 빛 효과",
      ],
      en: [
        "New character Raven (Silber): lancer of the black-and-white chess kingdom · a white Queen floats at her left and a black King at her right · press to have the King step forward and slam the ground, press again for the Queen's pillar of light (always alternating)",
        "Raven's base passive Check: foes hit by the King get a golden crown (Check) → the Queen's pillar turns it into Checkmate (+120% damage)",
        "Raven's 20 exclusive passives: 8 chance-based piece attacks (Pawn March, Knight Leap, Bishop Diagonal, Rook Rampart, Queen's Decree, King's Judgment, Promotion, Royal Joint Assault) · 4 skills (number keys: 1 Kingdom Board · 2 Checkmate · 3 Castling · 4 ultimate Grand Checkmate) · 8 support (En Passant, Royal Guard, King's Mace, Queen's Radiance, Chain Check, Tempo, Stalemate, Gambit)",
        "Raven's sprites, six chess pieces, golden light effects, icons, sounds, guide, achievement and Champion Clash skills",
        "Aria polish: each note leaves a trail of its own color with sparkles · a golden baton arc when attacking · light rings and sound waves under instruments · a staff-line halo around her · glow on notes, fireworks and instruments",
      ],
      ja: [
        "新キャラクター レイヴン（シルベル）：白黒チェス王国の槍騎士・体の左に白のクイーン、右に黒のキングが常に浮かぶ・押すとキングが前に出て地面を叩き、もう一度押すとクイーンが前に出て光の柱（ずっと交互）",
        "レイヴンの基本パッシブ チェック：キングに当たった敵の頭上に金の王冠（チェック）→ クイーンの光の柱が当たるとチェックメイト（攻撃力120%追加）",
        "レイヴン専用パッシブ20：確率の駒攻撃8（ポーン進軍・ナイト跳躍・ビショップ対角線・ルーク鉄壁・クイーン勅令・キング審判・ポーンの昇格・王室の合同攻勢）・スキル4（数字キー：1 王国のチェス盤・2 チェックメイト・3 キャスリング・4 究極技グランドチェックメイト）・補助8（アンパッサン・王室近衛隊・王の鉄槌・女王の光輝・連鎖チェック・テンポ・ステイルメイト・ギャンビット）",
        "レイヴンの絵・チェスの駒6種・金の光の効果・アイコン・効果音・キャラ説明・実績・覇王戦スキル",
        "アリアの演出：音符ごとに自分の色の光の尾ときらめき・攻撃時に指揮棒の金の軌跡・楽器の足元の光の輪と演奏の音波・体の周りの五線の光・音符・花火・楽器に光の効果",
      ],
    },
  },
];
