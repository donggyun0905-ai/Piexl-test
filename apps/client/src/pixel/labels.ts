// 도트 편집 개발용 글자 (한국어만): 그림 묶음 · 효과 · 탄 이름 (몬스터 이름은 i18n/enemies)
export type GroupId = "char" | "skin" | "enemy" | "weapon" | "passive" | "use" | "fx" | "shot" | "tiger";

export const GROUPS: { id: GroupId; label: string; help: string }[] = [
  { id: "char", label: "캐릭터", help: "칸 32×32가 4줄×4칸: 줄은 앞·뒤·옆(오른쪽)·공격, 칸은 움직임 4장. 노란 선은 가운데·발 위치" },
  { id: "skin", label: "스킨", help: "캐릭터와 같은 규격. '(던진 뒤)'는 베두인이 차크람을 던져 손이 빈 모습" },
  { id: "enemy", label: "몬스터·보스", help: "오른쪽을 보는 모습, 움직임 칸이 가로로 (보통 2장). 왼쪽은 게임이 뒤집어 그림" },
  { id: "weapon", label: "무기 아이콘", help: "16×16 아이콘. 장비 줄·바닥·상점·설명에 쓰임" },
  { id: "passive", label: "패시브 아이콘", help: "16×16 아이콘. 전용 아이템은 게임이 캐릭터 색 틀을 두르지 않고 그린 그대로 씀" },
  { id: "use", label: "사용 아이템 아이콘", help: "16×16 아이콘" },
  { id: "fx", label: "효과", help: "칸 48×48 장면 4개 (시간 순서). 칸 가운데가 효과 자리, 오른쪽이 앞쪽(게임이 방향대로 돌림). 효과 크기에 맞춰 늘이거나 줄여 그림" },
  { id: "tiger", label: "한정 스킨 효과 (범 풍류)", help: "범 풍류를 입었을 때만 나오는 효과. 칸 크기·장면 수는 그림마다 다름 (발톱 자국은 줄 = 자국 1·2·3개). 칸 가운데가 효과 자리" },
  { id: "shot", label: "탄", help: "16×16 한 칸. 가운데가 탄 자리, 오른쪽으로 날아가는 모습 (게임이 방향대로 돌림). 따로 모양이 정해진 탄은 바뀌지 않음" },
];

export const FX_LABELS: Record<string, string> = {
  hit: "맞음 반짝",
  swing: "근접 휘두르기 (한 바퀴 베기 포함)",
  blast: "마법탄 폭발",
  ring: "퍼지는 고리",
  burst: "터짐",
  streak: "빛줄기 (순간 베기)",
  slam: "내려찍기",
  cleave: "크게 베기",
  scratch: "할퀴기",
  bolt: "번개",
  flame: "불꽃",
  mark: "표식",
  sandspin: "베두인 · 모래 회전 베기",
  thrust: "장수 · 찌르기",
};

export const SHOT_LABELS: Record<string, string> = {
  player: "내 기본 탄",
  magic: "마법탄 (터지는 탄)",
  enemy: "적 기본 탄",
};

export const TIGER_LABELS: Record<string, string> = {
  claw: "발톱 자국 (맞힘·휘두르기)",
  crit: "치명타 발톱 (피해 숫자 뒤)",
  seal: "K.O 도장 (보스 처치)",
  ring: "파동 고리 (처치·쏘기)",
  pillar: "금빛 기둥 (무기·패시브 얻음)",
  aura: "대기 기운 (가만히 있을 때 발밑)",
  sleep: "몸을 말고 자는 백호 (가만히 있을 때, 숨 쉬기 2장, 배 가운데에 캐릭터가 앉음)",
  tail: "앞을 감싸는 백호 꼬리 (캐릭터 위에 겹침)",
  band: "떠다니는 풍악 악기 (줄: 장구·꽹과리·북·소고·태평소·청사초롱)",
  paw: "금빛 발자국 (걸을 때, 위가 걷는 쪽)",
};
