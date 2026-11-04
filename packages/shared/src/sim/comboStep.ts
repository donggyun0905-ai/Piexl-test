// 누를 때마다 한 동작씩 이어지는 콤보 (펜리르·이클립스): 한 번 누르면 한 동작 · 동작 뒤 쉬는 틱 동안 누르면 기억해 뒀다가 이어짐
// 누르고 있으면 계속 이어짐 · 오래 안 누르면 처음 동작으로

export interface StepCombo {
  /** 다음 동작 번호 · 이번 동작 뒤 쉬는 남은 틱 · 기다린 틱 · 미리 눌러 둠 */
  i: number;
  t: number;
  idle: number;
  q?: boolean;
}

/** 이번 틱: go = 다음 동작 · wait = 기다림 · drop = 콤보 끊김 (press: 이번 틱에 막 누름) */
export function comboStep(c: StepCombo, want: boolean, press: boolean, idleMax: number): "go" | "wait" | "drop" {
  if (press) c.q = true;
  if (c.t > 0) {
    c.t--;
    return "wait";
  }
  if (c.q || want) {
    c.q = false;
    c.idle = 0;
    return "go";
  }
  return ++c.idle > idleMax ? "drop" : "wait";
}
