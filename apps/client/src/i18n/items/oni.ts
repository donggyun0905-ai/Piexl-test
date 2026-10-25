// 오니 글자 (한·영·일): 방망이 이름 · 추가 공격 설명 · 전용 아이템 이름·효과 (수치는 weaponsOni·ONI_PERKS와 맞춤)
import type { ClubArt, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type OniWeapon = "thunderClub" | "frostClub" | "lotusClub" | "goldClub" | "yamataClub" | "genesisPillar" | "windClub" | "tideClub" | "blackThunder" | "azureThunder";
type OniPassive =
  | "oniThunderCloud" | "oniJudgment" | "oniChainBolt" | "oniFrostMail" | "oniPermafrost" | "oniSpiritEcho" | "oniHellBrand" | "oniRedLotus" | "oniBloodFlame"
  | "oniEightHeads" | "oniAbyssDrink" | "oniShadowSpread" | "oniTyphoonEye" | "oniGale" | "oniTwinWind" | "oniGreatWave" | "oniSprayChain" | "oniDragonPalace";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const ONI_WEAPON_NAMES: Record<OniWeapon & WeaponId, Names> = {
  thunderClub: c("명뢰봉", "Thunder Cudgel", "鳴雷棒"),
  frostClub: c("빙각금봉", "Frostfang Club", "氷角金棒"),
  lotusClub: c("홍련신주", "Crimson Lotus Pillar", "紅蓮神柱"),
  goldClub: c("금봉", "Golden Club", "金棒"),
  yamataClub: c("야마타의 그림자", "Shadow of Eight Heads", "八岐の影"),
  genesisPillar: c("창세의 기둥", "Pillar of Genesis", "創世の柱"),
  windClub: c("풍신소환", "Wind God's Call", "風神召喚"),
  tideClub: c("류신금봉", "Dragon Tide Club", "龍神金棒"),
  blackThunder: c("명계의 흑뢰봉", "Netherworld Black Thunder", "冥界の黒雷棒"),
  azureThunder: c("극한의 청전", "Azure Frost Lightning", "極寒の青電"),
};

/** 추가 공격 설명 */
export const CLUB_DESC: Record<ClubArt, Names> = {
  thunder: c("20%: 천벌 — 공격력 200% 번개 + 적 쪽으로 번개가 넓게 부채꼴 (공격력 50%)", "20%: Judgment — a 200% damage bolt, then lightning fans wide toward the foe (50% damage)", "20%：天罰 — 攻撃力200%の雷＋敵の方へ雷が扇状に広がる（攻撃力50%）"),
  frost: c("15%: 절대영도 — 공격력 150% · 보호막 15 · 맞은 적 1.5초 빙결 · 둘레에 한파(느려짐, 2.5초 머물면 영령: 최대 체력 10%, 적마다 5초)", "15%: Absolute Zero — 150% damage · 15 shield · freezes foes hit for 1.5s · a cold wave around you (slows; 2.5s inside summons a spirit: 10% of your max HP, 5s per foe)", "15%：絶対零度 — 攻撃力150% · シールド15 · 当たった敵を1.5秒凍結 · 周りに寒波（鈍化、2.5秒留まると英霊：最大体力10%、敵ごとに5秒）"),
  lotus: c("20%: 업화 — 공격력 150% + 최대 체력 10% · 불꽃이 터져 부채꼴로 (공격력 75%)", "20%: Hellfire — 150% damage + 10% of max HP · flames burst out in a fan (75% damage)", "20%：業火 — 攻撃力150%＋最大体力10% · 炎が扇状に弾ける（攻撃力75%）"),
  gold: c("30%: 가진 돈의 77%로 때리고 돈 10%가 사라짐 · 상점을 못 쓰고 다른 무기를 못 잡음 · 보물방·황금방에 들어가면 체력 가득 + 돈 50 (황금방은 패시브와 사용 아이템 진열)", "30%: strikes for 77% of your gold and 10% of it vanishes · can't use shops or pick up other weapons · entering a treasure or golden room: full heal + 50 gold (golden rooms display passives and items)", "30%：所持金の77%で殴り所持金10%が消える · ショップ不可・他の武器を拾えない · 宝部屋・黄金部屋に入ると体力全快＋50G（黄金部屋はパッシブとアイテムを陳列）"),
  yamata: c("20%: 어둠 — 공격력 75% + 3초 동안 1초마다 죽음 (최대 체력 × 재생력%)", "20%: Darkness — 75% damage + Death for 3s (every second: max HP × regen%)", "20%：闇 — 攻撃力75%＋3秒間1秒ごとに死（最大体力×再生力%）"),
  genesis: c("5%: 최대 체력의 300%로 빛이 터짐", "5%: light bursts for 300% of your max HP", "5%：最大体力の300%で光が弾ける"),
  wind: c("35%: 적을 천천히 따라가며 빠르게 베는 폭풍 5초 (최대 체력 3%)", "35%: a storm that slowly chases foes, slicing fast for 5s (3% of max HP)", "35%：敵をゆっくり追いながら素早く斬る嵐5秒（最大体力3%）"),
  tide: c("30%: 해일 — 부채꼴로 밀치며 최대 체력 30% · 입힌 피해의 10%를 주변 적에게 3번 나눠 줌", "30%: Tidal wave — a pushing fan for 30% of max HP · 10% of the damage splashes onto nearby foes 3 times", "30%：津波 — 扇状に押し流し最大体力30% · 与えたダメージの10%を周りの敵に3回分ける"),
  black: c("30%: 검은 번개 — 공격력 444% + 최대 체력 44% · 검은 번개 부채꼴 · 최대 체력 400 이상, 한 번 되살아난 뒤에만 나옴", "30%: Black lightning — 444% damage + 44% of max HP · a black lightning fan · appears only with 400+ max HP after reviving once", "30%：黒い雷 — 攻撃力444%＋最大体力44% · 黒い雷の扇 · 最大体力400以上かつ一度復活した後のみ出現"),
  azure: c("45%: 빙뢰(최대 체력 100% + 방어력 -5%) + 서리(1초마다 공격력 10%, 2.5초 머물면 공격력 30% 번개 + 최대 체력 30% 빙결) · 재생력 60 이상, 한 번 되살아난 뒤에만 나옴", "45%: Ice bolt (100% of max HP, -5% defense) + Frost field (10% damage per second; after 2.5s, a 30% damage bolt + 30% of max HP frost) · appears only with 60+ regen after reviving once", "45%：氷雷（最大体力100%＋防御-5%）＋霜（1秒ごとに攻撃力10%、2.5秒留まると攻撃力30%の雷＋最大体力30%の凍結）· 再生力60以上かつ一度復活した後のみ出現"),
};

const GOD = c("휘두를 때마다 신인족 게이지 (25번이면 30초 신인족: 공격력 +45% · 최대 체력 +50% · 추가 공격 100%)", "Each swing fills the Shinin gauge (25 swings: 30s of +45% damage, +50% max HP, 100% extra attacks)", "振るたびに神人族ゲージ（25回で30秒神人族：攻撃力+45%・最大体力+50%・追加攻撃100%）");

export const clubDesc = (art: ClubArt, lang: "ko" | "en" | "ja") => `${CLUB_DESC[art][lang]} · ${GOD[lang]}`;

export const ONI_PASSIVE_NAMES: Record<OniPassive & PassiveId, Names> = {
  oniThunderCloud: c("뇌운", "Thundercloud", "雷雲"),
  oniJudgment: c("천벌 각인", "Mark of Judgment", "天罰の刻印"),
  oniChainBolt: c("연쇄 뇌격", "Chain Thunder", "連鎖雷撃"),
  oniFrostMail: c("서리 갑주", "Frost Mail", "霜の甲冑"),
  oniPermafrost: c("영구동토", "Permafrost", "永久凍土"),
  oniSpiritEcho: c("빙령 공명", "Ice Spirit Echo", "氷霊の共鳴"),
  oniHellBrand: c("업화 낙인", "Hellfire Brand", "業火の烙印"),
  oniRedLotus: c("홍련 폭주", "Crimson Frenzy", "紅蓮の暴走"),
  oniBloodFlame: c("화신 혈류", "Flame-God Blood", "火神の血流"),
  oniEightHeads: c("여덟 머리", "Eight Heads", "八つの頭"),
  oniAbyssDrink: c("심연 흡수", "Abyss Drinker", "深淵の吸収"),
  oniShadowSpread: c("그림자 증식", "Spreading Shadow", "影の増殖"),
  oniTyphoonEye: c("태풍의 눈", "Eye of the Typhoon", "台風の目"),
  oniGale: c("질풍", "Gale", "疾風"),
  oniTwinWind: c("쌍둥이 바람", "Twin Winds", "双子の風"),
  oniGreatWave: c("대해일", "Great Wave", "大津波"),
  oniSprayChain: c("물보라 연쇄", "Spray Chain", "水しぶきの連鎖"),
  oniDragonPalace: c("용궁의 가호", "Dragon Palace Blessing", "竜宮の加護"),
};

export const ONI_EFFECTS: Partial<Record<OniPassive & PassiveId, Names>> = {
  oniThunderCloud: c("명뢰봉: 번개 부채꼴 범위 +{range:up}% · 피해 +{damage:up}%", "Thunder Cudgel: +{range:up}% lightning fan size · +{damage:up}% damage", "鳴雷棒：雷の扇の範囲+{range:up}% · ダメージ+{damage:up}%"),
  oniJudgment: c("명뢰봉: 천벌 확률 +{chance:pct}%p", "Thunder Cudgel: +{chance:pct}%p Judgment chance", "鳴雷棒：天罰の確率+{chance:pct}%p"),
  oniChainBolt: c("명뢰봉: 번개에 맞은 적마다 가까운 다른 적에게 번개 (공격력 {mul:pct}%)", "Thunder Cudgel: each foe struck chains a bolt to another nearby foe ({mul:pct}% damage)", "鳴雷棒：雷に当たった敵ごとに近くの別の敵へ雷（攻撃力{mul:pct}%）"),
  oniFrostMail: c("빙각금봉: 보호막 상한 {shieldMax}", "Frostfang Club: shield cap {shieldMax}", "氷角金棒：シールド上限{shieldMax}"),
  oniPermafrost: c("빙각금봉: 한파 +{ticks:sec}초 · 범위 +{radius:up}%", "Frostfang Club: cold wave +{ticks:sec}s · +{radius:up}% size", "氷角金棒：寒波+{ticks:sec}秒 · 範囲+{radius:up}%"),
  oniSpiritEcho: c("빙각금봉: 영령 다시 쓰기 {cd:sec}초 · 피해 최대 체력 {hp:pct}%", "Frostfang Club: spirit every {cd:sec}s · {hp:pct}% of max HP", "氷角金棒：英霊の再使用{cd:sec}秒 · 最大体力{hp:pct}%"),
  oniHellBrand: c("홍련신주: 불꽃에 맞은 적이 2초 동안 불탐", "Crimson Lotus Pillar: flames set foes ablaze for 2s", "紅蓮神柱：炎に当たった敵が2秒間燃える"),
  oniRedLotus: c("홍련신주: 업화 확률 +{chance:pct}%p", "Crimson Lotus Pillar: +{chance:pct}%p Hellfire chance", "紅蓮神柱：業火の確率+{chance:pct}%p"),
  oniBloodFlame: c("홍련신주: 업화가 터질 때 최대 체력의 {heal:pct}% 회복", "Crimson Lotus Pillar: heal {heal:pct}% of max HP on Hellfire", "紅蓮神柱：業火のとき最大体力の{heal:pct}%回復"),
  oniEightHeads: c("야마타의 그림자: 죽음 {ticks:sec}초", "Shadow of Eight Heads: Death lasts {ticks:sec}s", "八岐の影：死{ticks:sec}秒"),
  oniAbyssDrink: c("야마타의 그림자: 죽음 피해의 {heal:pct}%만큼 회복", "Shadow of Eight Heads: heal {heal:pct}% of Death damage", "八岐の影：死のダメージの{heal:pct}%回復"),
  oniShadowSpread: c("야마타의 그림자: 어둠 확률 +{chance:pct}%p", "Shadow of Eight Heads: +{chance:pct}%p Darkness chance", "八岐の影：闇の確率+{chance:pct}%p"),
  oniTyphoonEye: c("풍신소환: 폭풍 {ticks:sec}초", "Wind God's Call: storms last {ticks:sec}s", "風神召喚：嵐{ticks:sec}秒"),
  oniGale: c("풍신소환: 폭풍이 {speed}배 빠르고 더 자주 벰", "Wind God's Call: storms move {speed}x faster and slice more often", "風神召喚：嵐が{speed}倍速くより頻繁に斬る"),
  oniTwinWind: c("풍신소환: 폭풍이 {count}개", "Wind God's Call: {count} storms at once", "風神召喚：嵐が{count}つ"),
  oniGreatWave: c("류신금봉: 해일 범위 +{range:up}% · 더 멀리 밀침", "Dragon Tide Club: +{range:up}% wave size · pushes farther", "龍神金棒：津波の範囲+{range:up}% · より遠くへ押す"),
  oniSprayChain: c("류신금봉: 물보라 {chains}번", "Dragon Tide Club: splashes {chains} times", "龍神金棒：水しぶき{chains}回"),
  oniDragonPalace: c("류신금봉: 해일이 일 때 최대 체력의 {heal:pct}% 회복", "Dragon Tide Club: heal {heal:pct}% of max HP on each wave", "龍神金棒：津波のとき最大体力の{heal:pct}%回復"),
};
