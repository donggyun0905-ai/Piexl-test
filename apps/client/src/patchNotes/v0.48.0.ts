import type { PatchNote } from "./types";

// 지난 기록 (0.48.0)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.0",
    date: "2026-10-21",
    items: {
      ko: [
        "혼자 하기에 새 모드 '타워 디펜스'가 생겼습니다. 캐릭터를 타워처럼 세워 길로 몰려오는 적과 보스를 20라운드 동안 막습니다. 맵은 7개(초록 들판·모래 협곡·얼음 호수·안개 늪·용암 화산·수정 동굴·하늘 성채)",
        "타워 레벨을 올리면 2레벨에 무기를 고르고, 그다음부터 패시브를 하나씩 고릅니다(공용 + 자기 직업). 패시브를 다 고르면 무기를 하나 더 들어 두 무기로 싸우는 만렙이 됩니다",
        "5라운드마다 보스(1·2·3단계 보스 전부), 뒤로 갈수록 보스가 여럿 같이 오고, 20라운드에는 최종 보스 셋이 한 마리씩 옵니다. 타워 디펜스에만 나오는 적 8종(슬라임·도마뱀·박쥐·딱정벌레·바위 골렘·주술사·알주머니·도깨비불)",
        "새 캐릭터 닌자: 수리검 등으로 적에게 표식을 쌓으면 그 적의 그림자에서 분신이 튀어나와 벱니다. 환영진은 표식이 찬 적을 가운데로 내 사거리의 절반만 한 원이 생기고 원 위 9곳에서 그림자가 가운데로 돌진합니다. 전용 무기 10개·전용 아이템 10개",
        "새 캐릭터 시간술사: 본인 공격은 약하지만(70%), 1초 뒤 공격했던 그 자리에서 반투명한 잔상이 더 세게(120%) 한 번 더 합니다. 움직이며 싸우면 지나온 자리마다 공격이 다시 터집니다. 시곗바늘·모래시계·시한폭탄·예지의 눈 등 전용 무기 10개·전용 아이템 10개",
        "새 캐릭터 소환술사: 근접 채찍으로 적을 쳐서 모은 힘으로 소환수를 부릅니다. 채찍마다 해골 병사·임프·돌 골렘·해골 궁수·불꽃 정령·독버섯·늑대·요정·박쥐 떼·새끼 용 등 다른 소환수 (12초 동안 스스로 싸움). 전용 채찍 10개·전용 아이템 10개",
        "새 캐릭터 풋내기: 맨손으로 시작해 공용 무기·공용 패시브만 씁니다. 적을 쓰러뜨려 경험치를 모으고, 레벨이 오를 때마다 받은 스탯 포인트를 공격력·공격 속도·체력·치명타 확률·치명타 피해 등 원하는 능력치에 직접 찍습니다 (치명타는 풋내기만, 기본 5%·150%). 레벨마다 최대 체력·공격력도 조금씩 저절로 오릅니다",
        "공용 무기 4개 추가: 몽둥이 · 단도 · 투창(2명 관통) · 부메랑(되돌아옴)",
        "새 캐릭터 소환술사: 처음 선보이는 만큼 조금 세게 두되 소환수 피해를 약간(약 6%) 낮춤, 시작 채찍(가죽 채찍)은 조금 더 낮춤",
        "혼자 하기에 새 모드 '영웅의 길'이 생겼습니다. 13단계 동안 1~4단계는 1단계 보스, 5~8단계는 2단계 보스, 9~12단계는 3단계 보스가 나오고, 4단계 묶음마다 앞 두 단계는 보스 1마리, 뒤 두 단계는 보스 2마리가 함께 나옵니다(한 마리마다 체력 80%). 13단계는 랜덤 라스트 보스",
        "타워 디펜스의 적 8종이 던전에도 나옵니다: 슬라임(1층~, 통통 뛰어옴) · 도마뱀·박쥐 떼(2층~) · 딱정벌레(등껍질 방패)·도깨비불(순간이동, 3층~) · 주술사(주변 적 회복)·알주머니(터지면 작은 슬라임 셋, 4층~) · 바위 골렘(땅 찍기, 5층~ 한 방에 한 마리)",
        "캐릭터 선택 창에서 마지막 캐릭터 칸이 한 줄 전체로 길게 늘어나던 문제를 고쳤습니다",
      ],
      en: [
        "New Solo mode: Tower Defense. Station your heroes like towers and hold back the horde and bosses for 20 rounds. 7 maps (Green Meadow, Sand Canyon, Frozen Lake, Misty Swamp, Lava Volcano, Crystal Cave, Sky Citadel)",
        "Level up a tower to choose a weapon at level 2, then one passive at a time (common + class). Once every passive is taken, it wields a second weapon and fights with both at max level",
        "Bosses every 5 rounds (every tier-1/2/3 boss), more of them together later on, and at round 20 the three final bosses come one at a time. 8 Tower Defense-only foes (Slime, Lizard, Bat, Beetle, Rock Golem, Shaman, Egg Sac, Wisp)",
        "New character: Ninja. Build marks on enemies with shuriken and more, and a shadow clone bursts from that enemy's shadow to strike. Phantom Circle forms a circle half as wide as your range around the marked foe and 9 shadows dash in from it. 10 exclusive weapons and 10 exclusive items",
        "New character: Chronomancer. Your own attacks are weak (70%), but 1s later a translucent echo repeats each one harder (120%) right where you made it, so fighting on the move leaves strikes all along your path. Clock Hands, Hourglass, Time Bomb, Foresight and more: 10 exclusive weapons and 10 exclusive items",
        "New character: Summoner. Lash foes with a melee whip to build power and call summons. Each whip calls a different ally — skeleton soldier, imp, stone golem, skeleton archer, flame spirit, toadstool, wolves, fairy, bat swarm, baby dragon (each fights on its own for 12s). 10 exclusive whips and 10 exclusive items",
        "New character: Novice. Starts bare-handed and uses only common weapons and passives. Defeat foes to earn EXP; each level grants a stat point you spend yourself on damage, attack speed, health, crit chance, crit damage and more (only the Novice can crit: 5% / 150% base). Max health and damage also rise a little every level on their own",
        "4 new common weapons: Club · Dagger · Javelin (pierces 2) · Boomerang (returns)",
        "Summoner: still a bit strong for its debut, but summon damage is down slightly (~6%) and the starting Leather Whip a little more",
        "New Solo mode: Hero's Path. 13 stages: stages 1-4 bring tier-1 bosses, 5-8 tier-2 and 9-12 tier-3; in each group of four, the first two stages have one boss and the last two have two bosses at once (80% health each). Stage 13 is a random final boss",
        "Tower Defense's 8 enemies now appear in the dungeon: Slime (floor 1+, hops) · Lizard and Bat flocks (floor 2+) · Beetle (shell shield) and Will-o'-wisp (teleports, floor 3+) · Shaman (heals allies) and Egg Sac (bursts into 3 small slimes, floor 4+) · Rock Golem (ground slam, floor 5+, one per room)",
        "Fixed the last character card stretching across a whole row on the character select screen",
      ],
      ja: [
        "ソロに新モード「タワーディフェンス」を追加。キャラクターをタワーのように配置し、道を押し寄せる敵とボスを20ラウンド守り抜きます。マップは7つ（緑の草原・砂の峡谷・氷の湖・霧の沼・溶岩火山・水晶の洞窟・天空の城塞）",
        "タワーのレベルを上げると2レベルで武器を選び、その後はパッシブを1つずつ選びます（共通＋自分の職業）。パッシブをすべて選ぶと武器をもう1つ持ち、2つの武器で戦う最大レベルになります",
        "5ラウンドごとにボス（1・2・3段階のボス全員）、後半はボスが複数同時に来て、20ラウンドでは最終ボス3体が1体ずつ来ます。タワーディフェンス専用の敵8種（スライム・トカゲ・コウモリ・甲虫・岩ゴーレム・呪術師・卵嚢・鬼火）",
        "新キャラクター忍者：手裏剣などで敵に印を溜めると、その敵の影から分身が飛び出して斬ります。幻影陣は印が溜まった敵を中心に射程の半分の円ができ、円上の9か所から影が中心へ突進します。専用武器10個・専用アイテム10個",
        "新キャラクター時間術師：本人の攻撃は弱いですが（70%）、1秒後、攻撃した場所で半透明の残像がより強く（120%）もう一度行います。動きながら戦うと通った場所ごとに攻撃が再び炸裂します。時計の針・砂時計・時限爆弾・予知の眼など専用武器10個・専用アイテム10個",
        "新キャラクター召喚術師：近接の鞭で敵を打って力を溜め、召喚獣を呼びます。鞭ごとに骸骨兵・インプ・岩ゴーレム・骸骨弓兵・炎の精霊・毒キノコ・狼・妖精・コウモリの群れ・子竜など違う召喚獣（12秒間自分で戦う）。専用の鞭10個・専用アイテム10個",
        "新キャラクター見習い：素手で始まり、共通の武器とパッシブだけ使います。敵を倒して経験値を貯め、レベルが上がるたびにもらうステータスポイントを攻撃力・攻撃速度・体力・クリティカル率・クリティカルダメージなど好きな能力に自分で振ります（クリティカルは見習いだけ、基本5%・150%）。レベルごとに最大体力と攻撃力も少しずつ自動で上がります",
        "共通武器4つ追加：棍棒 · 短刀 · 投げ槍（2体貫通） · ブーメラン（戻ってくる）",
        "召喚術師：お披露目なので少し強めのままですが、召喚獣のダメージを少し（約6%）下げ、初期武器の革の鞭はもう少し下げました",
        "ソロに新モード「英雄の道」を追加。13ステージで、1～4は1段階ボス、5～8は2段階、9～12は3段階ボスが登場し、4ステージごとに前半2ステージはボス1体、後半2ステージはボス2体が同時に出ます（1体ごとの体力80%）。13ステージ目はランダムなラストボス",
        "タワーディフェンスの敵8種がダンジョンにも登場：スライム（1階～、跳ねて来る）・トカゲとコウモリの群れ（2階～）・甲虫（甲羅の盾）と鬼火（瞬間移動、3階～）・呪術師（周りの敵を回復）と卵嚢（割れると小さいスライム3体、4階～）・岩ゴーレム（地面叩き、5階～1部屋に1体）",
        "キャラクター選択画面で最後のキャラクターの枠が1行いっぱいに伸びていた問題を修正",
      ],
    },
  },
];
