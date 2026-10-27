import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.149",
    date: "2026-10-28",
    items: {
      ko: [
        "무한 모드 업데이트: 1~6층은 그대로 · 7~10층 보스방에 보스 2마리 · 11~13층 랜덤 라스트 보스 · 14~16층 라스트 보스 + 보스 (3마리) · 17~19층 라스트 보스 3종 (라스트 보스방 2배 크기)",
        "7층부터 보스방을 깰 때마다 적 체력·주는 피해가 12%씩 오름 · 20층부터 보스방은 내 능력치를 그대로 가진 랜덤 캐릭터 AI와의 대결 이벤트 (1대1·3대3·5대5·난투전 중 하나, 다 쓰러뜨리면 계단)",
      ],
      en: [
        "Endless mode update: floors 1–6 unchanged · floors 7–10 boss rooms have 2 bosses · 11–13 a random last boss · 14–16 a last boss plus bosses (3 in total) · 17–19 all three last bosses (in a room twice the last boss room)",
        "From floor 7, each cleared boss room makes enemies 12% tougher and harder-hitting · from floor 20 the boss room becomes a battle against AI characters with your own stats (1v1, 3v3, 5v5 or a brawl; defeat them all for the stairs)",
      ],
      ja: [
        "無限モード更新: 1〜6階はそのまま · 7〜10階のボス部屋にボス2体 · 11〜13階ランダムなラストボス · 14〜16階ラストボス＋ボス（計3体）· 17〜19階ラストボス3種（ラストボス部屋の2倍の広さ）",
        "7階からボス部屋を突破するたびに敵の体力・与ダメージが12%ずつ上がる · 20階からボス部屋は自分と同じ能力のランダムキャラAIとの対決イベント（1対1・3対3・5対5・乱闘のどれか、全員倒すと階段）",
      ],
    },
  },
  {
    version: "0.48.148",
    date: "2026-10-27",
    items: {
      ko: [
        "새 이벤트 '패왕전': AI 캐릭터들과 겨루는 대결 6종 · 1대1(작은 경기장·쉬움) · 3대3(넓은 경기장·보통) · 5대5(나무가 우거진 큰 숲, 수풀에 숨기·가시 함정·어려움) · 토너먼트(3명씩 1대1로 차례로, 체력 회복 없이 연달아·보통) · 대난투(20명이 큰 들판에서, 아이템이 떨어짐·지옥) · 데스매치(5명이 저택에서, 처치할 때마다 더 약한 캐릭터로 21레벨까지·보통)",
        "준비방: 무기 1개 · 패시브 10개(여러 번 가질 수 있는 것은 겹쳐서) · 사용 아이템 2개를 골라 가져감 (데스매치는 캐릭터·무기·패시브 모두 무작위) · 팀 대결에서 내가 쓰러지면 내 편을 지켜봄",
        "이기면 칩: 1대1 1,000 · 3대3 3,000 · 5대5 5,000 · 토너먼트 3,000 · 대난투 20,000 · 데스매치 10,000",
      ],
      en: [
        "New event 'Champion Clash': six battles against AI characters · 1v1 (small arena, Easy) · 3v3 (wide arena, Normal) · 5v5 (a vast dense forest with bushes to hide in and spike traps, Hard) · Tournament (three per side, one on one in turn without healing, Normal) · Brawl (20 fighters on a huge field with item drops, Brutal) · Deathmatch (five in a manor, each kill turns you into a weaker character up to level 21, Normal)",
        "Preparation room: bring 1 weapon, 10 passives (stackable ones can be doubled) and 2 consumables (Deathmatch is all random) · if you fall in a team battle you watch your allies",
        "Win chips: 1v1 1,000 · 3v3 3,000 · 5v5 5,000 · Tournament 3,000 · Brawl 20,000 · Deathmatch 10,000",
      ],
      ja: [
        "新イベント「覇王戦」: AIキャラクターと戦う対決6種 · 1対1（小さな闘技場・やさしい）· 3対3（広い闘技場・ふつう）· 5対5（木々が生い茂る大きな森、茂みに隠れる・トゲの罠・むずかしい）· トーナメント（3人ずつ1対1で順番に、回復なしで連戦・ふつう）· 大乱闘（20人が広い野原で、アイテムが落ちる・地獄）· デスマッチ（5人で屋敷にて、倒すたびに弱いキャラへ21レベルまで・ふつう）",
        "準備部屋: 武器1つ・パッシブ10個（重ねて持てるものは重複可）・使用アイテム2個を選んで持っていく（デスマッチはキャラ・武器・パッシブすべてランダム）· チーム戦で倒れたら味方を観戦",
        "勝てばチップ: 1対1 1,000 · 3対3 3,000 · 5対5 5,000 · トーナメント 3,000 · 大乱闘 20,000 · デスマッチ 10,000",
      ],
    },
  },
  {
    version: "0.48.147",
    date: "2026-10-27",
    items: {
      ko: ["잔영: 공격 속도가 아이템·버프로 오르지 않음 (무기 그대로) · 그림자 상태에서 친 뒤치기는 반드시 치명타 · '그림자 손놀림'은 공격 속도 +15% → 공격력 +15%"],
      en: ["Remnant: attack speed can no longer be raised by items or buffs (stays at the weapon's) · backstabs from the shadow are always critical · 'Shadow Hands' changed from +15% attack speed to +15% damage"],
      ja: ["残影: 攻撃速度がアイテム・バフで上がらない（武器のまま）· 影状態からの背後討ちは必ず会心 ·「影の手さばき」は攻撃速度+15% → 攻撃力+15%"],
    },
  },
  {
    version: "0.48.146",
    date: "2026-10-27",
    items: {
      ko: ["영사: 실 한 가닥 피해를 더 낮춤 (기본 공격력의 50% → 20%) · 진짜 피해는 얽힘 5로 찢기·과다출혈 (그대로)"],
      en: ["Silk: thread damage lowered further (50% → 20% of base attack) · the real damage is tearing at 5 tangles and Hemorrhage (unchanged)"],
      ja: ["影糸使い: 糸1本のダメージをさらに下げた（基本攻撃力の50% → 20%）· 本当のダメージは絡み5の引き裂き・大量出血（そのまま）"],
    },
  },
  {
    version: "0.48.145",
    date: "2026-10-27",
    items: {
      ko: [
        "렌 대지의 추가 공격을 새 그림으로 다시 만듦: 흙·나무·돌로 된 진짜 용 · 용머리는 기본 공격 폭발만큼 크게 땅에서 솟아 입을 벌리고 적을 물어 삼킴(잠깐 꼼짝 못 함) · 용오름은 굵은 몸통이 물결치며 땅을 드나들며 나아감",
        "돌 던지기는 더 넓고 크고 많이 (돌 18개, 더 멀리 날림) · 양쪽 토목은 새김 무늬가 빛나는 거대한 돌기둥이 땅을 가르고 솟아 맞부딪힌 뒤 부서짐 · 머리 위 거대 바위·떨어지는 큰 돌도 새 그림",
        "추적자 암습 저격: 자동 조준 없음 (쓰는 동안 자동 공격이 꺼지고 끝나면 다시 켜짐) · 조준경 가운데 빨간 작은 원에 정확히 대야 맞음 · 5초 동안 발 수 제한 없음 · 화면은 30%만 어둡게 · 무적 대신 보호막 20 (겹치지 않음) · 한 번 더 누르면 바로 끝 (대기는 그대로)",
        "추적자 스킬 키 1·2·3을 설정에서 원하는 키로 바꿀 수 있음 · 강력한 한방 한 판 3번 제한 없앰",
        "잊혀진 자 게이지: 테두리는 그대로, 안은 노란 원이 한 바퀴 다 차면 신족 · 영사 출혈 게이지는 적 체력바·얽힘 점 위에 핏방울 표시와 함께",
      ],
      en: [
        "Ren's Earth bonus attacks remade with new art: a real dragon of earth, wood and stone · the Dragon Head rises from the ground as big as a basic-attack blast, opens its jaws and swallows foes (briefly holding them) · the Dragon Surge's thick body weaves in and out of the ground as it charges",
        "Rock Toss is wider, bigger and denser (18 rocks, flings farther) · the crushing blocks are huge stone pillars with glowing carvings that split the ground, slam together and shatter · new art for the overhead boulder and falling rocks",
        "Tracker Ambush Snipe: no auto-aim (auto-attack turns off during it and back on after) · only hits foes exactly inside the small red circle in the scope · unlimited shots for 5s · screen only 30% darker · 20 shield instead of invulnerability (doesn't stack) · press again to end at once (cooldown still runs)",
        "Tracker skill keys 1·2·3 can be rebound in Settings · removed the 3-uses-per-run limit on Power Shot",
        "The Forgotten gauge: same frame, the inside is now a yellow ring that triggers divine form when fully filled · Silk's bleed gauge now sits above the enemy HP bar and tangle dots with a blood-drop mark",
      ],
      ja: [
        "レンの大地の追加攻撃を新しい絵で作り直し：土・木・石でできた本物の竜 · 竜頭は基本攻撃の爆発ほど大きく地面から現れ、口を開けて敵を丸呑み（少しの間動けない）· 竜の昇りは太い胴体がうねりながら地面を出入りして進む",
        "石投げはより広く大きく多く（石18個、より遠くへ）· 両側の土木は光る刻印の巨大な石柱が地面を割って現れ、ぶつかって砕ける · 頭上の巨大岩・落ちる大岩も新しい絵",
        "追跡者 暗襲狙撃：オートエイムなし（使用中はオートアタックがオフ、終わると再びオン）· スコープ中央の赤い小さな円にぴったり合わせた敵だけ命中 · 5秒間弾数制限なし · 画面は30%だけ暗く · 無敵の代わりにシールド20（重ならない）· もう一度押すとすぐ終了（待ち時間はそのまま）",
        "追跡者のスキルキー1・2・3を設定で好きなキーに変更可能 · 強力な一撃の1プレイ3回制限を撤廃",
        "忘れられし者のゲージ：縁はそのまま、中は黄色い円が一周満ちると神族 · 影糸使いの出血ゲージは敵の体力バー・絡みの点の上に血のしずく印つきで",
      ],
    },
  },
];
