import type { Lang } from "../index";

// 화면 글자: 세계 지도 탈라시아 (world/places/thalassiaField) · 표지판 글은 `{이름 키}Text`
export const WORLD_THAL_TEXT = {
  wpToThalassia: { ko: "동쪽 땅길", en: "Eastern land route", ja: "東の陸路" },
  wpToThalassiaText: { ko: "사막 동쪽 끝에서 바다의 나라 탈라시아로 이어지는 길. 아직 지나갈 수 없다. (스토리 9장에서 열림)", en: "A road from the desert's eastern edge to Thalassia, the nation of the sea. You can't pass yet. (Opens in Story Chapter 9)", ja: "砂漠の東端から海の国タラシアへ続く道。まだ通れない。（ストーリー第9章で解放）" },
  wpThalPort: { ko: "탈라시아 항구 광장", en: "Thalassia Harbor Plaza", ja: "タラシア港の広場" },
  wpThalPortText: { ko: "옛 대륙과 반대편 대륙의 물건이 모두 모이는 무역항의 광장. 동쪽 부두에는 큰 배들이 줄지어 서 있고, 강 하구 너머 남동쪽 곶에는 등대가 있다.", en: "The plaza of a trading port where goods from both the old continent and the far continent gather. Great ships line the eastern docks, and a lighthouse stands on the southeastern cape beyond the river mouth.", ja: "旧大陸と向こうの大陸の品がすべて集まる貿易港の広場。東の埠頭には大きな船が並び、河口の向こう南東の岬には灯台がある。" },
  wpTradeHouse: { ko: "무역 상회", en: "Trading House", ja: "貿易商会" },
  wpWarehouse: { ko: "항구 창고", en: "Harbor warehouse", ja: "港の倉庫" },
  wpPier: { ko: "탈라시아 부두", en: "Thalassia docks", ja: "タラシアの埠頭" },
  wpPierText: { ko: "잔교 셋이 바다로 뻗은 부두. 언젠가 월계선이 반대편 대륙으로 떠날 곳이다.", en: "Docks with three piers reaching into the sea. Someday the Laurel Ship will set sail from here for the far continent.", ja: "三本の桟橋が海へ伸びる埠頭。いつか月桂船が向こうの大陸へ旅立つ場所だ。" },
  wpSeaCave: { ko: "해식 동굴 던전 입구", en: "Sea Cave dungeon entrance", ja: "海食洞のダンジョン入口" },
  wpWarpThalWest: { ko: "서쪽 땅길 이동석", en: "West road warp stone", ja: "西の陸路の転移石" },
  wpWarpThalPort: { ko: "항구 광장 이동석", en: "Harbor plaza warp stone", ja: "港の広場の転移石" },
  wpWarpPier: { ko: "부두 이동석", en: "Docks warp stone", ja: "埠頭の転移石" },
  wpWarpLighthouse: { ko: "등대 이동석", en: "Lighthouse warp stone", ja: "灯台の転移石" },
  wpWarpSeaCave: { ko: "해식 동굴 이동석", en: "Sea Cave warp stone", ja: "海食洞の転移石" },
  wpWarpRiver: { ko: "강변 이동석", en: "Riverside warp stone", ja: "川辺の転移石" },
  wnLevia: { ko: "바다는 모두에게 열려 있어. 그러니 이 항구도 누구에게나 열려 있지.", en: "The sea is open to everyone. So this harbor is open to anyone too.", ja: "海はみんなに開かれてる。だからこの港も誰にでも開かれてるの。" },
  wnTail: { ko: "강물이 바다랑 만나는 곳엔 물고기가 제일 많아. 상어 친구들도 좋아하지!", en: "Where the river meets the sea, the fish are thickest. My shark friends love it too!", ja: "川と海が出会うところは魚がいちばん多いの。サメの友だちも大好き！" },
  wnThorken: { ko: "이 닻 하나면 어떤 배든 붙잡아 둔다. 화물 내리는 동안 비켜 서 있으라고.", en: "With this anchor I can hold any ship in place. Stand clear while the cargo comes down.", ja: "この錨ひとつでどんな船でも止めておける。荷を下ろす間はどいてな。" },
  wnWave: { ko: "잔교 끝에 서면 파도 소리밖에 안 들려. 난 여기가 제일 좋아.", en: "At the end of the pier, all you hear is the waves. This is my favorite spot.", ja: "桟橋の先に立つと波の音しか聞こえない。ここが一番好き。" },
  wnMadQueen: { ko: "저 검은 돛? 내 배야. 걱정 마, 오늘은 장사하러 왔으니까. …아마도.", en: "Those black sails? My ship. Relax, I'm here to trade today. …Probably.", ja: "あの黒い帆？私の船よ。心配しないで、今日は商売に来たんだから。…たぶんね。" },
  wnOrca: { ko: "모래사장에서 몸 풀고 바다에 뛰어드는 게 아침 운동이야. 같이 할래?", en: "Warming up on the beach, then diving into the sea — that's my morning workout. Join me?", ja: "砂浜で体をほぐして海に飛び込むのが朝の運動。一緒にやる？" },
  wnMiryu: { ko: "등대 불은 꺼진 적이 없어. 길 잃은 배가 하나라도 있는 한.", en: "The lighthouse has never gone dark. Not while a single ship is lost at sea.", ja: "灯台の灯が消えたことはない。迷う船がひとつでもある限り。" },
  wnHook: { ko: "반대편 대륙에서 온 물건이 잔뜩이야. 뭐가 걸릴지는 운에 맡겨 봐!", en: "Loads of goods from the far continent. Leave what you hook up to luck!", ja: "向こうの大陸から来た品がどっさりだ。何が釣れるかは運次第！" },
} satisfies Record<string, Record<Lang, string>>;
