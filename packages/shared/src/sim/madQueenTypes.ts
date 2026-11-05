// 매드퀸 상태 타입 (sim/madQueen). 모두 선택 값 (예전 저장에는 없음)

/** 날아가는(또는 떨어지는) 포탄: 땅 위 자리 · 방향·빠르기 · 남은 틱 · 처음 틱 · 몸 크기 · 폭발 반지름 · 피해 · 쏜 것(0 대포 · 1 터렛 · 2 일제사격 낙하)
 *  · 그림 높이 h (대포·터렛 포구에서 나와 날아가며 땅으로 내려옴, 맞힘은 땅 위 자리로) */
export interface MqShell {
  x: number;
  y: number;
  dx: number;
  dy: number;
  sp: number;
  t: number;
  t0: number;
  r: number;
  boom: number;
  dmg: number;
  src: 0 | 1 | 2;
  h: number;
}

/** 맵에 놓인 터렛: 자리 · 다음에 쏘기까지 틱 · 포신 방향(라디안) · 놓인 지 몇 틱 */
export interface MqTurret {
  x: number;
  y: number;
  cd: number;
  a: number;
  age: number;
}

export interface MadQueenPlayerState {
  /** 날아가는 포탄 · 맵의 터렛 · 몸 옆 날개 무기 수 (0~4) */
  mqShells?: MqShell[];
  mqTurrets?: MqTurret[];
  mqWings?: number;
  /** 마지막으로 쏜 틱 (대포 반동·손가락 그림) · 일제사격 남은 틱 */
  mqShot?: number;
  mqSalvo?: number;
  /** 지금 방 ("층/방", 바뀌면 터렛·날개·포탄이 사라짐) */
  mqRoom?: string;
}

/** 효과: 포탄 폭발 · 대포 불꽃 · 날개 레이저 · 터렛 내려옴 · 날개 펼침 · 일제사격 시작 · 번개 */
export type MadQueenFx = "mqBoom" | "mqMuzzle" | "mqBeam" | "mqDrop" | "mqWing" | "mqSalvo" | "mqBolt";
