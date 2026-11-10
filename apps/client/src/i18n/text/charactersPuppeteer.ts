// 화면 글자: 실베르 인형술사(붉은 실로 인형을 부리는 소녀) 이름·설명 · 버프 창(왕관·인형 친구·분신) · 패왕전 스킬 이름 · 해금
export const CHARACTER_TEXT_PUPPETEER = {
  puppeteer: { ko: "인형술사", en: "Puppeteer", ja: "人形使い" },
  puppetHand: { ko: "실 조종", en: "String Control", ja: "糸操り" },
  puppeteerDesc: {
    ko: "실베르의 붉은 실로 인형을 부리는 소녀 · 마우스 자리가 곧 커다란 손(반투명) · 짧게 클릭 = 손 크기만큼 아래로 실을 내리쳐 공격 · 꾹 누르기 = 손 아래 적에게 실을 걸어 조종 게이지를 채움 → 가득 차면 머리 위에 나무 왕관이 씌워지고 아군이 되어 같이 싸움 (보스 빼고 · 최대 3) · 게이지를 채우는 동안 그 적이 피해를 받거나 나를 때리면 0으로, 손이 떠나면 조금씩 줄어듦 · 무기는 손 하나 · 전용 패시브 20개는 모두 새 기술과 능력치를 줌",
    en: "Silber's girl who works dolls on red strings · your cursor is a giant (translucent) hand · tap = whip threads down under the hand · hold = string the foe under your hand and fill a control gauge → when full, a wooden crown lands on its head and it fights for you (not bosses · up to 3) · the gauge resets if that foe takes damage or hits you, and slowly drains while your hand is away · one weapon, the hand · all 20 exclusive passives unlock a new skill and grant stats",
    ja: "シルベルの赤い糸で人形を操る少女・カーソルが大きな手（半透明）になる・短くクリック＝手の大きさだけ下へ糸を叩きつけて攻撃・長押し＝手の下の敵に糸をかけ操りゲージをためる→満タンで頭に木の冠がかぶさり味方になって一緒に戦う（ボス以外・最大3）・ためている間にその敵がダメージを受けるか自分を叩くと0に、手が離れると少しずつ減る・武器は手ひとつ・専用パッシブ20個はすべて新しい技と能力値をくれる",
  },
  bfPpCrown: { ko: "나무 왕관 {n}/{m}", en: "Wooden crowns {n}/{m}", ja: "木の冠{n}/{m}" },
  bfPpCrownTip: {
    ko: "꾹 눌러 적에게 실을 걸면 게이지가 차고, 가득 차면 왕관 쓴 아군이 됨 (보스 빼고) · 그 적이 맞거나 나를 때리면 게이지 0 · 짧게 클릭하면 실 내리치기",
    en: "Hold on a foe to fill its gauge; when full it becomes a crowned ally (not bosses) · the gauge resets if it gets hit or hits you · tap to whip threads down",
    ja: "敵の上で長押しするとゲージがたまり、満タンで冠をかぶった味方になる（ボス以外）・その敵が叩かれるか自分を叩くとゲージ0・短くクリックで糸叩き",
  },
  bfPpGolem: { ko: "인형 친구 {s}초 뒤 다시", en: "Doll friend back in {s}s", ja: "人形の友達 {s}秒後に復活" },
  bfPpClone: { ko: "분신 {s}초", en: "Doppelganger cooldown {s}s", ja: "分身 {s}秒" },
  pwSk_puppeteer1: { ko: "실 내리치기", en: "Thread Whip", ja: "糸叩き" },
  pwSk_puppeteer2: { ko: "붉은 실 당기기", en: "Red String Pull", ja: "赤い糸引き" },
  pwSk_puppeteer3: { ko: "인형 돌진", en: "Doll Rush", ja: "人形の突進" },
  pwSk_puppeteer4: { ko: "내 친구의 내려찍기", en: "My Friend's Slam", ja: "ともだちの叩きつけ" },
  cg_puppeteer: { ko: "최대 체력 {n} 달성", en: "Reach {n} max HP", ja: "最大体力{n}達成" },
};
