// 새벽의 성흔 블래스트 글자 (한·영·일): 폭멸의 산탄총 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsBlast·BLAST_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type BlPassive =
  | "blBuckshot" | "blSlug" | "blChoke" | "blDragon" | "blShred" | "blGore" | "blChain" | "blRecoil" | "blSpread" | "blPump"
  | "blMoonlight" | "blFull" | "blHunter" | "blHalo" | "blLunar" | "blBlood" | "blSilver" | "blFlare" | "blRemain" | "blNight";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const BL_WEAPON_NAMES: Record<"blShotgun" & WeaponId, Names> = {
  blShotgun: c("폭멸의 산탄총", "Annihilation Shotgun", "爆滅の散弾銃"),
};

export const BL_PASSIVE_NAMES: Record<BlPassive & PassiveId, Names> = {
  blBuckshot: c("대형 벅샷", "Heavy Buckshot", "大型バックショット"),
  blSlug: c("슬러그탄", "Slug Round", "スラッグ弾"),
  blChoke: c("조임 총열", "Choked Barrel", "絞り銃身"),
  blDragon: c("용의 숨결탄", "Dragon's Breath Round", "竜の息吹弾"),
  blShred: c("찢는 탄", "Shredder Round", "裂く弾"),
  blGore: c("폭멸의 화약", "Annihilation Powder", "爆滅の火薬"),
  blChain: c("연쇄 폭멸", "Chain Annihilation", "連鎖爆滅"),
  blRecoil: c("반동 강화", "Heavy Recoil", "反動強化"),
  blSpread: c("넓은 산탄", "Wide Spread", "広い散弾"),
  blPump: c("빠른 장전", "Quick Reload", "素早い装填"),
  blMoonlight: c("달빛 탄피", "Moonlit Shell", "月光の薬莢"),
  blFull: c("보름달", "Full Moon", "満月"),
  blHunter: c("사냥꾼의 표식", "Hunter's Mark", "狩人の印"),
  blHalo: c("달무리", "Moon Halo", "月暈"),
  blLunar: c("월광 산탄", "Lunar Buckshot", "月光散弾"),
  blBlood: c("피의 사냥", "Blood Hunt", "血の狩り"),
  blSilver: c("은탄", "Silver Round", "銀の弾"),
  blFlare: c("섬광탄", "Flash Round", "閃光弾"),
  blRemain: c("남은 달빛", "Lingering Moonlight", "残る月光"),
  blNight: c("끝없는 밤", "Endless Night", "終わらぬ夜"),
};

export const BL_EFFECTS: Partial<Record<BlPassive & PassiveId, Names>> = {
  blBuckshot: c("산탄 피해 {mul}배", "{mul}x buckshot damage", "散弾ダメージ{mul}倍"),
  blSlug: c("초근접 피해 {mul}배", "{mul}x point-blank damage", "至近距離ダメージ{mul}倍"),
  blChoke: c("산탄 거리 {reach}배", "{reach}x shot range", "散弾の射程{reach}倍"),
  blDragon: c("맞은 적이 불탐 (공격력 {burn:pct}%)", "Hit foes burn ({burn:pct}% damage)", "当たった敵が燃える（攻撃力{burn:pct}%）"),
  blShred: c("초근접으로 맞은 적 출혈 ({mul:pct}%)", "Point-blank hits make foes bleed ({mul:pct}%)", "至近距離で当たった敵が出血（{mul:pct}%）"),
  blGore: c("폭멸 피해 {mul}배", "{mul}x annihilation damage", "爆滅ダメージ{mul}倍"),
  blChain: c("폭멸 범위 {r}배 · 폭멸로 처치한 적도 한 번 더 터짐", "{r}x annihilation radius · foes killed by it burst once more", "爆滅範囲{r}倍・爆滅で倒した敵ももう一度弾ける"),
  blRecoil: c("초근접 밀침 {push}배 · {stun:sec}초 멈춤", "{push}x point-blank knockback · {stun:sec}s stun", "至近距離の押し出し{push}倍・{stun:sec}秒停止"),
  blSpread: c("산탄 부채꼴이 넓어짐", "Wider shot cone", "散弾の扇が広がる"),
  blPump: c("한 발 장전 시간 -{load:down}%", "-{load:down}% time to load each shell", "1発の装填時間-{load:down}%"),
  blMoonlight: c("성흔이 {gain}배 빨리 참", "Stigma fills {gain}x faster", "聖痕が{gain}倍早く満ちる"),
  blFull: c("달빛 각성 +{more:sec}초", "Moonlight Awakening +{more:sec}s", "月光覚醒+{more:sec}秒"),
  blHunter: c("처치할 때 차는 성흔 {kill}배", "{kill}x Stigma on kills", "撃破時の聖痕{kill}倍"),
  blHalo: c("각성 달빛 폭발 범위 {r}배 · 피해 {mul}배", "Awakening burst: {r}x radius · {mul}x damage", "覚醒の月光爆発 範囲{r}倍・ダメージ{mul}倍"),
  blLunar: c("각성 중 피해 +{mul:pct}% 더 · 달빛이 한 번에 +{more}스택 더", "+{mul:pct}% more damage while awakened · Moonlight stacks +{more} more per hit", "覚醒中ダメージ+{mul:pct}%・月光が1回で+{more}スタック多く"),
  blBlood: c("초근접 처치 시 최대 체력 {heal:pct}% 회복", "Point-blank kills heal {heal:pct}% max HP", "至近距離撃破で最大体力{heal:pct}%回復"),
  blSilver: c("보스에게 피해 {mul}배", "{mul}x damage to bosses", "ボスへのダメージ{mul}倍"),
  blFlare: c("초근접으로 맞은 적 {slow:sec}초 느려짐", "Point-blank hits slow foes for {slow:sec}s", "至近距離で当たった敵が{slow:sec}秒鈍化"),
  blRemain: c("각성이 끝나도 성흔 {keep:pct}% 남음", "{keep:pct}% Stigma remains after awakening", "覚醒が終わっても聖痕{keep:pct}%残る"),
  blNight: c("각성 중 처치마다 각성 +{more:sec}초 (처음 시간까지)", "Each kill while awakened adds {more:sec}s (up to the full time)", "覚醒中の撃破ごとに覚醒+{more:sec}秒（最初の時間まで）"),
};
