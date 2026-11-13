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
  /** 오르카 (격투가, 금발·푸른 불꽃 팔·금빛 허리띠) */
  orca: { size: 40, footPad: 2, src: 128, v2: true },
  /** 웨이브 (은발 포니테일·흰 후드·서핑보드) */
  wave: { size: 40, footPad: 2, src: 128, v2: true },
  /** 미류 (해룡 수인, 은발·푸른 용 뿔·대태도) */
  miryu: { size: 40, footPad: 2, src: 128, v2: true },
  /** 베아트리스 (성국 성기사, 금발·후광·백은 갑옷·붉은 망토·쌍검) */
  beatrice: { size: 40, footPad: 2, src: 128, v2: true },
  /** 이안 (성국 침묵의 서기관, 은발 노인·안경·백금 로브·펜·등불) */
  ian: { size: 40, footPad: 2, src: 128, v2: true },
  /** 가브리엘 (성국 철옹의 방패, 금발·가시 후광·백은 갑옷·푸른 망토·타일 방패·단조 해머) */
  gabriel: { size: 40, footPad: 2, src: 128, v2: true },
  /** 세레나 (성국 환혹의 무희, 은발·가시 후광·백합·금빛 무희 옷·가시 사슬 채찍) */
  serena: { size: 40, footPad: 2, src: 128, v2: true },
  /** 라파엘 (성국 폭풍의 사수, 흰 로브·가시 후광·에테르 스코프 대궁) */
  rafael: { size: 40, footPad: 2, src: 128, v2: true },
  /** 유리엘 (성국 단죄의 성녀, 빛의 성복·후광·성수 수정구 & 사슬 철퇴) */
  yuriel: { size: 40, footPad: 2, src: 128, v2: true },
  /** 미카엘라 (성국 공허의 인도자, 빛의 성복·후광·떠다니는 투창과 검) */
  michaela: { size: 40, footPad: 2, src: 128, v2: true },
  /** 블래스트 (새벽의 성흔 악마 사냥꾼, 흰 머리·고글·붉은 코트·산탄총) */
  blast: { size: 40, footPad: 2, src: 128, v2: true },
  /** 네일러 (새벽의 성흔 못 박는 심판관, 은발·눈 붕대·가시 왕관·못 박힌 누더기·십자 해머) */
  nailer: { size: 40, footPad: 2, src: 128, v2: true },
  /** 시저스 (새벽의 성흔 단죄의 가위, 라벤더 머리·가시 두건·붉은 장미·쌍가위) */
  scissors: { size: 40, footPad: 2, src: 128, v2: true },
  /** 헬피스트 (새벽의 성흔 적혈의 주먹, 흰 머리·검은 코트·붉은 악마 팔) · 적혈 각성 중 악마화 모습 (뿔·붉은 몸) */
  hellfist: { size: 40, footPad: 2, src: 128, v2: true },
  hellfistDemon: { size: 40, footPad: 2, src: 128, v2: true },
  /** 실버불렛 (새벽의 성흔 은빛 집행자, 은발 땋은 머리·깃털 모자·검은 코트·쌍권총) */
  silverBullet: { size: 40, footPad: 2, src: 128, v2: true },
  /** 블루 플레임 (새벽의 성흔 청염의 맹인, 검푸른 긴 머리·눈가리개·흰 코트·푸른 불꽃) */
  blueFlame: { size: 40, footPad: 2, src: 128, v2: true },
  /** 루나틱 (새벽의 성흔 월광의 검사 · 리더, 은빛 긴 머리·초승달 머리 장식·흰 갑옷·남색 망토·새하얀 레이피어) */
  lunatic: { size: 40, footPad: 2, src: 128, v2: true },
  /** 인시전 (새벽의 성흔 쌍도끼의 도살자 · 광전사, 백발 땋은 포니테일·붉은 리본·흰 털 어깨·검은 갑옷·붉은 망토·붉은 쌍도끼) */
  incision: { size: 40, footPad: 2, src: 128, v2: true },
  /** 크루세이더 (새벽의 성흔 성십자가의 거인 · 탱커, 흰 판금 갑옷·가시 후광·붉은 머리채·흰 털 망토·붉은 망토·금테 거대한 돌 십자가) · 덩치가 커서 칸이 큼 */
  crusader: { size: 46, footPad: 2, src: 128, v2: true },
  /** 조커 (실베르 카드 투척자, 네온 헬멧·X 눈·이빨 웃음·보라·형광 연두 체크 재킷·카드) */
  joker: { size: 40, footPad: 2, src: 128, v2: true },
  /** 쉐도잉 (실베르 그림을 그리는 정령 소녀, 은빛 머리·남색 모자와 망토·푸른 영혼 손·보석 붓) */
  shadowing: { size: 38, footPad: 2, src: 128, v2: true },
  /** 인형술사 (실베르 붉은 실로 인형을 부리는 소녀, 검은 긴 머리·하얀 손 둘·매달린 나무 인형) */
  puppeteer: { size: 40, footPad: 2, src: 128, v2: true },
  /** 래빗 (실베르 망치를 든 유령 소녀, 연분홍 머리 둥근 쪽머리·초록 유령 기운·분홍 토끼 망치) */
  rabbit: { size: 44, footPad: 2, src: 128, v2: true },
  /** 백령 (실베르 영혼과 대태도를 다루는 오니 소녀, 흰 긴 머리·푸른 뿔·검은 칼집 대태도) */
  baekryeong: { size: 40, footPad: 2, src: 128, v2: true },
  /** 빙설 (실베르 얼음 칼날의 해군 소녀, 흰 긴 머리·남색 베레모·얼음 검) */
  bingseol: { size: 40, footPad: 2, src: 128, v2: true },
  /** 아수라 (실베르 귀신 주먹 6개의 싸움꾼, 금발·남색 코트·등 뒤 귀신 팔) */
  asura: { size: 40, footPad: 2, src: 128, v2: true },
  /** 기어스 (실베르 은빛 쌍방패 기사 메이드 · 큰 얼굴·양쪽 방패로 꽉 찬 그림이라 34로 맞춤, 2026-11-12) */
  gears: { size: 34, footPad: 2, src: 128, v2: true },
  /** 느아르 (아슈바르 태초의 색채 악마 검정) */
  noir: { size: 34, footPad: 2, src: 128, v2: true },
  /** 루주 (아슈바르 태초의 색채 악마 빨강) */
  rouge: { size: 34, footPad: 2, src: 128, v2: true },
  /** 블뢰 (아슈바르 태초의 색채 악마 파랑) */
  bleu: { size: 34, footPad: 2, src: 128, v2: true },
  /** 존 (아슈바르 태초의 색채 악마 노랑) */
  jaune: { size: 34, footPad: 2, src: 128, v2: true },
  /** 마젠타 (아슈바르 태초의 색채 악마 자홍) */
  magenta: { size: 34, footPad: 2, src: 128, v2: true },
  /** 백인장 (실베르 기계 날개 쌍검 기사) */
  baekinjang: { size: 40, footPad: 2, src: 128, v2: true },
  /** 아리아 (실베르 지휘자 소녀, 은발·흰 금빛 제복·높은음자리 모자) */
  aria: { size: 40, footPad: 2, src: 128, v2: true },
  /** 레이븐 (실베르 체스 왕국 창기사, 은발·흑백 금빛 갑옷·왕관) */
  chessRaven: { size: 40, footPad: 2, src: 128, v2: true },
  /** 혼령 (실베르 곰방대 연기의 여인, 은발·보랏빛 기모노) */
  honryeong: { size: 40, footPad: 2, src: 128, v2: true },
  /** 아수라 분노의 팔 (붉은 귀신 팔, scripts/art/asura.py red) */
  asuraRed: { size: 40, footPad: 2, src: 128, v2: true },
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
