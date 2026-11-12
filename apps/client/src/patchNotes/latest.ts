import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.46",
    date: "2026-11-12",
    items: {
      ko: [
        "피해 출처 4차: 모든 캐릭터의 피해 출처를 아리아·레이븐처럼 패시브·기술마다 따로 나눔 (전용 패시브 따로 잡히는 수 84 → 200여 개)",
        "기본 스킬이 있는 캐릭터(가브리엘·베아트리체·이안·미카엘라·네일러·라파엘·세레나·유리엘·추적자)는 '스킬' 한 줄 대신 스킬 이름마다 한 줄 · 웨이브 기술 30·수집가 무기 30·백인장 스킬은 아이템마다 · 운명의 여행자는 운명마다 기술·능력 이름으로",
        "확률로 나가는 추가 공격·두 번째 발·소환물·예약 공격·연쇄 공격도 만든 패시브 줄로 (예: 쌍발·쌍단검·갈래 화살·쌍룡·인형·고래 무리 등) · 소환물이 쏜 탄도 같은 출처를 달고 감",
        "실베르 캐릭터(백령·빙설·혼령·래빗 등)의 기본 공격이 '그림 소환'으로 잘못 나오던 문제 고침 · 출혈·의사 독가스·포자·부적 저주 피해가 두 번 세어지던 문제 고침",
      ],
      en: [
        "Damage sources, part 4: every character's damage sources are now split per passive and per skill like Aria and Raven (exclusive passives with their own line: 84 → 200+)",
        "Characters with base skills (Gabriel, Beatrice, Ian, Michaela, Nailer, Rafael, Serena, Yuriel, Tracker) show one line per skill name instead of a single 'Skills' line · Wave's 30 arts, Collector's 30 weapons and Baekinjang's skills are split per item · Voyager of Fate shows each fate's art and ability by name",
        "Chance-based extra attacks, second shots, summons, delayed strikes and chain attacks now go to the passive that made them (e.g. Double Shot, Twin Stab, Split Arrow, Twin Dragon, dolls, Whale Pod) · shots fired by summons keep the same source",
        "Fixed Silber characters' (Baekryeong, Bingseol, Honryeong, Rabbit, etc.) basic attacks showing as 'Painted spirits' · fixed bleed, Doctor gas, spore and charm curse damage being counted twice",
      ],
      ja: [
        "ダメージ内訳 第4弾：全キャラクターのダメージ内訳をアリア・レイヴンのようにパッシブ・技ごとに分けて表示（専用パッシブで個別に出る数 84 → 200以上）",
        "基本スキルのあるキャラ（ガブリエル・ベアトリーチェ・イアン・ミカエラ・ネイラー・ラファエル・セレナ・ユリエル・追跡者）は「スキル」1行ではなくスキル名ごとに1行・ウェーブの技30・コレクターの武器30・百人長のスキルはアイテムごと・運命の旅人は運命ごとの技・能力名で表示",
        "確率の追加攻撃・2発目・召喚物・予約攻撃・連鎖攻撃も作ったパッシブの行へ（例：双発・双短剣・分かれ矢・双竜・人形・クジラの群れなど）・召喚物が撃った弾も同じ出どころを引き継ぐ",
        "シルベルのキャラ（白霊・氷雪・魂霊・ラビットなど）の基本攻撃が「描いた霊」と表示されていた問題を修正・出血・医者の毒ガス・胞子・護符の呪いのダメージが二重に数えられていた問題を修正",
      ],
    },
  },
  {
    version: "0.52.45",
    date: "2026-11-12",
    items: {
      ko: ["이벤트 상점의 테마 타격 효과를 장착하면 무기·패시브를 얻을 때 '범의 기운!' 글자가 뜨던 문제 고침 (범 효과·범 풍류 스킨일 때만 뜸)"],
      en: ["Fixed 'Tiger's Might!' text appearing on weapon or passive pickups when an event-shop theme hit effect was equipped (it now shows only with the tiger effect or the tiger limited skin)"],
      ja: ["イベントショップのテーマ打撃エフェクトを装着すると、武器・パッシブ入手時に「虎の気！」の文字が出ていた問題を修正（虎エフェクト・虎の限定スキンのときだけ表示）"],
    },
  },
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
