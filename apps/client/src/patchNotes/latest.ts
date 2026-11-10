import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
  {
    version: "0.52.10",
    date: "2026-11-10",
    items: {
      ko: [
        "새 캐릭터 쉐도잉 (실베르): 그림을 그리는 정령 소녀 · 무기는 마법 붓 하나 · 누르고 있는 동안 마우스 자리(붓 끝)를 따라 바닥에 먹 획을 그려 공격 (마우스 커서가 붓으로 바뀜) · 획에 닿은 적은 계속 피해 · 잉크 100을 써서 그리고 손을 떼면 다시 참",
        "그린 모양에 따라 기술: 처음과 끝이 만나는 닫힌 원 = 봉인 (안의 적 공격력 250% · 묶음) · 곧은 줄 = 일필 베기 (공격력 180%) · 자동 조준이면 붓이 가까운 적 둘레를 돌며 원을 그림",
        "쉐도잉 전용 패시브 20: 모두 새 기술·능력과 능력치 · 쉐도잉 효과 5 (검무 일필 · 수묵 산수화 · 연꽃 각성 · 학과 구름 · 벚꽃 물결) · 레이드 맵 잔패턴 15 (봉인 사슬 · 불기둥 획 · 얼음 결정 · 먹 소용돌이 · 달 낙관 · 별 꺾임 · 멈춘 시계 · 유령 먹 · 가시 장미 · 혜성 붓 · 나비 붓끝 · 황금 문 · 날개 획 · 유성 낙하 · 먹의 용)",
      ],
      en: [
        "New character Shadowing (Silber): the painting spirit girl · one weapon, the Magic Brush · hold to paint ink strokes on the floor following your cursor (the cursor becomes a brush) · foes touching a stroke keep taking damage · painting uses 100 ink, which refills when you let go",
        "Shapes trigger skills: a closed loop whose ends meet = Seal (250% damage to foes inside · binds them) · a straight line = One-Stroke Slash (180% damage) · with auto-aim the brush circles the nearest foe",
        "Shadowing's 20 exclusive passives, each granting a new skill or ability plus stats · 5 Shadowing effects (Sword Dance Stroke · Ink Landscape · Lotus Awakening · Crane and Cloud · Sakura Wave) · 15 raid map patterns (Sealing Chain · Flame Pillar Stroke · Ice Crystal · Ink Vortex · Moon Seal Stamp · Star Corners · Stopped Clock · Ghost Ink · Thorned Rose · Comet Brush · Butterfly Tip · Golden Gate · Winged Stroke · Meteor Fall · Ink Dragon)",
      ],
      ja: [
        "新キャラクター シャドーイング（シルベル）：絵を描く精霊の少女・武器は魔法の筆ひとつ・押している間カーソル（筆先）に沿って床に墨の線を描いて攻撃（カーソルが筆に変わる）・線に触れた敵は継続ダメージ・インク100を使って描き、離すと回復",
        "描いた形で技：始めと終わりが出会う閉じた円＝封印（中の敵に攻撃力250%・拘束）・まっすぐな線＝一筆斬り（攻撃力180%）・自動照準なら筆が近い敵の周りを回って円を描く",
        "シャドーイング専用パッシブ20：すべて新しい技・能力と能力値・シャドーイングの効果5（剣舞一筆・水墨山水画・蓮華覚醒・鶴と雲・桜の波）・レイドのマップ模様15（封印の鎖・火柱の線・氷の結晶・墨の渦・月の落款・星の角・止まった時計・幽霊の墨・棘の薔薇・彗星の筆・蝶の筆先・黄金の門・翼の線・流星落下・墨の龍）",
      ],
    },
  },
];
