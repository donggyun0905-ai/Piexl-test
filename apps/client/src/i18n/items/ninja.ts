// 닌자 글자 (한·영·일): 무기 이름 · 무기 설명(공격 방식과 그림자) · 전용 아이템 이름·효과 (수치는 weaponsNinja·sim/ninja·shades·NINJA_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export type NinjaWeapon = "shuriken" | "kunai" | "fanstar" | "phantomring" | "kusarigama" | "smokebomb" | "shadowclone" | "ninjato" | "fuma" | "kagenui";
type NinjaPassive = "shadowMark" | "twinShadow" | "venomStar" | "shadowRush" | "moonlight" | "smokeVeil" | "assassin" | "bigStar" | "shadowChain" | "silentStep";

export const NINJA_WEAPON_NAMES: Record<NinjaWeapon & WeaponId, Names> = {
  shuriken: { ko: "수리검", en: "Shuriken", ja: "手裏剣" },
  kunai: { ko: "쿠나이", en: "Kunai", ja: "苦無" },
  fanstar: { ko: "부채 수리검", en: "Fan of Stars", ja: "扇手裏剣" },
  phantomring: { ko: "환영진", en: "Phantom Circle", ja: "幻影陣" },
  kusarigama: { ko: "사슬낫", en: "Kusarigama", ja: "鎖鎌" },
  smokebomb: { ko: "연막탄", en: "Smoke Bomb", ja: "煙玉" },
  shadowclone: { ko: "분신술", en: "Shadow Clones", ja: "分身の術" },
  ninjato: { ko: "닌자도", en: "Ninjato", ja: "忍者刀" },
  fuma: { ko: "풍마 수리검", en: "Fuma Shuriken", ja: "風魔手裏剣" },
  kagenui: { ko: "그림자 꿰매기", en: "Shadow Stitch", ja: "影縫い" },
};

const SHADE = { ko: "그림자가 적 뒤에서 벰", en: "a shadow slashes from behind", ja: "影が背後から斬る" };
const marks = (n: number) => ({ ko: `표식 ${n}개`, en: `${n} marks`, ja: `印${n}つ` });
const desc = (ko: string, en: string, ja: string, n: number, shade = SHADE): Names => ({
  ko: `${ko} · ${marks(n).ko}가 차면 ${shade.ko}`,
  en: `${en} · At ${marks(n).en}, ${shade.en}`,
  ja: `${ja} · ${marks(n).ja}が溜まると${shade.ja}`,
});

export const NINJA_DESC: Record<NinjaWeapon, Names> = {
  shuriken: desc("수리검을 던져 맞은 적에게 표식", "Throw shuriken that mark enemies", "手裏剣を投げて当たった敵に印", 3),
  kunai: desc("빠르고 묵직한 쿠나이, 1명 관통", "Fast, heavy kunai that pierce 1", "速く重い苦無、1体貫通", 2),
  fanstar: desc("수리검 3개를 부채꼴로", "Throw 3 shuriken in a fan", "手裏剣3枚を扇状に", 4),
  phantomring: desc("수리검을 던져 표식", "Throw shuriken that mark", "手裏剣を投げて印", 5, {
    ko: "그 적을 가운데로 내 사거리의 절반만 한 원이 생기고, 원 위 9곳에서 그림자가 가운데로 돌진해 벰 (사거리를 따라 원이 커짐)",
    en: "a circle half as wide as your range forms around that enemy and 9 shadows dash in from it to strike the center (grows with range)",
    ja: "その敵を中心に射程の半分の円ができ、円上の9か所から影が中心へ突進して斬る（射程に合わせて円が広がる）",
  }),
  kusarigama: desc("사슬낫으로 앞을 넓게 베어 맞은 적마다 표식", "Sweep wide with a chain sickle, marking each foe hit", "鎖鎌で前方を広く斬り、当たった敵ごとに印", 3),
  smokebomb: desc("연막탄을 던짐: 3초 동안 구름 속 적은 느려지고 0.5초마다 피해와 표식", "Throw a smoke bomb: foes inside are slowed and take damage plus a mark every 0.5s for 3s", "煙玉を投げる：3秒間、煙の中の敵は遅くなり0.5秒ごとにダメージと印", 3),
  shadowclone: desc("양옆 분신 둘이 같이 수리검을 던짐 (분신은 60% 피해)", "Two side clones throw shuriken with you (60% damage)", "両脇の分身2体も手裏剣を投げる（分身は60%ダメージ）", 3),
  ninjato: desc("빠르게 베어 맞은 적마다 표식", "Quick slashes that mark each foe hit", "素早く斬り、当たった敵ごとに印", 3, { ko: "그림자가 X자로 벰 (2배 피해)", en: "a shadow slashes an X (double damage)", ja: "影がX字に斬る（2倍ダメージ）" }),
  fuma: desc("큰 수리검이 모두 뚫고 사거리 끝에서 되돌아옴", "A huge shuriken pierces everything and returns at the end of its range", "大きな手裏剣がすべて貫き、射程の端で戻ってくる", 3),
  kagenui: desc("바늘을 던져 맞은 적을 0.5초 묶음", "Throw needles that pin foes for 0.5s", "針を投げて当たった敵を0.5秒縫い止める", 3, { ko: "그 적의 그림자에서 가시가 솟아 둘레까지 찌름", en: "shadow spikes erupt from its shadow, hitting nearby foes too", ja: "その敵の影から棘が突き出て周りまで刺す" }),
};

export const NINJA_PASSIVE_NAMES: Record<NinjaPassive & PassiveId, Names> = {
  shadowMark: { ko: "그림자 표식", en: "Shadow Mark", ja: "影の印" },
  twinShadow: { ko: "쌍그림자", en: "Twin Shadows", ja: "双影" },
  venomStar: { ko: "독 수리검", en: "Venom Stars", ja: "毒手裏剣" },
  shadowRush: { ko: "그림자 질주", en: "Shadow Rush", ja: "影走り" },
  moonlight: { ko: "월광", en: "Moonlight", ja: "月光" },
  smokeVeil: { ko: "연막 둔갑", en: "Smoke Veil", ja: "煙遁" },
  assassin: { ko: "암살", en: "Assassinate", ja: "暗殺" },
  bigStar: { ko: "큰 수리검", en: "Great Star", ja: "大手裏剣" },
  shadowChain: { ko: "그림자 연쇄", en: "Shadow Chain", ja: "影連鎖" },
  silentStep: { ko: "무음 보법", en: "Silent Step", ja: "無音歩法" },
};

export const NINJA_EFFECTS: Record<NinjaPassive & PassiveId, Names> = {
  shadowMark: { ko: "그림자가 나오는 데 필요한 표식 -1", en: "Shadows need 1 fewer mark", ja: "影が出るのに必要な印-1" },
  twinShadow: { ko: "그림자가 둘씩 나옴 (둘째는 옆에서, {damage:pct}% 피해)", en: "Shadows come in pairs (the second from the side, {damage:pct}% damage)", ja: "影が2体ずつ出る（2体目は横から、{damage:pct}%ダメージ）" },
  venomStar: { ko: "던진 무기에 맞은 적이 {ticks:sec}초 동안 독 (0.5초마다 공격력 {damage:pct}%)", en: "Thrown weapons poison for {ticks:sec}s ({damage:pct}% damage every 0.5s)", ja: "投げた武器が当たった敵は{ticks:sec}秒間毒（0.5秒ごとに攻撃力の{damage:pct}%）" },
  shadowRush: { ko: "그림자가 벤 뒤 {ticks:sec}초 동안 공격 속도 +{speed:pct}%", en: "After a shadow strikes, +{speed:pct}% attack speed for {ticks:sec}s", ja: "影が斬った後{ticks:sec}秒間攻撃速度+{speed:pct}%" },
  moonlight: { ko: "그림자 피해 +{damage:up}%", en: "Shadow damage +{damage:up}%", ja: "影のダメージ+{damage:up}%" },
  smokeVeil: { ko: "맞으면 연막: 둘레 적이 {ticks:sec}초 느려지고 1초 더 무적", en: "When hit, vanish in smoke: nearby foes slowed for {ticks:sec}s and 1s more invulnerability", ja: "被弾すると煙：周りの敵が{ticks:sec}秒遅くなり、さらに1秒無敵" },
  assassin: { ko: "체력 {below:pct}% 이하 적에게 그림자 피해 {damage}배", en: "Shadows deal {damage}x damage to foes at {below:pct}% health or less", ja: "体力{below:pct}%以下の敵に影のダメージ{damage}倍" },
  bigStar: { ko: "던진 무기가 커지고 {pierce}명 더 뚫음", en: "Thrown weapons grow larger and pierce {pierce} more", ja: "投げた武器が大きくなり{pierce}体多く貫通" },
  shadowChain: { ko: "그림자가 적을 쓰러뜨리면 가까운 적에게 옮겨 붙어 또 벰 (최대 {hits}번)", en: "When a shadow defeats a foe, it leaps to a nearby foe and strikes again (up to {hits} times)", ja: "影が敵を倒すと近くの敵に乗り移ってまた斬る（最大{hits}回）" },
  silentStep: { ko: "이동 속도 +0.15, 대시 대기 시간 -{cooldown:down}%", en: "Move speed +0.15, dash cooldown -{cooldown:down}%", ja: "移動速度+0.15、ダッシュの待ち時間-{cooldown:down}%" },
};
