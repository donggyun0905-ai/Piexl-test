// 의사 글자: 무기·패시브 이름, 패시브 효과, 무기 공격 방식 설명 (수치는 sim/medicWeapons·medicGear·heal의 상수와 맞춤)
import type { MedicGear } from "@pixel-rogue/shared";
import type { Names } from "./names";

export const DOCTOR_WEAPON_NAMES = {
  syringe: { ko: "주사기 발사기", en: "Syringe Launcher", ja: "注射器ランチャー" },
  scalpel: { ko: "수술용 메스", en: "Scalpel", ja: "手術用メス" },
  transfusion: { ko: "수혈 튜브", en: "Transfusion Tube", ja: "輸血チューブ" },
  defibrillator: { ko: "제세동기", en: "Defibrillator", ja: "除細動器" },
  sutureneedle: { ko: "봉합 바늘", en: "Suture Needle", ja: "縫合針" },
  gascanister: { ko: "마취 가스통", en: "Anesthetic Canister", ja: "麻酔ガス缶" },
  ivpole: { ko: "링거 폴대", en: "IV Pole", ja: "点滴スタンド" },
  pillshot: { ko: "알약 산탄", en: "Pill Scatter", ja: "錠剤散弾" },
  medkitbomb: { ko: "구급 키트 폭탄", en: "Medkit Bomb", ja: "救急キット爆弾" },
  bandagewhip: { ko: "붕대 채찍", en: "Bandage Whip", ja: "包帯ムチ" },
  ambulance: { ko: "구급차 호출", en: "Call Ambulance", ja: "救急車呼び出し" },
} satisfies Record<string, Names>;

export const DOCTOR_PASSIVE_NAMES = {
  woundSuture: { ko: "상처 봉합", en: "Wound Stitching", ja: "傷の縫合" },
  healthCare: { ko: "체력 관리", en: "Health Care", ja: "体調管理" },
  robust: { ko: "건강 체질", en: "Robust Body", ja: "健康体質" },
  firstAid: { ko: "응급 처치", en: "First Aid", ja: "応急処置" },
  checkup: { ko: "건강 검진", en: "Checkup", ja: "健康診断" },
  overtreat: { ko: "과잉 진료", en: "Overtreatment", ja: "過剰診療" },
  prescription: { ko: "처방전", en: "Prescription", ja: "処方箋" },
  doctorGown: { ko: "의사 가운", en: "Doctor's Coat", ja: "白衣" },
  surgery: { ko: "수술 집도", en: "Lead Surgeon", ja: "執刀" },
  antibody: { ko: "항체 반응", en: "Antibody Response", ja: "抗体反応" },
} satisfies Record<string, Names>;

export const DOCTOR_EFFECT_DESC = {
  woundSuture: { ko: "공격 회복률 4% → 9%", en: "Attack healing 4% → 9%", ja: "攻撃回復率 4% → 9%" },
  healthCare: { ko: "보호막 최대치 최대 체력의 35% → 60%", en: "Shield cap 35% → 60% of max health", ja: "シールド上限 最大体力の35% → 60%" },
  robust: { ko: "보호막이 있는 동안 피해 +20%", en: "+20% damage while you have a shield", ja: "シールドがある間ダメージ+20%" },
  firstAid: { ko: "처치하면 체력 3 회복 (초당 회복 상한에 포함)", en: "Heal 3 per kill (counts toward the per-second heal cap)", ja: "撃破すると体力3回復（毎秒の回復上限に含む）" },
  checkup: { ko: "체력이 가득 찬 채로 3초 지나면 다음 공격 피해 3배", en: "After 3s at full health, your next attack deals triple damage", ja: "体力満タンのまま3秒経つと次の攻撃が3倍ダメージ" },
  overtreat: { ko: "보호막이 최대일 때 공격 속도 +25%", en: "+25% attack speed while your shield is full", ja: "シールドが最大のとき攻撃速度+25%" },
  prescription: { ko: "포션·회복 아이템 회복량 +50%", en: "+50% healing from potions and healing items", ja: "ポーション・回復アイテムの回復量+50%" },
  doctorGown: { ko: "받는 피해 -15%, 맞은 뒤 1초간 이동 속도 +25%", en: "-15% damage taken; +25% move speed for 1s after being hit", ja: "被ダメージ-15%、被弾後1秒間移動速度+25%" },
  surgery: {
    ko: "근접·장판·폭발 범위 +25% (주사기·바늘·알약 사거리, 구급차 너비 +20%)",
    en: "+25% melee, field and blast size (+20% syringe, needle and pill range and ambulance width)",
    ja: "近接・フィールド・爆発の範囲+25%（注射器・針・錠剤の射程、救急車の幅+20%）",
  },
  antibody: {
    ko: "보호막이 막은 피해의 200%를 주변 적에게 돌려줌 (0.3초에 한 번, 그 사이 막은 양은 모아서)",
    en: "Return 200% of damage your shield blocks to nearby enemies (once per 0.3s, stored in between)",
    ja: "シールドが防いだダメージの200%を周りの敵に返す（0.3秒に1回、その間に防いだ分はまとめて）",
  },
} satisfies Record<string, Names>;

export const MEDIC_DESC: Record<MedicGear, Names> = {
  syringe: { ko: "주사기를 빠르게 쏨, 첫 적에서 멈춤", en: "Rapid syringes that stop at the first enemy", ja: "注射器を素早く撃つ、最初の敵で止まる" },
  scalpel: { ko: "앞쪽 짧은 부채꼴 빠른 베기, 회복 3배", en: "Fast short slashes in front, triple healing", ja: "前方の短い扇形を素早く斬る、回復3倍" },
  transfusion: { ko: "적 1명에게 튜브를 꽂아 계속 피해, 회복 4배 (초당 상한 4)", en: "Plug a tube into one enemy for steady damage, quadruple healing (cap 4/s)", ja: "敵1体にチューブを刺して継続ダメージ、回復4倍（毎秒上限4）" },
  defib: { ko: "1.1초마다 앞쪽 짧은 범위 전기 충격, 1초 기절 (보스 0.33초)", en: "Every 1.1s, a short shock in front that stuns for 1s (bosses 0.33s)", ja: "1.1秒ごとに前方の短い範囲へ電気ショック、1秒気絶（ボス0.33秒）" },
  suture: {
    ko: "0.6초마다 바늘을 꽂음 (최대 5개). 꽂힌 적끼리 실로 이어져 실에 닿은 적은 초당 80% 피해, 3초 뒤 봉합으로 가운데로 끌려 모이고 각각 150% 피해",
    en: "Every 0.6s, stick a needle in an enemy (up to 5). Threads link them and hurt enemies they touch (80%/s); after 3s they are sewn together toward the middle (150% each)",
    ja: "0.6秒ごとに針を刺す（最大5本）。刺さった敵同士が糸でつながり触れた敵に毎秒80%、3秒後に縫合で中央へ引き寄せ各150%",
  },
  gas: { ko: "1.8초마다 조준한 곳에 투척, 4초 장판 (초당 80%), 안의 적 이동 속도 -40%", en: "Every 1.8s, throw to your aim: a 4s cloud (80%/s) that slows enemies by 40%", ja: "1.8秒ごとに狙った場所へ投げる、4秒のフィールド（毎秒80%）、中の敵の移動速度-40%" },
  ivpole: { ko: "0.8초마다 한 바퀴 휘둘러 크게 밀어냄", en: "Every 0.8s, a full spin that knocks enemies far back", ja: "0.8秒ごとに一回転して大きく吹き飛ばす" },
  pills: { ko: "0.6초마다 앞쪽 부채꼴로 알약 7개 (한 알 25%), 붙을수록 많이 맞음", en: "Every 0.6s, 7 pills in a fan (25% each); more hit up close", ja: "0.6秒ごとに前方へ錠剤7個（1個25%）、近いほど多く当たる" },
  medkit: { ko: "1.6초마다 조준한 곳에 투척해 폭발 (120%), 쓰러진 적은 40% 확률로 회복 알약 (회복 6)", en: "Every 1.6s, throw to your aim and explode (120%); kills drop a healing pill 40% of the time (heals 6)", ja: "1.6秒ごとに狙った場所へ投げて爆発（120%）、倒した敵は40%で回復錠剤（回復6）" },
  whip: { ko: "1.2초마다 앞으로 곧게 휘둘러 맞은 적 1.5초 속박 (보스 0.4초)", en: "Every 1.2s, a straight lash that roots enemies for 1.5s (bosses 0.4s)", ja: "1.2秒ごとに前へまっすぐ振り、当たった敵を1.5秒拘束（ボス0.4秒）" },
  ambulance: {
    ko: "2초마다 조준 방향 화면 밖에서 구급차가 곧게 달려와 경로의 적을 치고 옆으로 밀어냄 (벽 통과). 보호막이 6 이상이면 6을 써서 왕복",
    en: "Every 2s, an ambulance charges in from off-screen along your aim, hitting and shoving enemies aside (ignores walls). With 6+ shield, spends 6 for a round trip",
    ja: "2秒ごとに狙った方向の画面外から救急車がまっすぐ走ってきて経路の敵をはね、横へ押しのける（壁を無視）。シールド6以上なら6使って往復",
  },
};
