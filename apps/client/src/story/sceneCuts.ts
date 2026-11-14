// 스토리 장면 컷: 장마다 몇 번째 문단부터 어떤 그림인지 (그림 목록·GPT 프롬프트 docs/STORY_ART.md)
// 그림 파일 public/story/{장}-{컷 번호}.webp 가 있으면 그 그림, 없으면 배경 종류(bg)로 그린 임시 그림 + 말하는 캐릭터 (story/sceneBg)
import type { ChapterId } from "./storyData";

export type SceneBg = "forest" | "castle" | "fire" | "room" | "mountain" | "night" | "dawn" | "sea" | "temple" | "snow" | "abyss" | "city";

export interface SceneCut {
  /** 이 문단(0부터)부터 */
  at: number;
  bg: SceneBg;
}

export const SCENE_CUTS: Record<ChapterId, readonly SceneCut[]> = {
  ch1: [
    { at: 0, bg: "forest" }, // 1 사냥꾼과 잠든 어린 용
    { at: 4, bg: "fire" }, // 2 어미 용의 아스칼론 습격
    { at: 7, bg: "room" }, // 3 의료소의 세 사람, 맹세
    { at: 13, bg: "forest" }, // 4 야수·원소술사가 새끼 용을 지킴
    { at: 19, bg: "mountain" }, // 5 산꼭대기 결전
    { at: 22, bg: "forest" }, // 6 비르디아 치유소의 대립
    { at: 29, bg: "night" }, // 7 그림자 속 누군가와 검은 약
    { at: 34, bg: "dawn" }, // 8 어미 용의 작별·세계수의 씨앗
  ],
  ch2: [
    { at: 0, bg: "castle" }, // 1 테라코어 세 사람의 경고
    { at: 3, bg: "castle" }, // 2 헬리오스로 떠나는 장수와 풋내기
    { at: 7, bg: "city" }, // 3 황금빛 연회장·악의 사도
    { at: 11, bg: "night" }, // 4 달빛 공터의 갓이터
    { at: 17, bg: "night" }, // 5 테라코어의 난입·풋내기를 보내는 장수
    { at: 28, bg: "night" }, // 6 풋내기와 격투가
    { at: 40, bg: "fire" }, // 7 아스트랄 로드·탈출
    { at: 48, bg: "dawn" }, // 8 국경 언덕의 새벽
  ],
  ch3: [
    { at: 0, bg: "city" }, // 1 테라코어 뒷골목의 세 아이
    { at: 9, bg: "city" }, // 2 그림자 같은 여자·제국패·빵과 물
    { at: 21, bg: "temple" }, // 3 바렌트 사막으로·복수 이야기
    { at: 27, bg: "temple" }, // 4 의사와 거인의 습격·아이들을 안고 뛰어오른 닌자
    { at: 45, bg: "temple" }, // 5 베두인의 회전체·소환술사·오니
    { at: 59, bg: "temple" }, // 6 신전으로 달려가는 아이들·떠오르는 몸
    { at: 72, bg: "fire" }, // 7 거인의 바위·튕겨 나간 오니·무너지는 현현체
    { at: 81, bg: "abyss" }, // 8 태초의 빛과 어둠 현현·아이들의 각성
    { at: 97, bg: "forest" }, // 9 풀피리·세계수 통로·비르디아 전력
    { at: 118, bg: "dawn" }, // 10 흉악들·후퇴·광야의 새벽
  ],
  ch4: [
    { at: 0, bg: "abyss" }, // 1 의식의 방·무릎 꿇은 악의 사도·알 수 없는 목소리
    { at: 5, bg: "temple" }, // 2 역병의사·학살자·사멸에게 내리는 명
    { at: 14, bg: "city" }, // 3 응접실 연회·사도의 귓속말
    { at: 23, bg: "abyss" }, // 4 사슬에 묶인 이터·떨어지는 황금 깃털
    { at: 29, bg: "fire" }, // 5 갓이터의 현현·대검에 꽂힌 두 장군
    { at: 39, bg: "dawn" }, // 6 새벽 공터·잔해 아래의 이터
    { at: 48, bg: "dawn" }, // 7 돌아온 사멸·역병의사·피투성이 학살자
    { at: 52, bg: "night" }, // 8 아카식 레코드의 세 관찰자
  ],
  ch5: [
    { at: 0, bg: "castle" }, // 1 세 왕의 원탁·패왕전을 앞당기자는 테라코어 왕
    { at: 10, bg: "castle" }, // 2 망설이는 비르디아 왕·장로의 사념
    { at: 20, bg: "forest" }, // 3 세계수 아래 비르디아 왕과 장로
    { at: 23, bg: "city" }, // 4 테라코어 거리의 패왕전 외침·로브 쓴 사람
    { at: 29, bg: "room" }, // 5 아스칼론 대기실
    { at: 43, bg: "city" }, // 6 패왕전 개막·룰렛·사냥
    { at: 52, bg: "forest" }, // 7 숲에 내려선 세 진영
    { at: 67, bg: "forest" }, // 8 하늘에서 떨어진 괴력난신
    { at: 78, bg: "castle" }, // 9 세 왕의 외침·검은 불꽃 천 조각
    { at: 93, bg: "dawn" }, // 10 연합 선언·같은 깃발 아래
  ],
  ch6: [
    { at: 0, bg: "castle" }, // 1 연합 정예 집결·로브 쓴 사람
    { at: 11, bg: "temple" }, // 2 모래에 묻힌 세레스티아·주먹으로 바닥을 뚫는 괴력난신
    { at: 18, bg: "temple" }, // 3 솟구친 여의봉·괴력난신과 제천대성의 싸움
    { at: 36, bg: "temple" }, // 4 로브를 벗은 에스텔(잊혀진 자)
    { at: 45, bg: "temple" }, // 5 성문을 부수고 원초의 진금을 건넴
    { at: 48, bg: "abyss" }, // 6 에워싼 그림자들·검은 인영
    { at: 70, bg: "fire" }, // 7 아스칼론 대 갓이터·멈춘 대검
    { at: 86, bg: "temple" }, // 8 비르디아 대 태초·검신
    { at: 102, bg: "abyss" }, // 9 장로의 진법·태초의 허상과 하늘의 진짜 태초
    { at: 114, bg: "fire" }, // 10 테라코어 대 파멸의 용
    { at: 135, bg: "fire" }, // 11 연옥의 브레스·로더·여의봉 벽
    { at: 145, bg: "night" }, // 12 홀로 남은 제천대성·황혼의 종언
  ],
  ch7: [
    { at: 0, bg: "abyss" }, // 1 지하 감옥에 묶인 악마
    { at: 8, bg: "abyss" }, // 2 가장 깊은 감방의 블루 플레임·헬피스트, 굉음
    { at: 21, bg: "abyss" }, // 3 끊어진 사슬·달려온 세 사냥꾼
    { at: 32, bg: "abyss" }, // 4 보랏빛 건틀릿을 쳐 내는 인시전
    { at: 38, bg: "night" }, // 5 달빛 레이피어·옷자락을 벗은 화신체
    { at: 49, bg: "temple" }, // 6 황금 결계와 흰 사제복의 천의 사도
    { at: 59, bg: "abyss" }, // 7 루나틱을 메고 달아나는 격투가
    { at: 65, bg: "night" }, // 8 보랏빛 오라에 무릎 꿇은 사도
  ],
  ch8: [
    { at: 0, bg: "temple" }, // 1 성화의 대성당·유리엘과 루나틱의 말다툼
    { at: 13, bg: "temple" }, // 2 문을 연 베아트리스·명단을 건네는 루나틱
    { at: 19, bg: "abyss" }, // 3 지하 통로 출구에 선 이클립스
    { at: 25, bg: "abyss" }, // 4 밤의 주인의 도끼를 막는 가브리엘
    { at: 31, bg: "abyss" }, // 5 성흔으로 잠시 돌아온 이클립스
    { at: 38, bg: "fire" }, // 6 천장을 가르고 뛰어든 학살자·성수병
    { at: 48, bg: "city" }, // 7 광장을 내려다보는 악의 사도·심연의 통로
  ],
  ch9: [
    { at: 0, bg: "sea" }, // 1 탈라시아 항구 회의장·매드퀸과 훅
    { at: 17, bg: "sea" }, // 2 웃는 사람들·달아나는 토르켄
    { at: 26, bg: "night" }, // 3 제국 쪽 길의 몬스터 떼를 뚫는 넷
    { at: 32, bg: "night" }, // 4 은빛 탄환과 실버불렛
    { at: 40, bg: "mountain" }, // 5 연합국 진지 문 앞·장수와 토르켄
    { at: 50, bg: "room" }, // 6 막사 안 네 나라 회의
    { at: 57, bg: "room" }, // 7 뇌전의 사자와 구름 탄 풍류사
    { at: 64, bg: "mountain" }, // 8 일곱 빛기둥과 광석 영물·괴력난신과 이드라
    { at: 71, bg: "forest" }, // 9 무덤가의 비석을 든 괴력난신
    { at: 77, bg: "abyss" }, // 10 거대한 동굴의 늙은 백랑과 이드라
    { at: 90, bg: "dawn" }, // 11 교류의 장·엎드린 백랑
    { at: 95, bg: "fire" }, // 12 화신체 앞의 사도 / 주먹을 쥔 괴력난신
  ],
};

/** 문단 i가 속한 컷 번호 (0부터) */
export function cutIndex(ch: ChapterId, i: number): number {
  const cuts = SCENE_CUTS[ch];
  let n = 0;
  while (n + 1 < cuts.length && cuts[n + 1]!.at <= i) n++;
  return n;
}

/** 컷 그림 파일 (있을 수도 없을 수도) */
export const cutImage = (ch: ChapterId, n: number): string => `${import.meta.env.BASE_URL}story/${ch}-${n + 1}.webp`;
