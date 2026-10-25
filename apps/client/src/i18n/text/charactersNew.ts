import type { Lang } from "../index";

// 화면 글자: 버려진 자들·거인 이름·설명 (characters.ts가 커서 나눔)
export const CHARACTER_TEXT_NEW = {
  abandoned: { ko: "버려진 자들", en: "The Abandoned", ja: "捨てられた者たち" },
  abandonedDesc: {
    ko: "탭 콤보 · 함께 자란 세 아이 (P1 방패·초록 / P2 총·빨강 / P3 검·파랑). 나와 있지 않은 둘도 곁에서 싸움. 대시 버튼 = 탭(그 아이와 자리를 바꿔 교대, 0.5초 무적). 아이마다 콤보 순서를 기억하고, 무기의 조합대로 이으면 둘이 특수기 (틀리면 처음부터 · P1로 강제 교대) · 공격 속도가 오르지 않음",
    en: "Tag combo · Three kids who grew up together (P1 Shield·green / P2 Gun·red / P3 Sword·blue). The two off-field kids fight beside you. Dash button = Tag (swap places with that kid, 0.5s invulnerable). Each remembers their own combo; follow the weapon's chain and the other two unleash a special (a mistake restarts the chain and forces P1) · attack speed never increases",
    ja: "タッチコンボ · 一緒に育った三人（P1 盾・緑 / P2 銃・赤 / P3 剣・青）。出ていない二人もそばで戦う。ダッシュボタン＝タッチ（その子と位置を入れ替えて交代、0.5秒無敵）。それぞれ自分のコンボ順を覚え、武器の組み合わせ通りに繋ぐと二人が特殊技（間違えると最初から・P1に強制交代） · 攻撃速度は上がらない",
  },
  titan: { ko: "거인", en: "Titan", ja: "巨人" },
  titanDesc: {
    ko: "기계팔 · 체력이 아주 높고 느린 탱커. 무기마다 아주 느린 범위 공격 또는 빠르지만 아주 약한 연타 · 맞은 피해가 기계팔 에너지로 쌓여 다 차면 강력한 강타 · 대시 대신 패링(막은 피해가 그대로 에너지로) · 받는 피해 -15%",
    en: "Mech arm · A slow tank with huge HP. Each weapon either strikes very slowly in an area or jabs fast but very weakly · damage taken charges the mech arm for a mighty Smash · Parry instead of Dash (blocked damage becomes energy) · -15% damage taken",
    ja: "機械腕 · 体力がとても高く遅いタンク。武器ごとにとても遅い範囲攻撃か、速いがとても弱い連打 · 受けたダメージが機械腕のエネルギーに溜まり満タンで強打 · ダッシュの代わりにパリィ（防いだダメージがそのままエネルギーに） · 受けるダメージ-15%",
  },
  scribe: { ko: "서기관", en: "Scribe", ja: "書記官" },
  scribeDesc: {
    ko: "히든 캐릭터 · 아카식 레코드의 서기관. 깃펜으로 잉크 탄을 쏘아 맞은 적에게 기록을 새기고, 5번째 공격마다 무기의 글자(劍·爆·封·雷·氷·炎·再·星·滅)가 써지며 발동",
    en: "Hidden character · The Scribe of the Akashic Records. Fires ink shots that leave records on foes; every 5th attack writes the weapon's glyph (劍·爆·封·雷·氷·炎·再·星·滅) and unleashes it",
    ja: "隠しキャラ · アカシックレコードの書記官。羽根ペンで墨の弾を撃ち当てた敵に記録を刻み、5回目の攻撃ごとに武器の文字（劍·爆·封·雷·氷·炎·再·星·滅）が書かれて発動",
  },
  idra: { ko: "이드라", en: "Idra", ja: "イドラ" },
  idraDesc: {
    ko: "세계수의 아이 · 비르디아. 무기는 가이아 하나, 대시 키로 대궁 → 단검 → 방패 → 채찍 차례로 모습이 바뀌며 둘레에 변환 일격 · 공용 아이템은 나오지 않고 전용 아이템 20개만 나옴",
    en: "Child of the World Tree · Virdia. Her only weapon is Gaia; the dash key shifts it longbow → dagger → buckler → whip with a burst around her · common items never drop, only her 20 own items",
    ja: "世界樹の子 · ヴィルディア。武器はガイアひとつ、ダッシュキーで大弓 → 短剣 → 盾 → 鞭の順に姿が変わり周囲へ変換の一撃 · 共通アイテムは出ず専用アイテム20個だけが出る",
  },
  byeonhui: { ko: "변희", en: "Byeonhui", ja: "ビョンヒ" },
  byeonhuiDesc: {
    ko: "만물의 소녀 · 비르디아. 무기가 곧 동물, 든 동물로 변해 싸움 (늑대·곰·독수리·뱀·멧돼지·전갈·박쥐·코끼리·거미·불사조) · 동물마다 전용 아이템 셋 (그 동물일 때만 나옴)",
    en: "The All-Shaped Girl · Virdia. Her weapons are animals; she becomes the one she holds (wolf, bear, eagle, serpent, boar, scorpion, bat, elephant, spider, phoenix) · three own items per animal (only while that animal)",
    ja: "万物の少女 · ヴィルディア。武器は動物そのもの、持った動物に変身して戦う（狼・熊・鷲・蛇・猪・蠍・蝙蝠・象・蜘蛛・不死鳥）· 動物ごとに専用アイテム3つ（その動物の時だけ出る）",
  },
  fly: { ko: "플라이", en: "Fly", ja: "フライ" },
  flyDesc: {
    ko: "잠자리 날개 · 비르디아. 속도를 즐기는 날쌘 존재. 공격하면 겨눈 쪽으로 공중을 가르며 급습(그동안 무적), 지나간 적을 날카로운 발톱으로 베고 끝에서 할큄 · 발이 아주 빠름",
    en: "Dragonfly wings · Virdia. A swift being who lives for speed. Attacking swoops through the air toward your aim (invulnerable), slashing foes on the way with razor claws and raking at the end · very fast",
    ja: "蜻蛉の翅 · ヴィルディア。速さを楽しむ素早い存在。攻撃すると狙った方へ空を切って急襲（その間無敵）、通り道の敵を鋭い爪で斬り最後に引っかく · 足がとても速い",
  },
  elder: { ko: "장로", en: "Elder", ja: "長老" },
  elderDesc: {
    ko: "진법 · 비르디아의 나이 든 장로. 공격하면 적 자리에 네모난 진을 깔고 잠시 뒤 발동 (덩굴·불기둥·양쪽 벽·함정·떨어지는 검·번개 등 무기마다 다름) · 한 번에 진 셋까지 · 느림",
    en: "Arrays · An old elder of Virdia. Attacking lays a square array under a foe that triggers after a moment (vines, fire pillars, crushing walls, pits, falling swords, lightning and more by weapon) · up to three at once · slow",
    ja: "陣法 · ヴィルディアの年老いた長老。攻撃すると敵の場所に四角い陣を敷き少し後に発動（蔓・火柱・両側の壁・落とし穴・降る剣・雷など武器ごとに違う）· 同時に三つまで · 遅い",
  },
  ren: { ko: "렌", en: "Ren", ja: "レン" },
  renDesc: {
    ko: "토목 · 비르디아. 맨손으로 거대한 토목을 부려 차례로 타격·묶기·날려버리기·짓뭉개기·가두기 (넓고 세지만 느림) · 둘레의 수호 토목이 원거리 탄을 70% 확률로 막음 · 무기는 맨손 하나",
    en: "Earthwood · Virdia. Wields giant earthwood bare-handed: strike, bind, launch, crush and imprison in turn (wide and strong but slow) · guardian earthwood blocks ranged shots 70% of the time · bare hands only",
    ja: "土木 · ヴィルディア。素手で巨大な土木を操り、順に打撃・縛る・吹き飛ばす・押し潰す・閉じ込める（広く強いが遅い）· 周りの守護の土木が遠距離弾を70%の確率で防ぐ · 武器は素手のみ",
  },
  spiritist: { ko: "정령사", en: "Spiritist", ja: "精霊使い" },
  spiritistDesc: {
    ko: "정령 계약 · 비르디아의 학생 정령사. 본인은 매직 미사일만 쏘고, 곁의 작은 정령 셋(30초마다 하나씩 무작위로 바뀜)과 무기인 대정령이 싸움 · 대정령 10 (이드라는 어른이 된 미래의 이드라)",
    en: "Spirit Pact · A student spiritist of Virdia. She only fires magic missiles; three small spirits (one swaps at random every 30s) and her weapon, a great spirit, do the fighting · 10 great spirits (Idra is the grown-up Idra of the future)",
    ja: "精霊契約 · ヴィルディアの学生の精霊使い。本人はマジックミサイルだけ、そばの小さな精霊三体（30秒ごとに一体ずつランダムに入れ替わる）と武器の大精霊が戦う · 大精霊10（イドラは大人になった未来のイドラ）",
  },
  oni: { ko: "오니", en: "Oni", ja: "鬼" },
  oniDesc: {
    ko: "방망이 · 무기가 본체인 도깨비. 느리고 아주 센 휘두르기(공격력 36) + 무기마다 확률 추가 공격 · 25번 휘두르면 30초 신인족(공격력 +45%·최대 체력 +50%·추가 공격 100%) · 공격력 아이템은 최대 체력으로, 공격 속도는 체력 재생력으로, 사거리는 추가 공격 범위로 · 받는 피해 +30% · ??? : 최대 체력 400, 부활 1회 뒤 얻을 수 있는 명계의 무기 · ??? : 재생력 60, 부활 1회 뒤 얻을 수 있는 청전의 무기",
    en: "Club · An oni whose weapon is its true self. Slow, crushing swings (36 damage) + a weapon-specific chance of extra attacks · 25 swings grant 30s of Shinin form (+45% damage, +50% max HP, 100% extra attacks) · damage items become max HP, attack speed becomes regen, range widens extra attacks · +30% damage taken · ??? : a netherworld weapon unlocked with 400 max HP after reviving once · ??? : an azure weapon unlocked with 60 regen after reviving once",
    ja: "金棒 · 武器こそが本体の鬼。遅くとても強い一振り（攻撃力36）＋武器ごとの確率追加攻撃 · 25回振ると30秒神人族（攻撃力+45%・最大体力+50%・追加攻撃100%）· 攻撃力アイテムは最大体力に、攻撃速度は体力再生に、射程は追加攻撃の範囲に · 受けるダメージ+30% · ??? : 最大体力400、1回復活した後に手に入る冥界の武器 · ??? : 再生力60、1回復活した後に手に入る青電の武器",
  },
} satisfies Record<string, Record<Lang, string>>;
