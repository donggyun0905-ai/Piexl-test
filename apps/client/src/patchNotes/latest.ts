import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.375",
    date: "2026-11-03",
    items: {
      ko: [
        "시련의 방: 비석에 YES/NO로 답하기 전에는 출구가 닫혀 다음 방으로 갈 수 없음 (잠긴 출구로도 못 감)",
        "노선도 갈 길: 걸어가던 것을 바꿈 — 큰 지도를 닫은 뒤(또는 싸운 방을 정리하면) '이동합니다'와 함께 귀환 빛기둥 1.5초 뒤 다음 방으로 이동 · 지도를 보는 동안에는 움직이지 않음 · 움직이거나 맞으면 취소 (지도를 다시 닫으면 다시 시작)",
      ],
      en: [
        "Trial room: the exits stay shut until you answer the monolith YES/NO (you can't even pay to leave)",
        "Planned path: no more auto-walking — after you close the big map (or clear a fight room), 'Moving on' shows with the recall light pillar and you move to the next room 1.5s later · nothing moves while the map is open · moving or getting hit cancels it (close the map again to retry)",
      ],
      ja: [
        "試練の部屋：石碑にYES/NOで答えるまで出口が閉じて次の部屋へ行けない（閉じた出口からも出られない）",
        "ルートの道：自動で歩く方式を変更 — 大きな地図を閉じたあと（または戦った部屋を片付けると）「移動します」と帰還の光の柱が出て1.5秒後に次の部屋へ移動・地図を見ている間は動かない・動いたり攻撃を受けると取り消し（地図をもう一度閉じると再開）",
      ],
    },
  },
  {
    version: "0.48.374",
    date: "2026-11-03",
    items: {
      ko: [
        "하이오크: 체력이 줄수록 세지는 것이 붉은 오라로 보임 (체력이 적을수록 크고 진해지고 불꽃이 솟음) · 도끼 한 방에 내 체력이 다 날아갈 만큼 세면 머리 위에 작은 WARNING",
        "단련의 방: 악마의 거래 아이템·히든 아이템은 포인트로 강화할 수 없음 (목록에 안 나옴)",
      ],
      en: [
        "High orcs: their low-HP rage now shows as a red aura (bigger, deeper and flaming as their HP drops) · a small WARNING appears over their head when one axe hit could take all your HP",
        "Training room: devil-deal and hidden items can no longer be trained with points (they don't appear in the list)",
      ],
      ja: [
        "ハイオーク：体力が減るほど強くなる様子が赤いオーラで見える（体力が少ないほど大きく濃く、炎が立つ）・斧の一撃で自分の体力が尽きるほど強いと頭上に小さくWARNING",
        "鍛錬の部屋：悪魔の取引アイテム・ヒドゥンアイテムはポイントで強化できない（一覧に出ない）",
      ],
    },
  },
  {
    version: "0.48.373",
    date: "2026-11-03",
    items: {
      ko: [
        "그림 리퍼·뒤집어진 십자가·풍뎅이 부적: 기계공학자·의사 공격, 원소술사 일부 공격, 화상·중독 같은 상태이상 피해에도 붙지 않던 것을 고침 (이제 모든 공격에 적이 받는 피해 +30%)",
        "비밀의 방(금 간 벽): 방에 몬스터가 남아 있으면 닿아도 무너지지 않음 · 다 잡아야 열림 (덜 잡고 들어가 방 보상을 놓치던 것)",
      ],
      en: [
        "Grim Reaper, Inverted Cross and Scarab Charm now also apply to Engineer and Doctor attacks, some Elementalist attacks and status damage such as burn and poison (every attack now deals +30% to enemies)",
        "Secret rooms (cracked walls): the wall won't crumble while monsters remain in the room — clear it first (you could slip in early and lose the room reward)",
      ],
      ja: [
        "グリムリーパー・逆さ十字・スカラベの護符：機械工学者・医者の攻撃、元素術師の一部の攻撃、火傷・毒などの状態異常ダメージにも乗るよう修正（すべての攻撃で敵の被ダメージ+30%）",
        "秘密の部屋（ひび割れた壁）：部屋にモンスターが残っていると触れても崩れない・全部倒すと開く（倒しきらずに入って部屋の報酬を逃していた問題）",
      ],
    },
  },
  {
    version: "0.48.372",
    date: "2026-11-03",
    items: {
      ko: [
        "노선도 큰 지도: Tab(모바일은 오른쪽 작은 지도를 누름)으로 열고 닫음 · 지금 방에서 이어진 방을 차례로 누르면 빛나는 파란 테두리로 갈 길이 정해짐 (다시 누르면 취소)",
        "갈 길을 정해 두면 싸운 방을 정리한 뒤 다음 방 출구로 알아서 걸어감 (직접 움직이면 그동안은 내 조작대로 · 고를 패시브가 바닥에 있으면 기다림)",
        "땅 물고기: 땅속에 있는 동안은 기절·느려짐·화상 등 아무것도 받지 않음 (증강 기술도 땅속 땅 물고기는 노리지 않음)",
        "제단·경매장 증강 기술은 내가 공격하는 동안만 나감 (가만히 있으면 안 나감)",
      ],
      en: [
        "Big route map: open/close with Tab (on mobile, tap the small map on the right) · tap connected rooms in order to set your path with a glowing blue border (tap again to cancel)",
        "With a path set, after you clear a fight room you walk to the next room's exit on your own (moving yourself overrides it · it waits if a passive choice is on the floor)",
        "Land fish: while underground they take nothing at all — no stun, slow, burn and so on (augment skills no longer target them either)",
        "Altar and auction augment skills only fire while you are attacking (not while standing idle)",
      ],
      ja: [
        "ルートマップ拡大：Tab（モバイルは右の小さなマップをタップ）で開閉・今の部屋からつながる部屋を順に押すと光る青い枠で道が決まる（もう一度押すと取り消し）",
        "道を決めておくと、戦った部屋を片付けたあと次の部屋の出口へ自動で歩く（自分で動くとその間は自分の操作・選ぶパッシブが床にあれば待つ）",
        "地中魚：地中にいる間は気絶・鈍化・火傷など何も受けない（増強スキルも地中の地中魚を狙わない）",
        "祭壇・オークションの増強スキルは自分が攻撃している間だけ発動（じっとしていると出ない）",
      ],
    },
  },
  {
    version: "0.48.371",
    date: "2026-11-03",
    items: {
      ko: [
        "숨은 시련: 4층부터 층마다 보통 전투방 하나가 몰래 시련 (지도에서는 보통 방과 똑같이 보이고, 들어가면 방이 잠김). 다섯 중 하나가 무작위로 나옴",
        "① 우거진 하이오크 부락: 체력·공격력이 오른 하이오크 3라운드, 마지막 라운드는 공격이 빠른 정예",
        "② 어둠의 세계: 사거리가 단검만큼 짧아지고 깜깜함 (가끔 1.5초 걷힘) · 그림자 3라운드, 마지막 라운드 그림자는 한 방이 아주 셈",
        "③ 공성전: 성벽 두 줄(보스만 한 체력, 닿아도 안 아프지만 못 넘어감) · 위에 스켈레톤 궁병, 사이에 포격수, 아래 방패 가디언 · 아래 벽을 부수면 포격수, 위 벽을 부수면 궁병이 무너짐 · 궁병이 남아 있으면 양옆에서 폭발풍뎅이가 계속 나옴",
        "④ 안개숲: 들어온 자리·살포기 둘레 말고는 독가스 · 베놈이 계속 다시 나오고, 탄 쏘는 적은 안개 속에서 숨어 쏨(안 맞음) · 독가스 살포기를 모두 부수면 3초 뒤 안개가 걷힘",
        "⑤ 죽음의 바다: 방 전체가 물, 숨 10초 (다 떨어지면 계속 다침) · 몬스터를 잡으면 3초 동안 비눗방울, 안에 들어가면 숨이 참 · 10초 뒤 해적선이 나타나고, 배를 부수면 해적 선장과 쇠사슬 간수가 내려옴",
        "숨은 시련을 깨면 보통 방 보상에 더해 패시브 셋 중 하나를 고름",
      ],
      en: [
        "Hidden Trials: from floor 4, one ordinary combat room per floor is secretly a trial (it looks like any other room on the map and locks once you enter). One of five, at random",
        "① Overgrown High Orc Village: 3 rounds of high orcs with more HP and damage; the last round is fast-attacking elites",
        "② World of Darkness: your range shrinks to a dagger's and everything goes dark (lifting for 1.5s now and then) · 3 rounds of shadows, the last round hits very hard",
        "③ Siege: two walls (boss-level HP, harmless to touch but impassable) · skeleton archers on top, gunners between, shield guardians below · breaking the lower wall fells the gunners, the upper wall the archers · while archers remain, bomb beetles keep coming from the side walls",
        "④ Misty Forest: poison gas everywhere except where you came in and around the sprayers · venoms keep respawning and shooters hide in the fog (can't be hit) · destroy every gas sprayer and the fog clears 3s later",
        "⑤ Sea of Death: the room is flooded and you have 10s of breath (then you keep taking damage) · slain monsters leave a bubble for 3s that refills your breath · after 10s a pirate ship appears; sink it and the pirate captain and chain wardens come down",
        "Clearing a hidden trial gives the normal room reward plus a choice of three passives",
      ],
      ja: [
        "隠れた試練：4階から各階で普通の戦闘部屋ひとつがひそかに試練に（マップでは普通の部屋と同じに見え、入ると部屋がロック）。5種類から1つがランダム",
        "① 生い茂るハイオークの集落：体力・攻撃力が上がったハイオーク3ラウンド、最後は攻撃の速い精鋭",
        "② 闇の世界：射程が短剣ほどに縮み真っ暗に（時々1.5秒晴れる）・影3ラウンド、最後の影は一撃がとても強い",
        "③ 攻城戦：城壁2列（ボス並みの体力、触れても痛くないが越えられない）・上にスケルトン弓兵、間に砲撃手、下に盾のガーディアン・下の壁を壊すと砲撃手、上の壁を壊すと弓兵が崩れる・弓兵が残る間は左右の壁から爆発甲虫が出続ける",
        "④ 霧の森：入った場所と散布機の周り以外は毒ガス・ヴェノムが出続け、弾を撃つ敵は霧の中で隠れて撃つ（当たらない）・毒ガス散布機をすべて壊すと3秒後に霧が晴れる",
        "⑤ 死の海：部屋全体が水、息は10秒（尽きるとダメージが続く）・倒した敵の場所に3秒間泡、入ると息が回復・10秒後に海賊船が現れ、壊すと海賊船長と鎖の看守が降りてくる",
        "隠れた試練を突破すると、普通の部屋の報酬に加えてパッシブ3つから1つを選べる",
      ],
    },
  },
];
