// 탈라시아 리바이어 글자 (한·영·일): 힘의 보석 무기 이름·기술 설명 · 전용 아이템 20 이름·효과 (수치는 weaponsLevia·LEVIA_PERKS와 맞춤)
import type { GemStyle, PassiveId, SeaGem, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type LvWeapon = "lvAqua" | "lvSapphire" | "lvTopaz" | "lvCoral" | "lvMoon" | "lvAbyss" | "lvIce" | "lvTwin" | "lvGale" | "lvKing";
type LvPassive =
  | "lvCrest" | "lvSpiral" | "lvBreaker" | "lvSurf" | "lvCurrent" | "lvAnchorless" | "lvSalt" | "lvShell" | "lvFlag" | "lvSpray"
  | "lvCall" | "lvSong" | "lvCalf" | "lvBlowhole" | "lvBaleen" | "lvPod" | "lvWhite" | "lvAmber" | "lvDeep" | "lvKingWhale";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const LV_WEAPON_NAMES: Record<LvWeapon & WeaponId, Names> = {
  lvAqua: c("아쿠아마린", "Aquamarine", "アクアマリン"),
  lvSapphire: c("해류 사파이어", "Current Sapphire", "海流のサファイア"),
  lvTopaz: c("뇌명 토파즈", "Thunder Topaz", "雷鳴のトパーズ"),
  lvCoral: c("산호석", "Coral Stone", "珊瑚石"),
  lvMoon: c("밀물 월장석", "Tide Moonstone", "満ち潮のムーンストーン"),
  lvAbyss: c("심해석", "Abyss Stone", "深海石"),
  lvIce: c("빙정", "Ice Crystal", "氷晶"),
  lvTwin: c("쌍둥이 진주", "Twin Pearls", "双子の真珠"),
  lvGale: c("해풍석", "Sea Breeze Stone", "海風石"),
  lvKing: c("리바이어던의 눈", "Eye of the Leviathan", "リヴァイアサンの瞳"),
};

/** 보석마다 기술 */
const GEM: Record<SeaGem, Names> = {
  aqua: c("맑은 바다의 기본 보석 · 고래 확률 +5%", "the clear sea's basic gem · +5% whale chance", "澄んだ海の基本の宝石 · クジラ確率+5%"),
  sapphire: c("대돌격 고래가 지나간 길에 해류가 남아 적을 끌어당겨 때림", "the charging whale leaves a current that drags and strikes foes", "大突撃のクジラが通った道に海流が残り、敵を引き寄せて打つ"),
  topaz: c("고래가 나올 때마다 둘레 적 3명에게 번개", "each time a whale appears, lightning strikes 3 nearby foes", "クジラが現れるたび周りの敵3体に雷"),
  coral: c("대돌격 고래가 끝에서 터져 큰 물보라", "the charging whale bursts into a big splash at the end", "大突撃のクジラが最後に弾けて大きな水しぶき"),
  moon: c("고래 확률 +20% (고래 피해 -10%)", "+20% whale chance (-10% whale damage)", "クジラ確率+20%（クジラダメージ-10%）"),
  abyss: c("4타 충격파 피해 +25% · 맞은 적 기절", "4th-hit shockwave +25% damage and stuns", "4段目の衝撃波ダメージ+25% · 当たった敵を気絶"),
  ice: c("맞은 적이 느려지고, 느려진 적은 +20% 아픔", "hits slow foes; slowed foes take +20%", "当たった敵が鈍化し、鈍化した敵は+20%"),
  twin: c("대돌격 고래가 두 마리 (둘째는 70%)", "two charging whales (the second at 70%)", "大突撃のクジラが2頭（2頭目は70%）"),
  gale: c("콤보가 빠르고 4타 돌진이 50% 멀리 감", "faster combo, 4th-hit lunge goes 50% farther", "コンボが速く、4段目の突進が50%遠くへ"),
  king: c("4타가 끝나면 고래가 반드시 솟구쳐 넓게 내리찍음 (기절)", "after the 4th hit, a whale always breaches and slams a wide area (stun)", "4段目の後、必ずクジラが跳び上がり広く叩きつける（気絶）"),
};

/** 바다의 창 무기 설명: 보석 기술 */
export function seaDesc(st: GemStyle, lang: Lang): string {
  return GEM[st.gem][lang];
}

export const LV_PASSIVE_NAMES: Record<LvPassive & PassiveId, Names> = {
  lvCrest: c("물마루", "Wave Crest", "波頭"),
  lvSpiral: c("나선 물결", "Spiral Wave", "螺旋の波"),
  lvBreaker: c("쇄파", "Breaker", "砕け波"),
  lvSurf: c("파도타기", "Wave Rider", "波乗り"),
  lvCurrent: c("역류", "Undertow", "逆流"),
  lvAnchorless: c("닻 없는 배", "Anchorless Ship", "錨なき船"),
  lvSalt: c("소금 바람", "Salt Wind", "潮風"),
  lvShell: c("소라 갑옷", "Conch Armor", "ほら貝の鎧"),
  lvFlag: c("해방의 깃발", "Flag of Liberty", "解放の旗"),
  lvSpray: c("물보라 창끝", "Spray Spearhead", "しぶきの穂先"),
  lvCall: c("고래의 부름", "Whale Call", "クジラの呼び声"),
  lvSong: c("심해의 노래", "Song of the Deep", "深海の歌"),
  lvCalf: c("아기 고래", "Whale Calf", "子クジラ"),
  lvBlowhole: c("물뿜기", "Blowhole", "潮吹き"),
  lvBaleen: c("고래수염", "Baleen", "クジラのヒゲ"),
  lvPod: c("고래 무리", "Whale Pod", "クジラの群れ"),
  lvWhite: c("흰 고래", "White Whale", "白いクジラ"),
  lvAmber: c("용연향", "Ambergris", "龍涎香"),
  lvDeep: c("심해 압력", "Deep Pressure", "深海の水圧"),
  lvKingWhale: c("바다의 왕", "King of the Sea", "海の王"),
};

export const LV_EFFECTS: Partial<Record<LvPassive & PassiveId, Names>> = {
  lvCrest: c("1타 휘두르기 범위 +{reach:up}%", "+{reach:up}% 1st-hit sweep reach", "1段目の薙ぎ範囲+{reach:up}%"),
  lvSpiral: c("3타 한 바퀴 휘두르기 피해 {mul}배 · 범위 +{reach:up}%", "3rd-hit spin {mul}x damage · +{reach:up}% reach", "3段目の回転斬り{mul}倍 · 範囲+{reach:up}%"),
  lvBreaker: c("4타 충격파 피해 {mul}배 · 반원으로 넓어짐", "4th-hit shockwave {mul}x damage · widens to a half circle", "4段目の衝撃波{mul}倍 · 半円に広がる"),
  lvSurf: c("4타 돌진 거리 +{rush:up}% · 돌진하는 동안 무적", "+{rush:up}% 4th-hit lunge distance · invincible while lunging", "4段目の突進距離+{rush:up}% · 突進中は無敵"),
  lvCurrent: c("고래 대돌격 거리 +{range:up}% · 크기 +{r:up}%", "Whale charge +{range:up}% range · +{r:up}% size", "クジラ大突撃の距離+{range:up}% · 大きさ+{r:up}%"),
  lvAnchorless: c("대시한 뒤 {ticks:sec}초 안의 첫 공격이 곧바로 4타 돌진", "The first attack within {ticks:sec}s after a dash jumps straight to the 4th-hit lunge", "ダッシュ後{ticks:sec}秒以内の最初の攻撃がすぐ4段目の突進に"),
  lvSalt: c("4타를 끝낼 때마다 최대 체력 {heal:pct}% 회복", "Heal {heal:pct}% max HP each time you finish the 4th hit", "4段目を終えるたび最大体力の{heal:pct}%回復"),
  lvShell: c("받는 피해 -{taken:down}%", "-{taken:down}% damage taken", "被ダメージ-{taken:down}%"),
  lvFlag: c("체력이 {hp:pct}% 이상이면 피해 {mul}배", "{mul}x damage while HP is at least {hp:pct}%", "体力{hp:pct}%以上ならダメージ{mul}倍"),
  lvSpray: c("1타 때 앞으로 물살 {n}줄기 (공격력 {mul:pct}%)", "The 1st hit also shoots {n} water jets ({mul:pct}% attack)", "1段目で前方に水流{n}本（攻撃力{mul:pct}%）"),
  lvCall: c("고래 확률 +{chance:pct}%", "+{chance:pct}% whale chance", "クジラ確率+{chance:pct}%"),
  lvSong: c("고래가 나오면 둘레 적이 {stun:sec}초 멈춤", "When a whale appears, nearby foes freeze for {stun:sec}s", "クジラが現れると周りの敵が{stun:sec}秒止まる"),
  lvCalf: c("고래가 나오면 아기 고래가 가까운 적에게 돌진 (공격력 {mul:pct}%)", "When a whale appears, a calf charges the nearest foe ({mul:pct}% attack)", "クジラが現れると子クジラが近くの敵へ突進（攻撃力{mul:pct}%）"),
  lvBlowhole: c("고래가 나오면 내 자리에 물기둥 (공격력 {mul:pct}%) + 최대 체력 {heal:pct}% 회복", "When a whale appears, a water spout erupts around you ({mul:pct}% attack) + heal {heal:pct}% max HP", "クジラが現れると自分の場所に水柱（攻撃力{mul:pct}%）+ 最大体力の{heal:pct}%回復"),
  lvBaleen: c("고래 피해 {mul}배", "{mul}x whale damage", "クジラのダメージ{mul}倍"),
  lvPod: c("고래 대돌격 +{n}마리", "+{n} charging whale", "クジラ大突撃+{n}頭"),
  lvWhite: c("고래가 나올 때마다 이번 판 고래 확률 +{step:pct}% (최대 +{max:pct}%)", "Each whale adds +{step:pct}% whale chance this run (up to +{max:pct}%)", "クジラが現れるたびこの回のクジラ確率+{step:pct}%（最大+{max:pct}%）"),
  lvAmber: c("날아간 고래가 적 {need}명 이상 맞히면 {ticks:sec}초 동안 공격 속도 {speed}배", "When a charging whale hits {need}+ foes, attack speed {speed}x for {ticks:sec}s", "飛んだクジラが敵{need}体以上に当たると{ticks:sec}秒間攻撃速度{speed}倍"),
  lvDeep: c("고래에 맞은 적이 {slow:sec}초 느려짐", "Foes hit by whales are slowed for {slow:sec}s", "クジラに当たった敵が{slow:sec}秒鈍化"),
  lvKingWhale: c("모든 고래 크기·범위 +{size:up}%", "+{size:up}% size and reach for all whales", "すべてのクジラの大きさ・範囲+{size:up}%"),
};
