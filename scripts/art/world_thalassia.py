"""탈라시아 필드 256×160 (docs/WORLD_MAP.md 4장: 대륙 동쪽 끝, 큰 무역 항구 · 강 하구 · 옛 대륙과 땅으로 이어짐)
- 서쪽: 대사막과 이어진 땅길 · 풀밭 / 가운데: 강 하구를 낀 항구 도시 (젖은 돌 거리 · 광장 생선 노점 · 무역 상회 · 민가 · 다리)
- 동쪽: 해변·나무 부두(잔교 셋)와 바다 — 큰 범선·해적선·작은 배 · 부두 따라 창고·크레인·화물
- 북쪽: 바위 절벽 해식 동굴 던전 / 남동: 곶 위 등대
장소 좌표는 apps/client/src/world/places/thalassiaField.ts · 집·창고 문·장식 자리는 생성기가 thalassiaLayout.ts로 씀
"""
import math
import re
from pathlib import Path

from world_lands import pave
from world_map import Grid

W, H = 256, 160
ROOT = Path(__file__).resolve().parents[2]
PLACES = ROOT / "apps/client/src/world/places"
SOFT = ("grass", "flower", "tree", "rock", "beach")
SOLID = {"water", "deep", "tree", "rock", "house", "sea", "ocean", "warehouse", "fence"}
WALK = {"grass", "flower", "path", "wetStone", "dockPlank", "beach", "bridge"}
RIVER = [(40, 0), (60, 30), (96, 56), (130, 76), (170, 80), (200, 82)]
WAREHOUSES = [(x, y) for y in (44, 100, 112) for x in (160, 168, 176)]  # 5×5 (그림이 세로로 긴 박공 창고)
HOUSES = [(x, y) for y in (88, 94, 100, 106, 112) for x in (76, 82, 88, 94, 100, 106)] + [(x, y) for y in (48, 54) for x in (112, 118, 124)]
TRADE = (136, 108)
FLOAT_DECOS = {"ship", "boat", "pirateShip"}
DECOS = [("pirateShip", 236, 68), ("ship", 236, 90), ("ship", 238, 112), ("boat", 212, 78), ("boat", 214, 100), ("boat", 210, 122),
         ("lighthouse", 214, 140), ("crane", 194, 60), ("crane", 194, 106), ("cargo", 190, 66), ("cargo", 190, 96), ("cargo", 190, 120),
         ("fishStall", 120, 90), ("fishStall", 128, 90), ("fishStall", 120, 102), ("anchor", 146, 104), ("net", 188, 84), ("net", 186, 128)] \
    + [("mooring", 225, y) for y in (70, 72, 90, 92, 110, 112)]


def thalassia():
    m = Grid(W, H, "grass", seed=83)
    rnd = m.rnd
    for y in range(H):
        for x in range(W):
            edge = min(x, y, H - 1 - y)
            if edge < 2 or (edge < 4 and rnd.random() < 0.4):
                m.put(x, y, "tree")
    for (cx, cy) in [(30, 40), (40, 130), (70, 140), (20, 70), (110, 20)]:
        m.scatter(cx - 8, cy - 5, cx + 8, cy + 5, "tree", 5, (4, 9))
    m.scatter(8, 10, 150, 150, "flower", 18, (3, 7))
    # 북쪽 바위 절벽 (해식 동굴)
    for y in range(1, 16):
        for x in range(120, 205):
            if rnd.random() < 0.95 - y * 0.05 - abs(x - 165) * 0.006:
                m.put(x, y, "rock")
    # 동쪽 바다 (해변 → 얕은 바다 → 깊은 바다) · 남동 곶
    for y in range(H):
        b = 197 + round(2 * math.sin(y / 10) + math.sin(y / 3.9))
        if 128 <= y <= 150:
            b += round(14 * math.sin((y - 128) / 22 * math.pi))
        for x in range(b, W):
            m.put(x, y, "beach" if x < b + 3 else "sea" if x < b + 10 else "ocean")
    m.line(RIVER, lambda x, y: m.blob(x, y, 2.6, "water", only=SOFT + ("path",)))
    m.line(RIVER, lambda x, y: m.blob(x, y, 1.0, "deep"))
    city(m)
    docks(m)
    # 길: 서쪽 땅길(대사막) → 광장 · 북쪽 동굴 · 등대
    m.road([(1, 92), (40, 94), (76, 97)], only=SOFT)
    m.road([(150, 40), (162, 24), (166, 16)], only=SOFT)
    m.road([(150, 122), (190, 132), (210, 140)], only=SOFT)
    for (cx, cy, r) in [(166, 15, 2.6), (8, 92, 2.4), (210, 140, 3.0)]:
        m.blob(cx, cy, r, "path", only=SOFT)
    # 항구 도시 안 풀밭은 돌길 바닥 (snowStone 칸 + skin tileRoad)
    pave(m, (72, 44, 168, 122), "snowStone", gardens=[(150, 110, 162, 120)])
    return m.g


def city(m):
    """항구 도시: 젖은 돌 큰길 · 광장 · 민가 · 무역 상회 · 다리"""
    m.rect(76, 96, 196, 98, "wetStone")
    m.rect(130, 40, 132, 124, "wetStone")
    m.rect(76, 60, 160, 62, "wetStone")
    m.rect(114, 84, 148, 106, "wetStone")
    for y in (91, 97, 103, 109, 115):
        m.rect(74, y, 110, y, "wetStone")
    for y in (51, 57):
        m.rect(110, y, 128, y, "wetStone")
    m.rect(129, 66, 133, 86, "bridge", only=("water", "deep"))
    m.rect(108, 56, 112, 70, "bridge", only=("water", "deep"))
    for (x, y) in HOUSES:
        m.rect(x, y, x + 2, y + 1, "house")
    tx, ty = TRADE
    m.rect(tx, ty, tx + 4, ty + 2, "house")
    for (x, y) in WAREHOUSES:
        m.rect(x, y, x + 4, y + 4, "warehouse")
        m.rect(x + 1, y + 5, x + 3, y + 5, "wetStone")


def docks(m):
    """부두 길(물가 따라) · 잔교 셋 (바다로)"""
    m.rect(186, 40, 194, 130, "dockPlank", only=("grass", "flower", "beach", "tree", "water", "deep", "path"))
    for y in (70, 90, 110):
        m.rect(195, y, 226, y + 2, "dockPlank")


def write_layout():
    lines = [
        "// 생성됨: scripts/art/world_thalassia.py (손으로 고치지 않음) · 탈라시아 필드 집·창고 문·장식 자리 (칸)",
        'import type { SeaDeco } from "../worldDecoSea";',
        "",
        "export const THAL_HOUSE_DOORS: readonly (readonly [number, number])[] = [" + ", ".join(f"[{x + 1}, {y + 2}]" for x, y in HOUSES) + "];",
        "export const THAL_WAREHOUSE_DOORS: readonly (readonly [number, number])[] = [" + ", ".join(f"[{x + 2}, {y + 5}]" for x, y in WAREHOUSES) + "];",
        f"export const THAL_TRADE_DOOR = [{TRADE[0] + 2}, {TRADE[1] + 3}] as const;",
        "export const THAL_DECO_SPOTS: readonly (readonly [SeaDeco, number, number])[] = [" + ", ".join(f'["{a}", {x}, {y}]' for a, x, y in DECOS) + "];",
        "",
    ]
    (PLACES / "thalassiaLayout.ts").write_text("\n".join(lines), encoding="utf-8")


def check(g):
    """장소 표·장식(배 빼고)·문 자리가 걸을 수 있는 칸인지 · 문 바로 위는 집·창고인지"""
    src = (PLACES / "thalassiaField.ts").read_text(encoding="utf-8").split("THAL_INSIDE")[0]
    pts = [(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)] + [(x, y) for (a, x, y) in DECOS if a not in FLOAT_DECOS]
    bad = [p for p in pts if g[p[1]][p[0]] in SOLID]
    bad += [(x, y) for (a, x, y) in DECOS if a in FLOAT_DECOS and g[y][x] not in ("sea", "ocean")]
    doors = [(x + 1, y + 2) for (x, y) in HOUSES] + [(x + 2, y + 5) for (x, y) in WAREHOUSES] + [(TRADE[0] + 2, TRADE[1] + 3)]
    for (x, y) in doors:
        if g[y][x] in SOLID or g[y - 1][x] not in ("house", "warehouse"):
            bad.append((x, y))
    assert not bad, f"걸을 수 없는 장소 자리: {bad}"
    print("탈라시아 장소", len(pts), "곳 OK")
