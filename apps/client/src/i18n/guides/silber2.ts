// 캐릭터 설명: 실베르 (인형술사·래빗) · 한·영·일 (수치는 weaponsPuppet·itemsPuppet·weaponsRabbit·itemsRabbit·factionDefs.FACTION_GROWTH와 맞춤) — silber.ts가 커서 나눔
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER2: Guide = {
  puppeteer: [
    "실베르 · 인형술사 '붉은 실로 인형을 부리는 소녀' · 체력 90 · 공격력 7 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 전용 패시브 하나마다 최대 체력 +3 · 공격력·공격 속도 +1% · 투사체 속도 +2% · 이동 속도 +1%, 30개까지)",
    "실 조종: 마우스 자리가 곧 반투명한 커다란 손 (손이 닿는 거리 140까지 · 사거리 증가만큼 멀리·크게) · 짧게 클릭 = 손 크기(반지름 20) 아래로 실을 내리쳐 공격력의 130% (0.27초마다, 공격 속도가 빠를수록 자주)",
    "꾹 누르기 = 손 아래 적에게 실을 걸어 조종 게이지를 채움 (약 1.3초 · 체력이 많은 적일수록 최대 3배 오래) → 가득 차면 머리 위에 나무 왕관이 씌워지고 아군이 됨 (보스 빼고 · 최대 3) · 게이지를 채우는 동안 그 적이 피해를 받거나 나를 때리면 0으로 · 손이 떠나면 조금씩 줄어듦 · 왕관 쓴 아군은 원래 체력의 1.5배로 나를 따라다니며 가까운 적을 때림 (공격력의 90%) · 방을 옮기면 같이 옴 · 자동 조준이면 조종할 수 있는 적은 조종하고 아니면 계속 내리침",
    "무기: 인형술사의 손 하나 · 전용 아이템 20 (모두 새 기술·능력 + 능력치): 미니 인형 8종(리본·태엽·광대·신사·공주·춤추는·빨간 망토·고양이 — 때릴 때 확률로 내 쪽에서 나와 적에게 달려가 터짐) · 시체 폭발 · 내 친구~(거대 인형 친구) · 검은 실 · 분신 · 네 번째 왕관 · 실타래 · 긴 실 · 거미줄 · 꼭두각시 춤 · 마지막 인사 · 바느질 · 금사슬",
  ],
  rabbit: [
    "실베르 · 래빗 '망치를 든 유령 소녀' · 체력 95 · 공격력 9 · 이동 1.2 · 행운 2 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 전용 패시브 하나마다 능력치가 더 오름)",
    "토끼 망치: 누르면 바라보는 쪽 앞(거리 30)에 망치를 내리찍어 반지름 24 땅울림 · 공격력의 125% · 맞은 적은 뒤로 밀려남 (0.5초마다, 공격 속도가 빠를수록 자주 · 사거리 증가만큼 멀리·크게)",
    "전용 아이템 20 (모두 새 기술·능력 + 능력치): 땅울림(맵 끝까지 나아가는 파동) · 세 갈래 땅울림 · 토끼인장 · 홈런!(10% 확률 큰 휘두르기 · 3배 밀침 · 30% 확률로 맵 밖으로, 보스 빼고) · 슈퍼 럭키!(전용 아이템 7개부터 · 공격할 때 3% 확률 초거대 망치 · 30초 쿨타임) · 당근 간식 · 긴 귀 · 깡총 뛰기 · 네잎클로버 · 방울 · 유령 망치 · 묵직한 망치 · 쿵쿵쿵 · 여진 · 갈라진 땅 · 달토끼 · 폭신한 솜털 · 왕망치 · 럭키 피버 · 별사탕",
    "슈퍼 럭키!: 맵을 가릴 만큼 큰 망치가 왼쪽에서 빠르게 나와 맵 1/5쯤에서 슬로우 모션 → 그동안 방 안 적 모두가 피해를 나눠 최대 60번 빠르게 맞음 (나는 무적) → 망치가 맵을 다 가리면 오른쪽 밖으로 빠르게 휘둘러짐",
  ],
};

export const GUIDE_EN_SILBER2: Guide = {
  puppeteer: [
    "Silber · Puppeteer, the girl who works dolls on red strings · 90 HP · 7 damage · 1.2 move · 1 luck · weak at first but grows with every passive (faction trait: each exclusive passive grants +3 max HP · +1% damage and attack speed · +2% projectile speed · +1% move speed, up to 30)",
    "String Control: your cursor is a giant translucent hand (reaching up to 140 · farther and bigger with range) · tap = whip threads down under the hand (radius 20) for 130% of damage (every 0.27s, more often with attack speed)",
    "Hold = string the foe under your hand and fill a control gauge (about 1.3s · up to 3x longer for tougher foes) → when full, a wooden crown lands on its head and it becomes your ally (not bosses · up to 3) · the gauge resets if that foe takes damage or hits you, and slowly drains while your hand is away · crowned allies have 1.5x their HP, follow you and hit nearby foes (90% of damage) · they follow you between rooms · with auto-aim you control what you can and whip the rest",
    "Weapon: one Puppeteer's Hand · 20 exclusive items (each unlocks a new skill or ability + stats): 8 mini dolls (Ribbon · Wind-up · Jester · Gentleman · Princess · Dancing · Red Hood · Cat — thread strikes may send one from you to rush a foe and burst) · Corpse Burst · My Friend~ (giant doll friend) · Black Thread · Doppelganger · Fourth Crown · Spool · Long Thread · Cobweb · Marionette Dance · Final Bow · Stitching · Golden Chain",
  ],
  rabbit: [
    "Silber · Rabbit, the hammer-wielding ghost girl · HP 95 · damage 9 · move 1.2 · luck 2 · starts weak but grows with every passive (faction trait: each exclusive passive raises stats further)",
    "Bunny Hammer: slam the hammer in front of you (30 ahead) for a radius-24 quake · 125% of damage · knocks foes back (every 0.5s, faster with attack speed · range increases reach farther and wider)",
    "20 exclusive items (each a new skill or ability + stats): Ground Quake (a wave that rolls to the map edge) · Triple Quake · Bunny Seal · Home Run! (10% giant swing · 3x knockback · 30% chance to send foes off the map, not bosses) · Super Lucky! (from 7 Rabbit items · 3% per swing for the colossal hammer · 30s cooldown) · Carrot Snack · Long Ears · Bunny Hop · Four-Leaf Clover · Little Bell · Ghost Hammer · Heavy Hammer · Thump Thump · Aftershock · Cracked Ground · Moon Rabbit · Fluffy Fur · Mega Hammer · Lucky Fever · Star Candy",
    "Super Lucky!: a hammer big enough to cover the map rushes in from the left and drops into slow motion about 1/5 of the way in → every foe in the room takes up to 60 rapid split hits (you are invincible) → once it covers the map it swings off to the right",
  ],
};

export const GUIDE_JA_SILBER2: Guide = {
  puppeteer: [
    "シルベル・人形使い『赤い糸で人形を操る少女』・体力90・攻撃力7・移動1.2・幸運1・最初は弱いがパッシブを得るほど強くなる（陣営の特徴：専用パッシブ1つごとに最大体力+3・攻撃力・攻撃速度+1%・弾速+2%・移動速度+1%、30個まで）",
    "糸操り：カーソルが半透明の大きな手になる（手が届く距離140まで・射程増加で遠く大きく）・短くクリック＝手の大きさ（半径20）だけ下へ糸を叩きつけ攻撃力の130%（0.27秒ごと、攻撃速度が速いほど頻繁）",
    "長押し＝手の下の敵に糸をかけ操りゲージをためる（約1.3秒・体力が多い敵ほど最大3倍長く）→満タンで頭に木の冠がかぶさり味方になる（ボス以外・最大3）・ためている間にその敵がダメージを受けるか自分を叩くと0に・手が離れると少しずつ減る・冠をかぶった味方は元の体力の1.5倍で自分について回り近くの敵を叩く（攻撃力の90%）・部屋を移ると一緒に来る・自動照準なら操れる敵は操り、それ以外は叩き続ける",
    "武器：人形使いの手ひとつ・専用アイテム20（すべて新しい技・能力＋能力値）：ミニ人形8種（リボン・ゼンマイ・道化・紳士・姫・踊る・赤ずきん・猫 — 叩くと確率で自分から飛び出し敵に突っ込んで弾ける）・死体爆発・ぼくのともだち〜（巨大人形の友達）・黒い糸・分身・四つ目の冠・糸巻き・長い糸・蜘蛛の巣・操り人形の舞・最後のお辞儀・縫い合わせ・金の鎖",
  ],
  rabbit: [
    "シルベル・ラビット「ハンマーを持つ幽霊の少女」・体力95・攻撃力9・移動1.2・幸運2・最初は弱いがパッシブを取るほど強くなる（陣営の特徴：専用パッシブひとつごとに能力値がさらに上がる）",
    "うさぎハンマー：押すと向いている方向の前（距離30）にハンマーを叩きつけ半径24の地響き・攻撃力の125%・当たった敵は後ろへ飛ばされる（0.5秒ごと、攻撃速度が速いほど頻繁・射程増加の分だけ遠く大きく）",
    "専用アイテム20（すべて新しい技・能力＋能力値）：地響き（マップの端まで進む波）・三つ又の地響き・うさぎの印・ホームラン！（10%で大振り・3倍吹き飛ばし・30%でマップの外へ、ボス以外）・スーパーラッキー！（専用アイテム7個から・攻撃時3%で超巨大ハンマー・30秒クールタイム）・にんじんおやつ・長い耳・ぴょんぴょん・四つ葉のクローバー・鈴・幽霊ハンマー・ずっしりハンマー・ドンドンドン・余震・ひび割れた地面・月うさぎ・ふわふわの毛・特大ハンマー・ラッキーフィーバー・金平糖",
    "スーパーラッキー！：マップを覆うほどのハンマーが左から素早く現れ、マップの1/5ほどでスローモーション→その間、部屋の敵全員がダメージを分けて最大60回素早く受ける（自分は無敵）→ハンマーがマップを覆うと右の外へ素早く振り抜かれる",
  ],
};
