import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.6",
    date: "2026-11-07",
    items: {
      ko: ["방 안 장애물 다듬기: 안쪽 벽(벽돌 줄·그림자) · 돌기둥(입체·이음매·금·이끼) · 구덩이(깊이·윗턱 돌)", "지형 함정 다듬기: 진흙(윤기·동심원·돌) · 용암(식은 바위 테·떠다니는 껍질·거품) · 물(깊이·가장자리 거품·반짝임) · 가시(쇠 발판·못·그늘진 가시)"],
      en: ["Polished room obstacles: inner walls (bricks, shadows) · stone pillars (depth, seams, cracks, moss) · pits (depth, stone lip)", "Polished floor hazards: mud (sheen, ripples, stones) · lava (cooled rock rim, drifting crust, bubbles) · water (depth, foam edge, sparkles) · spikes (iron plate, rivets, shaded spikes)"],
      ja: ["部屋の障害物を改善：内壁（レンガ・影）・石柱（立体・継ぎ目・ひび・苔）・穴（深さ・縁の石）", "地形の罠を改善：泥（つや・波紋・石）・溶岩（冷えた岩の縁・漂う殻・泡）・水（深さ・縁の泡・きらめき）・トゲ（鉄板・鋲・陰のあるトゲ）"],
    },
  },
  {
    version: "0.50.5",
    date: "2026-11-07",
    items: {
      ko: [
        "비르디아 공생 정령 10종: 시작할 때 카드 3장 중 하나를 고름 (Esc로 숨겼다가 버튼으로 다시) · 처치 30번 꽃, 80번 나무로 자라며 세짐",
        "버프형: 햇살(피해 +10%·처치 시 공격 속도) · 꽃(계속 회복) · 가시(받는 피해 -12%·맞으면 가시 폭발)",
        "동행형: 숲늑대(달려가 물어뜯음) · 부엉이(날다가 급강하) · 이끼 골렘(땅을 내려찍어 묶음)",
        "도박형: 장난꾸러기 여우 (방 5개마다 바꾸기 → 앞의 아이템을 무기·패시브·히든·악마·사용 아이템 전부 중 하나로)",
        "꾸러미형: 보관(칸이 차도 사용 아이템을 넣어 두고 빈 칸 키로 꺼냄) · 상자(4개 주울 때마다 패시브 3개 중 고름) · 먹보(두고 온 아이템을 먹고 5개마다 새 패시브)",
      ],
      en: [
        "Virdia Symbiotes (10): pick 1 of 3 cards at the start (Esc hides it, a button reopens) · grows into a Bloom at 30 kills and a Tree at 80",
        "Buff: Sunbeam (+10% damage, attack speed on kills) · Blossom (steady healing) · Thorn (-12% damage taken, thorns burst when hit)",
        "Companion: Forest Wolf (runs in and bites) · Owl (circles and dives) · Moss Golem (slams and roots)",
        "Gamble: Trickster Fox (a swap every 5 rooms → turns the item in front of you into any weapon, passive, hidden, devil or usable item)",
        "Bundle: Storage (keeps usable items when slots are full, take them out with an empty slot key) · Chest (every 4 pickups, choose 1 of 3 passives) · Glutton (eats items left behind, a new passive every 5)",
      ],
      ja: [
        "ヴィルディア共生精霊10種：開始時にカード3枚から1枚を選ぶ（Escで隠してボタンで再表示）・30体撃破で花、80体で樹に育ち強くなる",
        "バフ型：陽だまり（ダメージ+10%・撃破で攻撃速度）・花（持続回復）・棘（被ダメージ-12%・被弾で棘が弾ける）",
        "同行型：森の狼（駆け寄って噛みつく）・フクロウ（飛び回り急降下）・苔のゴーレム（地面を叩いて拘束）",
        "ギャンブル型：いたずら狐（5部屋ごとに入れ替え→目の前のアイテムを武器・パッシブ・隠し・悪魔・使用アイテム全部の中から1つに）",
        "包み型：保管（枠が埋まっても使用アイテムをしまい空き枠のキーで取り出す）・宝箱（4つ拾うごとにパッシブ3つから選ぶ）・食いしん坊（置いてきたアイテムを食べ5つごとに新しいパッシブ）",
      ],
    },
  },
  {
    version: "0.50.4",
    date: "2026-11-07",
    items: {
      ko: ["아스칼론 맹세 카드: 방에 들어서면 맹세·보상·벌칙이 적힌 카드가 화면 가운데 크게 뜨고(그동안 방이 멈춤) 아래 영광 게이지로 빨려 들어감 · 방을 끝내면 지켰을 땐 금빛으로 산화해 몸속으로, 어겼을 땐 검은 모래처럼 부서져 날아감"],
      en: ["Ascalon Oath card: entering a room shows a large card with the oath, reward and penalty (the room waits) before it flies into the Glory gauge · when the room ends it dissolves into golden light into you if kept, or crumbles away like black sand if broken"],
      ja: ["アスカロンの誓いカード：部屋に入ると誓い・報酬・罰が書かれたカードが画面中央に大きく出て（その間部屋は止まる）下の栄光ゲージへ吸い込まれる・部屋を終えると守った時は金色に散って体の中へ、破った時は黒い砂のように崩れて飛んでいく"],
    },
  },
  {
    version: "0.50.3",
    date: "2026-11-07",
    items: {
      ko: ["헬리오스 폭주: 머리 위 검은 뿔 · 얼굴에 x _ o 표정 · 화면 테두리가 붉게 일렁임", "진영 특징 안내: 캐릭터 선택창 진영 탭 아래 한 줄 설명 · 왼쪽 버프 창 맨 위에 지금 진영 특징 값", "바닥 아이템 빛이 가운데가 아닌 아이템 테두리를 따라 은은하게"],
      en: ["Helios Rampage: black horns above the head · an x _ o face · red glow around the screen edge", "Faction trait guide: one line under each faction tab in character select · current trait value at the top of the left buff panel", "Floor items now glow softly along their outline instead of from the center"],
      ja: ["ヘリオス暴走：頭上に黒い角・顔に x _ o の表情・画面の縁が赤く揺らめく", "陣営の特徴の案内：キャラ選択の陣営タブの下に一行説明・左のバフ欄の一番上に今の特徴の値", "床のアイテムの光が中央ではなく輪郭に沿ってほのかに"],
    },
  },
  {
    version: "0.50.2",
    date: "2026-11-07",
    items: {
      ko: ["테라코어 과열: 열이 저절로 식지 않음 (방이 바뀌어도 그대로) · 대시 증기 폭발로만 비움 · 과부하가 끝나면 50", "성국 핵심 스킬: 각성한 핵심 스킬을 한 번 쓰면 각성이 끝나고 다시 12번부터 · 쓸 때 캐릭터마다 다른 추가 공격 (태양 고리·인과의 실·중력 내려찍기·독 비수·빛 화살 비·세 갈래 철퇴·무기 폭격)"],
      en: ["Terracore Heat: no longer cools on its own (kept between rooms) · only a dash steam vent clears it · Overload ends at 50", "Holy Kingdom Core Skill: casting the awakened Core Skill ends the awakening and you count 12 again · each character adds a unique bonus attack (sun rings, causal threads, gravity slam, poison daggers, arrow rain, triple mace wave, weapon barrage)"],
      ja: ["テラコア過熱：熱が自然に冷えない（部屋が変わってもそのまま）・ダッシュの蒸気爆発でのみ放出・過負荷が終わると50", "聖国 核心スキル：覚醒した核心スキルを一度使うと覚醒が終わりまた12回から・使うとキャラごとに違う追加攻撃（太陽の輪・因果の糸・重力叩きつけ・毒の短剣・光の矢の雨・三叉の鉄槌・武器の爆撃）"],
    },
  },
  {
    version: "0.50.1",
    date: "2026-11-07",
    items: {
      ko: ["블래스트: 성흔 게이지 옆에 대시 슬라이딩 칸 (다시 쓰기까지 남은 초 · 준비되면 파란 테 · 미끄러지는 중 빛남)"],
      en: ["Blast: a dash Slide slot next to the Stigma gauge (seconds until ready · blue border when ready · glows while sliding)"],
      ja: ["ブラスト：聖痕ゲージの横にダッシュ・スライディング枠（再使用までの残り秒・準備できると青い枠・滑っている間は光る）"],
    },
  },
  {
    version: "0.50.0",
    date: "2026-11-07",
    items: {
      ko: [
        "진영 특징 시스템 (로그만, 패왕전·대결 제외): 진영마다 모든 캐릭터에 공통 특징 · 아래 칸에 진영 색 게이지",
        "탈라시아 물결 콤보: 맞힐 때마다 콤보 +1, 맞으면 0 · 콤보 10마다 물 피해 +8% (최대 +80%) · 매드퀸·후크는 콤보 20부터 작은 물 피해가 같이",
        "헬리오스 타락: 처치마다 +1 (최대 30), 맞으면 -1 · 1당 주는 피해 +1%·받는 피해 +0.5% · 30이면 6초 폭주(공격 속도 +30%) · 학살자는 피의 학살과 폭주가 겹치지 않음 · 악의 사도는 영혼과 타락 두 스택",
        "테라코어 과열: 맞힐수록 열 (피해 최대 +25%) · 100이면 2초 과부하(공격 불가) · 열 60 이상에서 대시하면 증기 폭발로 열을 비움",
        "아스칼론 맹세: 적이 있는 방마다 맹세 하나 (6종) · 지키면 영광 +1 (1당 피해 +2%, 최대 10) · 어기면 그 방에서만 피해 -15%",
        "비르디아 공생 정령: 정령이 따라다니며 적을 쏨 · 처치 30번 꽃(처치 회복) · 80번 나무 정령(뿌리 속박)",
        "성국 핵심 스킬: 스킬을 12번 쓰면 핵심 스킬이 각성해 스킬 칸이 금빛으로 빛남 · 쓰면 금빛 빛기둥 + 2초 동안 피해 1.3배",
      ],
      en: [
        "Faction Traits (roguelike only, not in Paewang/duels): every character shares a trait with their faction · a faction-colored gauge in the bottom bar",
        "Thalassia Tide Combo: +1 combo per hit, reset when hit · every 10 combo: +8% water damage (up to +80%) · Mad Queen and Hook add a small water hit from 20 combo",
        "Helios Taint: +1 per kill (max 30), -1 when hit · each: +1% damage dealt, +0.5% taken · at 30, a 6s Rampage (+30% attack speed) · Slayer's Blood Frenzy never overlaps it · Apostle keeps both souls and Taint",
        "Terracore Heat: hitting builds heat (up to +25% damage) · at 100, a 2s Overload (no attacks) · dash at 60+ heat to vent it in a steam blast",
        "Ascalon Oaths: one Oath per room with foes (6 kinds) · keep it for +1 Glory (+2% damage each, max 10) · break it for -15% damage in that room",
        "Virdia Symbiote: a spirit follows you and shoots foes · Blooms at 30 kills (heal on kill) · becomes a Treant at 80 (roots foes)",
        "Holy Kingdom Core Skill: use skills 12 times to awaken your Core Skill (its slot glows gold) · casting it calls a golden pillar and +30% damage for 2s",
      ],
      ja: [
        "陣営の特徴（ローグのみ、覇王戦・対戦は除く）：陣営ごとに全キャラ共通の特徴・下の欄に陣営色のゲージ",
        "タラシア 波のコンボ：当てるたびに+1、被弾で0・コンボ10ごとに水ダメージ+8%（最大+80%）・マッドクイーン・フックはコンボ20から小さな水ダメージが追加",
        "ヘリオス 堕落：撃破ごとに+1（最大30）、被弾で-1・1ごとに与ダメージ+1%・被ダメージ+0.5%・30で6秒暴走（攻撃速度+30%）・スレイヤーは血の殺戮と暴走が重ならない・悪の使徒は魂と堕落の2スタック",
        "テラコア 過熱：当てるほど熱（ダメージ最大+25%）・100で2秒過負荷（攻撃不可）・熱60以上でダッシュすると蒸気爆発で熱を放出",
        "アスカロン 誓い：敵のいる部屋ごとに誓いが一つ（6種）・守ると栄光+1（1ごとにダメージ+2%、最大10）・破るとその部屋だけダメージ-15%",
        "ヴィルディア 共生精霊：精霊がついて回り敵を撃つ・30体撃破で花（撃破時回復）・80体で樹の精霊（根で拘束）",
        "聖国 核心スキル：スキルを12回使うと核心スキルが覚醒しスキル枠が金色に光る・使うと金色の光柱＋2秒間ダメージ1.3倍",
      ],
    },
  },
];
