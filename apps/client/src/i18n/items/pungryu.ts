// 아스칼론 풍류사 글자 (한·영·일): 천자문 구절 무기 이름·구절 마법 설명 · 전용 아이템 이름·효과 (수치는 weaponsPungryu·PUNGRYU_PERKS와 맞춤)
import type { PassiveId, ScriptStyle, VerseKind, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type PuWeapon = "puHeaven" | "puFlood" | "puSunMoon" | "puStars" | "puSeasons" | "puHarvest" | "puRain" | "puFrost" | "puGold" | "puSword";
type PuPassive = "puShrink" | "puClone" | "puDisguise" | "puThief" | "puCloud" | "puInk" | "puDog" | "puFlute" | "puBook" | "puBanner";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const PU_WEAPON_NAMES: Record<PuWeapon & WeaponId, Names> = {
  puHeaven: c("천지현황", "Heaven Dark, Earth Gold", "天地玄黄"),
  puFlood: c("우주홍황", "Vast Cosmos", "宇宙洪荒"),
  puSunMoon: c("일월영측", "Sun and Moon", "日月盈昃"),
  puStars: c("진수열장", "Spread Stars", "辰宿列張"),
  puSeasons: c("한래서왕", "Cold Comes, Heat Goes", "寒来暑往"),
  puHarvest: c("추수동장", "Autumn Harvest", "秋収冬蔵"),
  puRain: c("운등치우", "Rising Clouds", "雲騰致雨"),
  puFrost: c("노결위상", "Dew Turns Frost", "露結為霜"),
  puGold: c("금생여수", "Gold in the River", "金生麗水"),
  puSword: c("검호거궐", "Sword Named Geogwol", "剣号巨闕"),
};

/** 구절 마법 설명 */
const VERSE: Record<VerseKind, Names> = {
  heaven: c("겨눈 적 자리에 하늘의 검은 빛 → 땅의 누런 빛 기둥", "a black pillar of heaven, then a golden pillar of earth on your target", "狙った敵に天の黒い光 → 地の黄色い光の柱"),
  flood: c("큰 물결이 앞으로 방을 쓸고 감 (밀침)", "a great wave sweeps forward (knockback)", "大きな波が前方を押し流す（ノックバック）"),
  sunmoon: c("해 구슬(화상)·달 구슬(느려짐)이 6초 동안 몸 둘레를 돌며 커짐", "a sun orb (burn) and moon orb (slow) circle you for 6s, growing", "太陽の珠（火傷）と月の珠（鈍化）が6秒間体の周りを回り大きくなる"),
  stars: c("글자에 맞은 적에 별 표식 → 표식 난 적을 별자리 선으로 이어 벰", "letters mark foes with stars → marked foes are linked and cut by constellation lines", "文字が当たった敵に星の印 → 印の敵を星座の線で結んで斬る"),
  seasons: c("앞쪽에 찬바람(얼림) → 뜨거운 바람(화상)", "a cold wind (freeze) then a hot wind (burn) ahead", "前方に冷たい風（凍結）→ 熱い風（火傷）"),
  harvest: c("글자 피해 30%를 곳간에 모았다가 가장 센 적에게 한 번에 (쓰러뜨리면 돈)", "stores 30% of letter damage, then unleashes it on the toughest foe (gold on kill)", "文字ダメージの30%を蔵に貯め、一番強い敵に一気に（倒すとゴールド）"),
  rain: c("비구름이 4초 동안 나를 따라다니며 비를 뿌림 (느려짐)", "a rain cloud follows you for 4s (slow)", "雨雲が4秒間ついてきて雨を降らす（鈍化）"),
  frost: c("글자가 이슬을 맺히게 함 → 이슬 맺힌 적을 모두 서리로 얼림 (받는 피해 +30%)", "letters leave dew → dewy foes freeze into frost (+30% damage taken)", "文字が露を結ぶ → 露の敵をすべて霜で凍らせる（被ダメージ+30%）"),
  gold: c("큰 금빛 물줄기 (쓰러뜨리면 금화)", "a great golden stream (gold on kill)", "大きな金色の水流（倒すと金貨）"),
  sword: c("명검 거궐이 날아가 앞을 크게 벰", "the famed sword Geogwol flies out and cleaves ahead", "名剣・巨闕が飛んで前方を大きく斬る"),
};

/** 붓 무기 설명: 글자탄 · 구절 마법 */
export function scriptDesc(st: ScriptStyle, lang: Lang): string {
  const letters = st.n > 1 ? c(`글자 ${st.n}갈래`, `${st.n} letters`, `文字${st.n}本`) : c("글자탄", "letter shot", "文字弾");
  const verse = c("구절 완성", "Verse", "句の完成");
  return `${letters[lang]} · ${verse[lang]}: ${VERSE[st.verse][lang]}`;
}

export const PU_PASSIVE_NAMES: Record<PuPassive & PassiveId, Names> = {
  puShrink: c("축지법", "Earth-Folding Step", "縮地法"),
  puClone: c("구절을 완성하면 분신이 나와 {ticks:sec}초 동안 따로 적을 찾아다니며 글자를 씀 (공격력 {mul:pct}%, 최대 {max})", "Completing a verse summons a clone that roams on its own for {ticks:sec}s, writing letters at enemies ({mul:pct}% damage, up to {max})", "句を完成すると分身が現れ{ticks:sec}秒間それぞれ敵を追って文字を書く（攻撃力{mul:pct}%、最大{max}）"),
  puDisguise: c("둔갑술", "Shape-Shift", "遁甲術"),
  puThief: c("의적 주머니", "Outlaw's Pouch", "義賊の巾着"),
  puCloud: c("오색 구름", "Five-Color Cloud", "五色の雲"),
  puInk: c("먹물 붓", "Ink Brush", "墨の筆"),
  puDog: c("서당 개 삼 년", "Three Years at School", "門前の小僧"),
  puFlute: c("풍류 피리", "Wandering Flute", "風流の笛"),
  puBook: c("천자문 책", "Thousand Character Book", "千字文の書"),
  puBanner: c("활빈당 깃발", "Banner of the Poor's Friends", "活貧党の旗"),
};

export const PU_EFFECTS: Partial<Record<PuPassive & PassiveId, Names>> = {
  puShrink: c("대시가 순간이동 (거리 +{reach:up}%), 그 뒤 다음 글자 피해 {mul}배", "Dash becomes a teleport (+{reach:up}% distance); the next letter deals {mul}x", "ダッシュが瞬間移動（距離+{reach:up}%）、次の文字ダメージ{mul}倍"),
  puClone: c("구절을 완성하면 분신이 나와 {ticks:sec}초 동안 같은 글자를 따라 씀 (공격력 {mul:pct}%, 최대 {max})", "Completing a verse summons a clone that copies your letters for {ticks:sec}s ({mul:pct}% damage, up to {max})", "句を完成すると分身が現れ{ticks:sec}秒間同じ文字を書く（攻撃力{mul:pct}%、最大{max}）"),
  puDisguise: c("체력이 {below:pct}% 아래로 떨어질 피해를 층마다 한 번 허수아비로 둔갑해 피함", "Once per floor, turn into a scarecrow to dodge a hit that would drop you below {below:pct}% HP", "体力が{below:pct}%未満になる被弾を階ごとに一度、案山子に化けて避ける"),
  puThief: c("얻는 돈 +{gold:up}% · 가진 돈 100G마다 공격력 +{per:pct}% (최대 +{max:pct}%)", "+{gold:up}% gold · +{per:pct}% attack per 100G held (max +{max:pct}%)", "獲得ゴールド+{gold:up}% · 所持金100Gごとに攻撃力+{per:pct}%（最大+{max:pct}%）"),
  puCloud: c("구름 자국에 닿은 적이 느려짐 · 지형·지속 피해를 받지 않음", "Foes touching your cloud trail are slowed · no terrain or damage-over-time hurt", "雲の跡に触れた敵が鈍化 · 地形・持続ダメージを受けない"),
  puInk: c("글자가 맞은 자리에 먹물 웅덩이 {ticks:sec}초 (초당 공격력 {mul:pct}%)", "Letters leave an ink puddle for {ticks:sec}s ({mul:pct}% attack per second)", "文字が当たった場所に墨の水たまり{ticks:sec}秒（毎秒攻撃力{mul:pct}%）"),
  puDog: c("구절을 완성할 때마다 이번 판 공격력 +{per:pct}% (최대 +{max:pct}%)", "Each completed verse gives +{per:pct}% attack this run (max +{max:pct}%)", "句を完成するたびにこのランの攻撃力+{per:pct}%（最大+{max:pct}%）"),
  puFlute: c("{gap:sec}초마다 피리 가락이 둘레 적을 밀치고 적 탄을 지움", "Every {gap:sec}s a flute tune pushes nearby foes away and clears enemy shots", "{gap:sec}秒ごとに笛の調べが周りの敵を押しのけ敵弾を消す"),
  puBook: c("구절에 필요한 글자 4 → {letters}", "Letters per verse 4 → {letters}", "句に必要な文字4 → {letters}"),
  puBanner: c("방을 정리하면 최대 체력 {heal:pct}% 회복 · 상점 가격 -{price:down}%", "Heal {heal:pct}% max HP on room clear · shop prices -{price:down}%", "部屋を片付けると最大体力の{heal:pct}%回復 · ショップ価格-{price:down}%"),
};
