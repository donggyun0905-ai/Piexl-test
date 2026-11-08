import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.34",
    date: "2026-11-08",
    items: {
      ko: [
        "새벽의 성흔 새 캐릭터 인시전 '쌍도끼의 도살자' (광전사, 스킬 없음, 성흔 게이지): 자비 없는 연타로 악마를 도륙내고 찢어발기는 콤보형 · 체력 130 · 공격력 13 · 해금: 공격 속도 2.2 달성",
        "쌍도끼 네 박자: 오른 도끼 베기 → 왼 도끼 베기 (75%) → 쌍도끼 교차 베기 (115%) → 회오리 베기 (몸 둘레 140%) · 대시는 돌진 연참 (지나가는 적을 두 번 60%)",
        "도륙 콤보: 맞힐 때마다 오르고 10마다 공격 속도 +5% · 피해 +4% (최대 6단계) · 2초 안 맞히면 끊기고 맞으면 반으로 · 30마다 다음 공격이 도살 도약 (적에게 뛰어들어 내려찍기 220% · 기절) · 화면 왼쪽 위 COMBO",
        "광란 각성: 둘레 쌍도끼 강타 · 공격 속도 ×1.4 · 피해 ×1.2 · 콤보 두 배 · 안 끊김 · 전용 아이템 20 (새 공격 방식: 날아가는 초승달 · 피의 소용돌이 · 도륙 폭발 · 갈라진 땅 · 연속 도약 · 피의 길 · 학살)",
      ],
      en: [
        "New Stigma of Dawn character Incision 'The Butcher of Twin Axes' (berserker, no skills, Stigma gauge): a combo fighter who butchers and tears demons apart with merciless blows · HP 130 · Damage 13 · Unlock: reach 2.2 attack speed",
        "Four-beat twin axes: right-axe slash → left-axe slash (75%) → crossing twin-axe slash (115%) → whirlwind slash (all around, 140%) · dashing is a Rushing Cleave (cuts each foe on the path twice, 60%)",
        "Carnage Combo: rises with every hit, +5% attack speed · +4% damage every 10 (up to 6 tiers) · breaks after 2s without a hit and halves when you're hit · every 30, your next attack is a Butcher's Leap (jump onto a foe and slam 220% · stun) · COMBO shown at the top left",
        "Frenzy Awakening: twin-axe slam around you · ×1.4 attack speed · ×1.2 damage · double combo · never breaks · 20 exclusive items (new attacks: Flying Crescents · Blood Vortex · Carnage Burst · Split Earth · Chain Leap · Trail of Blood · Massacre)",
      ],
      ja: [
        "夜明けの聖痕の新キャラクター、インシジョン「双斧の屠殺者」（狂戦士、スキルなし、聖痕ゲージ）：無慈悲な連打で悪魔を屠り引き裂くコンボ型 · 体力130・攻撃力13 · 解放：攻撃速度2.2達成",
        "双斧の四拍子：右斧斬り → 左斧斬り（75%）→ 双斧交差斬り（115%）→ 旋風斬り（周囲140%）· ダッシュは突進連斬（通り道の敵を2回60%）",
        "屠殺コンボ：当てるたびに上がり、10ごとに攻撃速度+5%・ダメージ+4%（最大6段階）· 2秒当てないと途切れ、被弾で半分に · 30ごとに次の攻撃が屠殺の跳躍（敵に飛び込んで叩きつけ220%・気絶）· 画面左上にCOMBO",
        "狂乱覚醒：周囲に双斧の強打 · 攻撃速度×1.4 · ダメージ×1.2 · コンボ2倍 · 途切れない · 専用アイテム20（新しい攻撃：飛ぶ三日月・血の渦・屠殺の爆発・裂けた大地・連続跳躍・血の道・虐殺）",
      ],
    },
  },
  {
    version: "0.50.33",
    date: "2026-11-08",
    items: {
      ko: ["히든 아이템 이름 바꿈: 포탈건 → 귀환의 문 (아이콘도 돌 아치 안 푸른 소용돌이로)", "블리자드 랜스를 진짜 창 모양으로 다시 그림 (자루·코등이·마름모 창날) · 다섯 창이 체력 줄 위에 한 줄로 떠 있음"],
      en: ["Hidden item renamed: Gate of Return (icon is now a blue swirl inside a stone arch)", "Redrew Blizzard Lance as real spears (shaft, guard, diamond blade) · the five lances now float in a row above your health bar"],
      ja: ["ヒドゥンアイテムの名前を変更：帰還の門（アイコンも石のアーチの中の青い渦に）", "ブリザードランスを本物の槍の形に描き直し（柄・鍔・ひし形の穂先）· 5本の槍が体力バーの上に一列に浮かぶ"],
    },
  },
  {
    version: "0.50.32",
    date: "2026-11-08",
    items: {
      ko: ["루나틱 찌르기 길이 2.5배 (52 → 130): 폭은 그대로 좁고 앞으로 길게 찌름"],
      en: ["Lunatic's thrust length ×2.5 (52 → 130): still narrow, but reaches much farther ahead"],
      ja: ["ルナティックの突きの長さ2.5倍（52 → 130）：幅は狭いまま、前へ長く突く"],
    },
  },
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
