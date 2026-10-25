// 플라이(비르디아) 글자 (한·영·일): 발톱 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsFly·FLY_PERKS와 맞춤)
import type { PassiveId, TalonStyle, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type FlyWeapon = "glassClaw" | "twinTalon" | "windTalon" | "venomClaw" | "thunderClaw" | "frostClaw" | "bloodClaw" | "mirageClaw" | "shadowClaw" | "queenTalon";
type FlyPassive = "flyWings" | "flyAfterburn" | "flyLonger" | "flyKeen" | "flyEvade" | "flyRecharge" | "flyGust" | "flyHunt" | "flyDragonEye" | "flyFrenzy";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const FLY_WEAPON_NAMES: Record<FlyWeapon & WeaponId, Names> = {
  glassClaw: c("유리 발톱", "Glass Claw", "硝子の爪"),
  twinTalon: c("쌍발톱", "Twin Talons", "双爪"),
  windTalon: c("바람 발톱", "Wind Talon", "風の爪"),
  venomClaw: c("독 발톱", "Venom Claw", "毒の爪"),
  thunderClaw: c("번개 발톱", "Thunder Claw", "雷の爪"),
  frostClaw: c("서리 발톱", "Frost Claw", "霜の爪"),
  bloodClaw: c("피 발톱", "Blood Claw", "血の爪"),
  mirageClaw: c("신기루 발톱", "Mirage Claw", "蜃気楼の爪"),
  shadowClaw: c("그림자 발톱", "Shadow Claw", "影の爪"),
  queenTalon: c("잠자리 여왕의 발톱", "Dragonfly Queen's Talon", "蜻蛉女王の爪"),
};

/** 발톱 설명 (무기 설명 뒤에 붙음) */
export const TALON_DESC: Record<TalonStyle, Names> = {
  glass: c("겨눈 쪽으로 사거리의 두 배만큼 급습 (그동안 무적), 지나간 적을 베고 끝에서 할큄 · 20% 확률로 하늘 습격 (날아올라 사라졌다가 방 끝에서 끝까지 10번 내리그음, 한 번에 공격력 30%)", "Swoop twice your range toward your aim (invulnerable), slashing foes on the way and raking at the end · 20% chance of a Sky Raid (soar out of sight, then sweep the room edge to edge 10 times at 30% damage each)", "狙った方へ射程の2倍急襲（その間無敵）、通り道の敵を斬り最後に引っかく・20%の確率で空襲（舞い上がって消え、部屋の端から端まで10回切り裂く、1回攻撃力30%）"),
  twin: c("급습으로 지나간 적을 두 번 벰", "Swoops slash each foe twice", "急襲で通った敵を二回斬る"),
  wind: c("급습 끝에 바람 칼날 셋이 날아감", "Three wind blades fly out at the end of a swoop", "急襲の最後に風の刃が三つ飛ぶ"),
  venom: c("급습에 맞은 적이 중독", "Swooped foes are poisoned", "急襲が当たった敵が毒状態に"),
  thunder: c("급습 끝에 가까운 적 셋에게 연쇄 번개", "Chain lightning hits the three nearest foes at the end of a swoop", "急襲の最後に近くの敵三体へ連鎖する雷"),
  frost: c("급습에 맞은 적이 느려지고 잠깐 멈춤", "Swooped foes are slowed and briefly stopped", "急襲が当たった敵が遅くなり少し止まる"),
  blood: c("급습으로 준 피해의 8%를 회복", "Heal 8% of swoop damage dealt", "急襲で与えたダメージの8%を回復"),
  mirage: c("0.5초 뒤 지나간 자리 세 곳이 한 번 더 터짐", "Three spots along the path burst again after 0.5s", "0.5秒後、通った場所三か所がもう一度弾ける"),
  shadow: c("급습 0.3초 뒤 그림자 분신이 같은 길을 되짚어 날며 다시 벰 (공격력 90%)", "0.3s after a swoop, a shadow double flies back along the path and slashes again (90% damage)", "急襲の0.3秒後、影の分身が同じ道を引き返して再び斬る（攻撃力90%）"),
  queen: c("급습 끝에 날개 칼날 넷이 네 방향으로", "Four wing blades fly in four directions at the end of a swoop", "急襲の最後に羽の刃が四方向へ"),
};

export const FLY_PASSIVE_NAMES: Record<FlyPassive & PassiveId, Names> = {
  flyWings: c("투명 날개", "Clear Wings", "透明な翅"),
  flyAfterburn: c("가속", "Afterburn", "加速"),
  flyLonger: c("긴 비행", "Long Flight", "長い飛行"),
  flyKeen: c("날 선 발톱", "Keen Claws", "鋭い爪"),
  flyEvade: c("잔상 회피", "Afterimage Dodge", "残像回避"),
  flyRecharge: c("연속 비행", "Chain Flight", "連続飛行"),
  flyGust: c("돌풍", "Gust", "突風"),
  flyHunt: c("사냥꾼", "Hunter", "狩人"),
  flyDragonEye: c("겹눈", "Compound Eyes", "複眼"),
  flyFrenzy: c("비행 광란", "Flight Frenzy", "飛行狂乱"),
};

export const FLY_EFFECTS: Partial<Record<FlyPassive & PassiveId, Names>> = {
  flyAfterburn: c("급습할 때마다 {ticks:sec}초 동안 이동 속도 +{speed:pct}% ({max}번까지 쌓임)", "Each swoop grants +{speed:pct}% move speed for {ticks:sec}s (stacks {max} times)", "急襲するたびに{ticks:sec}秒間移動速度+{speed:pct}%（{max}回まで重なる）"),
  flyLonger: c("급습 거리 +{reach:up}%", "Swoop distance +{reach:up}%", "急襲距離+{reach:up}%"),
  flyKeen: c("끝 할퀴기 피해 +{mul:up}%", "End rake damage +{mul:up}%", "最後の引っかきダメージ+{mul:up}%"),
  flyEvade: c("급습이 끝나도 {ticks:sec}초 더 무적", "Stay invulnerable {ticks:sec}s after a swoop", "急襲後も{ticks:sec}秒無敵"),
  flyRecharge: c("{every}번째 급습마다 바로 다시 급습", "Every {every:nth} swoop can be used again at once", "{every}回目の急襲ごとにすぐもう一度急襲"),
  flyGust: c("급습에 맞은 적을 멀리 밀침", "Swoops knock foes far away", "急襲が当たった敵を遠くへ押し飛ばす"),
  flyHunt: c("체력이 {below:pct}% 아래인 적에게 피해 +{mul:up}%", "+{mul:up}% damage to foes below {below:pct}% HP", "体力{below:pct}%未満の敵へのダメージ+{mul:up}%"),
  flyDragonEye: c("가장 가까운 적에게 급습 · 급습 거리 +{reach:up}%", "Swoop toward the nearest foe · swoop distance +{reach:up}%", "一番近い敵へ急襲・急襲距離+{reach:up}%"),
  flyFrenzy: c("공격력 +5% · 급습으로 적을 쓰러뜨리면 다음 급습 피해 +{mul:up}%", "Damage +5% · a swoop kill makes the next swoop deal +{mul:up}%", "攻撃力+5%・急襲で敵を倒すと次の急襲ダメージ+{mul:up}%"),
};
