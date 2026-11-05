// 캐릭터 그림 시트 표 (game/sprites가 씀): 이름 → 한 칸 크기·발 아래 여백 등
// 한 칸 크기 정사각형, 4줄 × 4칸: 1줄 앞(아래), 2줄 뒤(위), 3줄 옆(오른쪽, 왼쪽은 뒤집음), 4줄 마법 쓰기
// 테두리가 잘리지 않게 칸 둘레에 여백을 둠
/** 방향 시트로 넣은 캐릭터 그림: 이름 → 한 칸 크기, 발 아래 여백 */
/** src: 그림 파일의 한 칸 크기가 다를 때 (빛의 사도 성장 그림 2배 촘촘 · 몰락한 왕 96칸 → 보통 크기로 줄여 그림) */
/** v2: 새 시트 4칸 × 5줄 (칸 = 앞·뒤·왼·오): 1줄 서기 · 2줄 공격 · 3줄 걷기(왼발) · 4줄 걷기(오른발) · 5줄 맞음·쓰러짐·대시 오른쪽·대시 왼쪽 (scripts/art/import_v2.py) */
/** standWalk: 걷기 칸이 서기 칸과 크기가 달라 걸어도 서기 칸 (차원의 순례자) */
export const CHARACTER_SHEETS: Readonly<Record<string, { size: number; footPad: number; src?: number; v2?: true; standWalk?: true }>> = {
  mage: { size: 32, footPad: 2, src: 128, v2: true },
  drifter: { size: 32, footPad: 2, src: 128, v2: true },
  warden: { size: 32, footPad: 2, src: 128, v2: true },
  mystic: { size: 32, footPad: 2, src: 128, v2: true },
  engineer: { size: 32, footPad: 2, src: 128, v2: true },
  elementalist: { size: 32, footPad: 2, src: 128, v2: true },
  brawler: { size: 32, footPad: 2, src: 128, v2: true },
  doctor: { size: 32, footPad: 2, src: 128, v2: true },
  gunner: { size: 32, footPad: 2, src: 128, v2: true },
  beast: { size: 32, footPad: 2, src: 128, v2: true },
  ninja: { size: 32, footPad: 2, src: 128, v2: true },
  chronomancer: { size: 32, footPad: 2, src: 128, v2: true },
  summoner: { size: 32, footPad: 2, src: 128, v2: true },
  novice: { size: 32, footPad: 2, src: 128, v2: true },
  bedouin: { size: 32, footPad: 2, src: 128, v2: true },
  general: { size: 32, footPad: 2, src: 128, v2: true },
  imugi: { size: 32, footPad: 2, src: 128, v2: true },
  apostle: { size: 32, footPad: 2, src: 128, v2: true },
  stargazer: { size: 32, footPad: 2, src: 128, v2: true },
  duck: { size: 32, footPad: 2, src: 128, v2: true },
  scribe: { size: 32, footPad: 2, src: 128, v2: true },
  idra: { size: 32, footPad: 2, src: 128, v2: true },
  byeonhui: { size: 32, footPad: 2, src: 128, v2: true },
  fly: { size: 32, footPad: 2, src: 128, v2: true },
  elder: { size: 32, footPad: 2, src: 128, v2: true },
  ren: { size: 32, footPad: 2, src: 128, v2: true },
  spiritist: { size: 32, footPad: 2, src: 128, v2: true },
  plague: { size: 32, footPad: 2, src: 128, v2: true },
  slayer: { size: 32, footPad: 2, src: 128, v2: true },
  eater: { size: 32, footPad: 2, src: 128, v2: true },
  mukin: { size: 32, footPad: 2, src: 128, v2: true },
  samyeol: { size: 32, footPad: 2, src: 128, v2: true },
  automata: { size: 32, footPad: 2, src: 128, v2: true },
  rider: { size: 32, footPad: 2, src: 128, v2: true },
  bomber: { size: 32, footPad: 2, src: 128, v2: true },
  artifacter: { size: 32, footPad: 2, src: 128, v2: true },
  punk: { size: 32, footPad: 2, src: 128, v2: true },
  collector: { size: 32, footPad: 2, src: 128, v2: true },
  tracker: { size: 32, footPad: 2, src: 128, v2: true },
  forgotten: { size: 32, footPad: 2, src: 128, v2: true },
  remnant: { size: 32, footPad: 2, src: 128, v2: true },
  wanderer: { size: 32, footPad: 2, src: 128, v2: true },
  silk: { size: 32, footPad: 2, src: 128, v2: true },
  pungryu: { size: 32, footPad: 2, src: 128, v2: true },
  leo: { size: 32, footPad: 2, src: 128, v2: true },
  onyx: { size: 32, footPad: 2, src: 128, v2: true },
  fenrir: { size: 40, footPad: 2, src: 128, v2: true },
  /** 이클립스 태양(여자) · 일식(남자) 모습 (등 뒤 큰 광륜까지 그림이라 칸을 크게) */
  // 이클립스: 뒤의 태양·일식 고리까지 칸에 들어 있어 몸이 작게 보임 → 몸이 다른 캐릭터와 같은 크기가 되게 크게 그림
  eclipse: { size: 50, footPad: 2, src: 128, v2: true },
  eclipseNight: { size: 50, footPad: 2, src: 128, v2: true },
  /** 토르켄 (등 뒤 큰 닻까지 그림이라 칸을 크게) */
  thorken: { size: 46, footPad: 2, src: 128, v2: true },
  /** 리바이어 (머리 위 물결 왕관·긴 창까지 그림이라 칸을 조금 크게) */
  levia: { size: 44, footPad: 2, src: 128, v2: true },
  /** 테일 (상어 소녀, 긴 꼬리·물결까지 그림이라 칸을 조금 크게) */
  tail: { size: 40, footPad: 2, src: 128, v2: true },
  /** 매드퀸 (해군 제독, 긴 머리·코트 자락) */
  madQueen: { size: 40, footPad: 2, src: 128, v2: true },
  /** 훅 (해적, 등에 큰 갈고리·깃털 모자) */
  hook: { size: 40, footPad: 2, src: 128, v2: true },
  /** 오토마타 자매 인형 (진홍빛, 사용자 그림 2026-11-04) */
  automataDoll: { size: 32, footPad: 2, src: 128, v2: true },
  // 히든 캐릭터도 일반 캐릭터와 같은 크기 (2026-10-31) · 빛의 사도는 칸에 여백이 많아 키를 맞춘 크기(성장 모습은 단계마다 커짐) · 차원의 순례자는 소녀 키를 일반 캐릭터에 맞춤 (큰 가방은 그만큼 같이 커서 칸이 큼)
  miner: { size: 32, footPad: 2, src: 128, v2: true },
  voyager: { size: 32, footPad: 2, src: 128, v2: true }, zeus: { size: 32, footPad: 2, src: 128, v2: true }, pilgrim: { size: 32, footPad: 2, src: 128, v2: true, standWalk: true }, crownKing: { size: 80, footPad: 3, src: 128, v2: true }, fallenKing: { size: 32, footPad: 2, src: 128, v2: true }, lux: { size: 32, footPad: 2, src: 128, v2: true }, lux2: { size: 32, footPad: 2, src: 128, v2: true }, lux3: { size: 32, footPad: 2, src: 128, v2: true }, lux4: { size: 32, footPad: 2, src: 128, v2: true },
  // 변희가 변한 동물 (옆모습만, render/actors가 옆을 보게 그림)
  ...Object.fromEntries(["wolf", "bear", "eagle", "snake", "boar", "scorpion", "bat", "elephant", "spider", "phoenix"].flatMap((a) => [[`morph-${a}`, { size: 32, footPad: 2, src: 128, v2: true as const }], [`morph-${a}-evo`, { size: 48, footPad: 3, src: 128, v2: true as const }]])),
  abandoned: { size: 32, footPad: 2, src: 128, v2: true },
  abandoned2: { size: 32, footPad: 2, src: 128, v2: true },
  abandoned3: { size: 32, footPad: 2, src: 128, v2: true },
  titan: { size: 32, footPad: 2, src: 128, v2: true },
  oni: { size: 32, footPad: 2, src: 128, v2: true },
  // 각성 오니 (스킨 폴더 그림 skins/oni_god.png)
  oni_god: { size: 48, footPad: 3, src: 128, v2: true },
  // 학살자 피의 학살 모습 (skins/slayer_rage.png)
  slayer_rage: { size: 48, footPad: 3, src: 128, v2: true },
  novice5: { size: 32, footPad: 2, src: 128, v2: true },
  novice10: { size: 32, footPad: 2, src: 128, v2: true },
  novice15: { size: 32, footPad: 2, src: 128, v2: true },
  novice20: { size: 32, footPad: 2, src: 128, v2: true },
  // 야수 변신 백호 (render/beastTiger)
  beasttiger: { size: 56, footPad: 3, src: 128, v2: true },
};
