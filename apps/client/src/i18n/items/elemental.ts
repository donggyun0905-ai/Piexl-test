// 원소술사 글자 (한·영·일): 무기 이름 · 회전체 무기 설명 · 전용 아이템 이름·효과 (수치는 sim/orbit·orbitAttack·orbitPerks의 상수와 맞춤)
import type { OrbitKind, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type ElemWeapon = "elemorb" | "lightorb" | "galaxy" | "planets" | "bladelord" | "gravity" | "godhand" | "meteors" | "steelorb" | "trigger";
type ElemPassive = "perfectCircle" | "cleanFreak" | "genesis" | "electronic" | "luckyDeflect" | "pet" | "bigger" | "beautiful" | "flashy" | "steadfast";

export const ELEMENTAL_WEAPON_NAMES: Record<ElemWeapon & WeaponId, Names> = {
  elemorb: { ko: "원소구슬", en: "Elemental Orbs", ja: "元素の珠" },
  lightorb: { ko: "빛 구슬", en: "Light Orbs", ja: "光の珠" },
  galaxy: { ko: "은하수", en: "Milky Way", ja: "天の川" },
  planets: { ko: "행성", en: "Planets", ja: "惑星" },
  bladelord: { ko: "웨폰 마스터", en: "Blade Lord", ja: "ウェポンマスター" },
  gravity: { ko: "중력", en: "Gravity", ja: "重力" },
  godhand: { ko: "갓 핸드", en: "Giant Hand", ja: "ゴッドハンド" },
  meteors: { ko: "별똥별", en: "Shooting Stars", ja: "流れ星" },
  steelorb: { ko: "강철 구슬", en: "Steel Orbs", ja: "鋼の珠" },
  trigger: { ko: "트리거", en: "Trigger", ja: "トリガー" },
};

export const ORBIT_DESC: Record<OrbitKind, Names> = {
  elements: {
    ko: "구슬 5개가 돌며 닿은 적을 때림: 불(화상) · 물(둔화) · 땅(밀침+기절) · 번개(감전) · 풀(주변 넓게 독)",
    en: "5 orbs circle you and hit what they touch: fire (burn) · water (slow) · earth (push + stun) · lightning (shock) · grass (wide poison)",
    ja: "5つの珠が回り触れた敵を打つ：火（燃える）· 水（遅くする）· 土（押す＋気絶）· 雷（感電）· 草（周りを広く毒に）",
  },
  light: { ko: "가까이에서 빠르게 도는 구슬 4개, 맞은 적은 0.5초 경직 · 30% 확률로 빛이 터져 둘레에도 피해", en: "4 orbs spin fast close to you; hit enemies are stunned for 0.5s · 30% chance to burst with light, hitting foes around", ja: "近くを速く回る珠4つ、当たった敵は0.5秒硬直 · 30%で光が弾けて周りにもダメージ" },
  galaxy: { ko: "도는 구슬 없이 몸 둘레 넓은 장판이 따라다니며 안의 적 모두에게 피해, 10% 확률로 불탐 · 안에 머문 적은 스택이 쌓여 100이 되면 빅뱅 (공격력 1000%, 둘레 범위)", en: "No orbs: a wide field follows you and damages everything inside, 10% chance to burn · foes that stay inside build stacks; at 100 a Big Bang erupts (1000% damage, area)", ja: "回転体なし、体の周りの広い場が付いて回り中の敵全員にダメージ、10%で燃える · 中に留まった敵はスタックが溜まり100でビッグバン（攻撃力1000%、周囲範囲）" },
  planets: {
    ko: "느리게 도는 강한 행성 8개: 빙결 · 범위+감전 · 밀치기+둔화 · 불 · 흡혈+독 · 둔화 · 공격 늦추기+서리 · 보호막+광휘",
    en: "8 slow, heavy planets: freeze · splash + shock · push + slow · burn · drain + poison · slow · delay attacks + frost · shield + radiance",
    ja: "ゆっくり回る強い惑星8つ：凍結 · 範囲＋感電 · 押し出し＋鈍化 · 炎 · 吸血＋毒 · 鈍化 · 攻撃を遅らせる＋霜 · シールド＋光輝",
  },
  blades: {
    ko: "진짜 검 5자루, 칼끝이 늘 적을 향함: 불·물·번개 검 셋은 휘어지며 날아가 적을 쫓아 벰 (불 세게 3번 · 물 계속 따라다님 · 번개 빠르게 5번, 치명타 15%) · 땅·풀 검 둘은 몸 둘레를 돌며 적 탄을 막고 붙은 적을 벰 · 검마다 원소 상태이상",
    en: "5 real swords, tips always turned toward foes: the fire, water and lightning swords curve out to chase and slash (fire 3 hard hits · water keeps chasing · lightning 5 fast hits, 15% crit) · the earth and grass swords circle you, block enemy shots and cut foes that close in · each sword applies its element's status",
    ja: "本物の剣5本、切っ先は常に敵を向く：火・水・雷の3本は弧を描いて飛び敵を追って斬る（火は強く3回 · 水は追い続ける · 雷は速く5回、クリティカル15%）· 土・草の2本は体の周りを回り敵の弾を防ぎ近づいた敵を斬る · 剣ごとに元素の状態異常",
  },
  gravity: {
    ko: "사거리 안 적과 적 탄이 느려짐 · 공격하면 사거리 안 적을 모두 띄워 내려찍음 (기절) · 공격 속도 매우 느림 · 내려찍은 자리에 두 번째 중력이 생겨 잠시 뒤 한 번 더 (70%)",
    en: "Enemies and enemy shots in range are slowed · Attacking lifts and slams every enemy in range (stun) · Very slow attacks · a second gravity forms on the same spot and slams again shortly after (70%)",
    ja: "射程内の敵と敵の弾が遅くなる · 攻撃で射程内の敵を全て浮かせて叩きつける（気絶） · 攻撃速度がとても遅い · 叩きつけた場所に2つ目の重力が生まれ、少し後にもう一度（70%）",
  },
  hand: {
    ko: "가까운 적을 잡아 들었다가 다른 적에게 내려찍음 (범위) · 보스 앞에서는 돌멩이를 들고 피해 2배",
    en: "Grabs a nearby enemy and slams it onto another (area) · Against bosses it grabs a rock for 2x damage",
    ja: "近くの敵をつかみ上げ、別の敵へ叩きつける（範囲） · ボス戦では石をつかみダメージ2倍",
  },
  stars: {
    ko: "세 겹의 별: 제자리에서 도는 안쪽 3개 · 넓게 퍼졌다 돌아오는 가운데 4개 · 각자 적에게 날아갔다 돌아오는 바깥 5개 · 별마다 공격력만큼 때림",
    en: "Three rings of stars: inner 3 circling in place · middle 4 that spread wide and return · outer 5 that each fly at enemies and return · Each star hits for your full damage",
    ja: "三重の星：その場で回る内側3つ · 大きく広がって戻る中間4つ · それぞれ敵へ飛んで戻る外側5つ · 星ごとに攻撃力分のダメージ",
  },
  steel: { ko: "구슬 5개가 적 탄을 막음 · 공격하면 강철 총알을 쏨", en: "5 orbs block enemy shots · Attacking fires steel bullets", ja: "珠5つが敵の弾を防ぐ · 攻撃すると鋼の弾を撃つ" },
  trigger: {
    ko: "공격하면 구슬이 아주 빠르게 날아감 (3명 관통), 다 쓰면 2초 재장전 (구슬이 빨리 돌수록 그만큼 빨리 참) · 쏠 때 50% 확률로 +1 (최대 15) · 15개면 한 번에 모두 2배 피해 · 치명타 20%, 기본보다 더 채워진 구슬마다 +5%",
    en: "Attacking launches an orb very fast (pierces 3); reload 2s when empty (faster the faster the orbs spin) · 50% chance of +1 per shot (max 15) · At 15, all fire at once for 2x · 20% crit, +5% per orb loaded beyond the base",
    ja: "攻撃で珠がとても速く飛ぶ（3体貫通）、使い切ると2秒リロード（珠が速く回るほど速くたまる） · 撃つたび50%で+1（最大15） · 15個なら一度に全て2倍ダメージ · クリティカル20%、基本より多く込めた珠ごとに+5%",
  },
};

export const ELEMENTAL_PASSIVE_NAMES: Record<ElemPassive & PassiveId, Names> = {
  perfectCircle: { ko: "완벽한 원형", en: "Perfect Circle", ja: "完璧な円" },
  cleanFreak: { ko: "결벽증", en: "Neat Freak", ja: "潔癖症" },
  genesis: { ko: "천지창조", en: "Genesis", ja: "天地創造" },
  electronic: { ko: "일렉트로닉", en: "Electronic", ja: "エレクトロニック" },
  luckyDeflect: { ko: "행운", en: "Lucky Bounce", ja: "幸運" },
  pet: { ko: "펫", en: "Pet", ja: "ペット" },
  bigger: { ko: "더 크게!", en: "Bigger!", ja: "もっと大きく！" },
  beautiful: { ko: "아름답게!", en: "Beautiful!", ja: "美しく！" },
  flashy: { ko: "화려하게!", en: "Flashy!", ja: "華やかに！" },
  steadfast: { ko: "굳건하게!", en: "Steadfast!", ja: "揺るぎなく！" },
};

export const ELEMENTAL_EFFECTS: Record<ElemPassive & PassiveId, Names> = {
  perfectCircle: { ko: "공격력 +3, 이동 속도 -0.1", en: "Damage +3, move speed -0.1", ja: "攻撃力+3、移動速度-0.1" },
  cleanFreak: { ko: "맞으면 3초 동안 이동 속도 +30%, 회전 2.5배 빠르게", en: "When hit: move speed +30% and orbs spin 2.5x faster for 3s", ja: "被弾すると3秒間移動速度+30%、回転2.5倍速" },
  genesis: { ko: "회전체 +1 (여러 개 가질 수 있음)", en: "+1 orb (stacks)", ja: "回転体+1（重ねて持てる）" },
  electronic: { ko: "이웃한 회전체 사이에 전깃줄, 닿아 있는 동안 0.15초마다 피해 (초당 공격력의 30%)", en: "Wires link neighboring orbs and damage touching enemies every 0.15s (30% of your damage per second)", ja: "隣り合う回転体を電線でつなぎ、触れている間0.15秒ごとにダメージ（毎秒攻撃力の30%）" },
  luckyDeflect: { ko: "적 탄이 회전체에 닿으면 30% 확률로 튕겨 나가 적을 맞힘", en: "Enemy shots touching your orbs have a 30% chance to bounce back at enemies", ja: "敵の弾が回転体に触れると30%の確率で跳ね返り敵に当たる" },
  pet: { ko: "새빨간 회전체 하나가 1초마다 가까운 적에게 유도탄 (공격력 50%)", en: "A crimson orb fires a homing shot at a nearby enemy every 1s (50% damage)", ja: "真っ赤な回転体が1秒ごとに近くの敵へ追尾弾（攻撃力50%）" },
  bigger: { ko: "사거리(도는 반경) +10", en: "Range (orbit radius) +10", ja: "射程（回る半径）+10" },
  beautiful: { ko: "회전 속도 +30%, 공격 속도 +15%", en: "Spin speed +30%, attack speed +15%", ja: "回転速度+30%、攻撃速度+15%" },
  flashy: { ko: "때릴 때마다 15% 확률로 원소(불·물·풀·땅·번개) 효과 하나 더", en: "Each hit has a 15% chance to add an extra element (fire, water, grass, earth, lightning)", ja: "攻撃ごとに15%の確率で元素（火・水・草・土・雷）の効果をもう1つ" },
  steadfast: { ko: "최대 체력 +80", en: "Max health +80", ja: "最大体力+80" },
};
