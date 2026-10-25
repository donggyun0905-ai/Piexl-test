// 혼자 하기 입력 기록 (레이드 명예의 전당 확인용): 틱마다 쌓고, 이어하기 저장 때 같이 저장
// 이어 하기로 불러온 판은 저장된 기록이 판의 틱 수와 맞을 때만 이어서 씀 (아니면 이 판은 명예의 전당에 못 올림)
import { decodeInputs, encodeInputs, type RunState, type TickInput } from "@pixel-rogue/shared";
import { loadText, saveText } from "../storage";

const KEY = "saveInputs";
let inputs: TickInput[] | null = [];

function toText(data: Int16Array): string {
  const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function fromText(text: string): TickInput[] {
  const bin = atob(text);
  const bytes = new Uint8Array(bin.length - (bin.length % 2));
  for (let i = 0; i < bytes.length; i++) bytes[i] = bin.charCodeAt(i);
  return decodeInputs(new Int16Array(bytes.buffer));
}

/** 판 시작: 새 판은 빈 기록, 이어 하는 판은 저장해 둔 기록 */
export function startRaidLog(run: RunState): void {
  if (run.tick === 0) {
    inputs = [];
    return;
  }
  try {
    const saved = fromText(loadText(KEY) ?? "");
    inputs = saved.length === run.tick ? saved : null;
  } catch {
    inputs = null;
  }
}

export function recordRaidInput(input: TickInput): void {
  inputs?.push(input);
}

export function saveRaidLog(): void {
  saveText(KEY, inputs ? toText(encodeInputs(inputs)) : "");
}

export function clearRaidLog(): void {
  saveText(KEY, "");
}

/** 이 판의 입력 기록 (빠진 데가 있으면 null) */
export function raidInputs(run: RunState): TickInput[] | null {
  return inputs && inputs.length >= run.tick ? inputs.slice(0, run.tick) : null;
}
