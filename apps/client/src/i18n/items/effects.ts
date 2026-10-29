import type { PassiveId } from "@pixel-rogue/shared";
import { CLASS_EFFECTS } from "./classEffects";
import type { Names } from "./names";
import { DOCTOR_EFFECT_DESC } from "./doctor";
import { ORIGIN_EFFECT_DESC } from "./origin";
import { HIDDEN_DESC } from "./hidden";
import { HIDDEN2_DESC } from "./hidden2";

/** 공격 방식을 바꾸는 패시브 설명. {값 이름:모양}은 PERKS의 지금 수치로 채움 (관리자 페이지에서 바뀔 수 있음, items/index.ts) */
export const EFFECT_DESC: Partial<Record<PassiveId, Names>> = {
  ...DOCTOR_EFFECT_DESC,
  ...ORIGIN_EFFECT_DESC,
  ...HIDDEN_DESC,
  ...HIDDEN2_DESC,
  secondWind: { ko: "쓰러질 때 한 번, 체력 {hp:pct}%로 되살아남 (쓰면 사라짐)", en: "Once, when you would die, revive with {hp:pct}% health (used up)", ja: "倒れる時に1度だけ体力{hp:pct}%で復活（使うと消える）" },
  regenCharm: { ko: "방을 정리할 때마다 최대 체력의 {heal:pct}% 회복", en: "Heal {heal:pct}% of max health each time you clear a room", ja: "部屋を片付けるたびに最大体力の{heal:pct}%回復" },
  goldPouch: { ko: "얻는 돈 +{gold:up}%", en: "+{gold:up}% gold gained", ja: "獲得ゴールド+{gold:up}%" },
  dashCloak: { ko: "대시 대기 시간 {cooldown:down}% 감소", en: "Dash cooldown reduced by {cooldown:down}%", ja: "ダッシュのクールダウン{cooldown:down}%短縮" },
  goddessBlessing: {
    ko: "대시 대기 시간 50% 감소 · 이동 속도 +0.3 · 쓰러질 때 한 번 체력 50%로 되살아남",
    en: "Dash cooldown -50% · Move speed +0.3 · Once, when you would die, revive with 50% health",
    ja: "ダッシュのクールダウン50%短縮 · 移動速度+0.3 · 倒れる時に1度だけ体力50%で復活",
  },
  ricochet: { ko: "내 화살이 벽에 맞으면 튕겨 나옴 (최대 {bounces}번)", en: "Your shots bounce off walls (up to {bounces} times)", ja: "矢が壁に当たると跳ね返る（最大{bounces}回）" },
  splitHead: {
    ko: "화살이 적에게 맞으면 양옆 대각선으로 두 갈래로 갈라짐 (피해 {damage:pct}%)",
    en: "Shots that hit an enemy split into two diagonal shots ({damage:pct}% damage)",
    ja: "矢が敵に当たると斜め2方向に裂ける（{damage:pct}%のダメージ）",
  },
  seekerFeather: { ko: "화살이 가까운 적 쪽으로 휘어짐", en: "Shots curve toward the nearest enemy", ja: "矢が近くの敵の方へ曲がる" },
  backQuiver: { ko: "공격할 때 뒤쪽으로도 한 발 (피해 {damage:pct}%)", en: "Also fire one shot backward ({damage:pct}% damage)", ja: "攻撃時に後ろにも1発（ダメージ{damage:pct}%）" },
  returnFletch: { ko: "빗나간 화살이 사거리 끝에서 한 번 되돌아옴", en: "Missed shots turn around once at max range", ja: "外れた矢が射程の端で一度戻ってくる" },
  huntFrenzy: {
    ko: "처치 후 {ticks:sec}초 안에 또 처치하면 공격 속도 +{speed:pct}%씩 (최대 {stacks}번)",
    en: "Kill again within {ticks:sec}s: attack speed +{speed:pct}% each (up to {stacks} stacks)",
    ja: "撃破後{ticks:sec}秒以内にまた撃破すると攻撃速度+{speed:pct}%ずつ（最大{stacks}回）",
  },
  steadyBreath: { ko: "0.5초 이상 가만히 서 있으면 공격력 +{damage:up}%", en: "Standing still for 0.5s+: damage +{damage:up}%", ja: "0.5秒以上じっとしていると攻撃力+{damage:up}%" },
  volleyCharm: { ko: "{every}번째 공격마다 발 수 +2 (부채꼴)", en: "Every {every:nth} attack fires 2 extra shots in a fan", ja: "{every}回目の攻撃ごとに弾数+2（扇状）" },
  spinCleave: { ko: "{every}번째 공격마다 한 바퀴 휘두름", en: "Every {every:nth} attack is a full spin", ja: "{every}回目の攻撃ごとに全周攻撃" },
  waveSlash: {
    ko: "휘두를 때마다 앞으로 검기를 날림 ({damage:pct}% 피해, {pierce}명 관통)",
    en: "Each swing sends a blade wave forward ({damage:pct}% damage, pierces {pierce})",
    ja: "振るたびに前方へ剣気を飛ばす（{damage:pct}%ダメージ、{pierce}体貫通）",
  },
  executioner: { ko: "체력 {below:pct}% 이하 적에게 피해 {damage}배", en: "{damage}x damage to enemies at {below:pct}% HP or less", ja: "体力{below:pct}%以下の敵に{damage}倍ダメージ" },
  lifeLeech: { ko: "처치하면 최대 체력의 {heal:pct}% 회복", en: "Kills restore {heal:pct}% of max HP", ja: "撃破で最大体力の{heal:pct}%回復" },
  rage: { ko: "체력이 낮을수록 공격력 증가 (최대 +{damage:pct}%)", en: "Lower HP means more damage (up to +{damage:pct}%)", ja: "体力が低いほど攻撃力アップ（最大+{damage:pct}%）" },
  dashSlash: { ko: "대시로 지나간 적에게 공격력 {damage}배 피해", en: "Dashing through enemies deals {damage}x damage", ja: "ダッシュで通り抜けた敵に{damage}倍ダメージ" },
  earthshaker: {
    ko: "대시가 끝나면 주변에 충격파 (공격력만큼 피해)",
    en: "A shockwave hits nearby enemies when a dash ends",
    ja: "ダッシュ終了時に周囲へ衝撃波（攻撃力分のダメージ）",
  },
  lastStand: { ko: "체력 {below:pct}% 이하면 맞은 뒤 무적 시간 {invuln}배", en: "At {below:pct}% HP or less, invulnerability after a hit lasts {invuln}x as long", ja: "体力{below:pct}%以下だと被弾後の無敵時間が{invuln}倍" },
  bulwarkStance: { ko: "0.5초 이상 가만히 서 있으면 받는 피해 {taken:pct}%", en: "Standing still for 0.5s+ cuts damage taken to {taken:pct}%", ja: "0.5秒以上じっとしていると被ダメージ{taken:pct}%" },
  chainBurst: { ko: "적이 쓰러진 자리에서 작은 폭발 (공격력 {damage:pct}%)", en: "Fallen enemies explode ({damage:pct}% damage)", ja: "倒れた敵の場所で小爆発（攻撃力{damage:pct}%）" },
  wideBlast: { ko: "폭발 범위 +{blast:up}%, 주변 피해 {splash:pct}%", en: "Blast radius +{blast:up}%, splash damage {splash:pct}%", ja: "爆発範囲+{blast:up}%、周囲ダメージ{splash:pct}%" },
  arcaneShield: { ko: "방에 들어갈 때마다 {ticks:sec}초 동안 피해 없음", en: "No damage for {ticks:sec}s each time you enter a room", ja: "部屋に入るたびに{ticks:sec}秒間ダメージなし" },
  starShower: { ko: "{every}번째 공격마다 가까운 적 3명에게 폭발", en: "Every {every:nth} attack blasts the 3 nearest enemies", ja: "{every}回目の攻撃ごとに近くの敵3体を爆撃" },
  overcharge: { ko: "0.5초 이상 가만히 서 있으면 공격 속도 +{speed:up}%", en: "Standing still for 0.5s+: attack speed +{speed:up}%", ja: "0.5秒以上じっとしていると攻撃速度+{speed:up}%" },
  igniteTip: { ko: "맞은 적이 2초간 불탐 (총 공격력만큼 피해)", en: "Hit enemies burn for 2s (your damage in total)", ja: "当たった敵が2秒間燃える（合計で攻撃力分）" },
  tempestBreath: { ko: "폭발이 주변 적을 크게 밀어냄", en: "Blasts knock nearby enemies far back", ja: "爆発が周りの敵を大きく吹き飛ばす" },
  echoBolt: { ko: "폭발한 자리에서 {ticks:sec}초 뒤 한 번 더 폭발 (피해 {damage:pct}%)", en: "Blasts explode again {ticks:sec}s later ({damage:pct}% damage)", ja: "爆発した場所で{ticks:sec}秒後にもう一度爆発（{damage:pct}%のダメージ）" },
  manaDrain: { ko: "한 번의 폭발로 적 {hits}명 이상 맞히면 체력 {heal} 회복", en: "A blast hitting {hits}+ enemies restores {heal} HP", ja: "1回の爆発で{hits}体以上に当てると体力{heal}回復" },
  piercingBolt: { ko: "마법탄이 적 {pierce}명을 뚫고 지나감", en: "Bolts pierce through {pierce} enemy", ja: "魔弾が敵{pierce}体を貫通する" },
  highLens: {
    ko: "레이저 굵기 증가, 피해 +10%, 첫 대상 바로 뒤에 붙은 적도 같이 맞음. 레이저가 아닌 무기는 공격 범위 +15%",
    en: "Thicker laser, +10% damage, also hits enemies right behind the first target. Non-laser weapons get +15% attack area",
    ja: "レーザーが太くなり、ダメージ+10%、最初の対象のすぐ後ろの敵にも当たる。レーザー以外の武器は攻撃範囲+15%",
  },
  beamSplitter: {
    ko: "레이저가 가까운 다른 적 1명에게도 갈라짐 (모든 빔 피해 -10%, 대상은 최대 6명). 레이저가 아닌 무기는 공격할 때 가까운 적에게 보조 레이저 (40%)",
    en: "Your laser also splits to 1 more nearby enemy (all beams -10% damage, up to 6 targets). Non-laser weapons fire a support laser at the nearest enemy (40%)",
    ja: "レーザーが近くの別の敵1体にも分かれる（全ビームのダメージ-10%、対象は最大6体）。レーザー以外の武器は攻撃時に近くの敵へ補助レーザー（40%）",
  },
  heatBuildup: {
    ko: "공격받은 적에게 열이 쌓여 2초 분량이 차면 열폭발 (주변에 공격력 120%)",
    en: "Your attacks build heat; after 2s worth, the enemy erupts in a heat blast (120% damage around it)",
    ja: "攻撃した敵に熱がたまり、2秒分たまると熱爆発（周囲に攻撃力120%）",
  },
  focusCoil: {
    ko: "같은 적을 계속 공격하면 0.5초마다 피해 +10% (최대 +50%, 대상이 바뀌면 처음부터)",
    en: "Keep attacking one enemy: +10% damage every 0.5s (up to +50%, resets on a new target)",
    ja: "同じ敵を攻撃し続けると0.5秒ごとにダメージ+10%（最大+50%、対象が変わるとリセット）",
  },
  refractPrism: {
    ko: "레이저가 첫 대상을 뚫고 뒤쪽 적 1명을 더 맞힘 (50% 피해). 테슬라는 번개가 1명 더, 범위 공격 무기는 피해 +15%",
    en: "Your laser pierces the first target and hits 1 more behind it (50% damage). Tesla chains 1 more; area weapons deal +15% damage",
    ja: "レーザーが最初の対象を貫き、後ろの敵1体にも当たる（50%ダメージ）。テスラは稲妻が1体多く、範囲攻撃の武器はダメージ+15%",
  },
  coolingSystem: { ko: "사거리 +15%, 공격 속도 +10%", en: "Range +15%, attack speed +10%", ja: "射程+15%、攻撃速度+10%" },
  overloadBurst: { ko: "같은 적을 2초 계속 공격할 때마다 작은 폭발 (공격력 200%)", en: "Every 2s of attacking the same enemy triggers a small blast (200% damage)", ja: "同じ敵を2秒攻撃し続けるたびに小爆発（攻撃力200%）" },
  energyRecycle: {
    ko: "처치할 때마다 보호막 4 (최대 체력의 25%까지, 체력보다 먼저 깎임)",
    en: "Each kill grants a 4-point shield (up to 25% of max health, absorbs damage first)",
    ja: "撃破するたびにシールド4（最大体力の25%まで、体力より先に減る）",
  },
  armorMelt: { ko: "맞은 적은 받는 피해 +2%씩 (최대 10번, +20%)", en: "Enemies you hit take +2% damage per hit (up to 10 times, +20%)", ja: "当たった敵は被ダメージ+2%ずつ（最大10回、+20%）" },
  overclock: { ko: "체력 50% 이하일 때 피해 +20%, 레이저 굵기 증가", en: "At 50% health or less: +20% damage and a thicker laser", ja: "体力50%以下のときダメージ+20%、レーザーが太くなる" },
  chaseSteps: { ko: "처치할 때마다 대시 대기 시간 {ticks:sec}초 감소", en: "Each kill cuts the dash cooldown by {ticks:sec}s", ja: "撃破するたびにダッシュ待機時間が{ticks:sec}秒短縮" },
  resolve: { ko: "공격마다 20% 확률로 유도 부적 한 장 더 (피해 60%)", en: "20% chance per attack to fire an extra homing talisman (60% damage)", ja: "攻撃ごとに20%の確率で追尾する符をもう1枚（ダメージ60%）" },
  mindEye: { ko: "사거리 +20%, 투사체 속도 +20%", en: "Range +20%, projectile speed +20%", ja: "射程+20%、弾速+20%" },
  yinForce: { ko: "투사체 속도 -20%, 공격력 +4", en: "Projectile speed -20%, damage +4", ja: "弾速-20%、攻撃力+4" },
  yangForce: { ko: "공격 속도 +30%, 공격력 -2", en: "Attack speed +30%, damage -2", ja: "攻撃速度+30%、攻撃力-2" },
  barrier: { ko: "최대 체력 +20, 맞은 뒤 3초 동안 무적", en: "Max health +20, invulnerable for 3s after being hit", ja: "最大体力+20、被弾後3秒間無敵" },
  jadeOrb: { ko: "공격마다 구슬 한 발 더 (피해 30%, 2명 관통)", en: "Each attack also fires a bead (30% damage, pierces 2)", ja: "攻撃ごとに珠をもう1発（ダメージ30%、2体貫通）" },
  deathSeal: { ko: "부적에 맞은 일반 적이 10% 확률로 바로 쓰러짐 (보스 제외)", en: "Talisman hits have a 10% chance to instantly defeat a normal enemy (not bosses)", ja: "符が当たった通常の敵が10%の確率で即座に倒れる（ボス除く）" },
  domain: { ko: "사거리 안 적의 이동 속도 -30% (보스 제외)", en: "Enemies within your range move 30% slower (not bosses)", ja: "射程内の敵の移動速度-30%（ボス除く）" },
  lifeSiphon: { ko: "부적 추가 효과가 터질 때마다 최대 체력의 3% 회복", en: "Heal 3% of max health whenever a talisman bonus triggers", ja: "符の追加効果が発動するたびに最大体力の3%回復" },
  prajna: { ko: "공격마다 30% 확률로 부적 추가 효과가 바로 터짐", en: "30% chance per attack for the talisman bonus to trigger at once", ja: "攻撃ごとに30%の確率で符の追加効果がすぐ発動" },
  ...CLASS_EFFECTS,
};
