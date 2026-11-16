// 시즌 스킨 이름 → 크기를 따라갈 기본 그림 이름 (game/spriteSheets): 보통은 캐릭터, 변신 모습은 그 모습 그림
// 예: eclipse_cyber → eclipse · novice_tiger_lv10 → novice10 · abandoned_tiger_p2 → abandoned2 · slayer_summer_rage → slayer_rage · automata_summer_doll → automataDoll · eclipse_cyber_night → eclipseNight
const FORM: Readonly<Record<string, (c: string, n: string) => string>> = {
  lv: (c, n) => `${c}${n}`,
  p: (c, n) => `${c}${n}`,
  rage: (c) => `${c}_rage`,
  doll: (c) => `${c}Doll`,
  night: (c) => `${c}Night`,
};

export function skinBaseSheet(skin: string): string {
  const [c, , tail] = skin.split("_");
  if (!tail) return c!;
  const m = /^([a-z]+)(\d*)$/.exec(tail);
  const f = m && FORM[m[1]!];
  return f ? f(c!, m![2]!) : c!;
}
