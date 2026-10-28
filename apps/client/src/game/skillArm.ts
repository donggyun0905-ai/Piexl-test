// 스킬 키 조준 (패왕전 1~4): 키를 누르면 조준 모드 → 왼쪽 클릭으로 시전 · 오른쪽 클릭·Esc는 취소 · 설정의 '바로 사용'이면 키를 누르는 순간 시전
// 추적자(던전)는 조준 모드 없이 바로 · 모바일 스킬 버튼은 가장 가까운 상대 쪽으로 겨눈 값(aim)을 넘김
import { getSettings } from "../settings";

export class SkillArm {
  /** 패왕전 조준 모드를 씀 (아니면 키를 누르면 바로) */
  on = false;
  /** 조준 중인 스킬 (0~3, 없으면 -1) */
  armed = -1;
  /** 다음 시전에 쓸 조준 값 (모바일 버튼) */
  private aim: [number, number] | null = null;

  /** 스킬 키 n(1~4)을 누름: 지금 쓸 스킬 번호(바로) 또는 0(조준 모드로) */
  key(n: number): number {
    if (!this.on || getSettings().quickCast[n - 1]) {
      this.armed = -1;
      return n;
    }
    this.armed = this.armed === n - 1 ? -1 : n - 1;
    return 0;
  }

  /** 왼쪽 클릭: 조준 중이면 그 스킬 번호 (아니면 0 = 평타) */
  fire(): number {
    const n = this.armed + 1;
    this.armed = -1;
    return n;
  }

  /** 조준 취소 (취소했으면 true) */
  cancel(): boolean {
    if (this.armed < 0) return false;
    this.armed = -1;
    return true;
  }

  /** 모바일: 이 조준 값으로 n번 스킬 (조준 값은 TickInput aimX·aimY) */
  at(aimX: number, aimY: number): void {
    this.aim = [aimX, aimY];
  }

  /** 시전하는 틱의 조준 값 (모바일이 정한 값이 있으면 그것) */
  take(aimX: number, aimY: number): [number, number] {
    const a = this.aim ?? [aimX, aimY];
    this.aim = null;
    return a;
  }
}
