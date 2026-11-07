import type { Lang } from "../index";

// 화면 글자: 캐릭터 이름·설명 둘째 묶음 (characters가 커서 나눔: 베두인~격투가)
export const CHARACTER_TEXT_2 = {
  bedouin: { ko: "베두인", en: "Bedouin", ja: "ベドウィン" },
  bedouinDesc: {
    ko: "차크람 · 몸만 한 차크람으로 한 바퀴 베고 멀리 던진다 · 떨어진 차크람에 닿으면 주우며 모래와 함께 크게 벤다 · 대시로 지나간 적도 벤다 · 차크람을 던져 손이 비면 발이 빨라진다",
    en: "Chakram · Spin-slash with a body-sized chakram, then hurl it far · Touch it to pick it back up, unleashing a wide sand slash · Dashing through foes cuts them too · Moves faster while the chakram is thrown",
    ja: "チャクラム · 体ほどのチャクラムで一回転斬りし、遠くへ投げる · 落ちたチャクラムに触れると拾い、砂と共に大きく斬る · ダッシュで通り抜けた敵も斬る · チャクラムを投げて手が空くと足が速くなる",
  },
  general: { ko: "장수", en: "General", ja: "武将" },
  generalDesc: {
    ko: "창 · 찌르기·휘두르기·돌진 내리꽂기로 끊기지 않고 이어지는 콤보 · 옛 명장들의 무기를 들면 콤보와 필살기가 달라진다 · 요령: 공격을 끊지 말고 계속 누르면 콤보 끝 돌진 내리꽂기까지 이어짐",
    en: "Spear · An unbroken combo of thrusts, swings and a lunging slam · Wield the weapons of legendary generals to change combos and finishers · Tip: keep attacking without pause to reach the lunging slam at the combo's end",
    ja: "槍 · 突き・薙ぎ・突進叩きつけで途切れず続くコンボ · 昔の名将の武器を持つとコンボと必殺技が変わる · コツ: 攻撃を止めずに押し続けるとコンボ最後の突進叩きつけまでつながる",
  },
  imugi: { ko: "이무기", en: "Imugi", ja: "イムギ" },
  imugiDesc: {
    ko: "용창 · 찌르기와 휘두르기를 한 번에, 맞힐 때마다 콤보 · 72이면 용의 기운이 차올라 강해지고 108이면 용이 된다 (거대한 용이 맵을 지나가며 모든 적을 베고 8초 동안 더 강한 몸, 부를 때마다 영구 치명타 +15%) · 무기마다 다른 용의 힘",
    en: "Dragon spear · Thrust and swing at once; every hit builds combo · At 72 dragon energy surges through you; at 108 you become the dragon (a giant dragon sweeps the map, striking every foe, and you are empowered for 8s; each dragon permanently adds +15% crit) · Each weapon holds a different dragon's power",
    ja: "龍槍術 · 突きと薙ぎを同時に、当てるたびにコンボ · 72で龍の気が満ちて強くなり、108で龍になる（巨大な龍がマップを通り抜け全ての敵を斬り、8秒間さらに強い体） · 武器ごとに違う龍の力",
  },
  apostle: { ko: "악의 사도", en: "Apostle of Malice", ja: "悪の使徒" },
  apostleDesc: {
    ko: "십자가 · 하늘에서 뒤집힌 십자가가 떨어져 짓누른다 · 일곱 죄의 십자가는 저주의 장판을 남긴다 · 회복약은 독, 쓰러진 적의 영혼을 먹어야 회복 · 먹은 영혼마다 공격력 +0.01",
    en: "Cross · Inverted crosses fall from the sky to crush foes · Crosses of the seven sins leave cursed fields · Potions hurt; eat the souls of the fallen to heal · each soul eaten adds +0.01 damage",
    ja: "十字架 · 空から逆さ十字が落ちて押し潰す · 七つの罪の十字架は呪いの床を残す · 回復薬は毒、倒した敵の魂を食べて回復 · 食べた魂ごとに攻撃力+0.01",
  },
  stargazer: { ko: "별지기", en: "Stargazer", ja: "星守り" },
  stargazerDesc: {
    ko: "히든 · 별을 박아 별자리를 그린다 · 가까운 별끼리 빛줄기로 이어져 닿는 적을 태운다 · 별이 가득 차면 별자리가 완성되어 모든 별이 한꺼번에 터진다 · 방을 옮기면 별은 사라진다",
    en: "Hidden · Pin stars to draw constellations · Nearby stars link with beams of light that burn foes · When the constellation is full, every star bursts at once · Stars fade when you leave the room",
    ja: "隠しキャラ · 星を打ち込んで星座を描く · 近い星同士が光の線でつながり触れた敵を焼く · 星が満ちると星座が完成し全ての星が一斉に弾ける · 部屋を移ると星は消える",
  },
  duck: { ko: "오리", en: "Duck", ja: "アヒル" },
  duckDesc: {
    ko: "히든 캐릭터 · 꽥 음파로 앞쪽 적을 모두 밀치며 때리고, 4번째마다 둘레 전체에 큰 꽥(기절) · 새끼 오리가 줄지어 따라와 적 탄을 막고 같이 꽥 한다 · 아주 튼튼하다",
    en: "Hidden character · Quack shockwaves hit and push back every foe in front; every 4th is a Big Quack all around (stuns) · Ducklings follow in a line, block enemy shots, and quack along · Very sturdy",
    ja: "隠しキャラ · ガーガー音波で前方の敵をまとめて押し返して攻撃、4回ごとに周り全体へ大ガーガー（気絶） · 子アヒルが一列について来て敵の弾を防ぎ、一緒にガーガー · とても頑丈",
  },
  hiddenFound: { ko: "★ 히든 캐릭터 등장! ★", en: "★ Hidden character appeared! ★", ja: "★ 隠しキャラ登場！ ★" },
  novice: { ko: "풋내기", en: "Novice", ja: "見習い" },
  noviceDesc: {
    ko: "맨손으로 시작 · 공용 무기·공용 패시브만 쓴다 · 적을 쓰러뜨려 레벨을 올리고 스탯을 직접 찍는다 · 요령: 레벨이 오르면 아래 칸에서 스탯을 찍는 걸 잊지 말기",
    en: "Starts bare-handed · Uses only common weapons and passives · Level up by defeating foes and spend stat points yourself · Tip: don't forget to spend stat points in the bottom panel when you level up",
    ja: "素手で始まる · 共通の武器とパッシブだけ使う · 敵を倒してレベルを上げ、ステータスを自分で振る · コツ: レベルが上がったら下の欄でステータスを振るのを忘れずに",
  },
  doctor: { ko: "의사", en: "Doctor", ja: "医者" },
  doctorDesc: {
    ko: "치료 · 공격하며 조금씩 회복하고, 체력이 가득 차면 넘친 회복이 보호막이 된다 · 행운이 높다 · 요령: 체력이 가득할 때 계속 맞혀 보호막을 쌓아 두기",
    en: "Healer · Heals a little with each hit; overflow healing at full health becomes a shield · High luck · Tip: keep hitting at full HP to stack up a shield",
    ja: "治療 · 攻撃しながら少しずつ回復し、体力満タン時の余った回復はシールドになる · 幸運が高い · コツ: 体力満タンの時も当て続けてシールドを溜めておく",
  },
  engineer: { ko: "기계공학자", en: "Engineer", ja: "エンジニア" },
  engineerDesc: {
    ko: "레이저 · 누르고 있으면 레이저를 계속 쏘아 녹인다 · 빗나가지 않지만 사거리가 짧다 · 요령: 사거리가 짧으니 레이저를 겨눈 채 대시로 붙었다 빠지기",
    en: "Laser · Hold to keep a beam on foes and melt them · Never misses, but short range · Tip: short range — keep the beam on and dash in and out",
    ja: "レーザー · 押し続けるとレーザーを照射し続けて溶かす · 外れないが射程が短い · コツ: 射程が短いのでレーザーを当てたままダッシュで出入り",
  },
  elementalist: { ko: "원소술사", en: "Elementalist", ja: "元素術師" },
  elementalistDesc: {
    ko: "회전체 · 몸 둘레를 도는 원소 구슬이 닿은 적을 때린다 · 무기마다 회전체가 크게 달라진다 · 요령: 적에게 바짝 붙어 돌면 구슬이 계속 맞음",
    en: "Orbiting · Elemental orbs circle you and strike whatever they touch · Each weapon changes the orbs a lot · Tip: circle close to foes so the orbs keep hitting",
    ja: "回転体 · 体の周りを回る元素の珠が触れた敵を打つ · 武器ごとに回転体が大きく変わる · コツ: 敵にくっついて回ると珠が当たり続ける",
  },
  brawler: { ko: "격투가", en: "Brawler", ja: "格闘家" },
  brawlerDesc: {
    ko: "콤보 · 적을 맞힐 때마다 다음 기술이 이어지고 마지막 기술이 강하다 · 체력이 높다 · 요령: 마지막 기술까지 이어지게 한 적에게 붙어 계속 때리기",
    en: "Combo · Each hit chains into the next move, the last one hits hardest · High health · Tip: stick to one foe and keep hitting to reach the final move",
    ja: "コンボ · 敵に当てるたびに次の技がつながり、最後の技が強い · 体力が高い · コツ: 一体に張り付いて最後の技まで殴り続ける",
  },
} satisfies Record<string, Record<Lang, string>>;
