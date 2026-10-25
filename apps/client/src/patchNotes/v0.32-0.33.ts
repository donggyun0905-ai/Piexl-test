import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.33.1",
    date: "2026-10-20",
    items: {
      ko: [
        "원소술사 웨폰 마스터: 검 5개가 돌지 않고 몸 둘레에 떠 있다가, 사거리 안 적에게 실제로 날아가 베고 돌아옵니다",
        "원소술사 별똥별: 바깥 9개 별이 적에게 실제로 날아가 맞히고 돌아옵니다",
        "격투가 주짓수: 두 번째 기술이 주변이 아니라 방 안의 적 전체를 고정합니다",
        "원소술사 색을 떠돌이와 헷갈리지 않게 청록색으로 바꿨습니다",
      ],
      en: [
        "Elementalist Blade Lord: the 5 swords no longer circle you; they hover in place and actually fly out to slash enemies in range, then return",
        "Elementalist Shooting Stars: the outer 9 stars actually fly to enemies, hit them and come back",
        "Brawler Jiu-Jitsu: the second move now pins every enemy in the room instead of only nearby ones",
        "The Elementalist's color is now teal so it isn't confused with the Drifter",
      ],
      ja: [
        "元素術師ウェポンマスター：剣5本が回らずに体の周りに浮かび、射程内の敵へ実際に飛んで斬ってから戻ります",
        "元素術師流れ星：外側の9つの星が敵へ実際に飛んで当たり、戻ってきます",
        "格闘家柔術：2番目の技が周りではなく部屋の敵全員を固定するようになりました",
        "元素術師の色を流れ者と紛らわしくないよう青緑に変えました",
      ],
    },
  },
  {
    version: "0.33.0",
    date: "2026-10-20",
    items: {
      ko: [
        "새 캐릭터 '의사': 직접 피해의 3%만큼 회복하고(초당 최대 2), 체력이 가득 찬 상태에서 받는 회복은 넘친 만큼 보호막이 됩니다(초과 치료, 최대 체력의 30%까지). 보호막은 체력보다 먼저 깎이고 HP 옆에 +숫자로 보입니다. 서든데스에서는 초과 치료가 꺼집니다",
        "의사 전용 무기 10개: 무기마다 공격 방식이 바뀝니다. 수술용 메스(짧은 부채꼴, 회복 2배) · 수혈 튜브(한 적에 꽂아 계속, 회복 3배) · 제세동기(전기 충격·기절) · 봉합 바늘(실로 잇고 3초 뒤 끌어모음) · 마취 가스통(둔화 장판) · 링거 폴대(한 바퀴 휘두르기) · 알약 산탄(부채꼴 5알) · 구급 키트 폭탄(폭발, 회복 알약) · 붕대 채찍(속박) · 구급차 호출(화면 밖에서 달려옴, 보호막으로 왕복). 시작 무기는 주사기 발사기",
        "의사 전용 아이템 10개: 상처 봉합 · 체력 관리 · 건강 체질 · 응급 처치 · 건강 검진 · 과잉 진료 · 처방전 · 의사 가운 · 수술 집도 · 항체 반응",
        "기계공학자 무기 피해 약 15% 증가 (기본 레이저 초당 피해 19 → 22)",
        "업적 '퇴원 수속'(의사로 클리어) 추가. '모두의 탈출'은 이제 의사를 포함한 여덟 캐릭터 모두 클리어해야 합니다 (이미 얻은 업적은 그대로)",
      ],
      en: [
        "New character: Doctor. Heals 3% of direct damage dealt (up to 2 per second), and healing received at full health turns into a shield (Overheal, up to 30% of max health). The shield absorbs damage first and shows as +number next to your HP. Overheal is off in Sudden Death",
        "10 Doctor weapons, each changing how you attack: Scalpel (short fan, double healing) · Transfusion Tube (stays plugged into one enemy, triple healing) · Defibrillator (shock and stun) · Suture Needle (threads enemies together, then pulls them in after 3s) · Anesthetic Canister (slowing cloud) · IV Pole (full spin) · Pill Scatter (5 pills in a fan) · Medkit Bomb (explodes, healing pills) · Bandage Whip (root) · Call Ambulance (charges in from off-screen, round trip with shield). Starts with the Syringe Launcher",
        "10 Doctor items: Wound Stitching · Health Care · Robust Body · First Aid · Checkup · Overtreatment · Prescription · Doctor's Coat · Lead Surgeon · Antibody Response",
        "Engineer weapons deal about 15% more damage (base laser 19 → 22 damage per second)",
        "New achievement: Discharged (clear as the Doctor). Everyone Escapes now needs clears with all eight characters, including the Doctor (already earned achievements stay)",
      ],
      ja: [
        "新キャラクター「医者」：直接ダメージの3%回復し（毎秒最大2）、体力満タンで受けた回復は余った分がシールドになります（過剰回復、最大体力の30%まで）。シールドは体力より先に減り、HPの横に+数字で表示されます。サドンデスでは過剰回復はオフです",
        "医者専用武器10種：武器を替えると攻撃方法が変わります。手術用メス（短い扇形、回復2倍） · 輸血チューブ（1体に刺して継続、回復3倍） · 除細動器（電気ショック・気絶） · 縫合針（糸でつなぎ3秒後に引き寄せ） · 麻酔ガス缶（鈍化フィールド） · 点滴スタンド（一回転） · 錠剤散弾（扇形に5粒） · 救急キット爆弾（爆発、回復錠剤） · 包帯ムチ（拘束） · 救急車呼び出し（画面外から突進、シールドで往復）。初期武器は注射器ランチャー",
        "医者専用アイテム10種：傷の縫合 · 体調管理 · 健康体質 · 応急処置 · 健康診断 · 過剰診療 · 処方箋 · 白衣 · 執刀 · 抗体反応",
        "エンジニアの武器ダメージ約15%アップ（基本レーザーの毎秒ダメージ 19 → 22）",
        "実績「退院手続き」（医者でクリア）を追加。「全員脱出」は医者を含む8キャラクターすべてでのクリアが必要になりました（獲得済みの実績はそのまま）",
      ],
    },
  },
  {
    version: "0.32.0",
    date: "2026-10-20",
    items: {
      ko: [
        "새 캐릭터 '격투가': 공격 키를 누를 때마다 콤보의 다음 기술이 이어지고 마지막 기술이 강합니다 (1초 쉬면 처음부터, 발 아래 점이 콤보 단계). 체력이 높고, 시작 무기는 주먹(앞 치기 → 발차기 → 무적 폭발)",
        "격투가 전용 무기 10개: 주먹 · 복싱 글러브(무적 5연타) · 킥(돌진·모아서 큰 범위) · 무에타이 · 유도(붙잡아 내리꽂기, 잡은 적에게는 피해 없음) · 주짓수(빨아들이고 3초 고정) · 종합격투기(5단 콤보) · 가라테(버티며 받은 피해 ×3 되받아치기, 체력 20% 이하 적 마무리) · 택견(아주 빠른 4단 콤보) · 에너지파(모은 만큼 세고 굵은 레이저). 격투가는 전용 무기만 얻습니다",
        "격투가 전용 아이템 10개: 공방일체 · 존 · 금강불괴 · 속도는 곧 힘 · 마하 · 차력쇼 · 취권 · 위압 · 혈마 · K.O",
        "업적 '격투가의 귀환'(격투가로 클리어) 추가",
      ],
      en: [
        "New character: the Brawler. Each press of attack chains into the next move of a combo and the last move hits hardest (rest for 1s and it starts over; the dots under your feet show the step). High health, starts with Fists (jab → kick → invulnerable burst)",
        "10 Brawler weapons: Fists · Boxing Gloves (invulnerable 5-hit rush) · Kicks (dash, charged big area) · Muay Thai · Judo (grab and slam; no damage from the held enemy) · Jiu-Jitsu (pull in and pin for 3s) · Mixed Martial Arts (5-step combo) · Karate (brace and return 3x the damage taken, finish enemies at 20% health) · Taekkyon (very fast 4-step combo) · Energy Wave (a beam that grows stronger and wider the longer you charge). The Brawler only finds their own weapons",
        "10 Brawler items: Offense Is Defense · In the Zone · Diamond Body · Speed Is Power · Mach · Strongman Show · Drunken Fist · Intimidate · Blood Demon · K.O.",
        "New achievement: Brawler's Return (clear as the Brawler)",
      ],
      ja: [
        "新キャラクター「格闘家」：攻撃キーを押すたびにコンボの次の技がつながり、最後の技が強力です（1秒休むと最初から、足元の点がコンボの段階）。体力が高く、初期武器は拳（前打ち → 蹴り → 無敵の爆発）",
        "格闘家専用武器10種：拳 · ボクシンググローブ（無敵の5連打） · キック（突進・溜めて大きな範囲） · ムエタイ · 柔道（つかんで叩きつけ、つかんだ敵からはダメージなし） · 柔術（引き寄せて3秒固定） · 総合格闘技（5段コンボ） · 空手（耐えて受けたダメージ×3で反撃、体力20%以下の敵にとどめ） · テッキョン（とても速い4段コンボ） · エネルギー波（溜めるほど強く太いレーザー）。格闘家は専用武器だけを手に入れます",
        "格闘家専用アイテム10種：攻防一体 · ゾーン · 金剛不壊 · 速さは力 · マッハ · 怪力ショー · 酔拳 · 威圧 · 血魔 · K.O",
        "実績「格闘家の帰還」（格闘家でクリア）を追加",
      ],
    },
  },
];
