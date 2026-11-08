import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.31",
    date: "2026-11-08",
    items: {
      ko: [
        "새벽의 성흔 새 캐릭터 루나틱 '월광의 검사' (집단의 리더, 스킬 없음, 성흔 게이지): 달빛처럼 차갑고 아름다운 궤적으로 악마의 급소만 찌르는 고결한 검사 · 체력 115 · 공격력 15 · 해금: 공격 속도 2.5 달성 · 그림 시트·찌르기·달빛 베기 이펙트 (사용자 그림)",
        "월광의 세검: 매우 빠른 찌르기 (85%) + 앞으로 약간 돌진 · 달빛이 없어도 약점 공격 30% · 대시하면 지나가는 길의 적을 찌름 (130%)",
        "패시브 월광 표적: 가끔 적 머리 위에 조준점 → 약점 공격으로 맞히면 확정 치명타 + 빠른 달빛 베기 (220% · 달빛 2스택) · 약점이 아닌 그냥 공격으로 맞히면 조준점이 사라지고 다음 조준점을 기다림",
        "만월 각성: 둘레 달빛 폭발 · 공격 속도 ×1.35 · 모든 적이 표적 · 전용 아이템 20 (새 공격 방식: 삼연 찌르기 · 월광 검기 · 이어지는 달빛 · 초승달 비 · 잔상 찌르기 · 초승달 회전 베기) · 효과음 · 패왕전 스킬",
      ],
      en: [
        "New Stigma of Dawn character Lunatic 'The Moonlight Swordswoman' (the group's leader, no skills, Stigma gauge): a noble swordswoman who pierces only a demon's vitals with cold, beautiful moonlit arcs · HP 115 · Damage 15 · unlock: reach 2.5 attack speed · sprite sheet, thrust and Moonlight Slash effects (user art)",
        "Moonlight Rapier: very fast thrusts (85%) with a slight forward lunge · 30% weak-point chance even without Moonlight · dashing stabs foes along the path (130%)",
        "Passive Moonlight Mark: a crosshair sometimes appears above a foe → hitting it with a weak point is a guaranteed crit plus a swift Moonlight Slash (220% · 2 Moonlight stacks) · hitting it with a normal attack makes the crosshair vanish until the next one",
        "Full Moon Awakening: moonlight burst around you · ×1.35 attack speed · every foe is marked · 20 exclusive items (new attacks: Triple Thrust · Moonlight Wave · Chained Moonlight · Crescent Rain · Afterimage Thrust · Crescent Spin) · sound effects · Paewang skills",
      ],
      ja: [
        "夜明けの聖痕の新キャラ ルナティック『月光の剣士』（集団のリーダー、スキルなし、聖痕ゲージ）：月光のように冷たく美しい軌跡で悪魔の急所だけを突く高潔な剣士 · 体力115 · 攻撃力15 · 解放：攻撃速度2.5達成 · スプライト・突き・月光斬りのエフェクト（ユーザーの絵）",
        "月光の細剣：とても速い突き（85%）+ 少し前へ踏み込む · 月光がなくても弱点攻撃30% · ダッシュすると通り道の敵を突く（130%）",
        "パッシブ月光の標的：時々敵の頭上に照準 → 弱点攻撃で当てると確定クリティカル + 素早い月光斬り（220%・月光2スタック）· 弱点でない普通の攻撃で当てると照準が消え、次の照準を待つ",
        "満月覚醒：周囲に月光の爆発 · 攻撃速度×1.35 · 全ての敵が標的 · 専用アイテム20（新しい攻撃：三連突き・月光の剣気・連なる月光・三日月の雨・残像突き・三日月回転斬り）· 効果音 · 覇王戦スキル",
      ],
    },
  },
];
