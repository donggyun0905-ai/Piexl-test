import type { LaserGear } from "@pixel-rogue/shared";
import type { Names } from "./names";

/** 기계공학자 무기의 공격 방식 설명 (수치는 sim/laserWeapons·laserGear의 상수와 맞춤) */
export const GEAR_DESC: Record<LaserGear, Names> = {
  turret: {
    ko: "1.8초마다 조준한 곳으로 소형 포탑을 던져 설치, 포탑이 스스로 가까운 적에게 레이저를 쏨 (한 기당 45%, 최대 3기, 6초 뒤 사라짐) · 본체는 쏘지 않음",
    en: "Every 1.8s, throw a small turret where you aim; they laser nearby enemies on their own (45% each, up to 3, last 6s) · You don't fire yourself",
    ja: "1.8秒ごとに狙った場所へ小型砲台を投げて設置、砲台が近くの敵へ自動でレーザー（1基45%、最大3基、6秒で消える） · 本体は撃たない",
  },
  drone: {
    ko: "드론 3기가 각자 다른 적에게 레이저를 쏨 (한 기당 40%, 적이 하나면 셋이 모두 그 적에게)",
    en: "3 drones each laser a different enemy (40% each; all three focus a lone enemy)",
    ja: "ドローン3機がそれぞれ別の敵にレーザー（1機40%、敵が1体なら3機ともその敵に）",
  },
  focus: { ko: "한 대상만 맞히는 강한 레이저 (대상 수 증가·관통·렌즈의 같이 맞히기 효과 없음)", en: "A strong single-target laser (no extra targets, piercing or lens spread)", ja: "対象1体のみの強力なレーザー（対象数増加・貫通・レンズの同時ヒットは無効）" },
  cutter: { ko: "앞쪽 부채꼴 화염으로 안의 적 모두 맞힘, 열이 두 배로 쌓임 · 사거리 매우 짧음", en: "Short cone of flame hitting everything in it, heat builds twice as fast · Very short range", ja: "前方の扇形の炎で中の敵全員に当たり、熱が2倍たまる · 射程がとても短い" },
  tesla: { ko: "조준한 적에게 번개, 가까운 적으로 건너감 (최대 5명, 건너간 번개 45%) · 틱 피해 낮음", en: "Lightning hits your target and chains to nearby enemies (up to 5, chained hits 45%) · Lower tick damage", ja: "狙った敵に稲妻、近くの敵へ連鎖（最大5体、連鎖は45%） · ティックダメージ低め" },
  magnet: {
    ko: "누르고 있으면 주변 적을 끌어당기며 둔화, 2.25초 모이면 자력 펄스로 한꺼번에 피해·밀어내기 · 이동 속도 -10%",
    en: "Hold to pull in and slow nearby enemies; after 2.25s a magnetic pulse damages and blasts them all away · Move speed -10%",
    ja: "押し続けると周りの敵を引き寄せて鈍化、2.25秒たまると磁力パルスでまとめてダメージ・吹き飛ばし · 移動速度-10%",
  },
  hammer: { ko: "1.2초마다 주변을 내려찍어 밀어내고 1초 기절, 기절한 적은 받는 피해 +40% · 사거리 짧음", en: "Every 1.2s, slam the ground to knock back and stun nearby enemies for 1s; stunned enemies take +40% damage · Short reach", ja: "1.2秒ごとに周りを叩きつけて吹き飛ばし1秒気絶、気絶した敵は被ダメージ+40% · 射程が短い" },
  reactor: { ko: "4초 쏘면 5초 동안 피해 2배·굵기 최대 · 그 뒤 2초 동안 과열로 못 쏨", en: "4s of firing grants 5s of double damage and max thickness · Then overheats for 2s and can't fire", ja: "4秒照射すると5秒間ダメージ2倍・太さ最大 · その後2秒間オーバーヒートで撃てない" },
  mines: {
    ko: "0.75초마다 조준한 곳으로 지뢰를 던짐 (최대 6개). 떨어진 뒤 잠깐 있다 준비되고, 적이 닿으면 터짐(120%). 넘치면 가장 오래된 지뢰가 더 넓게 터짐",
    en: "Every 0.75s, lob a mine where you aim (up to 6). It arms shortly after landing and blows up on contact (120%); extras set off the oldest in a wider blast",
    ja: "0.75秒ごとに狙った場所へ地雷を投げる（最大6個）。着地して少しすると準備完了、敵が触れると爆発（120%）。あふれると一番古い地雷がより広く爆発",
  },
  orbital: { ko: "1.5초마다 조준한 곳에 표시, 0.5초 뒤 큰 레이저가 떨어짐 (범위 피해 115%) · 공격 속도 증가는 간격에 절반만 적용", en: "Every 1.5s, mark where you aim; a huge laser strikes 0.5s later (115% area damage) · Attack speed only half shortens the interval", ja: "1.5秒ごとに狙った場所へ印、0.5秒後に巨大レーザーが落ちる（範囲115%） · 攻撃速度アップは間隔に半分だけ適用" },
};
