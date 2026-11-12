import type { PatchNote } from "./types";

// 지난 패치 노트 0.52.47~0.52.50 (latest.ts에서 옮김)
export const NOTES: PatchNote[] = [
  {
    version: "0.52.50",
    date: "2026-11-12",
    items: {
      ko: ["최종보스(시즌 1~3 라스트 보스·레이드 루시퍼)와 싸우는 동안 맞으면 피해에 내 최대 체력의 5%가 더해짐 — 체력이 많은 캐릭터도 버티기만 할 수 없게 (지형·장판처럼 계속 닳는 피해는 제외)"],
      en: ["While fighting a final boss (Season 1–3 last bosses · raid Lucifer), each hit you take also deals 5% of your max HP — high-HP characters can no longer just tank it (lingering terrain and zone damage excluded)"],
      ja: ["最終ボス（シーズン1〜3のラストボス・レイドのルシファー）との戦闘中は、被ダメージに自分の最大HPの5%が追加 — HPの多いキャラも耐えるだけではしのげない（地形・床のような継続ダメージは除く）"],
    },
  },
  {
    version: "0.52.49",
    date: "2026-11-12",
    items: {
      ko: [
        "기어스: 몸 크기를 다른 캐릭터와 비슷하게 줄임 (큰 얼굴·양쪽 방패 때문에 커 보이던 것)",
        "기어스 대시 구체를 2.5배 크게 — 그림과 함께 벽·적에 부딪히는 판정도 커짐 (맞는 판정은 몸 그대로)",
        "기어스 구체가 벽이나 적에게 튕길 때마다 12%씩 빨라짐 (최대 10번 · 구체를 풀면 처음부터)",
      ],
      en: [
        "Gears: body size reduced to match other characters (the large face and twin shields made her look bigger)",
        "Gears' dash orb is 2.5× larger — its wall and enemy collision grows with the art (your own hitbox stays the body)",
        "Gears' orb gets 12% faster every time it bounces off a wall or an enemy (up to 10 times · resets when you leave orb form)",
      ],
      ja: [
        "ギアーズ：体の大きさを他のキャラに合わせて縮小（大きな顔と両側の盾で大きく見えていた）",
        "ギアーズのダッシュ球体を2.5倍に — 絵と一緒に壁・敵への衝突判定も大きく（被弾判定は体のまま）",
        "ギアーズの球体が壁や敵に跳ね返るたびに12%ずつ速く（最大10回 · 球体を解くとリセット）",
      ],
    },
  },
  {
    version: "0.52.48",
    date: "2026-11-12",
    items: {
      ko: [
        "새 캐릭터 기어스 (실베르): 은빛 쌍방패 기사 메이드 · 공격력은 아주 낮지만 방어력이 높고(받는 피해 ×0.8) 여러 번 때려서 싸움 · 공격력 아이템은 반만 적용",
        "무기 1 (은빛 쌍방패): 앞을 두 방패로 강타 · 대시는 푸른 보석 기계 구체: 누른 방향으로 굴러가며 벽에 튕기고 적과 부딪힘(서로 피해, 퉁!) · 무적 없이 받는 피해만 30% 감소 · 굴러가며 공격 가능 · 다시 누르면 풀림",
        "전용 패시브 20: 거울 반격·마법 보호막 돔·푸른 육각 방벽(맞을 때) · 대지 분쇄·방패 던지기·연속 방패타·천상의 수호자(60타)·청뢰 방패 폭풍(30타) · 쌍성 방패 · 마법 방패 충격파 · 보조 10 (60타·30타는 피해 숫자가 한 대씩 모두 뜸)",
      ],
      en: [
        "New character Gears (Silber): the silver twin-shield knight maid · very low damage, but high defense (damage taken x0.8) and many hits · damage items apply only half",
        "Weapon 1 (Silver Twin Shields): slam ahead with both shields · Dash becomes a blue gem mechanical orb that rolls the way you pressed, bounces off walls and rams foes (both take damage, thump!) · no invincibility, only 30% less damage taken · you can attack while rolling · press again to return",
        "20 exclusive passives: Mirror Counter, Magic Barrier Dome, Azure Hex Bulwark (when hit) · Earth Shatter, Shield Throw, Shield Barrage, Celestial Guardian (60 hits), Azure Thunder Shield Storm (30 hits) · Twin Star Shields · Magic Shield Shockwave · 10 support (every hit of the 60- and 30-hit skills shows its own number)",
      ],
      ja: [
        "新キャラクター ギアーズ（シルベル）：銀の双盾騎士メイド・攻撃力はとても低いが防御力が高く（被ダメージ×0.8）手数で戦う・攻撃力アイテムは半分だけ適用",
        "武器1（銀の双盾）：前を2枚の盾で強打・ダッシュは青い宝石の機械球体：押した方向へ転がり、壁で跳ね返り敵にぶつかる（互いにダメージ、ドン！）・無敵なしで被ダメージ30%減のみ・転がりながら攻撃できる・もう一度押すと解除",
        "専用パッシブ20：鏡の反撃・魔法障壁ドーム・青き六角防壁（被弾時）・大地粉砕・盾投げ・連続盾打・天上の守護者（60ヒット）・青雷盾嵐（30ヒット）・双星の盾・魔法盾の衝撃波・補助10（60・30ヒットはダメージ数字が1発ずつすべて出る）",
      ],
    },
  },
  {
    version: "0.52.47",
    date: "2026-11-12",
    items: {
      ko: [
        "실베르 진영 특징 '성장' 약하게: 이제 전용 패시브만 셈 (공용 패시브는 먹어도 오르지 않음) · 전용 패시브 하나마다 공격력·공격 속도 +2% → +1%",
        "백령: 유령팔(손) 크기는 그대로, 손이 커질 때 공격 크기가 따라 커지는 정도를 절반으로 (가장 큰 손 2배일 때 공격 2배 → 1.5배)",
        "백인장: 붉은 날개 폭우 크기 절반",
        "아리아: 악보 완성 폭죽 크기 줄임 (반지름 46 → 34) · 폭죽 효과를 그림 대신 빛으로 바꿔 화면을 덜 가리게 (맞는 범위만큼만 그려짐)",
        "아수라: 각성 공격(1·2타·3타·4타) 범위 1.5배 줄임",
      ],
      en: [
        "Silber faction trait 'Growth' weakened: only exclusive passives count now (shared passives no longer raise it) · per exclusive passive damage and attack speed +2% → +1%",
        "Baekryeong: the ghost arm (hand) size is unchanged, but attacks grow only half as much as the hand (at the largest 2x hand, attacks 2x → 1.5x)",
        "Baekinjang: Red Wing Downpour size halved",
        "Aria: Score Complete fireworks are smaller (radius 46 → 34) · firework effects are now drawn with light instead of images so they cover less of the screen (drawn only as big as the hit area)",
        "Asura: awakened attacks (hits 1-2, 3 and 4) have 1.5x smaller range",
      ],
      ja: [
        "シルベル陣営の特徴「成長」を弱体化：専用パッシブのみ数えるように（共通パッシブでは上がらない）・専用パッシブ1つごとの攻撃力・攻撃速度 +2% → +1%",
        "白霊：幽霊腕（手）の大きさはそのまま、手が大きくなるときに攻撃が大きくなる割合を半分に（最大2倍の手で攻撃 2倍 → 1.5倍）",
        "百人長：赤い翼の豪雨の大きさを半分に",
        "アリア：楽譜完成の花火を小さく（半径 46 → 34）・花火の効果を画像ではなく光で描き、画面を隠しにくく（当たる範囲の大きさだけ描画）",
        "阿修羅：覚醒攻撃（1・2打・3打・4打）の範囲を1.5分の1に",
      ],
    },
  },
];
