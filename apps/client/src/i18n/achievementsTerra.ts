// 업적 이름·조건 설명: 시즌 2 테라코어 캐릭터 클리어 (한·영·일, achievements가 커서 나눔)
type Row = [ko: string, en: string, ja: string];
const n = (name: Row, desc: Row) => ({
  name: { ko: name[0], en: name[1], ja: name[2] },
  desc: { ko: desc[0], en: desc[1], ja: desc[2] },
});

export const TERRA_ACHIEVEMENTS = {
  clearAutomata: n(["깨어난 인형", "The Doll Awakens", "目覚めた人形"], ["오토마타로 클리어", "Clear as Automata", "オートマタでクリア"]),
  clearRider: n(["폭주 완주", "Full Throttle", "暴走完走"], ["라이더로 클리어", "Clear as Rider", "ライダーでクリア"]),
  clearBomber: n(["폭발은 예술이다", "Explosions Are Art", "爆発は芸術だ"], ["붐버로 클리어", "Clear as Bomber", "ボマーでクリア"]),
  clearArtifacter: n(["푸른 문신의 장인", "Artisan of Blue Ink", "青き刺青の匠"], ["아티팩터로 클리어", "Clear as Artifacter", "アーティファクターでクリア"]),
  clearPunk: n(["네온의 전설", "Neon Legend", "ネオンの伝説"], ["펑크로 클리어", "Clear as Punk", "パンクでクリア"]),
  clearCollector: n(["서른 자루의 주인", "Master of Thirty Blades", "三十振りの主"], ["수집가로 클리어", "Clear as Collector", "コレクターでクリア"]),
};
