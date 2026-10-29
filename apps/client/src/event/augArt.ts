// 패왕전 증강 카드 그림 (16×16 픽셀): 글자마다 색 · '.'은 빈칸. 그리기는 PwAugPick
export const AUG_PAL: Record<string, string> = {
  k: "#1a1420", r: "#e0303a", R: "#8a1a20", p: "#ff8a9a", w: "#f4f4f8", g: "#f2d040", G: "#a87a18", s: "#c8ccd8", S: "#6a6e7a",
  b: "#5ab0ff", B: "#2a5aa0", n: "#5ad86a", N: "#2a8a3a", o: "#ff9a3a", v: "#b48aff", V: "#6a4ab0", c: "#6ae8ff", y: "#fff27a",
};

export const AUG_ART: Record<string, readonly string[]> = {
  // 흡혈: 핏방울과 송곳니
  vamp: [
    "................", ".......kk.......", "......krrk......", ".....krrrrk.....", ".....krprrk.....", "....krprrrrk....", "....krrrrrrk....",
    "...krrrrrrrrk...", "...krrrrrrRRk...", "...krrrrrRRRk...", "....krrRRRRk....", ".....kRRRRk.....", "..kwk.kkkk.kwk..", "..kwwk....kwwk..", "...kwk....kwk...", "....k......k....",
  ],
  // 예리함: 번뜩이는 칼날
  edge: [
    "..............kk", ".............kwk", "............kwsk", "...........kwsk.", "..........kwsk..", ".........kwsk...", "........kwsk....",
    ".......kwsk.....", "..y...kwsk......", "...ykkwsk.......", "...kGkSk........", "..kGgGk.........", ".kGgk.k.........", "kGgk............", "kGk.............", ".k..............",
  ],
  // 치명: 붉은 표적과 별
  fatal: [
    "................", "......kkkk......", "....kkrrrrkk....", "...krrkkkkrrk...", "..krkk....kkrk..", "..krk..yy..krk..", ".krk..yggy..krk.",
    ".krk.yggggy.krk.", ".krk.yggggy.krk.", ".krk..yggy..krk.", "..krk..yy..krk..", "..krkk....kkrk..", "...krrkkkkrrk...", "....kkrrrrkk....", "......kkkk......", "................",
  ],
  // 강철 피부: 은빛 방패
  skin: [
    "................", "...kkkkkkkkkk...", "..kssssssssssk..", "..kswwsssssSSk..", "..kswssssssSSk..", "..ksssssssssSk..", "..ksssbbbbssSk..",
    "..ksssbBBbssSk..", "..ksssbBBbssSk..", "..kssssbbsssSk..", "...ksssssssSk...", "...kssssssSSk...", "....kssssSSk....", ".....kssSSk.....", "......kkkk......", "................",
  ],
  // 재생: 새싹 잎과 빛
  bloom: [
    "................", "........y.......", ".......kk..y....", "......knnk......", ".....knnnNk.....", "....knnwnNk..kk.", "....knnnnNk.knnk",
    ".kk..knnNk.knnNk", "knnk..kNk.knnNk.", "knNNk.kNkknnNk..", ".kNNNkkNknNNk...", "..kkNNkNkNkk....", "....kkkNkk......", "......kNk.......", ".....kGGGk......", "....kGGGGGk.....",
  ],
  // 힘: 위로 솟는 붉은 화살과 주먹 빛
  might: [
    ".......kk.......", "......krrk......", ".....krrrrk.....", "....krrrrrrk....", "...krrrrrrrrk...", "..kkkkrrrrkkkk..", ".....krrrrk.....",
    ".....krrRrk.....", ".....krrRrk.....", ".....krrRrk.....", "...kkkkkkkkkk...", "...koooooooook..", "...kooyyyyyook..", "...koooooooook..", "....kkkkkkkkk...", "................",
  ],
  // 신속: 날개
  swift: [
    "................", "................", "..kk............", ".kwwkk..........", ".kwsswkk........", "..kwssswkk......", "...kwssssswkk...",
    "....kwsssssswk..", "..kkkwsssssswk..", ".kcckkwsssswk...", "..kcckkwssswk...", "...kcck.kwwk....", "....kcck.kk.....", ".....kk.........", "................", "................",
  ],
  // 거인: 큰 붉은 심장
  giant: [
    "................", "..kkkk....kkkk..", ".krrrrk..krrrrk.", "krpwrrrkkrrrrrRk", "krwrrrrrrrrrrrRk", "krrrrrrrrrrrrrRk", "krrrrrrrrrrrrRRk",
    ".krrrrrrrrrrrRk.", "..krrrrrrrrrRk..", "...krrrrrrrRk...", "....krrrrrRk....", ".....krrrRk.....", "......krRk......", ".......kk.......", "................", "................",
  ],
  // 집중: 금빛 모래시계
  focus: [
    "...kkkkkkkkkk...", "...kGggggggGk...", "....kwyyyyyk....", "....kwyyyyyk....", ".....kwyyyk.....", "......kwyk......", ".......kk.......",
    ".......kk.......", "......kw.k......", ".....kw.y.k.....", "....kw.yyy.k....", "....kwyyyyyk....", "....kyyyyyyk....", "...kGggggggGk...", "...kkkkkkkkkk...", "................",
  ],
  // 주문 강화: 보랏빛 마법 구슬
  spell: [
    ".......y........", "......yky.......", ".....kkkkk......", "...kkvvvvvkk....", "..kvvwwvvvvVk...", "..kvwwvvvvvVk...", ".kvvwvvvvvvVVk..",
    ".kvvvvvvvvvVVk..", ".kvvvvvvvvVVVk..", "..kvvvvvvVVVk...", "..kVvvvvVVVVk...", "...kkVVVVVkk....", ".....kkkkk......", "....kGGGGGk.....", "...kGggggggGk...", "...kkkkkkkkk....",
  ],
  // 메아리: 퍼지는 고리
  echo: [
    "................", ".....kkkkkk.....", "...kkccccccckk..", "..kcc......cck..", ".kc...kkkk...ck.", ".kc..kbbbbk..ck.", "kc..kb....bk..ck",
    "kc..kb.ww.bk..ck", "kc..kb.ww.bk..ck", "kc..kb....bk..ck", ".kc..kbbbbk..ck.", ".kc...kkkk...ck.", "..kcc......cck..", "...kkccccccckk..", ".....kkkkkk.....", "................",
  ],
  // 돌격: 빠른 화살
  rush: [
    "................", "................", "................", "..........kk....", "..........kgk...", "..ccc.....kggk..", "...kkkkkkkkgggk.",
    ".cckwwwwwwwwgggk", "..ckwwwwwwwwggk.", "...kkkkkkkkggk..", "..ccc.....kgk...", "..........kk....", "................", "................", "................", "................",
  ],
};
