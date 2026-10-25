import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.17.0",
    date: "2026-10-16",
    items: {
      ko: [
        "파수꾼·마법사 전용 아이템을 10개씩 추가했습니다. 떠돌이와 같이 능력치가 아니라 공격 방식을 바꾸는 패시브이고, 자기 캐릭터에게만 나오며 한 판에 하나씩만 얻을 수 있습니다",
        "파수꾼: 반격의 방패 · 회전 베기 · 검기 · 처형인의 표식 · 생명 흡수 · 분노 · 돌진 베기 · 대지 흔들기 · 배수의 진 · 방패 자세",
        "마법사: 연쇄 폭발 · 확대 폭발 · 마력 방패 · 별똥별 · 마력 과충전 · 점화 · 폭풍의 숨결 · 메아리 폭발 · 마력 흡수 · 관통 마탄",
        "공용 무기는 이제 자기 공격 방식만 나옵니다: 파수꾼은 근접, 떠돌이·마법사는 원거리 공용 무기만 얻습니다 (전용 아이템 효과가 항상 맞게)",
        "마법사 시작 무기 '불씨 지팡이'의 기본 범위 피해를 뺐습니다. 범위 공격은 전용 무기와 확대 폭발 같은 아이템으로 얻습니다",
        "게임 규칙이 바뀌어서 이어하기 저장은 이어지지 않습니다",
      ],
      en: [
        "Added 10 exclusive items each for the Warden and the Mage. Like the Drifter's, they change how you attack instead of raw stats, appear only for their own character, and you can hold each only once per run",
        "Warden: Counter Shield · Spin Cleave · Blade Wave · Executioner's Mark · Life Leech · Rage · Dash Slash · Earthshaker · Last Stand · Bulwark Stance",
        "Mage: Chain Burst · Wide Blast · Arcane Shield · Starshower · Overcharge · Ignite · Tempest Breath · Echo Blast · Mana Drain · Piercing Bolt",
        "Shared weapons now match your attack style: the Warden only finds melee ones, the Drifter and Mage only ranged ones (so exclusive item effects always apply)",
        "Removed the built-in area damage from the Mage's starting weapon, the Ember Staff. Area damage now comes from exclusive weapons and items like Wide Blast",
        "The game rules changed, so continue-saves do not carry over",
      ],
      ja: [
        "番人と魔法使いの専用アイテムを10個ずつ追加しました。流れ者と同じく能力値ではなく攻撃方法を変えるパッシブで、自分のキャラにだけ出現し、1回のプレイで1つずつ入手できます",
        "番人: 反撃の盾・回転斬り・剣気・処刑人の印・生命吸収・激怒・突進斬り・大地の震え・背水の陣・盾の構え",
        "魔法使い: 連鎖爆発・拡大爆発・魔力の盾・流星群・魔力過充填・点火・嵐の息・こだまの爆発・魔力吸収・貫通魔弾",
        "共用武器は自分の攻撃方法のものだけ出るようになりました: 番人は近接、流れ者と魔法使いは遠距離のみ（専用アイテムの効果が常に効くように）",
        "魔法使いの初期武器「火種の杖」の基本範囲ダメージを外しました。範囲攻撃は専用武器や拡大爆発などのアイテムで得ます",
        "ゲームルールが変わったため、続きから再開の保存は引き継がれません",
      ],
    },
  },
  {
    version: "0.16.0",
    date: "2026-10-16",
    items: {
      ko: [
        "능력치 보기를 추가했습니다. 켜면 게임 화면 왼쪽 위에 체력·공격력·공격 속도·초당 피해·사거리·이동 속도·투사체 속도·행운이 지금 수치로 표시됩니다",
        "게임 중 위쪽 '수치' 버튼이나 C 키로 켜고 끌 수 있고, 설정 창에서도 바꿀 수 있습니다 (이 기기에 저장)",
      ],
      en: [
        "Added a stats display. When on, your current HP, damage, attack speed, damage/sec, range, move speed, projectile speed and luck are shown at the top left of the game screen",
        "Toggle it with the 'Stats' button at the top or the C key during a run, or in Settings (saved on this device)",
      ],
      ja: [
        "ステータス表示を追加しました。オンにすると、ゲーム画面の左上に体力・攻撃力・攻撃速度・毎秒ダメージ・射程・移動速度・弾速・幸運が現在の数値で表示されます",
        "プレイ中は上の「数値」ボタンまたはCキーで切り替えでき、設定画面でも変更できます（この端末に保存）",
      ],
    },
  },
  {
    version: "0.15.0",
    date: "2026-10-16",
    items: {
      ko: [
        "떠돌이 전용 아이템 10개를 추가했습니다. 능력치가 아니라 공격 방식을 바꾸는 패시브이고, 층 보상·상점에서 떠돌이에게만 나오며 한 판에 하나씩만 얻을 수 있습니다",
        "튕기는 화살촉(벽에 맞으면 튕김) · 갈라지는 촉(적에게 맞으면 두 갈래) · 추적 깃털(적 쪽으로 휘어짐) · 등뒤 화살통(뒤로도 한 발) · 되돌이 깃(빗나가면 되돌아옴)",
        "사냥의 흥분(연속 처치하면 공격 속도 증가) · 숨 고르기(가만히 서 있으면 공격력 증가) · 기습(대시 직후 첫 공격 2배) · 일제 사격 부적(4번째 공격마다 발 수 +2) · 질주의 발자국(처치하면 대시 대기 감소)",
        "게임 규칙이 바뀌어서 이어하기 저장과 이전 일일 도전 기록은 이어지지 않습니다",
      ],
      en: [
        "Added 10 Drifter-only items. They change how you attack instead of raw stats, appear only for the Drifter in floor rewards and shops, and you can hold each only once per run",
        "Ricochet Tip (shots bounce off walls) · Splitting Head (split in two on hit) · Seeker Feather (curve toward enemies) · Back Quiver (also shoot backward) · Returning Fletch (missed shots come back)",
        "Hunt Frenzy (chain kills for attack speed) · Steady Breath (stand still for damage) · Ambush (double damage right after a dash) · Volley Charm (+2 shots every 4th attack) · Chasing Steps (kills shorten dash cooldown)",
        "The game rules changed, so continue-saves and earlier daily records do not carry over",
      ],
      ja: [
        "流れ者専用アイテムを10個追加しました。能力値ではなく攻撃方法を変えるパッシブで、階層報酬・ショップに流れ者にだけ出現し、1回のプレイで1つずつ入手できます",
        "跳ね返る鏃（壁で跳ね返る）・裂ける鏃（命中で2方向に分裂）・追尾の羽（敵に向かって曲がる）・背中の矢筒（後ろにも1発）・戻り羽（外れると戻る）",
        "狩りの高揚（連続撃破で攻撃速度アップ）・息を整える（静止で攻撃力アップ）・奇襲（ダッシュ直後の攻撃が2倍）・一斉射撃のお守り（4回ごとに弾数+2）・疾走の足跡（撃破でダッシュ待機短縮）",
        "ゲームルールが変わったため、続きから再開の保存と以前のデイリー記録は引き継がれません",
      ],
    },
  },
  {
    version: "0.14.0",
    date: "2026-10-16",
    items: {
      ko: [
        "층 보상(보스를 잡고 고르는 아이템)은 서 있기가 아니라 클릭(모바일은 탭)으로 고릅니다",
        "마우스를 바닥 아이템 위에 올리면 그 아이템 위쪽에 이름과 설명이 뜹니다",
        "미니맵을 크게 키웠고, 정리된 방에서 가 본 방을 클릭하면 그 방으로 바로 이동합니다",
        "다른 방에 들어갈 때 주어지던 잠깐의 무적 시간을 없앴습니다",
        "바닥 무기에 마우스를 올리면 지금 든 무기와 초당 피해·공격력·공격 속도·사거리를 비교해 보여 줍니다",
        "무기는 위에 서 있어도 바뀌지 않고, F(모바일은 버튼)를 눌러야 바뀝니다",
      ],
      en: [
        "Floor rewards (the pick-one items after a boss) are now chosen by clicking (tap on mobile) instead of standing on them",
        "Hovering the mouse over a floor item shows its name and description right above the item",
        "The minimap is much larger, and from a cleared room you can click a visited room to travel there",
        "Removed the brief invulnerability you got when entering another room",
        "Hovering a floor weapon compares its damage/sec, damage, attack speed and range with your current weapon",
        "Weapons are no longer swapped by standing on them; press F (a button on mobile) to swap",
      ],
      ja: [
        "階層報酬（ボス撃破後に選ぶアイテム）は、立ち止まりではなくクリック（モバイルはタップ）で選びます",
        "床のアイテムにマウスを乗せると、アイテムの上に名前と説明が表示されます",
        "ミニマップを大きくし、クリア済みの部屋から訪れた部屋をクリックすると直接移動できます",
        "別の部屋に入ったときの短い無敵時間をなくしました",
        "床の武器にマウスを乗せると、今の武器と毎秒ダメージ・攻撃力・攻撃速度・射程を比較表示します",
        "武器は上に立っていても交換されず、F（モバイルはボタン）で交換します",
      ],
    },
  },
  {
    version: "0.13.1",
    date: "2026-10-16",
    items: {
      ko: [
        "PC에서 좌클릭으로 공격하는 중에도 우클릭으로 대시할 수 있습니다",
        "Ctrl+S를 눌러도 브라우저 저장 창이 뜨지 않습니다",
      ],
      en: [
        "On PC you can now right-click to dash while holding left-click to attack",
        "Pressing Ctrl+S no longer opens the browser's save dialog",
      ],
      ja: [
        "PCで左クリック攻撃中も右クリックでダッシュできるようになりました",
        "Ctrl+Sを押してもブラウザの保存画面が開かなくなりました",
      ],
    },
  },
  {
    version: "0.13.0",
    date: "2026-10-16",
    items: {
      ko: [
        "캐릭터마다 전용 무기를 8개씩 추가해 각각 10개가 되었습니다 (총 24개)",
        "파수꾼: 쌍도끼·미늘창·회오리 검·큰 도끼·쇠사슬 철퇴·곡도·큰 방패·룬 검. 회오리 검과 쇠사슬 철퇴는 한 바퀴를 휘두릅니다",
        "떠돌이: 단궁·세 갈래 쇠뇌·관통 쇠뇌·투척 단검·사냥 활·무거운 쇠뇌·날 원반·일제 활. 여러 발을 부채꼴로 쏘거나 적을 뚫고 지나가는 무기가 있습니다",
        "마법사: 서리 막대·번개 막대·혜성 지팡이·세 구슬·별비 홀·그림자 지팡이·불꽃 장갑·공허 구슬",
        "무기 설명에 발 수·관통·폭발·한 바퀴 휘두름이 표시됩니다",
      ],
      en: [
        "Added 8 exclusive weapons per character, for 10 each (24 in total)",
        "Warden: Twin Axes, Halberd, Whirlblade, Broadaxe, Flail, Sabre, Tower Shield, Rune Blade. Whirlblade and Flail swing all the way around",
        "Drifter: Shortbow, Scatter Bow, Arbalest, Throwing Knives, Hunting Bow, Heavy Crossbow, Chakram, Volley Bow. Some fire several shots in a fan or pierce through enemies",
        "Mage: Frost Wand, Lightning Rod, Comet Staff, Tri-Orb, Starfall Scepter, Shadow Staff, Flame Glove, Void Orb",
        "Weapon descriptions now show shots, pierce, blast and full spin",
      ],
      ja: [
        "キャラクターごとに専用武器を8個ずつ追加し、それぞれ10個になりました（計24個）",
        "番人：双斧・斧槍・旋風剣・大斧・鎖鉄球・曲刀・大盾・ルーン剣。旋風剣と鎖鉄球は全周を攻撃します",
        "流れ者：短弓・三連弩・貫通弩・投げナイフ・狩猟弓・重弩・円月輪・斉射弓。扇状に複数発撃つ武器や敵を貫通する武器があります",
        "魔法使い：霜の杖・雷の杖・彗星の杖・三つの宝珠・星降りの笏・影の杖・炎の手袋・虚無の宝珠",
        "武器の説明に弾数・貫通・爆発・全周攻撃が表示されます",
      ],
    },
  },
];
