import type { PatchNote } from "./types";

// 지난 패치 노트 0.52.10 (latest.ts에서 옮김)
export const NOTES: PatchNote[] = [
  {
    version: "0.52.10",
    date: "2026-11-10",
    items: {
      ko: [
        "새 캐릭터 쉐도잉 (실베르): 그림을 그리는 정령 소녀 · 무기는 마법 붓 하나 · 누르고 있는 동안 마우스 자리(붓 끝)를 따라 바닥에 먹 획을 그려 공격 (마우스 커서가 붓으로 바뀜) · 획에 닿은 적은 계속 피해 · 잉크 100을 써서 그리고 손을 떼면 다시 참",
        "그린 모양에 따라 기술: 처음과 끝이 만나는 닫힌 원 = 봉인 (안의 적 공격력 250% · 묶음) · 곧은 줄 = 일필 베기 (공격력 180%) · 자동 조준이면 붓이 가까운 적 둘레를 돌며 원을 그림",
        "쉐도잉 전용 패시브 20: 모두 새 기술·능력과 능력치 · 쉐도잉 효과 5 (검무 일필 · 수묵 산수화 · 연꽃 각성 · 학과 구름 · 벚꽃 물결) · 레이드 맵 잔패턴 15 (봉인 사슬 · 불기둥 획 · 얼음 결정 · 먹 소용돌이 · 달 낙관 · 별 꺾임 · 멈춘 시계 · 유령 먹 · 가시 장미 · 혜성 붓 · 나비 붓끝 · 황금 문 · 날개 획 · 유성 낙하 · 먹의 용)",
      ],
      en: [
        "New character Shadowing (Silber): the painting spirit girl · one weapon, the Magic Brush · hold to paint ink strokes on the floor following your cursor (the cursor becomes a brush) · foes touching a stroke keep taking damage · painting uses 100 ink, which refills when you let go",
        "Shapes trigger skills: a closed loop whose ends meet = Seal (250% damage to foes inside · binds them) · a straight line = One-Stroke Slash (180% damage) · with auto-aim the brush circles the nearest foe",
        "Shadowing's 20 exclusive passives, each granting a new skill or ability plus stats · 5 Shadowing effects (Sword Dance Stroke · Ink Landscape · Lotus Awakening · Crane and Cloud · Sakura Wave) · 15 raid map patterns (Sealing Chain · Flame Pillar Stroke · Ice Crystal · Ink Vortex · Moon Seal Stamp · Star Corners · Stopped Clock · Ghost Ink · Thorned Rose · Comet Brush · Butterfly Tip · Golden Gate · Winged Stroke · Meteor Fall · Ink Dragon)",
      ],
      ja: [
        "新キャラクター シャドーイング（シルベル）：絵を描く精霊の少女・武器は魔法の筆ひとつ・押している間カーソル（筆先）に沿って床に墨の線を描いて攻撃（カーソルが筆に変わる）・線に触れた敵は継続ダメージ・インク100を使って描き、離すと回復",
        "描いた形で技：始めと終わりが出会う閉じた円＝封印（中の敵に攻撃力250%・拘束）・まっすぐな線＝一筆斬り（攻撃力180%）・自動照準なら筆が近い敵の周りを回って円を描く",
        "シャドーイング専用パッシブ20：すべて新しい技・能力と能力値・シャドーイングの効果5（剣舞一筆・水墨山水画・蓮華覚醒・鶴と雲・桜の波）・レイドのマップ模様15（封印の鎖・火柱の線・氷の結晶・墨の渦・月の落款・星の角・止まった時計・幽霊の墨・棘の薔薇・彗星の筆・蝶の筆先・黄金の門・翼の線・流星落下・墨の龍）",
      ],
    },
  },
];
