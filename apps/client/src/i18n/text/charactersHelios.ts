// 화면 글자: 시즌 2 헬리오스 캐릭터 이름·설명 · 무기 종류 이름 (charactersNew가 커서 나눔)
export const CHARACTER_TEXT_HELIOS = {
  plague: { ko: "역병의사", en: "Plague Doctor", ja: "疫病医" },
  plagueDesc: {
    ko: "역병 · 모기떼로 적을 갈아버리고, 큰 연기 구역으로 독·불·죽음·부식을 걸고, 쥐떼로 갉아먹다 흑사병을 퍼뜨리고, 죽음의 손아귀로 즉사시킴 · 무기 4 · 전용 아이템 10 · 헬리오스의 새부리 가면 의사.",
    en: "Plague · A beak-masked doctor of Helios. Mosquito swarms grind foes, a great smoke zone inflicts poison, burn, death and corrosion, rat swarms gnaw and spread the Black Death, and the Grip of Death kills outright · 4 weapons · 10 own items",
    ja: "疫病 · 蚊の群れで敵をすり潰し、大きな煙の領域で毒 · 炎 · 死 · 腐食をかけ、鼠の群れでかじって黒死病を広め、死の手で即死させる · 武器4 · 専用アイテム10 · ヘリオスの鳥嘴マスクの医者。",
  },
  slayer: { ko: "학살자", en: "Slayer", ja: "虐殺者" },
  slayerDesc: {
    ko: "대낫 · 한 번 누르면 거대한 대낫으로 화려한 5연속 콤보(급습·일직선·검기·회오리 등)가 몰아치고, 기술마다 체력 5를 씀 (체력 40 아래로는 안 내려감) · 받는 피해 +50% · 회복약은 듣지 않음 · 체력 280 · 체력이 낮을수록 강해짐 · 게이지가 차면 10초 '피의 학살'(체력 소모 없음·흡혈 50%·공격력·공격 속도·이동 속도) · 공용 아이템은 나오지 않음 · 대낫 10 · 전용 아이템 10 · 헬리오스. 피에 젖은 얼굴로 늘 웃는 여자.",
    en: "Scythe · One press unleashes a flashy 5-move combo with her huge scythe (raids, line cleaves, blade waves, whirls), each move costing 5 HP (never below 40) · takes 50% more damage · potions do nothing · 280 HP · stronger at low HP · a full gauge starts a 10s Blood Massacre (no HP cost, 50% lifesteal, more damage, attack and move speed) · common items never drop · 10 scythes · 10 own items · Helios. A woman who always grins through a blood-soaked face.",
    ja: "大鎌 · 一度押すと巨大な大鎌で華麗な5連続コンボ（急襲・一直線・剣気・旋風など）が吹き荒れ、技ごとに体力5を使う（40未満にはならない）· 被ダメージ+50% · 回復薬は効かない · 体力280 · 体力が低いほど強い · ゲージが溜まると10秒「血の虐殺」（体力消費なし・吸血50%・攻撃力・攻撃速度・移動速度）· 共通アイテムは出ない · 大鎌10 · 専用アイテム10 · ヘリオス。血に濡れた顔でいつも笑う女。",
  },

  eater: { ko: "이터", en: "Eater", ja: "イーター" },
  eaterDesc: {
    ko: "그림자 · 이빨 달린 그림자 하나로 싸우며, 누를 때마다 열 가지 공격(베기·검기·물어뜯기·심연·창·연타·X자·돌진·세 번 씹기·낚아채기) 중 하나가 확률로 나옴 · 넓고 세지만 느림 · 먹은 적마다 재생력 +0.1 (재생력 10마다 공격력 +3) · 무기 1 · 전용 아이템 10 · 헬리오스. 온몸이 검고 붉은 눈과 새하얀 늑대 이빨만 보이는 존재.",
    en: "Shadow · Fights with a single fanged shadow; each press unleashes one of ten random attacks (slash, blades, bite, abyss, spear, barrage, X-cut, dash, triple bite, ambush) · wide and strong but slow · +0.1 regen for every foe it eats · 1 weapon · 10 own items · Helios. A pitch-black being with only red eyes and white wolf fangs.",
    ja: "影 · 牙のある影ひとつで戦い、押すたびに10種の攻撃（斬り・剣気・噛みつき・深淵・槍・連打・X字・突進・三度噛み・捕食）のどれかが確率で出る · 広く強いが遅い · 喰った敵ごとに再生力+0.1 · 武器1 · 専用アイテム10 · ヘリオス。全身が黒く、赤い目と真っ白な狼の牙だけが見える存在。",
  },
  mukin: { ko: "묵인", en: "Mukin", ja: "黙忍" },
  mukinDesc: {
    ko: "돌진 · 방어력 30(받는 피해 30% 무시, 적어도 1은 받음) · 맞아도 무적이 거의 없음 · 몸으로 들이받는 돌진 피해가 방어력의 300% · 재생력 10 · 회복약은 천천히 차오름 · 무기 10 · 전용 아이템 10 · 헬리오스. 입을 쇠 가면으로 가린 말없는 거구.",
    en: "Charge · 30 Defense (ignores 30% of damage, always takes at least 1) · almost no invincibility after hits · his body-slam charge deals 300% of his Defense · 10 regen · potions heal slowly · 10 weapons · 10 own items · Helios. A silent giant whose mouth is hidden behind an iron mask.",
    ja: "突進 · 防御力30（被ダメージ30%無視、最低1は受ける）· 被弾後の無敵がほぼない · 体当たり突進のダメージは防御力の300% · 再生力10 · 回復薬はゆっくり回復 · 武器10 · 専用アイテム10 · ヘリオス。口を鉄の仮面で覆った無言の巨漢。",
  },
  samyeol: { ko: "사멸", en: "Samyeol", ja: "死滅" },
  samyeolDesc: {
    ko: "독침 · 모든 침에 독과 죽음이 붙고, 수많은 침을 사방으로 날리며, 침을 많이 던질수록 맵에 독가스가 피어남 · 독침 10 · 전용 아이템 10 · 헬리오스. 사천 당가에서 가장 강한 여인. 혼인을 강요하는 집안을 떠나 헬리오스에 들어옴.",
    en: "Needles · Every needle carries poison and death, she flings needles in every direction, and the more she throws the more poison gas blooms across the map · 10 needle weapons · 10 own items · Helios. The strongest woman of the Tang clan of Sichuan, who left a family pressing her to marry and joined Helios.",
    ja: "毒針 · すべての針に毒と死が付き、無数の針を四方八方に放ち、投げるほどマップに毒ガスが湧く · 毒針10 · 専用アイテム10 · ヘリオス。四川唐家で最も強い女。婚姻を迫る家を捨ててヘリオスに入った。",
  },
  needle: { ko: "독침", en: "Needles", ja: "毒針" },
  maw: { ko: "그림자", en: "Shadow", ja: "影" },
  ram: { ko: "돌진", en: "Charge", ja: "突進" },
  statDefense: { ko: "방어력 (받는 피해 % 무시)", en: "Defense (% damage ignored)", ja: "防御力（被ダメージ%無視）" },
  statRegen10: { ko: "체력 재생력 (10초마다)", en: "HP regen (per 10s)", ja: "体力再生（10秒ごと）" },
  // 모든 캐릭터 공통 추가 기본 스탯 (값이 있을 때만 능력치 창에)
  statArmor: { ko: "방어력", en: "Armor", ja: "防御力" },
  statReduction: { ko: "받는 피해 감소", en: "Damage reduction", ja: "被ダメージ軽減" },
  statDodge: { ko: "회피", en: "Dodge", ja: "回避" },
  statLifesteal: { ko: "흡혈", en: "Lifesteal", ja: "吸血" },
  statSharpness: { ko: "예리함", en: "Sharpness", ja: "鋭さ" },
  statStatusPower: { ko: "상태이상 강화", en: "Status power", ja: "状態異常強化" },
  statGoldGain: { ko: "돈 획득", en: "Gold gain", ja: "ゴールド獲得" },
  statPetTaken: { ko: "받는 피해 (펫)", en: "Damage taken (pet)", ja: "被ダメージ（ペット）" },
  statPetGold: { ko: "얻는 돈 (펫)", en: "Gold gained (pet)", ja: "獲得ゴールド（ペット）" },
  statPetLife: { ko: "남은 부활 (펫)", en: "Revives left (pet)", ja: "残り復活（ペット）" },
  pest: { ko: "역병", en: "Plague", ja: "疫病" },
  scythe: { ko: "대낫", en: "Scythe", ja: "大鎌" },
  slGaugeFull: { ko: "피의 학살!", en: "Blood Massacre!", ja: "血の虐殺！" },
};
