// 캐릭터 설명: 아슈바르 (블랑) · 한·영·일 (수치는 itemsBlanc·itemsNoir와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_ASHVAR6: Guide = {
  blanc: [
    "아슈바르 · 블랑 '태초의 색채 악마 7원색 군단의 하양' · 체력 100 · 공격력 8 · 이동 1.35 · 무기는 순백의 부채 하나 · 패시브 없음 · 로비 칩 45만 개로 열기",
    "적응력·강화·승격·제약은 느아르와 같음: 흑이 차면 레벨업과 강화 한 번 · 기본·추가 공격 4단계 · 스킬 강화판 · 하위→중위→고위→대악마",
    "백무(빙의): 대시하면 화면이 회색이 되고 3초 동안 모든 움직임이 느려짐 · 공격 범위 안 적(보스 빼고) 머리 위에 방향키 4개 → 그대로 누른 적 몸속으로 들어감(나는 사라지고 무적) · 틀리면 그냥 대시(다음 빙의까지 10초), 성공하면 3초 · 몸속에서는 그 몬스터 몸으로 다른 적을 때림(블랑 기본 공격·스킬 없음, 추가 공격은 나감) · 3초 뒤 대시하면 다른 적으로 옮겨 탐(방향키 +1) · 최대 10초, 나오거나 옮겨 탈 때 그 적에게 공격력의 600% · 방향키가 0개인 적은 고르자마자 그 한 방",
    "기본 공격: 1 순백의 부채무(앞 3타) · 2 거짓된 축복(마우스 자리 6타) · 3 성흔 인형극(12타, 맞은 적이 3초 동안 같은 종류 적을 때림) · 4 백색 거울궁(24타, 2.5초 동안 맞으면 30% 되돌림) · 추가 공격(35%): 영혼의 틈(방향키 3개로 고정) · 백령 빙의(25% 바로 빙의) · 강제 성전(쓰러지면 분신, 살면 5초 같은 종류를 때림) · 허수의 분신(분신 최대 4)",
    "스킬(1~4키, 몸속에서는 못 씀): 고해의 속삭임(15타 + 3초 못 움직임) → 반전된 구원(16타, 적끼리 5초 싸움) · 정화의 역설(16타, 주는 피해 절반 3초) → 백색 성역의 기만(32타 + 10초 기절) · 천사의 거짓 날개(아무렇게나 32타, 방향키 -1) → 천개의 거짓 눈(레이저 100발 + 0.5초 기절) · 영혼 전이(16타 후 맞은 적에게 차례로 빙의) → 종언의 무구한 지배(방의 모든 적에게 차례로 빙의 · 3초 뒤 한 번 더)",
  ],
};

export const GUIDE_EN_ASHVAR6: Guide = {
  blanc: [
    "Ashvar · Blanc 'the White of the Primordial Chromatic Demon Legion of Seven Colors' · HP 100 · Damage 8 · Move 1.35 · one weapon, the Pure White Fan · no passives · unlock with 450,000 lobby chips",
    "Adaptation, upgrades, ranks and Restraint work like Noir: a full Black gauge levels you up and grants one upgrade · base/extra attacks have 4 stages · skills have upgraded versions · Lesser → Middle → Greater → Arch Demon",
    "White Dance (possession): dashing turns the screen gray and slows everything for 3s · 4 arrow keys appear over foes in range (not bosses) → enter them to slip inside that foe (you vanish and are invulnerable) · a mistake is just a dash (next try in 10s), success in 3s · inside, you strike other foes with that monster's body (no Blanc base attacks or skills, extra attacks still fire) · dash again after 3s to hop to another foe (+1 key) · up to 10s; leaving or hopping deals 600% of Damage to that foe · foes needing 0 keys take that hit as soon as you dash",
    "Base attacks: 1 Pure White Fan Dance (3 hits ahead) · 2 False Blessing (6 hits at the cursor) · 3 Stigmata Puppet Show (12 hits; foes attack their own kind for 3s) · 4 White Mirror Palace (24 hits; for 2.5s, 30% to reflect hits) · Extra attacks (35%): Soul Rift (keys fixed at 3) · White Spirit Possession (25% instant possession) · Forced Crusade (a double if it falls, else it attacks its kind for 5s) · Imaginary Double (up to 4 doubles)",
    "Skills (keys 1–4, not while inside a foe): Whisper of Confession (15 hits + 3s no movement) → Inverted Salvation (16 hits; foes fight each other for 5s) · Paradox of Purification (16 hits; half damage dealt for 3s) → Deceit of the White Sanctuary (32 hits + 10s stun) · False Wings of the Angel (32 random hits, -1 key) → Thousand False Eyes (100 lasers + 0.5s stun) · Soul Transfer (16 hits, then possess each hit foe in turn) → Final Immaculate Dominion (possess every foe in turn · again 3s later)",
  ],
};

export const GUIDE_JA_ASHVAR6: Guide = {
  blanc: [
    "アシュヴァル・ブラン「太初の色彩悪魔七原色軍団の白」・体力100・攻撃力8・移動1.35・武器は純白の扇ひとつ・パッシブなし・ロビーチップ45万枚で解放",
    "適応力・強化・昇格・制約はノワールと同じ：黒が満ちるとレベルアップと強化1回・基本／追加攻撃4段階・スキル強化版・下位→中位→高位→大悪魔",
    "白舞（憑依）：ダッシュすると画面が灰色になり3秒間すべての動きが遅くなる・攻撃範囲内の敵（ボス以外）の頭上に方向キー4個 → その通り押した敵の体内に入る（自分は消えて無敵）・間違えるとただのダッシュ（次の憑依まで10秒）、成功なら3秒・体内ではそのモンスターの体で他の敵を攻撃（ブランの基本攻撃・スキルなし、追加攻撃は出る）・3秒後にダッシュすると別の敵に乗り移る（方向キー+1）・最大10秒、抜ける時や乗り移る時その敵に攻撃力の600%・方向キー0個の敵は選んだ瞬間にその一撃",
    "基本攻撃：1 純白の扇舞（前方3ヒット）・2 偽りの祝福（マウス位置6ヒット）・3 聖痕の人形劇（12ヒット、当たった敵は3秒間同じ種類の敵を攻撃）・4 白き鏡宮（24ヒット、2.5秒間被弾時30%で反射）・追加攻撃（35%）：魂の隙間（方向キー3個に固定）・白霊憑依（25%ですぐ憑依）・強制聖戦（倒れると分身、生きていれば5秒同じ種類を攻撃）・虚数の分身（分身最大4）",
    "スキル（1〜4キー、体内では使えない）：告解の囁き（15ヒット＋3秒移動不可）→ 反転した救済（16ヒット、敵同士が5秒戦う）・浄化の逆説（16ヒット、与ダメージ半分3秒）→ 白き聖域の欺瞞（32ヒット＋10秒気絶）・天使の偽りの翼（ランダム32ヒット、方向キー-1）→ 千の偽りの眼（レーザー100発＋0.5秒気絶）・魂の転移（16ヒット後に当たった敵へ順に憑依）→ 終焉の無垢なる支配（部屋の全ての敵に順に憑依・3秒後にもう一度）",
  ],
};
