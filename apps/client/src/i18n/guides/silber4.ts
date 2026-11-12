// 캐릭터 설명: 실베르 (아수라·혼령) · 한·영·일 (수치는 weaponsAsura·itemsAsura·factionDefs.FACTION_GROWTH와 맞춤) — silber3.ts가 커서 나눔
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER4: Guide = {
  honryeong: [
    "실베르 · 혼령 '곰방대 연기로 싸우는 여인' · 체력 90 · 공격력 8 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 전용 패시브 하나마다 능력치가 더 오름)",
    "기본: 누르면 곰방대에서 보랏빛 연기용을 앞으로 내뿜어 줄 위 적을 모두 맞힘 (사거리 증가만큼 길어짐) · 공격할 때마다 방 어딘가에 연기 구름 하나 (30개까지 · 10초 · 같은 곳에 겹쳐 생기지 않음 · 다 차면 방을 덮음) · 구름 안에 들어가면 은신: 적이 쫓아오지만 내 자리를 정확히 겨누지 못해 원거리 공격이 빗나감",
    "무기 10 (곰방대): 곰방대(기본) · 불씨(화상) · 서리(느려짐) · 독초(중독) · 약초(맞히면 10% 확률로 체력 1 회복) · 뇌전(15% 기절) · 혈연초(출혈) · 장죽(길고 세지만 느림) · 단죽(짧고 아주 빠름) · 몽환(공격마다 구름 둘)",
    "전용 아이템 10 (모두 새 기술·능력 + 능력치): 혼-랑(15% 늑대 둘, 체력 낮고 공격력 높음) · 혼-범(8% 범 하나, 체력·공격력 높음) · 혼-효(10% 부엉이를 그 자리에, 둘까지 · 범위 안 적에게 낙하 공격 후 그 자리에 앉음) · 혼-룡(3% 방을 덮는 용이 왼쪽에서 오른쪽으로 지나가며 모든 적을 60번 따로 때림) · 혼-영(12% 방 어딘가에 분신, 넷까지 · 적이 분신을 쫓고 쓰러지면 연기가 터짐) · 혼령사냥(은신하면 소환수도 은신 · 늑대 첫 타격 확정 치명타·출혈 · 범 1.5배 · 부엉이는 계속 날며 공격) · 혼-귀(구름 안 적이 확률로 공포, 보스 제외) · 짙은 연기 · 혼의 계약 · 깊은 들숨",
  ],
  asura: [
    "실베르 · 아수라 '귀신의 주먹 6개와 자기 주먹으로 싸우는 싸움꾼' · 체력 105 · 공격력 8 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 전용 패시브 하나마다 능력치가 더 오름)",
    "무기 1 (맨손 · 귀신의 주먹): 누르면 바라보는 쪽 앞을 넓게 침 (반지름 30, 사거리 증가만큼 넓어짐) · 피해는 약함 (공격력의 70%)",
    "전용 아이템 20 (모두 새 기술·능력 + 능력치): 분쇄(주먹 피해를 6번으로 나눠 한 틱에 한 대씩) · 귀진(몸 둘레 남색 영역, 안의 적 다이아 표식 · 방어력 -5) · 파동(모든 공격 끝에 앞 부채꼴) · 아수라(필살기 · 공격마다 3% 각성 10초 · 1·2타 → 1·2타 → 3타 바닥 연속 강타 → 4타 1.5초 기절) · 연발(30% 연속 펀치 15연타) · 악귀(때릴 때마다 60% 붉게 터지며 추가 피해) · 철권 · 귀수 확장 · 수라장 · 귀문 개방 · 육도 · 천근추 · 귀압 · 업화 · 분노의 팔 · 귀갑 · 마수 연타 · 육비 난무 · 혼백 흡수 · 귀신 걸음",
  ],
};

export const GUIDE_EN_SILBER4: Guide = {
  honryeong: [
    "Silber · Honryeong, the lady who fights with pipe smoke · HP 90 · damage 8 · move 1.2 · luck 1 · starts weak but grows with every passive (faction trait: each exclusive passive raises stats further)",
    "Basics: press to breathe a violet smoke dragon forward from the pipe, hitting every foe on the line (longer with range) · every attack leaves a smoke cloud somewhere in the room (up to 30 · 10s · never on top of another · a full set covers the room) · stand inside a cloud to hide: foes still chase you but cannot aim at you precisely, so ranged attacks miss",
    "10 weapons (pipes): Long Pipe (basic) · Ember (burn) · Frost (slow) · Poison Herb (poison) · Healing Herb (10% to heal 1 HP on hit) · Thunder (15% stun) · Bloodleaf (bleed) · Great Pipe (long and strong but slow) · Short Pipe (short and very fast) · Dream (two clouds per attack)",
    "10 exclusive items (each a new skill or ability + stats): Spirit: Wolf (15% for two wolves, low HP and high damage) · Spirit: Tiger (8% for a tiger, high HP and damage) · Spirit: Owl (10% to perch an owl, up to 2 · dive-bombs foes in range, then perches there) · Spirit: Dragon (3% for a room-covering dragon that crosses left to right, hitting every foe 60 separate times) · Spirit: Shade (12% for a decoy, up to 4 · foes chase it and it bursts into smoke when it falls) · Spirit Hunt (summons hide when you hide · wolf first bite is a guaranteed crit with bleed · tiger x1.5 · owls keep flying and attacking) · Spirit: Ghost (foes in clouds may be terrified, bosses excluded) · Thick Smoke · Spirit Pact · Deep Breath",
  ],
  asura: [
    "Silber · Asura, the brawler who fights with six spectral fists and her own · HP 105 · damage 8 · move 1.2 · luck 1 · starts weak but grows with every passive (faction trait: each exclusive passive raises stats further)",
    "1 weapon (bare hands · Spectral Fists): punches a wide area ahead (radius 30, wider with range) · weak damage (70% of damage)",
    "20 exclusive items (each a new skill or ability + stats): Pulverize (splits each punch into 6 hits, one per tick) · Spirit Domain (navy domain around you, diamond mark on foes inside · -5 defense) · Shockwave (a fan wave after every attack) · Asura (ultimate · 3% per attack to awaken for 10s · strike 1-2 → 1-2 → 3 ground pounding → 4 with 1.5s stun) · Flurry (30% for a 15-hit flurry) · Fiend (60% red burst of extra damage on every hit) · Iron Fist · Spirit Reach · Carnage · Open Spirit Gate · Six Paths · Thousand-Weight · Spirit Pressure · Hellfire · Arms of Wrath · Spirit Shell · Demon Barrage · Six-Arm Frenzy · Soul Drain · Ghost Step",
  ],
};

export const GUIDE_JA_SILBER4: Guide = {
  honryeong: [
    "シルベル・魂霊「キセルの煙で戦う女性」・体力90・攻撃力8・移動1.2・幸運1・最初は弱いがパッシブを取るほど強くなる（陣営の特徴：専用パッシブひとつごとに能力値がさらに上がる）",
    "基本：押すとキセルから紫の煙の龍を前方へ吹き出し、線上の敵すべてに当たる（射程増加の分だけ長くなる）・攻撃するたびに部屋のどこかに煙の雲がひとつ（30個まで・10秒・同じ場所には重ならない・全部そろうと部屋を覆う）・雲の中に入ると隠密：敵は追ってくるが正確に狙えず遠距離攻撃が外れる",
    "武器10（キセル）：キセル（基本）・火種（火傷）・霜（鈍化）・毒草（毒）・薬草（当てると10%で体力1回復）・雷電（15%気絶）・血煙草（出血）・長ギセル（長く強いが遅い）・短ギセル（短くとても速い）・夢幻（攻撃ごとに雲ふたつ）",
    "専用アイテム10（すべて新しい技・能力＋能力値）：魂・狼（15%で狼2匹、体力が低く攻撃力が高い）・魂・虎（8%で虎1匹、体力・攻撃力が高い）・魂・梟（10%でフクロウをその場に、2羽まで・範囲内の敵へ急降下攻撃してその場に止まる）・魂・龍（3%で部屋を覆う龍が左から右へ通り抜け、すべての敵を60回別々に攻撃）・魂・影（12%で分身、4体まで・敵が分身を追い、倒れると煙が弾ける）・魂霊狩り（隠れると召喚獣も隠れる・狼の最初の一撃は確定クリティカル・出血・虎1.5倍・フクロウは飛び続けて攻撃）・魂・鬼（雲の中の敵が確率で恐怖、ボスを除く）・濃い煙・魂の契約・深い一服",
  ],
  asura: [
    "シルベル・阿修羅「鬼神の拳6本と自分の拳で戦う格闘家」・体力105・攻撃力8・移動1.2・幸運1・最初は弱いがパッシブを取るほど強くなる（陣営の特徴：専用パッシブひとつごとに能力値がさらに上がる）",
    "武器1（素手・鬼神の拳）：押すと向いている方向の前を広く打つ（半径30、射程増加の分だけ広がる）・ダメージは弱い（攻撃力の70%）",
    "専用アイテム20（すべて新しい技・能力＋能力値）：粉砕（拳のダメージを6回に分け1ティックに1発ずつ）・鬼陣（体の周りに紺色の領域、中の敵にダイヤの印・防御力-5）・波動（すべての攻撃の終わりに前方へ扇形）・阿修羅（必殺技・攻撃ごとに3%で覚醒10秒・1・2打→1・2打→3打床連続強打→4打1.5秒気絶）・連発（30%で連続パンチ15連打）・悪鬼（打つたびに60%で赤く弾けて追加ダメージ）・鉄拳・鬼手拡張・修羅場・鬼門開放・六道・千斤墜・鬼圧・業火・憤怒の腕・鬼甲・魔手連打・六臂乱舞・魂魄吸収・鬼神歩",
  ],
};
