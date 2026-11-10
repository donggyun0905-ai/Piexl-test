import type { Lang } from "../index";

// 화면 글자: 캐릭터 이름·설명 (캐릭터 선택·기록·배틀 대기실)
export const CHARACTER_TEXT = {
  warden: { ko: "파수꾼", en: "Warden", ja: "番人" },
  wardenDesc: {
    ko: "근접 · 큰 칼로 앞쪽을 넓게 벤다 · 반격: 맞은 뒤 1.5초 안의 첫 휘두르기가 한 바퀴 베기 + 1.5배 피해 · 체력이 높다 · 요령: 일부러 한 대 맞고 바로 휘두르면 반격 한 바퀴 베기",
    en: "Melee · Wide greatblade sweeps · Counter: the first swing within 1.5s after taking a hit becomes a full spin with 1.5x damage · High health · Tip: take a hit on purpose, then swing right away for a counter spin",
    ja: "近接 · 大剣で前方を広く斬る · 反撃: 被弾後1.5秒以内の最初の攻撃が全周斬り+1.5倍ダメージ · 体力が高い · コツ: わざと一発受けてすぐ振ると反撃の全周斬り",
  },
  drifter: { ko: "떠돌이", en: "Drifter", ja: "流れ者" },
  drifterDesc: {
    ko: "원거리 · 쇠뇌로 멀리서 쏜다 · 기습: 대시 직후 1.5초 안의 첫 공격이 2배 피해 · 발이 빠르다 · 요령: 대시로 자리를 옮긴 직후 첫 화살로 강한 적을 노리기",
    en: "Ranged · Crossbow from afar · Ambush: the first attack within 1.5s after a dash deals 2x damage · Fast on foot · Tip: right after a dash, aim the first bolt at the toughest foe",
    ja: "遠距離 · クロスボウで遠くから撃つ · 奇襲: ダッシュ後1.5秒以内の最初の攻撃が2倍ダメージ · 足が速い · コツ: ダッシュ直後の最初の一発で強い敵を狙う",
  },
  mage: { ko: "마법사", en: "Mage", ja: "魔法使い" },
  mageDesc: {
    ko: "원거리 · 공격할 때마다 발밑 마법진에 한 획씩, 다 새기면 큰 마법이 떨어진다 · 체력이 낮다 · 요령: 마법진이 다 새겨질 때까지 멈추지 말고 계속 공격",
    en: "Ranged · Each attack carves a rune stroke at your feet; complete it and a great spell falls · Low health · Tip: keep attacking until the rune circle is complete",
    ja: "遠距離 · 攻撃するたびに足元の魔法陣に一画ずつ、刻み終えると大魔法が落ちる · 体力が低い · コツ: 魔法陣が完成するまで攻撃を止めない",
  },
  mystic: { ko: "음양사", en: "Talisman Master", ja: "陰陽師" },
  mysticDesc: {
    ko: "원거리 · 부적을 맞힐 때마다 쌓여 무기마다 다른 추가 효과가 터진다 · 체력이 조금 낮다 · 요령: 한 적에게 부적을 몰아 맞혀 추가 효과를 빨리 터뜨리기",
    en: "Ranged · Talisman hits build up and unleash a different bonus per weapon · Slightly low health · Tip: focus talismans on one foe to trigger the bonus faster",
    ja: "遠距離 · 符を当てるたびに溜まり、武器ごとに違う追加効果が発動 · 体力がやや低い · コツ: 一体に符を集中させて追加効果を早く発動",
  },
  gunner: { ko: "거너", en: "Gunner", ja: "ガンナー" },
  gunnerDesc: {
    ko: "총 · 탄창을 다 쓰면 장전한다 · 치명타가 터지고 발이 빠르지만 체력이 40으로 고정 (체력 아이템도 늘지 않음) · 요령: 체력이 낮으니 대시로 피하며 장전 시간에는 거리를 벌리기",
    en: "Guns · Reload when the magazine runs dry · Critical hits and fast feet, but max HP is fixed at 40 (HP items don't raise it) · Tip: HP is low — dash to dodge and back off while reloading",
    ja: "銃 · 弾倉を撃ち切るとリロード · クリティカルが出て足が速いが最大体力は40固定（体力アイテムでも増えない） · コツ: 体力が低いのでダッシュで避け、リロード中は距離を取る",
  },
  beast: { ko: "야수", en: "Beastkin", ja: "獣人" },
  beastDesc: {
    ko: "고양이 수인 · 고양이 펫이 스스로 적에게 달려가 할퀸다 · 발이 빠르다 · 요령: 고양이가 알아서 싸우니 나는 피하는 데 집중",
    en: "Cat-folk · Pet cats run at enemies and scratch on their own · Quick on their feet · Tip: the cats fight on their own — focus on dodging",
    ja: "猫の獣人 · ペットの猫が自分から敵に駆け寄って引っかく · 足が速い · コツ: 猫が勝手に戦うので自分は避けることに集中",
  },
  ninja: { ko: "닌자", en: "Ninja", ja: "忍者" },
  ninjaDesc: {
    ko: "그림자 · 수리검으로 표식을 쌓으면 적의 그림자에서 분신이 튀어나와 벤다 · 발이 빠르다 · 요령: 표식이 쌓인 적 옆에 머물면 분신이 계속 튀어나옴",
    en: "Shadows · Build marks with shuriken and a shadow clone bursts from the foe's shadow to strike · Quick on their feet · Tip: stay near marked foes and clones keep bursting out",
    ja: "影 · 手裏剣で印を溜めると敵の影から分身が飛び出して斬る · 足が速い · コツ: 印が溜まった敵のそばにいると分身が出続ける",
  },
  chronomancer: { ko: "시간술사", en: "Chronomancer", ja: "時間術師" },
  chronomancerDesc: {
    ko: "시간 · 본인 공격은 약하지만, 1초 뒤 공격한 그 자리에서 잔상이 더 세게 한 번 더 한다 · 움직이며 싸우면 지나온 자리마다 공격이 다시 터진다 · 잔상에 5번 맞은 적은 시간 붕괴",
    en: "Time · Your own attacks are weak, but 1s later an echo repeats each one harder where you made it · Fight on the move and your past self keeps striking · 5 afterimage hits trigger Time Collapse",
    ja: "時間 · 本人の攻撃は弱いが、1秒後に攻撃した場所で残像がより強くもう一度行う · 動きながら戦うと通った場所ごとに攻撃が再び炸裂する · 残像に5回当たった敵は時間崩壊",
  },
  summoner: { ko: "소환술사", en: "Summoner", ja: "召喚術師" },
  summonerDesc: {
    ko: "근접 · 채찍으로 친 만큼 소환수를 부른다 · 채찍마다 해골·임프·골렘·늑대·요정·새끼 용 등 다른 소환수 · 요령: 많이 때릴수록 소환수가 늘어나니 적이 몰린 곳을 채찍질",
    en: "Melee · Lash foes to call summons · Each whip calls a different ally: skeletons, imps, golems, wolves, fairies, a baby dragon and more · Tip: more hits mean more summons — lash where foes crowd",
    ja: "近接 · 鞭で打った分だけ召喚獣を呼ぶ · 鞭ごとに骸骨・インプ・ゴーレム・狼・妖精・子竜など違う召喚獣 · コツ: 多く当てるほど召喚獣が増えるので敵が集まる所を打つ",
  },
  charGoalLock: { ko: "도전과제 「{name}」를 이루면 열림", en: "Unlocks with the achievement “{name}”", ja: "実績「{name}」達成で解放" },
  randomCharacter: { ko: "무작위 캐릭터로 시작 (무기·패시브·아이템도 무작위)", en: "Random character (random weapon, passive & items too)", ja: "ランダムなキャラで開始（武器・パッシブ・アイテムもランダム）" },
  skinSwitch: { ko: "스킨 바꾸기", en: "Change skin", ja: "スキン変更" },
  skinSwitchNone: { ko: "가진 스킨이 없습니다 (상점에서 살 수 있어요)", en: "No skins owned yet (buy them in the Shop)", ja: "スキンを持っていません（ショップで買えます）" },
} satisfies Record<string, Record<Lang, string>>;
