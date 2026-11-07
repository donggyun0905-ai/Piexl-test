import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
  {
    version: "0.49.82",
    date: "2026-11-07",
    items: {
      ko: ["블래스트 대시 슬라이딩(1.7초) 중에 움직이는 방향으로 방향을 바꾸며 이동할 수 있게", "새벽의 성흔 특징: 성흔(달빛 각성)이 발동하면 화면 위로 하얀 달과 달빛이 비치고 가장자리로 흰 깃털이 흩날림"],
      en: ["Blast can now steer and move in any direction during the 1.7s dash slide", "Dawn Stigmata trait: when the Stigma (Moonlight Awakening) triggers, a white moon and moonlight shine over the screen and white feathers drift around its edges"],
      ja: ["ブラストのダッシュ・スライディング（1.7秒）中に移動方向へ向きを変えながら動けるように", "暁の聖痕の特徴：聖痕（月光覚醒）が発動すると画面の上に白い月と月光が差し、縁に白い羽根が舞う"],
    },
  },
  {
    version: "0.49.81",
    date: "2026-11-07",
    items: {
      ko: ["블래스트 파란 탄 피해 60%로 (슬라이딩 중엔 공격을 맞지 않으니)"],
      en: ["Blast blue shells now deal 60% damage (you can't be hit while sliding)"],
      ja: ["ブラストの青い弾のダメージを60%に（スライディング中は攻撃を受けないため）"],
    },
  },
  {
    version: "0.49.80",
    date: "2026-11-07",
    items: {
      ko: [
        "블래스트 대시 슬라이딩: 대시가 끝난 뒤 느려지던 것을, 대시 자체가 1.7초 동안 천천히 미끄러지는 슬라이딩이 되고 그동안 모두가 느려지게 (적은 더 느리게) · 미끄러지는 동안 파란 탄을 다 쏠 수 있음",
        "슬로우모션 중엔 탄창 5발이 사라지고 파란 탄 4발로 바뀜 → 잿빛 화면이 끝나면 원래 탄창으로 돌아옴",
      ],
      en: [
        "Blast dash slide: instead of slowing after the dash, the dash itself becomes a slow 1.7s slide during which everyone slows down (enemies even more) · you can fire all blue shells while sliding",
        "During the slow motion the 5-shell magazine is replaced by 4 blue shells → the original magazine returns when the gray screen ends",
      ],
      ja: [
        "ブラストのダッシュ・スライディング：ダッシュ後に遅くなっていたのを、ダッシュ自体が1.7秒のゆっくりしたスライディングになり、その間全員が遅くなるように（敵はさらに遅く）・滑りながら青い弾を撃ち切れる",
        "スローモーション中は弾倉5発が消えて青い弾4発に → 灰色の画面が終わると元の弾倉に戻る",
      ],
    },
  },
  {
    version: "0.49.79",
    date: "2026-11-07",
    items: {
      ko: [
        "블래스트 탄창 5발: 5발마다 마지막 발은 확정 치명타 (체력 줄 위 새빨간 탄) · 쏘지 않을 때 한 발씩 장전하며 철컥 소리 · 한 발만 들어가도 바로 쏠 수 있지만 치명타 탄은 다시 5번째 발에서 (두 발 → 펌프질 방식은 없앰)",
        "블래스트 대시 슬로우모션 (7초마다): 2초 동안 나를 포함한 모두가 느려지고 화면이 잿빛으로 · 파란 탄 4발이 바로 장전 (푸른 폭발) · 그동안 공격 속도와 탄은 그대로",
        "아이템 바뀜: 빠른 펌프 → 빠른 장전 (한 발 장전 시간 -30%)",
      ],
      en: [
        "Blast 5-shell magazine: every 5th shell is a guaranteed crit (bright red shell above the HP bar) · reloads one shell at a time with a click when not firing · you can fire as soon as one shell is in, but the crit shell comes again only on the 5th shot (the two-shots-then-pump pattern is gone)",
        "Blast dash slow motion (every 7s): for 2s everyone including you slows down and the screen turns gray · 4 blue shells load instantly (blue blast) · your attack speed and shots stay the same",
        "Item changed: Quick Pump → Quick Reload (-30% time to load each shell)",
      ],
      ja: [
        "ブラストの弾倉5発：5発ごとに最後の1発は確定クリティカル（体力バーの上に真っ赤な弾）・撃たない間に1発ずつ装填しガチャッと音・1発入ればすぐ撃てるがクリティカル弾は再び5発目に（2発→ポンプ方式は廃止）",
        "ブラストのダッシュスローモーション（7秒ごと）：2秒間、自分を含む全員が遅くなり画面が灰色に・青い弾4発が即装填（青い爆発）・その間も攻撃速度と弾はそのまま",
        "アイテム変更：素早いポンプ → 素早い装填（1発の装填時間-30%）",
      ],
    },
  },
];
