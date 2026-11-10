import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.12",
    date: "2026-11-11",
    items: {
      ko: [
        "새 캐릭터 래빗 (실베르): 망치를 든 유령 소녀 · 무기는 토끼 망치 하나 · 누르면 바라보는 쪽 앞에 망치를 내리찍어 둘레 적에게 땅울림 (공격력 125%) · 맞은 적은 뒤로 밀려남",
        "래빗 전용 패시브 20: 모두 새 기술·능력과 능력치 · 땅울림 (커진 땅울림이 그 크기 그대로 앞으로 맵 끝까지) · 세 갈래 땅울림 · 토끼인장 (찍은 곳에서 토끼가 나와 터짐) · 홈런! (10% 확률 큰 휘두르기 · 3배 밀침 · 30% 확률로 맵 밖으로 날려 즉사, 보스 빼고) · 당근 간식 · 긴 귀 · 깡총 뛰기 · 네잎클로버 · 방울 · 유령 망치 · 묵직한 망치 · 쿵쿵쿵 · 여진 · 갈라진 땅 · 달토끼 · 폭신한 솜털 · 왕망치 · 럭키 피버 · 별사탕",
        "슈퍼 럭키! (래빗 전용 아이템 7개부터 · 공격할 때 3% · 쿨타임 30초): 맵을 가릴 만큼 큰 망치가 왼쪽에서 빠르게 나와 맵 1/5쯤에서 슬로우 모션 → 방 안 적 모두가 피해를 나눠 최대 30번 맞음 (맞을 때마다 높아지는 타격음 · 그동안 무적) → 맵을 다 가리면 오른쪽 밖으로 휘둘러짐",
      ],
      en: [
        "New character Rabbit (Silber): the hammer-wielding ghost girl · one weapon, the Bunny Hammer · slam it in front of you to quake nearby foes (125% damage) · they get knocked back",
        "Rabbit's 20 exclusive passives, each granting a new skill or ability plus stats · Ground Quake (the grown quake ring rolls forward at full size to the map edge) · Triple Quake · Bunny Seal (a bunny pops out where you slam and bursts) · Home Run! (10% giant swing · 3x knockback · 30% chance to send foes flying off the map for an instant kill, not bosses) · Carrot Snack · Long Ears · Bunny Hop · Four-Leaf Clover · Little Bell · Ghost Hammer · Heavy Hammer · Thump Thump · Aftershock · Cracked Ground · Moon Rabbit · Fluffy Fur · Mega Hammer · Lucky Fever · Star Candy",
        "Super Lucky! (from 7 Rabbit items · 3% per swing · 30s cooldown): a hammer big enough to cover the map rushes in from the left and drops into slow motion about 1/5 of the way in → every foe in the room takes up to 30 split hits (each hit rings higher · you are invincible) → once it covers the map it swings off to the right",
      ],
      ja: [
        "新キャラクター ラビット（シルベル）：ハンマーを持つ幽霊の少女・武器はうさぎハンマーひとつ・押すと向いている方向の前にハンマーを叩きつけ周りの敵に地響き（攻撃力125%）・当たった敵は後ろへ飛ばされる",
        "ラビット専用パッシブ20：すべて新しい技・能力と能力値・地響き（広がった地響きがその大きさのまま前へマップの端まで）・三つ又の地響き・うさぎの印（叩いた所からうさぎが出て弾ける）・ホームラン！（10%で大振り・3倍吹き飛ばし・30%でマップの外へ飛ばして即死、ボス以外）・にんじんおやつ・長い耳・ぴょんぴょん・四つ葉のクローバー・鈴・幽霊ハンマー・ずっしりハンマー・ドンドンドン・余震・ひび割れた地面・月うさぎ・ふわふわの毛・特大ハンマー・ラッキーフィーバー・金平糖",
        "スーパーラッキー！（ラビット専用アイテム7個から・攻撃時3%・クールタイム30秒）：マップを覆うほどのハンマーが左から素早く現れマップの1/5ほどでスローモーション→部屋の敵全員がダメージを分けて最大30回受ける（当たるたび高くなる打撃音・その間無敵）→マップを覆うと右の外へ振り抜かれる",
      ],
    },
  },
  {
    version: "0.52.11",
    date: "2026-11-11",
    items: {
      ko: [
        "새 캐릭터 인형술사 (실베르): 붉은 실로 인형을 부리는 소녀 · 무기는 손 하나 · 마우스 커서가 반투명한 커다란 손으로 바뀜 · 짧게 클릭 = 손 크기만큼 아래로 실을 내리쳐 공격 (공격력 130%)",
        "꾹 누르기 = 손 아래 적에게 실을 걸어 조종 게이지를 채움 → 가득 차면 머리 위에 나무 왕관이 씌워지고 아군이 되어 같이 싸움 (보스 빼고 · 최대 3) · 게이지를 채우는 동안 그 적이 피해를 받거나 나를 때리면 0으로 · 손이 떠나면 조금씩 줄어듦 · 아군은 방을 옮겨도 따라옴",
        "인형술사 전용 패시브 20: 모두 새 기술·능력과 능력치 · 미니 인형 8종 (때릴 때 확률로 내 쪽에서 나와 적에게 달려가 터짐: 리본 묶음 · 태엽 끌어당김 · 광대 파편 · 신사 큰 폭발 · 공주 회복 · 춤꾼 한 번 더 · 빨간 망토 불 · 고양이 느려짐) · 시체 폭발 · 내 친구~ (거대 인형 친구, 쓰러지면 30초 뒤 다시) · 검은 실 (20개 느려짐 · 30개 검게 터짐, 보스에게도) · 분신 (적을 모두 끌어들임, 30초마다) · 네 번째 왕관 · 실타래 · 긴 실 · 거미줄 · 꼭두각시 춤 · 마지막 인사 · 바느질 · 금사슬",
      ],
      en: [
        "New character Puppeteer (Silber): the girl who works dolls on red strings · one weapon, her hand · your cursor becomes a giant translucent hand · tap = whip threads down under the hand (130% damage)",
        "Hold = string the foe under your hand and fill a control gauge → when full, a wooden crown lands on its head and it fights for you (not bosses · up to 3) · the gauge resets if that foe takes damage or hits you, and slowly drains while your hand is away · allies follow you between rooms",
        "Puppeteer's 20 exclusive passives, each granting a new skill or ability plus stats · 8 mini dolls (thread strikes may send one from you to rush a foe and burst: Ribbon binds · Wind-up pulls · Jester shards · Gentleman big blast · Princess heals · Dancer bounces · Red Hood burns · Cat slows) · Corpse Burst · My Friend~ (giant doll friend, back 30s after falling) · Black Thread (20 slow · 30 burst black, bosses too) · Doppelganger (draws every foe, every 30s) · Fourth Crown · Spool · Long Thread · Cobweb · Marionette Dance · Final Bow · Stitching · Golden Chain",
      ],
      ja: [
        "新キャラクター 人形使い（シルベル）：赤い糸で人形を操る少女・武器は手ひとつ・カーソルが半透明の大きな手に変わる・短くクリック＝手の大きさだけ下へ糸を叩きつけて攻撃（攻撃力130%）",
        "長押し＝手の下の敵に糸をかけ操りゲージをためる→満タンで頭に木の冠がかぶさり味方になって一緒に戦う（ボス以外・最大3）・ためている間にその敵がダメージを受けるか自分を叩くと0に・手が離れると少しずつ減る・味方は部屋を移ってもついてくる",
        "人形使い専用パッシブ20：すべて新しい技・能力と能力値・ミニ人形8種（叩くと確率で自分から飛び出し敵に突っ込んで弾ける：リボン拘束・ゼンマイ引き寄せ・道化の破片・紳士の大爆発・姫の回復・踊り子もう一度・赤ずきんの炎・猫の鈍足）・死体爆発・ぼくのともだち〜（巨大人形の友達、倒れると30秒後に復活）・黒い糸（20本で鈍足・30本で黒く弾ける、ボスにも）・分身（敵をすべて引きつける、30秒ごと）・四つ目の冠・糸巻き・長い糸・蜘蛛の巣・操り人形の舞・最後のお辞儀・縫い合わせ・金の鎖",
      ],
    },
  },
];
