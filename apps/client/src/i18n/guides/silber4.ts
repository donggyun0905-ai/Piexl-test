// 캐릭터 설명: 실베르 (아수라) · 한·영·일 (수치는 weaponsAsura·itemsAsura·factionDefs.FACTION_GROWTH와 맞춤) — silber3.ts가 커서 나눔
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER4: Guide = {
  asura: [
    "실베르 · 아수라 '귀신의 주먹 6개와 자기 주먹으로 싸우는 싸움꾼' · 체력 105 · 공격력 8 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 패시브 하나마다 능력치가 더 오름)",
    "무기 1 (맨손 · 귀신의 주먹): 누르면 바라보는 쪽 앞을 넓게 침 (반지름 30, 사거리 증가만큼 넓어짐) · 피해는 약함 (공격력의 70%)",
    "전용 아이템 20 (모두 새 기술·능력 + 능력치): 분쇄(주먹 피해를 6번으로 나눠 한 틱에 한 대씩) · 귀진(몸 둘레 남색 영역, 안의 적 다이아 표식 · 방어력 -5) · 파동(모든 공격 끝에 앞 부채꼴) · 아수라(필살기 · 공격마다 3% 각성 10초 · 1·2타 → 1·2타 → 3타 바닥 연속 강타 → 4타 1.5초 기절) · 연발(30% 연속 펀치 15연타) · 악귀(때릴 때마다 60% 붉게 터지며 추가 피해) · 철권 · 귀수 확장 · 수라장 · 귀문 개방 · 육도 · 천근추 · 귀압 · 업화 · 분노의 팔 · 귀갑 · 마수 연타 · 육비 난무 · 혼백 흡수 · 귀신 걸음",
  ],
};

export const GUIDE_EN_SILBER4: Guide = {
  asura: [
    "Silber · Asura, the brawler who fights with six spectral fists and her own · HP 105 · damage 8 · move 1.2 · luck 1 · starts weak but grows with every passive (faction trait: each passive raises stats further)",
    "1 weapon (bare hands · Spectral Fists): punches a wide area ahead (radius 30, wider with range) · weak damage (70% of damage)",
    "20 exclusive items (each a new skill or ability + stats): Pulverize (splits each punch into 6 hits, one per tick) · Spirit Domain (navy domain around you, diamond mark on foes inside · -5 defense) · Shockwave (a fan wave after every attack) · Asura (ultimate · 3% per attack to awaken for 10s · strike 1-2 → 1-2 → 3 ground pounding → 4 with 1.5s stun) · Flurry (30% for a 15-hit flurry) · Fiend (60% red burst of extra damage on every hit) · Iron Fist · Spirit Reach · Carnage · Open Spirit Gate · Six Paths · Thousand-Weight · Spirit Pressure · Hellfire · Arms of Wrath · Spirit Shell · Demon Barrage · Six-Arm Frenzy · Soul Drain · Ghost Step",
  ],
};

export const GUIDE_JA_SILBER4: Guide = {
  asura: [
    "シルベル・阿修羅「鬼神の拳6本と自分の拳で戦う格闘家」・体力105・攻撃力8・移動1.2・幸運1・最初は弱いがパッシブを取るほど強くなる（陣営の特徴：パッシブひとつごとに能力値がさらに上がる）",
    "武器1（素手・鬼神の拳）：押すと向いている方向の前を広く打つ（半径30、射程増加の分だけ広がる）・ダメージは弱い（攻撃力の70%）",
    "専用アイテム20（すべて新しい技・能力＋能力値）：粉砕（拳のダメージを6回に分け1ティックに1発ずつ）・鬼陣（体の周りに紺色の領域、中の敵にダイヤの印・防御力-5）・波動（すべての攻撃の終わりに前方へ扇形）・阿修羅（必殺技・攻撃ごとに3%で覚醒10秒・1・2打→1・2打→3打床連続強打→4打1.5秒気絶）・連発（30%で連続パンチ15連打）・悪鬼（打つたびに60%で赤く弾けて追加ダメージ）・鉄拳・鬼手拡張・修羅場・鬼門開放・六道・千斤墜・鬼圧・業火・憤怒の腕・鬼甲・魔手連打・六臂乱舞・魂魄吸収・鬼神歩",
  ],
};
