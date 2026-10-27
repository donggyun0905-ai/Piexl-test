// 업적 이름·조건 설명: 시즌 2 아스칼론 캐릭터 클리어 (한·영·일)
type Row = [ko: string, en: string, ja: string];
const n = (name: Row, desc: Row) => ({
  name: { ko: name[0], en: name[1], ja: name[2] },
  desc: { ko: desc[0], en: desc[1], ja: desc[2] },
});

export const ASCALON_ACHIEVEMENTS = {
  clearTracker: n(["한 발의 무게", "Weight of One Shot", "一発の重み"], ["추적자로 클리어", "Clear as Tracker", "追跡者でクリア"]),
  clearForgotten: n(["잊히지 않는 빛", "Light Unforgotten", "忘れられぬ光"], ["잊혀진 자로 클리어", "Clear as The Forgotten", "忘れられし者でクリア"]),
  clearRemnant: n(["뒤를 조심해", "Watch Your Back", "背後に気をつけろ"], ["잔영으로 클리어", "Clear as Remnant", "残影でクリア"]),
};
