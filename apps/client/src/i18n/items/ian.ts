// 성국 이안 글자 (한·영·일): 집행의 펜 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsIan·IAN_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type IaPassive =
  | "iaQuill" | "iaLedger" | "iaClause" | "iaChain" | "iaSeal" | "iaVital" | "iaSilence" | "iaShadow" | "iaNeedle" | "iaReaper"
  | "iaSteel" | "iaWeave" | "iaSnare" | "iaSpool" | "iaKnot" | "iaEcho" | "iaLaw" | "iaAbsolute" | "iaVerse" | "iaCall";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const IA_WEAPON_NAMES: Record<"iaPen" & WeaponId, Names> = {
  iaPen: c("집행의 펜 & 강철 실타래", "Pen of Execution & Steel Spool", "執行のペン＆鋼の糸巻"),
};

export const IA_PASSIVE_NAMES: Record<IaPassive & PassiveId, Names> = {
  iaQuill: c("깃펜 촉", "Quill Nib", "羽ペンの先"),
  iaLedger: c("두꺼운 장부", "Thick Ledger", "分厚い台帳"),
  iaClause: c("조항", "Clause", "条項"),
  iaChain: c("연쇄 조문", "Chained Article", "連鎖条文"),
  iaSeal: c("봉인 낙관", "Sealing Stamp", "封印の落款"),
  iaVital: c("급소 해부도", "Anatomy of Vitals", "急所解剖図"),
  iaSilence: c("침묵의 서약", "Vow of Silence", "沈黙の誓約"),
  iaShadow: c("그림자 잉크", "Shadow Ink", "影のインク"),
  iaNeedle: c("바늘 끝", "Needle Point", "針の先"),
  iaReaper: c("마지막 문장", "Final Sentence", "最後の一文"),
  iaSteel: c("강철 실타래", "Steel Spool", "鋼の糸巻"),
  iaWeave: c("엮음", "Weave", "編み込み"),
  iaSnare: c("올가미", "Snare", "輪縄"),
  iaSpool: c("실패", "Bobbin", "糸車"),
  iaKnot: c("매듭", "Knot", "結び目"),
  iaEcho: c("메아리 각주", "Echoing Footnote", "残響の脚注"),
  iaLaw: c("인과의 무게", "Weight of Causality", "因果の重み"),
  iaAbsolute: c("절대 조문", "Absolute Article", "絶対条文"),
  iaVerse: c("침묵의 기도", "Silent Prayer", "沈黙の祈り"),
  iaCall: c("신의 부름", "Call of the Gods", "神の呼び声"),
};

export const IA_EFFECTS: Partial<Record<IaPassive & PassiveId, Names>> = {
  iaQuill: c("기록이 쌓일 때 {chance:pct}% 확률로 하나 더", "{chance:pct}% chance to add one more Record", "記録が溜まる時{chance:pct}%の確率でもう1つ"),
  iaLedger: c("속박 시간 {mul}배", "Bind lasts {mul}x longer", "束縛時間{mul}倍"),
  iaClause: c("속박된 적이 받는 피해 +{taken:pct}% (원래 20%)", "Bound foes take +{taken:pct}% damage (was 20%)", "束縛中の敵の被ダメージ+{taken:pct}%（元20%）"),
  iaChain: c("적이 속박될 때 둘레 적에게 기록 +{rec}", "When a foe is Bound, nearby foes gain +{rec} Record", "敵が束縛された時、周りの敵に記録+{rec}"),
  iaSeal: c("속박된 적을 쓰러뜨리면 둘레 적에게 기록 +{rec}", "Killing a Bound foe gives nearby foes +{rec} Records", "束縛中の敵を倒すと周りの敵に記録+{rec}"),
  iaVital: c("급소 피해 {mul:pct}% (원래 180%)", "Vital Point damage {mul:pct}% (was 180%)", "急所ダメージ{mul:pct}%（元180%）"),
  iaSilence: c("{ticks:sec}초 동안 맞지 않으면 다음 기본 공격이 급소", "If not hit for {ticks:sec}s, next basic attack hits a Vital Point", "{ticks:sec}秒間被弾しないと次の通常攻撃が急所"),
  iaShadow: c("그림자 걸음 거리 {dash}배 · 대기 -{cd:down}%", "Shadow Step {dash}x farther · -{cd:down}% cooldown", "影歩きの距離{dash}倍 · 待機-{cd:down}%"),
  iaNeedle: c("펜 찌르기 길이 {len}배 · 피해 {mul}배", "Pen thrust {len}x longer · {mul}x damage", "ペン突きの長さ{len}倍 · ダメージ{mul}倍"),
  iaReaper: c("급소로 체력이 {below:pct}% 이하가 되는 적은 바로 쓰러뜨림 (보스 제외)", "A Vital Point hit that leaves a foe at or below {below:pct}% HP finishes it (not bosses)", "急所で体力{below:pct}%以下になる敵は即座に倒す（ボス除く）"),
  iaSteel: c("인과의 실 폭 {width}배 · 피해 {mul}배", "Thread of Causality {width}x wider · {mul}x damage", "因果の糸の幅{width}倍 · ダメージ{mul}倍"),
  iaWeave: c("인과의 실이 기록 +{rec} (원래 2)", "Thread of Causality gives +{rec} Records (was 2)", "因果の糸が記録+{rec}（元2）"),
  iaSnare: c("3타 실 휘감기 거리 {r}배 · 끌어당김 {pull}배", "3rd-hit thread lash {r}x reach · {pull}x pull", "3撃目の糸の巻きつけ距離{r}倍 · 引き寄せ{pull}倍"),
  iaSpool: c("인과의 실이 세 갈래로 날아감", "Thread of Causality flies in three strands", "因果の糸が三筋に飛ぶ"),
  iaKnot: c("기록 집행 뒤에도 기록이 {keep:pct}% 남음", "{keep:pct}% of Records remain after Writ of Execution", "記録執行の後も記録が{keep:pct}%残る"),
  iaEcho: c("기록 집행: 기록 하나마다 {mul:pct}% (원래 50%)", "Writ of Execution: {mul:pct}% per Record (was 50%)", "記録執行：記録1つごとに{mul:pct}%（元50%）"),
  iaLaw: c("인과율 속박 {more:sec}초 더 · 되돌리는 피해 {debt:pct}% (원래 40%)", "Law of Causality lasts {more:sec}s longer · returns {debt:pct}% (was 40%)", "因果律束縛が{more:sec}秒長い · 跳ね返すダメージ{debt:pct}%（元40%）"),
  iaAbsolute: c("인과율 속박 대기 {cd:sec}초 (원래 45초)", "Law of Causality cooldown {cd:sec}s (was 45s)", "因果律束縛の待機{cd:sec}秒（元45秒）"),
  iaVerse: c("모든 스킬 대기 -{cd:down}%", "-{cd:down}% all skill cooldowns", "全スキル待機-{cd:down}%"),
  iaCall: c("적을 쓰러뜨릴 때마다 모든 스킬 대기 -{cut:sec}초", "Each kill cuts all skill cooldowns by {cut:sec}s", "敵を倒すたびに全スキル待機-{cut:sec}秒"),
};
