import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.51.1",
    date: "2026-11-10",
    items: {
      ko: [
        "레이드: 석화의 기둥·절망의 검·악마의 불길에 처형·즉사 효과가 걸려 한 번에 사라지던 것 고침 (보스처럼 막음)",
        "레이드 결과표: 끝나면 결과 창 아래에, 싸우는 중엔 Tab을 누르는 동안 · 팀원마다 준 피해(비율) · 루시퍼에게 · 기둥·검·몬스터에게 · 최대 한 방 · 받은 피해 · 회복 · 데스",
      ],
      en: [
        "Raid: fixed execute/instant-kill effects wiping out petrified pillars, swords of despair and demon flames in one hit (now protected like bosses)",
        "Raid board: shown under the results, or hold Tab during the fight · per teammate: damage (share) · to Lucifer · to pillars/swords/adds · biggest hit · damage taken · healed · deaths",
      ],
      ja: [
        "レイド：石化の柱・絶望の剣・悪魔の炎に処刑・即死効果が入り一撃で消えていたのを修正 (ボスと同じく無効)",
        "レイド結果表：終了時は結果画面の下に、戦闘中はTabを押している間 · 仲間ごとに与ダメージ(割合) · ルシファーへ · 柱・剣・モンスターへ · 最大の一撃 · 被ダメージ · 回復 · デス",
      ],
    },
  },
  {
    version: "0.51.0",
    date: "2026-11-09",
    items: {
      ko: [
        "새 이벤트 '레이드' 완성: 루시퍼를 쓰러뜨리면 모두 살아나 보상 방으로 · 보라·금빛 대리석 방에 붉은 융단 · 빛기둥 여섯과 깃발 · 가운데 큰 보물 상자를 함께 때려 열면 빛이 솟고 금화·색종이가 쏟아지며 모두에게 '축하합니다!' 창 (보상은 준비 중)",
      ],
      en: [
        "New event 'Raid' complete: defeat Lucifer and everyone revives in the reward room · purple-and-gold marble hall with a red carpet, six pillars of light and banners · strike the great treasure chest together to open it — light bursts out, gold and confetti rain down, and everyone sees 'Congratulations!' (rewards coming soon)",
      ],
      ja: [
        "新イベント「レイド」完成：ルシファーを倒すと全員復活して報酬の間へ · 紫と金の大理石の間に赤い絨毯 · 6本の光の柱と旗 · 中央の大きな宝箱をみんなで叩いて開けると光があふれ金貨と紙吹雪が降り、全員に「おめでとうございます！」 (報酬は準備中)",
      ],
    },
  },
  {
    version: "0.50.52",
    date: "2026-11-09",
    items: {
      ko: ["레이드: 석화의 기둥·절망의 검을 루시퍼보다 크게 (맞는 범위도 넓어짐)"],
      en: ["Raid: the petrified pillars and swords of despair are now bigger than Lucifer (larger hitboxes too)"],
      ja: ["レイド：石化の柱・絶望の剣をルシファーより大きく (当たり判定も拡大)"],
    },
  },
  {
    version: "0.50.51",
    date: "2026-11-09",
    items: {
      ko: [
        "레이드 방은 화면을 꽉 채움 (미니맵 숨김 · 왼쪽 능력치 창은 꺼 두고 C로 켜고 끄기) · 루시퍼 기본 공격 크기 2배 · 검기 빈칸 2배(8칸) · 공격이 더 아프고 더 자주 옴",
        "루시퍼 상태이상: 불기둥·불꽃 화상 · 별 고리·지진파·회전 베기·얼음 감속 · 가시 고리·앞뒤 휘두르기·어둠의 손 기절 · X자·검기·금빛 검 치유 감소 50% · 보라 구·화살비·가시 덩굴 독",
        "근접 견제 2개: 가까이 붙으면 회전 베기(몸 둘레 큰 원) · 앞뒤 휘두르기(가까운 사람 쪽 → 반대쪽)",
        "루시퍼 2페이즈: 절망의 검 4개(빛나는 색의 패턴 6가지: 붉은 X 사슬 · 얼음 가시 · 금빛 검 비 · 불꽃 분출 · 가시 덩굴 · 어둠의 손 · 15초마다 맵 전체 기절 0.5초) → 검을 다 부수면 컷신 → 사라진 보스와 떨어지는 검 → 모두 사슬(화면 가운데 큰 방향키를 차례로) → 1대5 → 30줄부터 날개를 줍고 바닥이 꺼지면 하늘 탄막 (날개가 없으면 떨어져 관전) → 쓰러지는 컷신",
        "컷신을 고화질로 (3배 매끄럽게 키움 · 칸 사이를 부드럽게 · 가장자리가 검은 바탕과 이어져 화면 가득)",
      ],
      en: [
        "The raid arena now fills the screen (minimap hidden · the left stats panel starts off, toggle with C) · Lucifer's basic attacks are twice as large · twice as many safe squares (8) for sword waves · attacks hit harder and come more often",
        "Lucifer status effects: fire pillar/flames burn · star rings/shockwaves/spin slash/ice slow · thorn crown/double sweep/dark hands stun · X slashes/sword waves/golden swords heal -50% · purple orb/arrow rain/thorn vines poison",
        "Two anti-melee moves: get close and Lucifer spins a huge slash around his body · or sweeps toward the nearest player and then behind",
        "Lucifer phase 2: four swords of despair (6 colored patterns: red X chains · ice spikes · golden sword rain · fire eruptions · thorn vines · dark hands · map-wide 0.5s stun every 15s) → break them all for a cutscene → the boss vanishes while swords fall → everyone is chained (press the big arrows in order) → 1 vs 5 → from 30 bars grab wings before the floor collapses into a sky bullet hell (no wings = you fall and spectate) → defeat cutscene",
        "Cutscenes in high quality (smoothly upscaled 3×, in-between frames, edges fade into the black background to fill the screen)",
      ],
      ja: [
        "レイド部屋は画面いっぱいに (ミニマップ非表示 · 左の能力値パネルはオフで開始、Cで切り替え) · ルシファーの通常攻撃が2倍の大きさ · 剣気の安全マスが2倍(8マス) · 攻撃がより痛く頻繁に",
        "ルシファーの状態異常：火柱・炎は火傷 · 星の輪・地震波・回転斬り・氷は減速 · 棘の輪・前後斬り・闇の手は気絶 · X字・剣気・金の剣は回復-50% · 紫の球・矢の雨・茨のつるは毒",
        "近接けん制2種：近づくと体の周りを大きく回転斬り · 近い人の方へ斬ってから反対側へ",
        "ルシファー フェーズ2：絶望の剣4本(光る色のパターン6種：赤いX鎖 · 氷の棘 · 金の剣の雨 · 炎の噴出 · 茨のつる · 闇の手 · 15秒ごとにマップ全体0.5秒気絶) → 全部壊すとカットシーン → ボスが消え剣が降る → 全員が鎖に(画面中央の大きな矢印を順に) → 1対5 → 30ゲージから翼を拾い床が崩れると空の弾幕 (翼がないと落ちて観戦) → 倒れるカットシーン",
        "カットシーンを高画質に (3倍になめらかに拡大 · コマの間をなめらかに · 端が黒い背景とつながり画面いっぱい)",
      ],
    },
  },
  {
    version: "0.50.50",
    date: "2026-11-09",
    items: {
      ko: [
        "레이드 보스 루시퍼 1페이즈: 체력 줄 ×99 · 석화의 기둥 4개(유저 한 명씩 아주 느리게 따라옴, 1분마다 석화의 빔 → 지진파 3번 · 루시퍼에게 보호막 10000) · 기본 공격(발밑 어둠 불기둥 · 닿으면 터지는 별 고리 · 두 번 깜빡이고 내리꽂히는 가시 고리)",
        "기둥이 부서질 때마다 루시퍼 기절 + 검기 5번(빛나는 네모 칸으로 피함) · 기둥 둘 뒤 어둠의 기둥(맞으면 어둠의 세계: 치유·아이템 불가, 사거리·공격 속도·이동 속도 -50%) · 기둥 넷 뒤 흰색 돔과 컷신(밖에 있으면 최대 체력 80%) → X자·보라 구 · 30줄부터 악마의 불길 4마리",
        "레이드 방은 화면을 2배 줄여 넓게 · 데스 카운트 10(다 쓰면 관전) · AI 동료가 준비 방을 돌아다니며 고르고 레이드 방에서 같이 싸우고 패턴을 피함 · 1페이즈를 깎으면 변신 컷신 → 2페이즈(다음 업데이트에서 완성)",
      ],
      en: [
        "Raid boss Lucifer phase 1: ×99 health bars · 4 petrified pillars (each slowly follows one player, petrifying beam every minute → 3 shockwaves · gives Lucifer a 10000 shield) · basic attacks (dark fire pillar under your feet · star rings that burst on touch · a thorn crown that blinks twice then drops)",
        "Each broken pillar stuns Lucifer and unleashes 5 sword waves (hide in the glowing squares) · after two pillars, a dark pillar hunts you (hit → World of Darkness: no healing or items, range/attack speed/move speed -50%) · after all four, a white dome and a cutscene (outside = 80% max HP) → X slashes and purple orbs · from 30 bars, 4 demon flames",
        "The raid arena zooms out 2× · 10 lives each (then spectate) · AI allies wander the prep rooms, then fight beside you and dodge patterns · depleting phase 1 plays the transformation cutscene → phase 2 (completed in the next update)",
      ],
      ja: [
        "レイドボス・ルシファー フェーズ1：体力ゲージ×99 · 石化の柱4本(1人ずつとてもゆっくり追う、1分ごとに石化のビーム → 地震波3回 · ルシファーにシールド10000) · 通常攻撃(足元の闇の火柱 · 触れると爆ぜる星の輪 · 2回点滅して落ちる棘の輪)",
        "柱が壊れるたびにルシファー気絶 + 剣気5回(光る四角に入って回避) · 柱2本後は闇の柱(当たると闇の世界：回復・アイテム不可、射程・攻撃速度・移動速度-50%) · 4本後は白いドームとカットシーン(外にいると最大体力80%) → X字・紫の球 · 30ゲージから悪魔の炎4体",
        "レイド部屋は画面を2倍縮小 · デスカウント10(使い切ると観戦) · AIの仲間が準備部屋を歩き回って選び、レイド部屋で一緒に戦いパターンを避ける · フェーズ1を削ると変身カットシーン → フェーズ2(次のアップデートで完成)",
      ],
    },
  },
  {
    version: "0.50.49",
    date: "2026-11-09",
    items: {
      ko: ["설정: 공격 이펙트 진하기(%)를 '내 것'과 '다른 사람·AI 것'으로 따로 조절 (0%면 안 보임) · 보스 공격·위험 표시는 그대로 보여서 협동·레이드에서 보스 패턴이 가려지지 않음"],
      en: ["Settings: attack effect opacity (%) can be set separately for 'mine' and 'others & AI' (0% hides them) · boss attacks and danger marks stay fully visible so boss patterns are never hidden in co-op or raids"],
      ja: ["設定：攻撃エフェクトの濃さ(%)を「自分」と「他の人・AI」で別々に調整 (0%で非表示) · ボスの攻撃・危険表示はそのままなので協力・レイドでボスのパターンが隠れない"],
    },
  },
  {
    version: "0.50.48",
    date: "2026-11-09",
    items: {
      ko: [
        "새 이벤트 '레이드' (만드는 중): 이벤트 창 → 레이드 → 보스 목록(루시퍼) → 준비하기 · 친구 초대·자동으로 사람 찾기·AI와 바로 시작 (늘 5명, 빈자리는 AI 동료)",
        "레이드 준비: 고른 캐릭터의 전용 패시브 전부 + 여신의 축복 · 무장실(무기 하나·사용 아이템 2개) → 대장간(999원) → 성좌의 방(제단 8개 중 하나, 증강을 대가 없이) → 단련의 방(포인트 30) → 레이드 방 (보스는 다음 업데이트)",
      ],
      en: [
        "New event 'Raid' (in progress): Events → Raid → boss list (Lucifer) → Get ready · invite friends, find others automatically, or start now with AI (always 5 players, AI allies fill empty seats)",
        "Raid prep: all of your character's exclusive passives + Goddess's Blessing · Armory (one weapon, 2 usable items) → Forge (999 gold) → Constellation hall (one of 8 altars, augment for free) → Training room (30 points) → Raid arena (boss in the next update)",
      ],
      ja: [
        "新イベント「レイド」(制作中)：イベント → レイド → ボス一覧(ルシファー) → 準備する · 友達招待・自動で人を探す・AIとすぐ始める (常に5人、空き席はAIの仲間)",
        "レイド準備：選んだキャラの専用パッシブすべて + 女神の祝福 · 武装室(武器ひとつ・使用アイテム2つ) → 鍛冶場(999ゴールド) → 星座の間(8つの祭壇からひとつ、増強を代償なし) → 鍛錬の間(ポイント30) → レイド部屋 (ボスは次のアップデート)",
      ],
    },
  },
];
