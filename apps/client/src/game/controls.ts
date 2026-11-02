import { AIM_DIST_MAX, AIM_DIST_STEP, quantize, type TickInput } from "@pixel-rogue/shared";
import { skillOf, useOf } from "../settings";
import { bindPan } from "./cameraPan";
import { SkillArm } from "./skillArm";
import type { ClickTarget } from "./clickTargets";
import { drawSticks, type StickElements } from "./sticks";
import { moveVector, TouchSticks } from "./touchSticks";

// 조작 입력 (PC: 키보드+마우스 / 모바일: 왼쪽 이동·오른쪽 조준 조이스틱, 손가락 댄 자리에 생기고 드래그 중에만 보임)
const AIM_DEADZONE = 6;
/** 조준 방향 정밀도 (−100~100). 입력 기록이 너무 길어지지 않게 */
const AIM_STEPS = 100;
export const ZOOM_MAX = 2.5; // 화면 확대 한도 (1 = 방 전체가 보임 · 줄이는 한도는 옵션 zoom.min)

export interface ControlsOptions {
  /** 터치·마우스를 받는 화면 전체 영역 */
  zone: HTMLElement;
  sticks: StickElements;
  /** 플레이어의 화면 위치 (마우스 조준 계산용, scale: 게임 1픽셀의 화면 크기) */
  playerScreenPos: () => { x: number; y: number; scale: number } | null;
  onEscape: () => void;
  onPause: () => void;
  onAutoAimChange: (on: boolean) => void;
  /** 켜기·끄기: C 능력치 수치 · N 패왕전 이름표 · H 맞는 범위 늘 보기 · G 사거리 */
  onToggleStats: () => void;
  onToggleNames?: () => void;
  onToggleHitbox: () => void;
  onToggleRange: () => void;
  /** 처음 터치하면 모바일 화면(버튼·안내)으로 전환 */
  onTouch: () => void;
  zoom: { min: number; start: number }; // 확대 한도·처음 배율 (camera zoomFor)
  /** 누른 자리가 층 보상·미니맵 방이면 그 입력 (클릭·탭) */
  clickTarget: (x: number, y: number) => ClickTarget | null;
}

export class Controls {
  /** 자동 공격 (기본). 끄면 수동 조준 */
  autoAim = true;
  manualOnly = false; // 패왕전: 자동 공격 없이 직접 조준만
  private keys = new Set<string>();
  private mouseX: number | null = null;
  private mouseY = 0;
  private mouseAttack = false;
  private dashQueued = false;
  /** 우클릭을 누르고 있는 동안 대시가 찰 때마다 계속 대시 */
  private dashHeld = false;
  /** Space·화면 버튼을 누르고 있는 동안 맞는 범위 보기 */
  hitboxHeld = false;
  private interactQueued = false;
  /** 이번에 쓸 사용 아이템 칸 (0 = 없음, 1·2) */
  private useQueued = 0;
  /** 풋내기 스탯 찍기 (1~7, 장비 줄의 스탯 버튼) */
  private statQueued = 0;
  private skillQueued = 0;
  private sellQueued = 0;
  private menuQueue: number[] = []; // 누른 창 버튼들 (한 틱에 하나씩: 빠르게 여러 번 눌러도 빠지지 않게)
  skillKeys = false; // 숫자 키를 스킬로 씀 (추적자·패왕전)
  clickSkill = false; // 직접 누름(좌클릭·새 터치)을 스킬 1로도 보냄 (잔영 슬로우모션 연속 베기, 자동 공격과 따로)
  arm = new SkillArm();
  fineAim = false; // 누른 곳까지 거리를 잘게 (추적자 암습 저격: 조준경 가운데에 정확히 대야 맞음)
  /** 클릭·탭으로 고른 층 보상·미니맵 방 */
  private clickQueued: ClickTarget | null = null;
  zoom: number; // 화면 배율 (휠·두 손가락)
  private touch: TouchSticks;
  private cleanup: (() => void)[] = [];

  constructor(private opt: ControlsOptions) {
    this.zoom = opt.zoom.start;
    this.cleanup.push(bindPan(opt.zone, opt.zoom.min < 1, () => opt.playerScreenPos()?.scale ?? 1));
    this.touch = new TouchSticks({
      zone: opt.zone,
      onTouch: opt.onTouch,
      clickTarget: opt.clickTarget,
      zoom: () => this.zoom,
      setZoom: (z) => this.setZoom(z),
      queueDash: () => this.queueDash(),
      queueClick: (c) => {
        this.clickQueued = c;
      },
      redraw: () => this.drawSticks(),
    });
    const on = <K extends keyof WindowEventMap>(
      target: Window | HTMLElement,
      type: K,
      fn: (e: WindowEventMap[K]) => void,
      options?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, fn as EventListener, options);
      this.cleanup.push(() => target.removeEventListener(type, fn as EventListener, options));
    };

    on(window, "keydown", (e) => {
      if (e.repeat) return;
      // 글자 입력 칸(채팅 등)에 쓰는 중이면 게임 조작으로 받지 않음
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.code === "Escape") return this.arm.cancel() ? undefined : opt.onEscape();
      // 스킬 키 (설정에서 바꾼 키가 다른 키보다 먼저)
      if (this.skillKeys && skillOf(e.code)) {
        this.skillQueued = this.arm.key(skillOf(e.code));
        return;
      }
      if (e.code === "KeyP") return opt.onPause();
      if (e.code === "KeyR") return this.setAutoAim(!this.autoAim);
      if (e.code === "KeyC" && !e.ctrlKey && !e.metaKey) return opt.onToggleStats();
      if (e.code === "KeyH") return opt.onToggleHitbox();
      if (e.code === "KeyG") return opt.onToggleRange();
      if (e.code === "KeyN") return opt.onToggleNames?.();
      if (e.code === "KeyF") {
        this.interactQueued = true;
        return;
      }
      if (e.code === "Space") {
        e.preventDefault(); // 페이지 스크롤·버튼 눌림 막기
        this.hitboxHeld = true;
        return;
      }
      // PC 사용 아이템 키: 설정의 두 키(기본 Q·E) · 숫자 1·2 (스킬이 있으면 숫자는 스킬)
      const slot = useOf(e.code);
      if (slot) {
        this.useQueued = slot;
        return;
      }
      this.keys.add(e.code);
    });
    on(window, "keyup", (e) => {
      // 눌러 둔 화면 버튼이 Space로 눌리지 않게
      if (e.code === "Space") {
        e.preventDefault();
        this.hitboxHeld = false;
      }
      this.keys.delete(e.code);
    });
    on(window, "blur", () => this.releaseAll());
    on(window, "mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    on(
      window,
      "wheel",
      (e) => {
        // 스크롤되는 창(연습장 아이템 목록 등) 위에서는 그 창을 스크롤
        if (inScrollable(e.target)) return;
        // 휠: 게임 화면 확대·축소 (Ctrl+휠도 브라우저 확대 대신 게임 화면)
        e.preventDefault();
        if (e.deltaY !== 0) this.setZoom(this.zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1));
      },
      { passive: false },
    );
    on(window, "mouseup", (e) => void (e.button === 0 ? (this.mouseAttack = false) : e.button === 2 && (this.dashHeld = false)));

    const zone = opt.zone;
    // 게임 중 우클릭은 어디서든 브라우저 메뉴 대신 대시 (좌클릭 공격을 누른 채로도) · 좌클릭은 mousedown으로 받음
    on(window, "contextmenu", (e) => e.preventDefault());
    on(window, "mousedown", (e) => {
      if (e.button === 2 && !zone.contains(e.target as Node) && !this.arm.cancel()) this.dashQueued = this.dashHeld = true;
    });
    on(zone, "mousedown", (e) => {
      if (e.button === 0) {
        const c = opt.clickTarget(e.clientX, e.clientY);
        if (c) this.clickQueued = c;
        else if (!(this.skillQueued = this.arm.fire())) [this.mouseAttack, this.skillQueued] = [true, this.clickSkill ? 1 : 0];
      }
      if (e.button === 2 && !this.arm.cancel()) this.dashQueued = this.dashHeld = true;
      if (e.button === 1) e.preventDefault(); // 휠 버튼 자동 스크롤 막기
    });
    on(zone, "pointerdown", (e) => void ((this.skillQueued ||= this.clickSkill && e.pointerType === "touch" ? 1 : 0), this.touch.down(e)));
    on(zone, "pointermove", (e) => this.touch.moveTo(e));
    on(zone, "pointerup", (e) => this.touch.up(e));
    on(zone, "pointercancel", (e) => this.touch.up(e));
  }

  setAutoAim(on: boolean): void {
    this.autoAim = on && !this.manualOnly;
    this.opt.onAutoAimChange(on);
  }

  setZoom(z: number): void {
    this.zoom = Math.min(ZOOM_MAX, Math.max(this.opt.zoom.min, z));
  }

  /** 풋내기 스탯 · 사용 아이템 쓰기 (화면 버튼). slot: 1·2 */
  queueStat(k: number): void { this.statQueued = k; }
  queueUse(slot: number): void { this.useQueued = slot; }
  /** 스킬 쓰기 (화면 버튼). 1~4 */
  queueSkill(n: number): void { this.skillQueued = n; }
  /** 상점에서 장비 팔기 (판매 줄: 1·2 = 사용 아이템 칸, 3~ = 패시브 순서) · 작업대 창에서 누름 (sim/station.menuCode) */
  queueSell(n: number): void { this.sellQueued = n; }
  queueMenu(code: number): void { this.menuQueue.push(code); }
  /** 상호작용을 한 번 누른 것으로 처리 (모바일 버튼) · 대시 */
  queueInteract(): void { this.interactQueued = true; }
  queueDash(): void { this.dashQueued = true; }

  /** 마우스가 가리키는 곳이 내 캐릭터에서 얼마나 떨어졌는지 (게임 좌표, 핑) · 마우스 위치 (화면 좌표, 안 썼으면 null) */
  mouseOffset(): { dx: number; dy: number } | null { const p = this.opt.playerScreenPos(); return p && this.mouseX !== null ? { dx: (this.mouseX - p.x) / p.scale, dy: (this.mouseY - p.y) / p.scale } : null; }
  get mouse(): { x: number; y: number } | null { return this.mouseX === null ? null : { x: this.mouseX, y: this.mouseY }; }

  releaseAll(): void {
    this.keys.clear();
    this.mouseAttack = false;
    this.dashHeld = false;
    this.hitboxHeld = false;
    this.touch.release();
    this.drawSticks();
  }

  dispose(): void {
    for (const fn of this.cleanup) fn();
    this.cleanup = [];
  }

  /** 이번 틱 입력. 대시는 한 번 읽으면 사라짐 */
  read(): TickInput {
    const { move, aim, pinch } = this.touch;
    let moveX = 0;
    let moveY = 0;
    if (move) {
      const v = moveVector(move);
      moveX = quantize(v.x, 100);
      moveY = quantize(v.y, 100);
    } else {
      const k = (a: string, b: string) => (this.keys.has(a) || this.keys.has(b) ? 100 : 0);
      moveX = k("KeyD", "ArrowRight") - k("KeyA", "ArrowLeft");
      moveY = k("KeyS", "ArrowDown") - k("KeyW", "ArrowUp");
    }

    let aimX = 0;
    let aimY = 0;
    let attack = false;
    if (aim && !pinch) {
      const len = Math.hypot(aim.dx, aim.dy);
      // 자동 공격 중에는 오른쪽 터치가 대시(두 번 탭)·확대에만 쓰임
      if (!this.autoAim && len > AIM_DEADZONE) {
        // 조이스틱은 방향만: 거리 단계를 최대로 (누른 곳 없음 = 멀리)
        aimX = quantize(aim.dx / len, AIM_STEPS) * AIM_DIST_MAX;
        aimY = quantize(aim.dy / len, AIM_STEPS) * AIM_DIST_MAX;
        attack = true;
      }
    } else {
      const p = this.opt.playerScreenPos();
      if (p && this.mouseX !== null) {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const len = Math.hypot(dx, dy);
        if (len > 0) {
          // 방향 × 누른 곳까지 거리 단계 (기계공학자가 누른 곳에 던지게)
          // 암습 저격은 거리를 0.01 단계로 (최대 30단계 = 360칸)
          const kf = Math.max(0.1, Math.min(30, len / p.scale / AIM_DIST_STEP));
          if (this.fineAim) [aimX, aimY] = [Math.round((dx / len) * 100 * kf), Math.round((dy / len) * 100 * kf)];
          else {
            const k = Math.max(1, Math.min(AIM_DIST_MAX, Math.round(len / p.scale / AIM_DIST_STEP)));
            aimX = quantize(dx / len, AIM_STEPS) * k;
            aimY = quantize(dy / len, AIM_STEPS) * k;
          }
        }
      }
      attack = !this.autoAim && this.mouseAttack;
    }

    const dash = this.dashQueued || this.dashHeld;
    const interact = this.interactQueued;
    const useSlot = this.useQueued;
    const pickChoice = this.clickQueued?.pickChoice ?? 0;
    const statPick = this.statQueued;
    const skill = this.skillQueued;
    if (skill) [aimX, aimY] = this.arm.take(aimX, aimY);
    const menu = this.menuQueue.shift() ?? 0, sell = { ...(this.sellQueued ? { sell: this.sellQueued } : {}), ...(menu ? { menu } : {}) };
    this.sellQueued = 0;
    this.statQueued = 0;
    this.skillQueued = 0;
    this.dashQueued = false;
    this.interactQueued = false;
    this.useQueued = 0;
    this.clickQueued = null;
    // 자동 공격 중에는 조준·공격 입력을 쓰지 않으므로 0으로 (입력 기록이 짧아지고, 기록 = 계산에 쓴 값)
    if (this.autoAim) return { moveX, moveY, aimX: 0, aimY: 0, attack: false, dash, interact, useSlot, pickChoice, statPick, skill, ...sell, autoAim: true };
    return { moveX, moveY, aimX, aimY, attack, dash, interact, useSlot, pickChoice, statPick, skill, ...sell, autoAim: false };
  }

  /** 모바일 조준 중인지 (조준점 표시용) */
  get touchAiming(): boolean {
    const { aim, pinch } = this.touch;
    return !this.autoAim && !pinch && aim !== null && Math.hypot(aim.dx, aim.dy) > AIM_DEADZONE;
  }

  private drawSticks(): void {
    // 자동 공격 중에는 조준하지 않으므로 조준 조이스틱을 그리지 않음
    drawSticks(this.opt.sticks, this.touch.move, this.autoAim ? null : this.touch.aim);
  }
}

/** 휠을 굴린 곳이 내용이 넘쳐 스크롤되는 창 안인지 */
function inScrollable(target: EventTarget | null): boolean {
  for (let el = target instanceof Element ? target : null; el && el !== document.body; el = el.parentElement) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight) return true;
  }
  return false;
}
