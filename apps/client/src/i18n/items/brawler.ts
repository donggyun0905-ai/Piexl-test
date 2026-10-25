// 격투가 글자 (한·영·일): 무기 이름 · 콤보 설명 · 전용 아이템 이름·효과 (수치는 combos·sim/brawl·brawlMoves의 값과 맞춤)
import type { ComboStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type BrawlWeapon = "fist" | "boxinggloves" | "kick" | "muaythai" | "judo" | "jiujitsu" | "mma" | "karate" | "taekkyon" | "energywave";
type BrawlPassive = "balance" | "zone" | "ironBody" | "speedIsPower" | "mach" | "strongman" | "drunkenFist" | "intimidate" | "bloodDemon" | "knockout";

export const BRAWLER_WEAPON_NAMES: Record<BrawlWeapon & WeaponId, Names> = {
  fist: { ko: "주먹", en: "Fists", ja: "拳" },
  boxinggloves: { ko: "복싱 글러브", en: "Boxing Gloves", ja: "ボクシンググローブ" },
  kick: { ko: "킥", en: "Kicks", ja: "キック" },
  muaythai: { ko: "무에타이", en: "Muay Thai", ja: "ムエタイ" },
  judo: { ko: "유도", en: "Judo", ja: "柔道" },
  jiujitsu: { ko: "쌍광연격", en: "Twin Light Barrage", ja: "双光連撃" },
  mma: { ko: "종합격투기", en: "Mixed Martial Arts", ja: "総合格闘技" },
  karate: { ko: "가라테", en: "Karate", ja: "空手" },
  taekkyon: { ko: "택견", en: "Taekkyon", ja: "テッキョン" },
  energywave: { ko: "콤보", en: "Combo", ja: "コンボ" },
};

export const COMBO_DESC: Record<ComboStyle, Names> = {
  fist: { ko: "콤보: 앞 치기 → 발차기 → 무적 넓은 폭발", en: "Combo: jab → kick → invulnerable wide burst", ja: "コンボ：前打ち → 蹴り → 無敵の広い爆発" },
  boxing: { ko: "콤보: 앞 치기 → 빠른 찌르기 2번 → 무적 연타 5번", en: "Combo: jab → 2 quick thrusts → invulnerable 5-hit rush", ja: "コンボ：前打ち → 速い突き2回 → 無敵の5連打" },
  kick: { ko: "콤보: 밀치는 킥 → 적 바로 앞까지 돌진 후 범위 → 무적으로 모았다가 큰 범위", en: "Combo: pushing kick → dash up to the enemy, then area → invulnerable charge into a big area", ja: "コンボ：押し出す蹴り → 敵の目の前まで突進して範囲 → 無敵で溜めて大きな範囲" },
  muaythai: { ko: "콤보: 약한 범위 → 중간 찌르기 → 큰 범위 강타", en: "Combo: light area → medium thrust → big heavy area", ja: "コンボ：弱い範囲 → 中くらいの突き → 大きな範囲の強打" },
  judo: {
    ko: "콤보: 짧은 약한 치기 → 붙잡기 (잡은 적은 경직, 내리꽂을 때까지 무적 · 보스는 못 들어서 바위를 만들어 듦) → 무적 돌진 후 내리꽂기 (큰 범위)",
    en: "Combo: short light hit → grab (the held enemy is stunned and you are invulnerable until the slam; bosses are too big, so you conjure a rock instead) → invulnerable dash and slam (big area)",
    ja: "コンボ：短い弱い打撃 → つかむ（つかんだ敵は硬直、叩きつけるまで無敵 · ボスは持てないので岩を作って持つ） → 無敵の突進から叩きつけ（大きな範囲）",
  },
  jiujitsu: {
    ko: "콤보: 앞쪽을 두 검으로 동시에 두 번 베기 → 한 바퀴 돌며 두 번 베기 → 무적으로 가까운 적을 꿰뚫고 공격 범위 끝까지 찌르기 (지나간 자리 모두 피해) · 5번 연속 콤보마다 찌르기로 별을 그림",
    en: "Combo: two swords slash the front twice at once → spinning double slash all around → invulnerable thrust through the nearest enemy to the edge of your range (hits everything on the way) · Every 5th combo in a row draws a star of thrusts",
    ja: "コンボ：二本の剣で前を同時に2回斬る → 一回転して2回斬る → 無敵で近くの敵を貫き攻撃範囲の端まで突く（通り道すべてにダメージ） · 5連続コンボごとに突きで星を描く",
  },
  mma: {
    ko: "5단 콤보: 느린 찌르기 → 빠른 좌우 연타 → 적 앞까지 무적 돌진해 붙잡기 → 내리꽂기 (범위) → 넓게 밀치는 킥",
    en: "5-step combo: slow thrust → fast left-right → invulnerable dash up to an enemy and grab → slam (area) → wide pushing kick",
    ja: "5段コンボ：遅い突き → 速い左右連打 → 敵の前まで無敵の突進でつかむ → 叩きつけ（範囲） → 広く押し出す蹴り",
  },
  karate: {
    ko: "콤보: 빨아들이고 3초 버티기 (받는 피해 절반) → 받은 피해 ×3 범위 일격·기절 → 체력 20% 이하 적을 돌진해 쓰러뜨림 (보스는 3배 피해), 입힌 피해의 30% 회복",
    en: "Combo: pull in and brace for 3s (half damage taken) → area strike of 3x damage taken plus stun → dash through enemies at 20% health or less to finish them (3x damage to bosses), healing 30% of the damage dealt",
    ja: "コンボ：引き寄せて3秒耐える（被ダメージ半分） → 受けたダメージ×3の範囲一撃・気絶 → 体力20%以下の敵へ突進して倒す（ボスは3倍ダメージ）、与えたダメージの30%回復",
  },
  taekkyon: {
    ko: "4단 콤보를 아주 빠르게: 좌·우·앞 3연타 → 강하게 밀치는 찌르기 → 무적 돌진 넓은 범위 (기절) → 내려찍기",
    en: "Very fast 4-step combo: left, right, front → strong pushing thrust → invulnerable dash wide area (stun) → stomp",
    ja: "とても速い4段コンボ：左・右・前の3連打 → 強く押し出す突き → 無敵の突進で広い範囲（気絶） → 踏みつけ",
  },
  energy: {
    ko: "파동탄 4단 콤보: 1발 → 부채꼴 3발 → 부채꼴 5발 → 기를 모아 사방으로 30발 난사",
    en: "4-step energy shot combo: 1 shot → 3 in a fan → 5 in a fan → gather energy and spray 30 shots in every direction",
    ja: "波動弾の4段コンボ：1発 → 扇状に3発 → 扇状に5発 → 気を溜めて四方に30発乱射",
  },
};

export const BRAWLER_PASSIVE_NAMES: Record<BrawlPassive & PassiveId, Names> = {
  balance: { ko: "공방일체", en: "Offense Is Defense", ja: "攻防一体" },
  zone: { ko: "존", en: "In the Zone", ja: "ゾーン" },
  ironBody: { ko: "금강불괴", en: "Diamond Body", ja: "金剛不壊" },
  speedIsPower: { ko: "속도는 곧 힘", en: "Speed Is Power", ja: "速さは力" },
  mach: { ko: "마하", en: "Mach", ja: "マッハ" },
  strongman: { ko: "차력쇼", en: "Strongman Show", ja: "怪力ショー" },
  drunkenFist: { ko: "취권", en: "Drunken Fist", ja: "酔拳" },
  intimidate: { ko: "위압", en: "Intimidate", ja: "威圧" },
  bloodDemon: { ko: "혈마", en: "Blood Demon", ja: "血魔" },
  knockout: { ko: "K.O", en: "K.O.", ja: "K.O" },
};

export const BRAWLER_EFFECTS: Record<BrawlPassive & PassiveId, Names> = {
  balance: { ko: "공격력 +10%, 최대 체력 +10%", en: "Damage +10%, max health +10%", ja: "攻撃力+10%、最大体力+10%" },
  zone: { ko: "공격마다 15% 확률로 남은 콤보를 아주 빠르게 이어 감", en: "15% chance per attack to rush through the rest of the combo", ja: "攻撃ごとに15%の確率で残りのコンボをとても速くつなぐ" },
  ironBody: { ko: "공격마다 15% 확률로 3초 무적", en: "15% chance per attack to become invulnerable for 3s", ja: "攻撃ごとに15%の確率で3秒無敵" },
  speedIsPower: { ko: "콤보를 이어 갈 때마다 이동 속도 +8% (최대 +40%, 콤보가 끊기면 처음으로)", en: "Move speed +8% per chained move (up to +40%, resets when the combo breaks)", ja: "コンボをつなぐたびに移動速度+8%（最大+40%、コンボが切れると元に戻る）" },
  mach: { ko: "콤보 첫 기술을 바로 끝내고 두 번째 기술부터", en: "Instantly finish the first move of a combo and start from the second", ja: "コンボの最初の技をすぐ終えて2番目の技から" },
  strongman: { ko: "콤보를 끝까지 3번 이으면 5초 동안 공격력 +5, 보호막 20", en: "Finish 3 full combos in a row: damage +5 and a 20 shield for 5s", ja: "コンボを最後まで3回続けると5秒間攻撃力+5、シールド20" },
  drunkenFist: { ko: "최대 체력 -30, 공격력 +7", en: "Max health -30, damage +7", ja: "最大体力-30、攻撃力+7" },
  intimidate: { ko: "맞힐 때마다 30% 확률로 적이 1.5초 동안 도망감 (보스 제외)", en: "Each hit has a 30% chance to make the enemy flee for 1.5s (not bosses)", ja: "当てるたびに30%の確率で敵が1.5秒逃げる（ボス除く）" },
  bloodDemon: { ko: "체력이 적을수록 기술 피해 증가 (최대 +100%)", en: "The lower your health, the more your moves deal (up to +100%)", ja: "体力が少ないほど技のダメージ増加（最大+100%）" },
  knockout: { ko: "맞힐 때마다 5% 확률로 적이 10초 기절 (보스는 1초)", en: "Each hit has a 5% chance to stun the enemy for 10s (1s for bosses)", ja: "当てるたびに5%の確率で敵が10秒気絶（ボスは1秒）" },
};
