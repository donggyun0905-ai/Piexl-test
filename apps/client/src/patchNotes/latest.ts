import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.357",
    date: "2026-11-02",
    items: {
      ko: ["하이오크 새 그림: 붉은 피부·털 달린 가시 갑옷·큰 도끼의 큰 도트 (걷기 · 도끼 휘두르기 · 정면) · 몸이 커지고 도끼 범위도 넓어짐"],
      en: ["High Orc redrawn: big pixel art with red skin, spiked fur armor and a great axe (walk · axe swing · front) · bigger body and wider axe reach"],
      ja: ["ハイオークの新しい絵：赤い肌・毛皮付きトゲ鎧・大斧の大きなドット（歩き · 大斧振り · 正面）· 体が大きくなり斧の範囲も広く"],
    },
  },
  {
    version: "0.48.356",
    date: "2026-11-02",
    items: {
      ko: [
        "새 몬스터(3층부터): 쇠사슬 간수(사슬이 날아갈 길이 먼저 보이고, 맞으면 피해 + 간수 쪽으로 끌려감 · 대시나 길 밖으로 피함) · 하이오크(큰 도끼 반원 휘두르기·맞으면 출혈, 체력이 적을수록 빨라지고 세짐 · 붉은 기운)",
      ],
      en: [
        "New monsters (from floor 3): Chain Warden (its chain's path shows first; a hit deals damage and drags you toward it · dash or step off the path) · High Orc (half-circle great-axe swings that cause Bleed; the lower its HP, the faster and stronger it gets · red aura)",
      ],
      ja: [
        "新モンスター（3階から）：鎖の看守（鎖の飛ぶ道が先に見え、当たるとダメージ + 看守の方へ引き寄せられる · ダッシュか道の外へ避ける）· ハイオーク（大斧の半円振り・当たると出血、体力が少ないほど速く強くなる · 赤いオーラ）",
      ],
    },
  },
  {
    version: "0.48.355",
    date: "2026-11-02",
    items: {
      ko: [
        "시련의 방 뒤 몬스터 강화: 얻은 시련 점수 비율만큼 그 뒤 모든 몬스터·보스의 체력(700점에 +35%)·주는 피해(+25%)가 오름 · 700점을 넘긴 몫은 그대로라 그만큼 강해짐",
        "시련 '다섯 보스': 보스 다섯이 한꺼번에 나오고 사용 아이템 금지 · 무리 시련은 5물결, 한 물결 몬스터 수 증가 · 암흑 시련은 내 몸 둘레 말고는 완전히 깜깜",
        "새 몬스터(2층부터): 폭발풍뎅이(빠르게 달라붙어 1.5초 뒤 폭발 + 화상, 대시로 떼어 냄) · 스켈레톤 궁병(얇은 선으로 겨누다 깜빡이면 매우 빠른 화살)",
      ],
      en: [
        "Monsters grow after Trial Rooms: by the share of trial points earned, all later monsters and bosses gain HP (+35% at 700 pts) and damage (+25%) · points beyond 700 add nothing, so you come out ahead",
        "Trial 'Five Bosses': five bosses appear at once and items are sealed · horde trials now have 5 waves with more monsters per wave · the darkness trial is pitch black except right around you",
        "New monsters (from floor 2): Blast Beetle (clings to you and explodes after 1.5s with Burn; dash to shake it off) · Skeleton Archer (aims with a thin line; when it blinks, a lightning-fast arrow flies)",
      ],
      ja: [
        "試練の部屋の後のモンスター強化：得た試練点数の割合で以後の全モンスター・ボスの体力（700点で+35%）・与ダメージ（+25%）が上がる · 700点を超えた分は上がらず、その分強くなれる",
        "試練「五体のボス」：ボス5体が同時に出現し使用アイテム禁止 · 群れの試練は5波、1波のモンスター数増加 · 暗黒の試練は自分の周り以外が真っ暗",
        "新モンスター（2階から）：爆発コガネ（素早く張り付き1.5秒後に爆発 + 火傷、ダッシュで振り払う）· スケルトン弓兵（細い線で狙い、点滅すると非常に速い矢）",
      ],
    },
  },
];
