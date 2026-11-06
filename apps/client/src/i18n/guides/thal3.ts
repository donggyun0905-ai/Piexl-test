// 캐릭터 설명: 탈라시아 3 (훅·오르카) · 한·영·일 (수치는 weaponsHook·itemsHook·weaponsOrca·itemsOrca와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_THAL3: Guide = {
  hook: [
    "탈라시아 · 훅 · 자유의 바다를 누비는 해적 · 체력 115 · 공격력 13 · 이동 1.3 · 행운 2",
    "갈고리: 누르면 바라보는 쪽으로 커다란 빛 갈고리를 던짐 (거리 120) · 지나가는 적을 걸어(최대 3, 공격력 30%) 내 앞까지 끌어옴",
    "더블배럴 산탄총: 갈고리가 돌아오면 품속 산탄총으로 앞 부채꼴에 초근접 발사 (공격력 150%, 끌려온 적은 195%) · 끌려온 적은 원래 있던 자리로 튕겨 날아가고, 아닌 적은 뒤로 밀려남",
    "약화: 갈고리에 걸린 적은 머리 위에 작은 갈고리 표식이 쌓임 (최대 5) · 표식 하나마다 받는 피해 +5% (5개면 +25%)",
    "난파: 튕겨 날아가던 적이 벽·기둥에 부딪히면 추가 피해(공격력 80%) + 기절",
    "밧줄 타기: 빈 갈고리가 벽에 박히면 밧줄을 타고 그 벽으로 날아가(날아가는 동안 무적) 내리며 방 쪽으로 쏨 · 보스에 걸면 내가 보스 코앞으로 끌려가 쏘고 원래 자리로 튕겨 돌아옴",
    "무기 6: 녹슨 갈고리 · 크라켄 갈고리(2마리 더) · 작살 갈고리(멀리·빠르게) · 폭풍탄 산탄총(번개) · 용의 숨결탄(넓게·불) · 역조 갈고리(멀리 밀어냄·난파 2배)",
    "전용 아이템 10: 닻사슬 · 네 갈래 갈고리 · 밧줄 그네 · 쌍발 연사 · 흑색 화약 · 난파선 · 약탈 · 럼주 한 병 · 해골 깃발 · 자유의 돛 (공용 아이템도 나옴)",
  ],
  orca: [
    "탈라시아 · 오르카 · 바다의 자유를 주먹에 담은 격투가 · 체력 110 · 공격력 12 · 이동 1.4 · 행운 1",
    "4연속 콤보 (누르고 있으면, 움직이며 때림): ① 물 주먹 파동 — 앞으로 뻗는 넓은 물결 (공격력 70%) ② 소용돌이 훅 — 나를 둘러싼 물회오리가 적을 끌어당김 (80%) ③ 물기둥 어퍼 — 앞에 물기둥이 솟아 적을 띄움 (110% + 기절) ④ 상어 기공파",
    "상어 기공파: 상어 모양 기공파가 스스로 먹잇감을 찾아 헤엄쳐 꺾어 가며 3마리까지 물어뜯고 (공격력 140%) 물보라로 터짐 (60%)",
    "자유로운 콤보: 대시해도 콤보가 끊기지 않고 바로 다음 타격을 칠 수 있음 · 1.5초 넘게 안 때리면 처음부터",
    "해방 게이지: 맞힐 때마다 차고 상어가 물면 더 참 · 가득 차면 양손 불꽃이 커지고, 대시가 '범고래 돌파'로 바뀜 — 거대한 범고래 물기운이 되어(무적) 적을 양옆으로 가르며 뚫고 나가고 (200%) 큰 파도로 내려앉음 (240% + 밀어냄 + 기절)",
    "해방 (내려앉은 뒤 10초, 머리 위 게이지가 노랗게 줄어듦): 모든 공격 범위 +35% · 공격 속도 +30% · 받는 피해 -15% · 때릴 때마다 물 상어가 날아가 꿰뚫음 (60%) · 대시가 번개 대시 — 지나간 자리의 적에게 번개 (120% + 기절) · 몸의 전류가 모든 공격에 붙어 맞은 적에게 번개 (그 공격의 30%) + 옆 적 하나에게 튐 · 해방 중 이펙트는 진한 파랑 천둥 주먹 (때린 자리마다 낙뢰)",
    "무기 6: 파도 손목띠 · 이안류 권갑(큰 소용돌이) · 간헐천 너클(물기둥 셋) · 메갈로돈 이빨(큰 상어) · 범고래 무리(상어 셋) · 대소용돌이 권갑(소용돌이 장판)",
    "전용 아이템 10: 물보라 장갑 · 밑물결 · 파도 타기 · 등지느러미 · 피 냄새 · 반향정위 · 고래의 숨 · 해방의 노래 · 물거품 방패 · 바닷바람 (공용 아이템도 나옴)",
  ],
};

export const GUIDE_EN_THAL3: Guide = {
  hook: [
    "Thalassia · Hook · a pirate roaming the sea of freedom · HP 115 · ATK 13 · Move 1.3 · Luck 2",
    "Hook: press to throw a giant spectral hook where you face (range 120) · it snags foes along the way (up to 3, 30% ATK) and reels them right in front of you",
    "Double-barrel shotgun: when the hook returns, a shotgun from the coat fires point-blank in a forward cone (150% ATK, 195% to hooked foes) · hooked foes fly back to where they were, others are pushed away",
    "Weaken: foes caught by the hook gain a tiny hook mark above their head (up to 5) · +5% damage taken per mark (+25% at 5)",
    "Wreck: a foe flying back into a wall or pillar takes extra damage (80% ATK) and is stunned",
    "Rope swing: an empty hook that sticks into a wall swings you over to it (invulnerable while flying) and you fire back into the room as you land · hook a boss and you are pulled point-blank, fire, then bounce back",
    "6 weapons: Rusty Hook · Kraken Hook (2 more foes) · Harpoon Hook (farther, faster) · Stormshot Scattergun (lightning) · Dragon's Breath Shells (wider, burn) · Undertow Hook (pushes farther, 2x wreck)",
    "10 exclusive items: Anchor Chain · Grapnel · Rope Swing · Double Tap · Black Powder · Shipwreck · Plunder · Bottle of Rum · Jolly Roger · Sail of Freedom (shared items also drop)",
  ],
  orca: [
    "Thalassia · Orca · a brawler who carries the freedom of the sea in his fists · HP 110 · ATK 12 · Move 1.4 · Luck 1",
    "4-hit combo (hold, hits on the move): ① Spray Jab — wide frontal fan (70% ATK) ② Whirl Hook — a water vortex around you pulls foes in (80%) ③ Geyser Upper — a geyser erupts ahead and launches foes (110% + stun) ④ Shark Wave",
    "Shark Wave: a shark-shaped ki blast hunts on its own, turning to chase prey and biting up to 3 foes (140% ATK) before bursting into spray (60%)",
    "Free-flowing combo: dashing never breaks the combo and lets you strike again at once · it resets after 1.5s without hitting",
    "Liberation gauge: fills with every hit, more on shark bites · when full your hands blaze and your dash becomes Orca Breach — you turn into a giant orca of water (invulnerable), split through foes (200%) and land in a huge wave (240% + knockback + stun)",
    "Liberation (10s after landing, the overhead gauge drains in yellow): +35% range on every attack · +30% attack speed · -15% damage taken · every hit launches a flying water shark that pierces (60%) · dashes become Lightning Dashes that strike foes along the path (120% + stun) · his body current rides every attack, shocking the target (30% of that hit) and arcing to one nearby foe · Liberation effects turn into deep-blue Thunder Fists (lightning strikes wherever he hits)",
    "6 weapons: Tide Wraps · Riptide Gauntlets (bigger whirl) · Geyser Knuckles (three geysers) · Megalodon Fang (big shark) · Orca Pod (three sharks) · Maelstrom Gauntlets (whirlpool)",
    "10 exclusive items: Spray Gloves · Undertow · Wave Riding · Dorsal Fin · Scent of Blood · Echolocation · Whale's Breath · Song of Liberation · Foam Shield · Sea Breeze (common items appear too)",
  ],
};

export const GUIDE_JA_THAL3: Guide = {
  hook: [
    "タラシア · フック · 自由の海を駆ける海賊 · 体力115 · 攻撃力13 · 移動1.3 · 運2",
    "フック：押すと向いている方へ大きな光のフックを投げる（距離120）· 通り道の敵を掛けて（最大3、攻撃力30%）目の前まで引き寄せる",
    "ダブルバレル散弾銃：フックが戻ると懐の散弾銃で前方の扇形へ零距離射撃（攻撃力150%、引き寄せた敵は195%）· 引き寄せた敵は元の場所へ吹き飛び、ほかの敵は後ろへ押される",
    "弱化：フックに掛かった敵の頭上に小さなフックの印がたまる（最大5）· 印1つごとに被ダメージ+5%（5つで+25%）",
    "難破：吹き飛んだ敵が壁・柱に当たると追加ダメージ（攻撃力80%）＋気絶",
    "ロープ移動：空のフックが壁に刺さるとロープでその壁へ飛び（飛んでいる間無敵）着地しながら部屋の方へ撃つ · ボスに掛けると自分がボスの目の前へ引き寄せられて撃ち、元の場所へ跳ね返る",
    "武器6：錆びたフック · クラーケンのフック（2体多く）· 銛のフック（遠く・速く）· 嵐弾の散弾銃（雷）· 竜の息吹弾（広く・火）· 逆潮のフック（遠くへ押し出す・難破2倍）",
    "専用アイテム10：錨の鎖 · 四爪錨 · ロープブランコ · 二連射 · 黒色火薬 · 難破船 · 略奪 · ラム酒一瓶 · 海賊旗 · 自由の帆（共用アイテムも出る）",
  ],
  orca: [
    "タラシア · オルカ · 海の自由を拳に込めた格闘家 · 体力110 · 攻撃力12 · 移動1.4 · 運1",
    "4連続コンボ（押し続けると動きながら）：① 飛沫ジャブ — 前方の広い扇形（攻撃力70%）② 渦巻きフック — 周りの水の渦が敵を引き寄せる（80%）③ 水柱アッパー — 前に水柱が噴き上がり敵を打ち上げる（110%＋気絶）④ 鮫の気功波",
    "鮫の気功波：鮫の形の気功波が自ら獲物を探して曲がりながら泳ぎ、3体まで噛みつき（攻撃力140%）飛沫と共に弾ける（60%）",
    "自由なコンボ：ダッシュしてもコンボが途切れず、すぐ次の攻撃ができる · 1.5秒以上攻撃しないと最初から",
    "解放ゲージ：当てるたびにたまり、鮫が噛むともっとたまる · 満タンで両手の炎が大きくなり、ダッシュが「シャチ突破」に — 巨大なシャチの水気となって（無敵）敵を左右に裂きながら突き抜け（200%）大波と共に着地（240%＋吹き飛ばし＋気絶）",
    "解放（着地後10秒、頭上のゲージが黄色く減る）：全攻撃の範囲+35% · 攻撃速度+30% · 被ダメージ-15% · 攻撃のたびに水の鮫が飛んで貫く（60%）· ダッシュが雷ダッシュに — 通った道の敵に雷（120%＋気絶）· 体の電流が全攻撃に乗り、当たった敵に雷（その攻撃の30%）＋近くの敵1体へ跳ぶ · 解放中のエフェクトは濃い青の雷の拳（攻撃した場所に落雷）",
    "武器6：波のリストバンド · 離岸流の籠手（大きな渦）· 間欠泉のナックル（水柱3本）· メガロドンの牙（大きな鮫）· シャチの群れ（鮫3匹）· 大渦の籠手（渦の床）",
    "専用アイテム10：飛沫のグローブ · 引き波 · 波乗り · 背びれ · 血の匂い · 反響定位 · 鯨の息 · 解放の歌 · 泡の盾 · 潮風（共通アイテムも出る）",
  ],
};
