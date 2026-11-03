import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
