import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
