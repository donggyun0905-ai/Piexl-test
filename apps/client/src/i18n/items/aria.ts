// 실베르 아리아 글자 (한·영·일): 무기 10 이름 · 전용 아이템 10 이름·효과 (수치는 weaponsAria·ARIA_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type ArWeapon = "arBaton" | "arFlute" | "arCello" | "arTrumpet" | "arBell" | "arLyre" | "arDrum" | "arMusicBox" | "arTambourine" | "arRequiem";
type ArPassive = "arPiano" | "arHarp" | "arHorn" | "arClarinet" | "arViolin" | "arChord" | "arCanon" | "arForte" | "arEncore" | "arMaestro";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const AR_WEAPON_NAMES: Record<ArWeapon & WeaponId, Names> = {
  arBaton: c("황금 지휘봉", "Golden Baton", "黄金の指揮棒"),
  arFlute: c("은빛 플루트", "Silver Flute", "銀のフルート"),
  arCello: c("첼로 활", "Cello Bow", "チェロの弓"),
  arTrumpet: c("금빛 트럼펫", "Golden Trumpet", "金のトランペット"),
  arBell: c("종 지휘봉", "Bell Baton", "鐘の指揮棒"),
  arLyre: c("서정의 리라", "Lyric Lyre", "叙情のリラ"),
  arDrum: c("작은 북", "Little Drum", "小太鼓"),
  arMusicBox: c("겨울 오르골", "Winter Music Box", "冬のオルゴール"),
  arTambourine: c("불꽃 탬버린", "Flame Tambourine", "炎のタンバリン"),
  arRequiem: c("진혼곡 악보", "Requiem Score", "鎮魂歌の楽譜"),
};

export const AR_PASSIVE_NAMES: Record<ArPassive & PassiveId, Names> = {
  arPiano: c("피아노", "Piano", "ピアノ"),
  arHarp: c("하프", "Harp", "ハープ"),
  arHorn: c("호른", "Horn", "ホルン"),
  arClarinet: c("클라리넷", "Clarinet", "クラリネット"),
  arViolin: c("영혼의 바이올린", "Soul Violin", "魂のバイオリン"),
  arChord: c("화음", "Chord", "和音"),
  arCanon: c("돌림노래", "Canon", "輪唱"),
  arForte: c("포르티시모", "Fortissimo", "フォルティッシモ"),
  arEncore: c("앙코르", "Encore", "アンコール"),
  arMaestro: c("마에스트로", "Maestro", "マエストロ"),
};

export const AR_EFFECTS: Partial<Record<ArPassive & PassiveId, Names>> = {
  arPiano: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 방 어딘가에 영혼 팔이 치는 피아노를 놓음 ({max}대까지, {life:sec}초) · {rate:sec}초마다 가까운 적들에게 음표 {n}개를 날림 (하나 공격력의 {mul:pct}%) · 악보 완성에 필요한 악기",
    "New skill: each attack has a {chance:pct}% chance to place a piano played by soul hands somewhere in the room (up to {max}, {life:sec}s) · every {rate:sec}s it sends {n} notes at nearby foes ({mul:pct}% of damage each) · one of the instruments needed for Score Complete",
    "新技：攻撃ごとに{chance:pct}%の確率で魂の手が弾くピアノを部屋のどこかに置く（{max}台まで、{life:sec}秒）・{rate:sec}秒ごとに近くの敵へ音符を{n}個飛ばす（1個 攻撃力の{mul:pct}%）・楽譜完成に必要な楽器",
  ),
  arHarp: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 방 어딘가에 하프를 놓음 ({max}대까지, {life:sec}초) · {rate:sec}초마다 가까운 적 쪽으로 음표 {n}개를 부채꼴로 (하나 공격력의 {mul:pct}%) · 악보 완성에 필요한 악기",
    "New skill: each attack has a {chance:pct}% chance to place a harp somewhere in the room (up to {max}, {life:sec}s) · every {rate:sec}s it fans {n} notes toward the nearest foe ({mul:pct}% of damage each) · one of the instruments needed for Score Complete",
    "新技：攻撃ごとに{chance:pct}%の確率で部屋のどこかにハープを置く（{max}台まで、{life:sec}秒）・{rate:sec}秒ごとに近くの敵の方へ音符{n}個を扇形に（1個 攻撃力の{mul:pct}%）・楽譜完成に必要な楽器",
  ),
  arHorn: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 방 어딘가에 호른을 놓음 ({max}대까지, {life:sec}초) · {rate:sec}초마다 빠른 음표 하나를 가까운 적에게 (공격력의 {mul:pct}%) · 악보 완성에 필요한 악기",
    "New skill: each attack has a {chance:pct}% chance to place a horn somewhere in the room (up to {max}, {life:sec}s) · every {rate:sec}s it fires one fast note at the nearest foe ({mul:pct}% of damage) · one of the instruments needed for Score Complete",
    "新技：攻撃ごとに{chance:pct}%の確率で部屋のどこかにホルンを置く（{max}台まで、{life:sec}秒）・{rate:sec}秒ごとに速い音符を1つ近くの敵へ（攻撃力の{mul:pct}%）・楽譜完成に必要な楽器",
  ),
  arClarinet: c(
    "새 기술: 공격마다 {chance:pct}% 확률로 적을 따라다니는 클라리넷을 부름 ({max}대까지, {life:sec}초) · 둘레({r}) 적은 느려지고 공격 준비가 늦어지며 받는 피해 {taken}배 · 악보 완성에 필요한 악기",
    "New skill: each attack has a {chance:pct}% chance to summon a clarinet that follows foes (up to {max}, {life:sec}s) · foes around it ({r}) are slowed, attack more slowly and take x{taken} damage · one of the instruments needed for Score Complete",
    "新技：攻撃ごとに{chance:pct}%の確率で敵を追うクラリネットを呼ぶ（{max}台まで、{life:sec}秒）・周り（{r}）の敵は遅くなり、攻撃の準備が遅れ、被ダメージ{taken}倍・楽譜完成に必要な楽器",
  ),
  arViolin: c(
    "새 기술: 영혼 팔이 켜는 바이올린이 늘 곁을 떠다님 · {rate:sec}초마다 가까운 적이 있으면 활로 휘감아 둘레를 {hits}번 벰 (한 번 공격력의 {mul:pct}%)",
    "New skill: a violin played by soul hands always floats beside you · every {rate:sec}s, if a foe is near, it sweeps its bow around you {hits} times ({mul:pct}% of damage each)",
    "新技：魂の手が弾くバイオリンが常にそばに浮かぶ・{rate:sec}秒ごとに近くに敵がいれば弓で周りを{hits}回斬る（1回 攻撃力の{mul:pct}%）",
  ),
  arChord: c(
    "새 능력: 공격마다 다른 종류 음표가 {n}개 더 (공격력의 {mul:pct}%) · 여덟 음표가 더 빨리 모임",
    "New ability: each attack adds {n} more note of a different kind ({mul:pct}% of damage) · the eight notes gather faster",
    "新能力：攻撃ごとに別の種類の音符がもう{n}個（攻撃力の{mul:pct}%）・八つの音符が早く集まる",
  ),
  arCanon: c(
    "새 능력: 음표가 방 끝에 닿으면 {bounces}번 튕겨 돌아옴 (돌아올 때 같은 적을 다시 맞힘) · 음표가 방에 오래 남아 여덟 음표가 잘 모임",
    "New ability: notes bounce back {bounces} time when they reach the room's edge (hitting the same foes again) · notes stay longer, so the eight gather more easily",
    "新能力：音符が部屋の端に届くと{bounces}回跳ね返る（戻るとき同じ敵に再び当たる）・音符が長く残り八つの音符が集まりやすい",
  ),
  arForte: c(
    "새 능력: 음표 피해 {mul}배 · 여덟 음표 터짐 범위 {burst}배",
    "New ability: note damage x{mul} · Octet Burst radius x{burst}",
    "新能力：音符のダメージ{mul}倍・八音符の破裂の範囲{burst}倍",
  ),
  arEncore: c(
    "새 능력: 여덟 음표가 터진 자리에서 {delay:sec}초 뒤 한 번 더 터짐 (공격력의 {mul:pct}%) · 악보 완성 {finale:sec}초 더 길게",
    "New ability: {delay:sec}s after the Octet Burst, each spot bursts once more ({mul:pct}% of the burst) · Score Complete lasts {finale:sec}s longer",
    "新能力：八音符が弾けた場所で{delay:sec}秒後にもう一度弾ける（{mul:pct}%）・楽譜完成が{finale:sec}秒長くなる",
  ),
  arMaestro: c(
    "새 능력: 악기가 나올 확률 {chance}배 · 악기가 남는 시간 {life}배 · 악기 음표 피해 {mul}배",
    "New ability: instrument chance x{chance} · instruments last x{life} as long · instrument note damage x{mul}",
    "新能力：楽器が出る確率{chance}倍・楽器が残る時間{life}倍・楽器の音符ダメージ{mul}倍",
  ),
};
