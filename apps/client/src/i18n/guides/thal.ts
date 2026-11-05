// 캐릭터 설명: 탈라시아 (토르켄·리바이어·테일) · 한·영·일 (수치는 weaponsThorken·itemsThorken과 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_THAL: Guide = {
  thorken: [
    "탈라시아 · 토르켄 · 자유의 바다를 누비는 뱃사람. 거대한 닻과 사슬로 이은 철구공으로 싸움 · 체력 120 · 공격력 12 · 이동 1.3 · 방어 5",
    "던지기: 철구공이 손에 있을 때 누르면 가까운 적(없으면 앞)으로 던짐 · 떨어진 자리에 물보라와 천둥 (둘레 피해 + 기절)",
    "휘두르기: 철구공이 나가 있으면 누를 때마다 닻을 넓게 휘두르고(공격력 250%, 느림) 사슬 끝 철구공이 나를 중심으로 크게 돌며 휩씀 · 공이 있던 쪽에서 바라보는 쪽을 지나 반대편까지 돌아서, 공을 어디에 두느냐에 따라 휩쓰는 길이 달라짐 · 멀어지면 공이 끌려옴",
    "대시하면 철구공을 감아 들임 → 다시 누르면 새로 던져 또 천둥 · 때릴수록 폭풍 게이지가 차고, 가득 차면 다음 휘두르기에 태풍(철구공을 따라다니며 적을 끌어당겨 때림) + 하늘에서 천둥 5번",
    "무기는 철구공만 바뀜 (10): 무쇠 · 조수(물결) · 뇌운(번개 튐) · 소용돌이 · 성게(가시) · 쌍둥이(공 둘) · 간헐천(물기둥) · 빙해(느려짐) · 크라켄(긴 사슬·사슬 베기) · 대해일(한 바퀴)",
    "전용 아이템 10: 순풍의 돛 · 갈매기 깃털 · 심해 진주 · 해방의 나침반 · 해방의 종 · 따개비 사슬 · 고래의 노래 · 바다의 삼지창 · 산호 갑옷 · 등대 (공용 아이템도 나옴)",
  ],
  levia: [
    "탈라시아 · 리바이어 · 고래와 함께 자유로운 바다를 누비는 창술사 · 체력 105 · 공격력 12 · 이동 1.35",
    "3단 콤보 (누를 때마다 다음 타, 잠깐 멈추면 1타부터): 1타 앞으로 크게 휘두르기 → 2타 한 바퀴 휘두르고 앞으로 커다란 고래 대돌격(뚫고 날아감) → 3타 앞으로 돌진하고 끝에서 부채꼴 충격파 (조금 쉼)",
    "고래: 타마다 확률(기본 25%)로 고래가 같이 나옴 · 1타는 날개로 창보다 넓게 쓸고 · 2타는 몸을 감아 나를 한 바퀴 더 넓게 · 3타는 옆에서 같이 돌진 · 안 나올 때마다 다음 확률 +8%, 나오면 처음으로",
    "무기는 창에 박는 힘의 보석만 바뀜 (10): 아쿠아마린 · 해류 사파이어(해류) · 뇌명 토파즈(번개) · 산호석(터짐) · 밀물 월장석(고래 잘 나옴) · 심해석(충격파 기절) · 빙정(느려짐) · 쌍둥이 진주(고래 둘) · 해풍석(빠름) · 리바이어던의 눈(고래 도약)",
    "전용 아이템 20 · 창 10: 물마루 · 나선 물결 · 쇄파 · 파도타기 · 역류 · 닻 없는 배 · 소금 바람 · 소라 갑옷 · 해방의 깃발 · 물보라 창끝",
    "고래 10: 고래의 부름 · 심해의 노래 · 아기 고래 · 물뿜기 · 고래수염 · 고래 무리 · 흰 고래 · 용연향 · 심해 압력 · 바다의 왕 (공용 아이템도 나옴)",
  ],
  tail: [
    "탈라시아 · 테일 · 물을 자유롭게 다루는 상어 수인 · 체력 110 · 공격력 12 · 이동 1.4",
    "영역 바다: 둘레(반지름 74)에 늘 바다가 펼쳐지고, 바다 안에 적이 있으면 약 1초마다 물 상어가 저절로 공격 (누르지 않아도 됨)",
    "상어 3가지 (확률 4:4:2): 삼키기(바다 밑에서 솟아 적을 집어삼키고 가운데로 끌어당김) · 돌진(바다에서 튀어나와 적을 꿰뚫고 다시 잠수) · 낙하(높이 솟구쳐 적에게 내리꽂혀 넓게 기절)",
    "꼬리 3연타 (누를 때마다 다음 타, 잠깐 멈추면 1타부터): 1타 위→아래 · 2타 아래→위 · 3타 앞을 크게 내려치기 (잠깐 기절)",
    "마무리 물기: 한 방에 쓰러뜨릴 적이 가까이(150) 있으면 누를 때 물 상어로 변해 번개처럼 돌진해 씹어먹음 (돌진 중 무적 · 준 피해의 25% 흡혈, 최대 체력 5%까지)",
    "무기는 바다의 종류만 바뀜 (10): 밀물 · 귀상어(낙하) · 청상아리(돌진) · 백상아리(삼키기) · 뇌우(번개) · 빙해(느려짐) · 대양(넓음) · 광란(자주) · 소용돌이(끌어당김) · 메갈로돈(거대)",
    "전용 아이템 10: 칼 지느러미 · 피 냄새 · 포식 · 연쇄 사냥 · 해방의 물결 · 깊은 바다 · 상어 떼 · 큰 턱 · 솟구침 · 쌍둥이 돌진 (공용 아이템도 나옴)",
  ],
};

export const GUIDE_EN_THAL: Guide = {
  thorken: [
    "Thalassia · Thorken · a sailor of the free sea who fights with a giant anchor and a chained iron ball · 120 HP · 12 attack · 1.3 move · 5 defense",
    "Throw: with the ball in hand, a press hurls it at the nearest foe (or ahead) · where it lands, a splash and thunder (area damage + stun)",
    "Swing: with the ball out, each press swings the anchor wide (250% attack, slow) and the chained ball whips around you in a huge arc · it travels from where it lay, past where you face, to the far side, so where you leave the ball shapes the sweep · walk away and the ball is dragged along",
    "Dash reels the ball back → the next press throws it again for more thunder · hits fill the Storm gauge; when full, your next swing calls a typhoon (follows the ball, pulling and striking foes) + 5 thunderbolts from the sky",
    "Only the ball changes as a weapon (10): Iron · Tide (waves) · Thundercloud (forking lightning) · Whirlpool · Urchin (spines) · Twin (two balls) · Geyser (water pillar) · Ice Floe (slow) · Kraken (long chain that cuts) · Maelstrom (full circle)",
    "10 exclusive items: Tailwind Sail · Gull Feather · Deep-Sea Pearl · Compass of Liberty · Bell of Liberty · Barnacle Chain · Whale Song · Sea Trident · Coral Armor · Lighthouse (common items also appear)",
  ],
  levia: [
    "Thalassia · Levia · a spear dancer roaming the free sea with the whales · 105 HP · 12 attack · 1.35 move",
    "3-hit combo (each press is the next hit; pause and it restarts): 1st a big forward sweep → 2nd a full spin, then a giant whale charges forward (piercing) → 3rd a lunge forward ending in a fan-shaped shockwave (short rest)",
    "Whales: each hit has a chance (25% base) to bring a whale · 1st: its fins sweep wider than the spear · 2nd: it coils around you in a wider circle · 3rd: it lunges alongside you · every miss adds +8% to the next roll, reset when one appears",
    "Only the power gem in the spear changes as a weapon (10): Aquamarine · Current Sapphire (current) · Thunder Topaz (lightning) · Coral Stone (burst) · Tide Moonstone (more whales) · Abyss Stone (stun shockwave) · Ice Crystal (slow) · Twin Pearls (two whales) · Sea Breeze Stone (fast) · Eye of the Leviathan (whale breach)",
    "20 exclusive items · Spear 10: Wave Crest · Spiral Wave · Breaker · Wave Rider · Undertow · Anchorless Ship · Salt Wind · Conch Armor · Flag of Liberty · Spray Spearhead",
    "Whale 10: Whale Call · Song of the Deep · Whale Calf · Blowhole · Baleen · Whale Pod · White Whale · Ambergris · Deep Pressure · King of the Sea (common items also appear)",
  ],
  tail: [
    "Thalassia · Tail · a shark beastfolk who bends water freely · 110 HP · 12 attack · 1.4 move",
    "Sea domain: a sea always spreads around Tail (radius 74); while a foe is inside, a water shark attacks on its own about every second (no button needed)",
    "3 sharks (odds 4:4:2): Gulp (rises from below, swallows the foe and drags others to the middle) · Dart (leaps out of the sea, pierces the foe and dives back) · Drop (soars high and crashes onto the foe, stunning a wide area)",
    "3-hit tail combo (each press is the next hit; pause and it restarts): 1st down · 2nd up · 3rd a big slam ahead (short stun)",
    "Finishing bite: if a nearby foe (150) can be finished in one bite, pressing attack turns Tail into a water shark that darts in like lightning and devours it (invincible while darting · heals 25% of the damage, up to 5% max HP)",
    "Only the kind of sea changes as a weapon (10): Tide · Hammerhead (drops) · Mako (darts) · Great White (gulps) · Thunderstorm (lightning) · Ice Sea (slow) · Ocean (wide) · Frenzy (frequent) · Whirlpool (pull) · Megalodon (huge)",
    "10 exclusive items: Blade Fin · Scent of Blood · Feast · Chain Hunt · Wave of Liberty · Deep Sea · Shark School · Great Jaws · Breach · Twin Dart (common items also appear)",
  ],
};

export const GUIDE_JA_THAL: Guide = {
  thorken: [
    "タラシア · トルケン · 自由の海を駆ける船乗り。巨大な錨と鎖でつないだ鉄球で戦う · 体力120 · 攻撃力12 · 移動1.3 · 防御5",
    "投げ: 鉄球が手にあるとき押すと近くの敵（いなければ前）へ投げる · 落ちた場所に水しぶきと雷（周りにダメージ + 気絶）",
    "振り: 鉄球が出ていると押すたびに錨を広く振り（攻撃力250%、遅い）、鎖の先の鉄球が自分を中心に大きく回って薙ぐ · 球があった方から向いている方を越えて反対側まで回るので、球をどこに置くかで薙ぐ道が変わる · 離れると球が引きずられる",
    "ダッシュで鉄球を巻き戻す → 次に押すとまた投げて雷 · 当てるほど嵐ゲージがたまり、満ちると次の振りで台風（鉄球について回り敵を引き寄せて打つ）+ 空から雷5回",
    "武器は鉄球だけが変わる（10）: 鉄 · 潮（波） · 雷雲（雷が跳ぶ） · 渦潮 · ウニ（トゲ） · 双子（球が2つ） · 間欠泉（水柱） · 氷海（鈍化） · クラーケン（長い鎖・鎖で斬る） · 大海嘯（一回転）",
    "専用アイテム10: 順風の帆 · カモメの羽 · 深海の真珠 · 解放の羅針盤 · 解放の鐘 · フジツボの鎖 · クジラの歌 · 海の三叉槍 · 珊瑚の鎧 · 灯台（共通アイテムも出る）",
  ],
  levia: [
    "タラシア · リヴァイア · クジラと共に自由な海を駆ける槍使い · 体力105 · 攻撃力12 · 移動1.35",
    "3段コンボ（押すたび次の段、少し止まると1段目から）: 1段目 前へ大きく薙ぐ → 2段目 一回転して前へ巨大なクジラ大突撃（貫通） → 3段目 前へ突進し、最後に扇形の衝撃波（少し休む）",
    "クジラ: 各段で確率（基本25%）でクジラも現れる · 1段目はヒレで槍より広く薙ぐ · 2段目は体を巻いて自分の周りをより広く一回転 · 3段目は隣で一緒に突進 · 出ないたびに次の確率+8%、出ると元に戻る",
    "武器は槍にはめる力の宝石だけが変わる（10）: アクアマリン · 海流のサファイア（海流） · 雷鳴のトパーズ（雷） · 珊瑚石（破裂） · 満ち潮のムーンストーン（クジラが出やすい） · 深海石（衝撃波で気絶） · 氷晶（鈍化） · 双子の真珠（クジラ2頭） · 海風石（速い） · リヴァイアサンの瞳（クジラの跳躍）",
    "専用アイテム20 · 槍10: 波頭 · 螺旋の波 · 砕け波 · 波乗り · 逆流 · 錨なき船 · 潮風 · ほら貝の鎧 · 解放の旗 · しぶきの穂先",
    "クジラ10: クジラの呼び声 · 深海の歌 · 子クジラ · 潮吹き · クジラのヒゲ · クジラの群れ · 白いクジラ · 龍涎香 · 深海の水圧 · 海の王（共通アイテムも出る）",
  ],
  tail: [
    "タラシア · テイル · 水を自在に操るサメの獣人 · 体力110 · 攻撃力12 · 移動1.4",
    "領域の海: 周り（半径74）に常に海が広がり、海の中に敵がいると約1秒ごとに水のサメが自動で攻撃（押さなくてよい）",
    "サメ3種（確率4:4:2）: 丸呑み（海の底から現れて敵を呑み込み、中央へ引き寄せる）· 突進（海から飛び出して敵を貫き再び潜る）· 落下（高く跳び上がって敵に落ち、広く気絶）",
    "尾の3連撃（押すたび次の段、少し止まると1段目から）: 1段目 上→下 · 2段目 下→上 · 3段目 前方へ大きく叩きつけ（少し気絶）",
    "とどめの噛みつき: 一撃で倒せる敵が近く（150）にいると、押したとき水のサメに変わって稲妻のように突進し食らいつく（突進中は無敵 · 与えたダメージの25%吸血、最大体力の5%まで）",
    "武器は海の種類だけが変わる（10）: 満ち潮 · シュモクザメ（落下）· アオザメ（突進）· ホホジロザメ（丸呑み）· 雷雨（雷）· 氷海（鈍化）· 大洋（広い）· 狂乱（頻繁）· 渦潮（引き寄せ）· メガロドン（巨大）",
    "専用アイテム10: 刃のヒレ · 血の匂い · 捕食 · 連鎖狩り · 解放の波 · 深い海 · サメの群れ · 大きな顎 · 跳び上がり · 双子の突進（共通アイテムも出る）",
  ],
};
