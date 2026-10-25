import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.31.0",
    date: "2026-10-20",
    items: {
      ko: [
        "새 캐릭터 '원소술사': 몸 둘레를 도는 회전체가 닿은 적을 때립니다 (몸에 붙은 적도 구슬이 휩쓸고 지나가며 맞힘). 시작 무기는 원소구슬(불·물·땅·번개·풀 구슬 5개)",
        "원소술사 전용 무기 10개: 원소구슬 · 빛 구슬(경직) · 은하수(따라다니는 장판) · 행성(8개, 각자 다른 효과) · 웨폰 마스터(검이 날아가 때림) · 중력(둔화·내려찍기) · 갓 핸드(잡아 들어 내려찍기, 보스전은 돌멩이로 2배) · 별똥별(세 겹) · 강철 구슬(적 탄 막기·총알) · 트리거(구슬을 쏘고 재장전, 15개면 한꺼번에). 원소술사는 전용 무기만 얻습니다",
        "원소술사 전용 아이템 10개: 완벽한 원형 · 결벽증 · 천지창조(여러 개 가질 수 있음) · 일렉트로닉 · 행운 · 펫 · 더 크게! · 아름답게! · 화려하게! · 굳건하게!",
        "업적 '원소의 귀환'(원소술사로 클리어) 추가",
      ],
      en: [
        "New character: the Elementalist. Orbs circling you hit whatever they touch (they sweep through enemies pressed against you too). Starts with Elemental Orbs (fire, water, earth, lightning and grass)",
        "10 Elementalist weapons: Elemental Orbs · Light Orbs (stun) · Milky Way (a field that follows you) · Planets (8, each with its own effect) · Blade Lord (swords fly at enemies) · Gravity (slow and slam) · Giant Hand (grab and slam; grabs a rock for 2x against bosses) · Shooting Stars (three rings) · Steel Orbs (block shots, fire bullets) · Trigger (launch orbs and reload; all 15 at once when full). The Elementalist only finds their own weapons",
        "10 Elementalist items: Perfect Circle · Neat Freak · Genesis (stacks) · Electronic · Lucky Bounce · Pet · Bigger! · Beautiful! · Flashy! · Steadfast!",
        "New achievement: Elements Return (clear as the Elementalist)",
      ],
      ja: [
        "新キャラクター「元素術師」：体の周りを回る回転体が触れた敵を打ちます（体に張り付いた敵も珠が薙ぎ払って当たる）。初期武器は元素の珠（火・水・土・雷・草の珠5つ）",
        "元素術師専用武器10種：元素の珠 · 光の珠（硬直） · 天の川（付いて回る場） · 惑星（8つ、それぞれ違う効果） · ウェポンマスター（剣が飛んで斬る） · 重力（鈍化・叩きつけ） · ゴッドハンド（つかんで叩きつける、ボス戦は石で2倍） · 流れ星（三重） · 鋼の珠（敵の弾を防ぐ・弾を撃つ） · トリガー（珠を撃ってリロード、15個なら一斉に）。元素術師は専用武器だけを手に入れます",
        "元素術師専用アイテム10種：完璧な円 · 潔癖症 · 天地創造（重ねて持てる） · エレクトロニック · 幸運 · ペット · もっと大きく！ · 美しく！ · 華やかに！ · 揺るぎなく！",
        "実績「元素の帰還」（元素術師でクリア）を追加",
      ],
    },
  },
  {
    version: "0.30.1",
    date: "2026-10-20",
    items: {
      ko: [
        "벚꽃 부적이 진짜 벚꽃처럼 보입니다: 핫핑크 다섯 꽃잎이 큼직하게 천천히 돌며, 쏠 때마다 조금씩 비껴 나가 바람에 흩날리듯 퍼집니다. 속도는 2배 더 느려졌습니다",
        "벚꽃 부적 추가 효과가 터지면 그 자리에 벚꽃이 만개합니다 (가운데 큰 꽃과 둘레 여섯 송이가 피어나고 꽃잎이 흩날림)",
      ],
      en: [
        "The Blossom Talisman now looks like real cherry blossoms: big hot-pink five-petal flowers turn slowly, and each shot veers a little so they spread as if scattered by the wind. They are also 2 times slower",
        "When the Blossom Talisman's bonus triggers, cherry blossoms burst into full bloom on the spot (a large flower with six around it, petals scattering)",
      ],
      ja: [
        "桜の符が本物の桜のように見えるようになりました：ホットピンクの大きな5枚の花びらがゆっくり回り、撃つたびに少しずつ逸れて風に舞うように広がります。速度はさらに2倍遅くなりました",
        "桜の符の追加効果が発動すると、その場で桜が満開になります（中央の大きな花と周りの6輪が咲き、花びらが舞う）",
      ],
    },
  },
  {
    version: "0.30.0",
    date: "2026-10-20",
    items: {
      ko: [
        "적에게 들어간 피해가 숫자로 떠오릅니다 (설정의 '피해 숫자 보기'로 켜고 끄기, 처음에는 켜져 있음)",
        "연습장: 허수아비를 때리면 허수아비 아래에 평균 피해·초당 피해·직전 피해·총 피해가 보입니다. 3초 동안 안 때리면 사라지고 처음부터 셉니다",
      ],
      en: [
        "Damage dealt to enemies now pops up as numbers (toggle with Show damage numbers in Settings, on by default)",
        "Practice: hitting the scarecrow shows average hit, damage per second, last hit and total damage right below it. It resets after 3 seconds without a hit",
      ],
      ja: [
        "敵に与えたダメージが数字で表示されるようになりました（設定の「ダメージの数字を表示」で切り替え、最初はオン）",
        "練習場：かかしを攻撃するとかかしの下に平均ダメージ・毎秒ダメージ・直前ダメージ・合計ダメージが表示されます。3秒間攻撃しないと消えて最初から数えます",
      ],
    },
  },
];
