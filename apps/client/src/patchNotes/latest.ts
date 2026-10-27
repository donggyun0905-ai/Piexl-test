import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
