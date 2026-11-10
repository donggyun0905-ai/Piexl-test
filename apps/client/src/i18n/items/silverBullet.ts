// 새벽의 성흔 실버불렛 글자 (한·영·일): 은빛 쌍권총 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsSilverBullet·SILVER_BULLET_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type SbPassive =
  | "sbQuick" | "sbHollow" | "sbPierce" | "sbTriple" | "sbBarrel" | "sbEngrave" | "sbStorm" | "sbRapid" | "sbBurst" | "sbPure"
  | "sbFlask" | "sbBless" | "sbBelt" | "sbPurify" | "sbSplash" | "sbFocus" | "sbEndless" | "sbSeek" | "sbAgile" | "sbLunar";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const SB_WEAPON_NAMES: Record<"sbPistols" & WeaponId, Names> = {
  sbPistols: c("은빛 쌍권총", "Silver Twin Pistols", "銀の双銃"),
};

export const SB_PASSIVE_NAMES: Record<SbPassive & PassiveId, Names> = {
  sbQuick: c("빠른 손", "Quick Hands", "早撃ちの手"),
  sbHollow: c("할로우 포인트", "Hollow Point", "ホローポイント"),
  sbPierce: c("관통 은탄", "Piercing Silver", "貫通銀弾"),
  sbTriple: c("세 번째 총성", "Third Gunshot", "三発目の銃声"),
  sbBarrel: c("긴 총열", "Long Barrel", "長銃身"),
  sbEngrave: c("은빛 각인", "Silver Engraving", "銀の刻印"),
  sbStorm: c("탄막 폭풍", "Bullet Storm", "弾幕の嵐"),
  sbRapid: c("연사 가속", "Rapid Fire", "連射加速"),
  sbBurst: c("은빛 파열", "Silver Rupture", "銀の破裂"),
  sbPure: c("순은", "Pure Silver", "純銀"),
  sbFlask: c("큰 성수병", "Large Flask", "大きな聖水瓶"),
  sbBless: c("축복받은 물", "Blessed Water", "祝福の水"),
  sbBelt: c("넉넉한 탄띠", "Full Bandolier", "たっぷりの弾帯"),
  sbPurify: c("정화", "Purification", "浄化"),
  sbSplash: c("성수 뿌리기", "Holy Sprinkle", "聖水撒き"),
  sbFocus: c("사냥꾼의 집중", "Hunter's Focus", "狩人の集中"),
  sbEndless: c("끝없는 탄창", "Endless Magazine", "尽きない弾倉"),
  sbSeek: c("추적 은탄", "Seeking Silver", "追跡銀弾"),
  sbAgile: c("날렵한 발", "Nimble Feet", "身軽な足"),
  sbLunar: c("달의 집행자", "Lunar Executioner", "月の執行者"),
};

export const SB_EFFECTS: Partial<Record<SbPassive & PassiveId, Names>> = {
  sbQuick: c("기본 공격 간격 {time:pct}%", "Basic attack interval {time:pct}%", "通常攻撃の間隔{time:pct}%"),
  sbHollow: c("기본 은탄 피해 {mul}배", "{mul}x basic round damage", "通常銀弾ダメージ{mul}倍"),
  sbPierce: c("기본 은탄이 적 {add}을 뚫고 나감", "Basic rounds pierce {add} foe", "通常銀弾が敵{add}体を貫通"),
  sbTriple: c("공격 {every}번째마다 은탄 두 발 더", "Two extra rounds every {every}th attack", "{every}回ごとに銀弾2発追加"),
  sbBarrel: c("은탄 빠르기 {speed}배 · 거리 {range}배", "Rounds {speed}x faster · {range}x farther", "銀弾の速さ{speed}倍・距離{range}倍"),
  sbEngrave: c("연사에 필요한 마크 {need}", "Barrage needs {need} marks", "連射に必要なマーク{need}"),
  sbStorm: c("연사 +{more:sec}초", "Barrage +{more:sec}s", "連射+{more:sec}秒"),
  sbRapid: c("연사 간격 {gap}틱", "Barrage every {gap} ticks", "連射の間隔{gap}ティック"),
  sbBurst: c("연사가 끝나면 둘레 {r} 은빛 폭발 ({mul:pct}%)", "Barrage ends in a silver blast ({r} radius, {mul:pct}%)", "連射後に周囲{r}の銀の爆発（{mul:pct}%）"),
  sbPure: c("마크 {from} 이상인 적에게 피해 {mul}배", "{mul}x damage to foes with {from}+ marks", "マーク{from}以上の敵へダメージ{mul}倍"),
  sbFlask: c("성수 폭탄 범위 {r}배", "{r}x holy water bomb radius", "聖水爆弾の範囲{r}倍"),
  sbBless: c("성수 폭탄 피해 {mul}배", "{mul}x holy water bomb damage", "聖水爆弾のダメージ{mul}倍"),
  sbBelt: c("공격 {every}번째마다 성수 폭탄", "Holy water bomb every {every}th attack", "{every}回ごとに聖水爆弾"),
  sbPurify: c("성수 폭탄에 맞은 적 달빛 +{more}", "+{more} Moonlight on bombed foes", "聖水爆弾に当たった敵に月光+{more}"),
  sbSplash: c("대시하면 떠난 자리에 성수 폭탄 ({mul:pct}%)", "Dashing leaves a holy water bomb ({mul:pct}%)", "ダッシュすると元の位置に聖水爆弾（{mul:pct}%）"),
  sbFocus: c("성흔이 {gain}배 빨리 참", "Stigma fills {gain}x faster", "聖痕が{gain}倍早く満ちる"),
  sbEndless: c("은빛 활 일제 사격 +{more:sec}초", "Silver Bow Salvo +{more:sec}s", "銀の弓一斉射撃+{more:sec}秒"),
  sbSeek: c("은빛 활 가운데 은탄도 적을 쫓음", "Silver Bow center rounds also home in", "銀の弓の中央の弾も敵を追う"),
  sbAgile: c("대시 은탄 +{add}발", "+{add} dash rounds", "ダッシュ銀弾+{add}発"),
  sbLunar: c("달빛 각성 중 피해 {mul}배", "{mul}x damage while awakened", "月光覚醒中のダメージ{mul}倍"),
};
