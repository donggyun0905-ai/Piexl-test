import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.66",
    date: "2026-11-07",
    items: {
      ko: ["가브리엘: 공격 속도가 느려도 누르고 있으면 3타 대지 강타까지 이어짐 (전엔 1타로 계속 돌아감) · 세레나도 같게"],
      en: ["Gabriel: holding attack now carries through to the 3rd-hit Earth Slam even at low attack speed (it kept resetting to the 1st hit) · same for Serena"],
      ja: ["ガブリエル：攻撃速度が遅くても押し続ければ3撃目の大地強打までつながる（以前は1撃目に戻り続けた）· セレナも同様"],
    },
  },
  {
    version: "0.49.65",
    date: "2026-11-07",
    items: {
      ko: [
        "성국 새 캐릭터 세레나 '환혹의 무희' (스킬형): 비수 달린 사슬 채찍 둘이 늘 몸 둘레를 크게 돌며 적 사이를 휘저음 (35%) · 기본 치명타 25% · 맞힐 때마다 빛 피해 추가 · 해금: 이동 속도 1.8 달성",
        "세레나 3연격: 채찍 휘두르기 둘 → 환혹의 회오리 (여러 사슬 채찍이 둘레를 세 번 연달아 휘저음) · 맞힌 적에 가시 (가득 차면 마비: 느려짐·받는 피해 +15%)",
        "세레나 숫자 키 스킬 넷: 1 환혹의 스텝 (무적 회전 미끄러짐) · 2 가시 정원 (빛의 강철 가시 장판 일곱) · 3 맹독 비수 (부채꼴 비수·독) · 4 환혹의 무도 (8초 동안 사슬 채찍 여섯·피해 2배)",
        "세레나 무기 1 (강철 가시 채찍 & 맹독성 에테르 비수) · 전용 아이템 20 · 그림 시트 · 사슬 채찍·회오리 이펙트 · 패왕전 스킬",
      ],
      en: [
        "New Holy Kingdom character Serena 'The Bewitching Dancer' (skill-based): two dagger-tipped chain whips always circle wide around her, lashing between foes (35%) · 25% base crit · bonus light damage on every hit · unlock: reach 1.8 move speed",
        "Serena's 3-hit chain: two whip lashes → Bewitching Whirl (many chain whips sweep around her three times in a row) · hits plant thorns (a full set Numbs: slowed, +15% damage taken)",
        "Serena's four number-key skills: 1 Bewitching Step (invulnerable spinning glide) · 2 Thorn Garden (seven fields of steel-and-light thorns) · 3 Venom Daggers (dagger cone, poison) · 4 Dance of Bewitchment (six chain whips, 2x damage for 8s)",
        "Serena: 1 weapon (Steel Thorn Whip & Venom Ether Daggers) · 20 exclusive items · sprite sheet · chain whip and whirl effects · Paewang skills",
      ],
      ja: [
        "聖国の新キャラクター、セレナ「幻惑の舞姫」（スキル型）：短剣付きの鎖鞭2本がいつも体の周りを大きく回り敵の間を薙ぐ（35%）· 基本会心25% · 当てるたびに光ダメージ追加 · 解放：移動速度1.8達成",
        "セレナの3連撃：鞭の振り2回 → 幻惑の旋風（多くの鎖鞭が周りを3回続けて薙ぐ）· 当てた敵に棘（満タンで麻痺：遅くなる・受けるダメージ+15%）",
        "セレナの数字キーのスキル4つ：1 幻惑のステップ（無敵の回転スライド）· 2 棘の庭（光の鋼の棘の床7つ）· 3 猛毒の短剣（扇形の短剣・毒）· 4 幻惑の舞（8秒間鎖鞭6本・ダメージ2倍）",
        "セレナ：武器1（鋼の棘の鞭＆猛毒のエーテル短剣）· 専用アイテム20 · スプライトシート · 鎖鞭・旋風のエフェクト · 覇王戦スキル",
      ],
    },
  },
];
