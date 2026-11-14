"""아스칼론 필드 256×160 (docs/WORLD_MAP.md 4장: 나라 하나 = 화면 약 12×12장)
- 가운데 위: 성벽 도시 (안쪽 성: 성채·정원 · 훈련장 · 광장·분수 · 상점가 · 장인 거리(대장간·여관) · 주거지 · 남·동·서 성문)
- 성 남쪽: 서쪽 바다로 흐르는 강 · 강가 길 · 다리 · 그 아래 농촌 마을과 밭 · 맨 남쪽 사막 (세레스티아 쪽)
- 북쪽 바위산 던전 · 북서 숲 던전 · 서쪽 바닷가 항구(부두) · 동쪽 갈림길과 테라코어 국경 · 국경 숲가 기억의 탑
장소(문·주민·순간 이동석) 좌표는 apps/client/src/world/places/ascalonField.ts · 집 문은 생성기가 ascalonLayout.ts로 씀
실행은 world_map.py (끝에 장소 자리가 걸을 수 있는 칸인지 검사)
"""
import math
import re
from pathlib import Path

from world_lands import pave
from world_map import Grid

W, H = 256, 160
ROOT = Path(__file__).resolve().parents[2]
PLACES = ROOT / "apps/client/src/world/places"
SOFT = ("grass", "flower", "tree", "rock")

# 가게 (x0, y0, 폭, 높이) → 문은 앞 가운데 아래 칸
SHOPS = {"weapon": (114, 49, 5, 3), "armor": (121, 49, 5, 3), "potion": (128, 49, 5, 3), "goods": (135, 49, 5, 3), "smithy": (114, 61, 7, 3), "inn": (125, 60, 11, 4)}
# 민가 (왼쪽 위, 3×2) — 서쪽 주거지 줄마다 · 동쪽 주거지
WEST_COLS = [50, 56, 66, 72, 78, 84]
HOUSES = [(x, y) for y in (45, 50, 60) for x in WEST_COLS] + [(x, y) for y in (67, 74, 81) for x in WEST_COLS + [90]]
HOUSES += [(x, y) for y in (72, 79) for x in range(106, 146, 6)]
FARM_HOUSES = [(90, 110), (106, 110), (90, 128), (106, 128)]
# 교회 (x0, y0, 폭, 높이): 상점가 동쪽 빈터 · 문에서 큰길까지 돌길
CHAPEL = (143, 47, 5, 4)


def door(x0, y0, w, h):
    return (x0 + (w - 1) // 2, y0 + h)


def ascalon():
    m = Grid(W, H, "grass", seed=11)
    rnd = m.rnd
    # 가장자리 숲 (서쪽은 바다, 남쪽 가운데는 사막이라 얇게) · 북서 큰 숲 · 흩어진 숲 무리
    for y in range(H):
        for x in range(W):
            edge = min(y, W - 1 - x, H - 1 - y)
            if edge < 2 or (edge < 5 and rnd.random() < 0.45) or (x > W - 8 and rnd.random() < 0.6):
                m.put(x, y, "tree")
    for y in range(3, 48):
        for x in range(3, 46):
            if rnd.random() < 0.55 - max(0, x - 30) * 0.03 - max(0, y - 36) * 0.04:
                m.put(x, y, "tree")
    for (cx, cy) in [(150, 120), (170, 135), (225, 100), (235, 130), (205, 140), (60, 150), (30, 130), (230, 30), (50, 108)]:
        m.scatter(cx - 6, cy - 4, cx + 6, cy + 4, "tree", 4, (4, 9))
    m.scatter(110, 62, 248, 146, "tree", 26, (3, 9))
    m.scatter(50, 102, 248, 146, "tree", 10, (2, 6))
    # 북쪽 바위산 (아래로 갈수록 듬성)
    for y in range(1, 17):
        for x in range(112, 252):
            if rnd.random() < 0.95 - y * 0.055 - abs(x - 180) * 0.002:
                m.put(x, y, "rock")
    # 서쪽 바다 · 바닷가 모래
    for y in range(H):
        coast = 9 + round(2 * math.sin(y / 11) + math.sin(y / 4))
        for x in range(0, coast + 3):
            m.put(x, y, "deep" if x < coast - 3 else "water" if x < coast else "sand")
    # 남쪽 사막 (세레스티아 쪽) · 맨 끝 바위
    for x in range(60, 210):
        top = 149 + round(2.5 * math.sin(x / 9) + math.sin(x / 3.7))
        for y in range(top, H):
            m.put(x, y, "sand")
        for y in range(H - 2, H):
            m.put(x, y, "rock")
    m.scatter(70, 150, 200, 157, "rock", 10, (1, 3), only=("sand",))
    # 강: 북동 산에서 → 성 남쪽을 지나 → 서쪽 바다로 (모래 둑 · 가운데 깊음)
    river = [(208, 0), (204, 14), (198, 30), (194, 46), (192, 60), (188, 76), (178, 90), (160, 97), (130, 99), (100, 99), (70, 98), (44, 99), (24, 96), (4, 95)]
    m.line(river, lambda x, y: m.blob(x, y, 3.4, "sand", only=SOFT + ("sand",)))
    m.line(river, lambda x, y: m.blob(x, y, 2.2, "water"))
    m.line(river, lambda x, y: m.blob(x, y, 0.8, "deep"))
    # 꽃 무리 (성 밖)
    m.scatter(20, 60, 250, 148, "flower", 40, (4, 11))
    city(m)
    # 길: 남문 → 다리 → 농촌 → 사막 · 동문 → 강 다리 → 갈림길 → 국경 · 갈림길 → 북쪽 던전 · 서문 → 숲 던전 · 서문 → 항구
    m.road([(100, 89), (100, 104), (101, 120), (100, 152)])
    m.road([(153, 56), (176, 56), (214, 56), (248, 56)])
    m.road([(176, 56), (177, 40), (176, 26), (176, 15)])
    # 북쪽 산길 → 실베르
    m.road([(176, 26), (160, 14), (150, 2)])
    m.road([(47, 56), (40, 52), (32, 44), (26, 34), (24, 30)])
    m.road([(47, 56), (36, 62), (28, 74), (24, 86), (18, 89)])
    # 강가 길 (성 남쪽 둑 위)
    m.road([(22, 92), (50, 93), (80, 93), (98, 93)], width=0.7)
    m.road([(102, 93), (130, 94), (160, 92), (172, 88)], width=0.7)
    for (cx, cy, r) in [(176, 14, 2.6), (24, 30, 2.6), (214, 56, 2.6), (100, 151, 2.2), (22, 89, 2.2)]:
        m.blob(cx, cy, r, "path", only=SOFT + ("sand",))
    # 다리 (길이 강을 건너는 곳)
    for (x0, y0, x1, y1) in [(99, 94, 101, 104), (186, 55, 199, 57)]:
        m.rect(x0, y0, x1, y1, "bridge", only=("water", "deep", "sand", "path", "grass"))
    # 항구: 바다로 나간 나무 부두
    m.rect(2, 87, 12, 89, "bridge")
    m.rect(13, 87, 18, 90, "sand", only=SOFT + ("water", "deep"))
    farm(m)
    # 기억의 탑 (동쪽 국경 숲가, 길 위쪽): 둘레 풀밭 · 문 앞까지 길
    m.rect(226, 40, 238, 54, "grass", only=SOFT)
    m.rect(231, 50, 233, 54, "path")
    # 동쪽 국경 뒤는 숲으로 막힘
    m.rect(250, 50, 255, 62, "tree")
    # 성벽 안 풀밭은 돌길 바닥 (snowStone 칸 + skin tileRoad) · 동북 공원·서쪽 정원만 풀밭과 꽃
    pave(m, (49, 19, 151, 87), "snowStone", gardens=[(124, 20, 150, 45), (50, 76, 60, 86)])
    return m.g


def city(m):
    """성벽 도시 x 48~152, y 18~88"""
    m.rect(48, 18, 152, 88, "grass")
    m.ring(48, 18, 152, 88, "wall")
    m.scatter(50, 20, 150, 86, "flower", 14, (3, 8))
    # 큰길 (돌) · 성문 세 곳 · 광장과 분수
    m.rect(99, 45, 101, 88, "floor")
    m.rect(48, 55, 152, 57, "floor")
    m.rect(88, 48, 112, 64, "floor")
    m.rect(97, 54, 103, 58, "flower")
    m.rect(98, 55, 102, 57, "water")
    m.put(100, 56, "deep")
    # 안쪽 성 (성채 · 양쪽 정원 연못) · 성문
    m.ring(78, 18, 122, 44, "wall")
    m.rect(79, 19, 121, 43, "floor")
    m.rect(99, 44, 101, 44, "floor")
    m.rect(93, 21, 107, 26, "keep")
    for gx in (82, 110):
        m.rect(gx, 31, gx + 8, 40, "flower")
        m.blob(gx + 4, 35.5, 1.8, "water")
    # 훈련장 (울타리 · 모래 · 아래 가운데 입구) → 큰길까지 길
    m.ring(52, 22, 74, 40, "fence")
    m.rect(53, 23, 73, 39, "sand")
    m.rect(62, 40, 64, 40, "sand")
    m.rect(62, 41, 64, 54, "floor")
    # 상점가 (큰길 위쪽) · 장인 거리 (대장간·여관)
    m.rect(101, 64, 150, 66, "floor")
    for (x0, y0, w, h) in SHOPS.values():
        m.rect(x0, y0, x0 + w - 1, y0 + h - 1, "house")
        dx, dy = door(x0, y0, w, h)
        m.rect(dx - 1, dy, dx + 1, dy + (54 - dy if dy < 55 else 0), "floor")
    for (x, y) in HOUSES:
        m.rect(x, y, x + 2, y + 1, "house")
    cx0, cy0, cw, chh = CHAPEL
    m.rect(cx0, cy0, cx0 + cw - 1, cy0 + chh - 1, "chapel")
    cdx, cdy = door(*CHAPEL)
    m.rect(cdx, cdy, cdx, 54, "floor")
    # 동북 공원 (연못·나무)
    m.blob(138, 32, 3.2, "water")
    m.blob(138, 32, 1.2, "deep")
    m.scatter(126, 22, 150, 44, "tree", 6, (2, 5))
    # 성 안 나무 몇 그루
    for (x, y) in [(54, 85), (60, 85), (148, 85), (142, 85), (148, 22), (146, 30), (54, 44), (96, 85)]:
        m.put(x, y, "tree")


def farm(m):
    """강 남쪽 농촌: 울타리 밭 둘 · 집 넷"""
    for (x0, y0, x1, y1, ox) in [(60, 112, 86, 140, 86), (114, 112, 146, 140, 114)]:
        m.rect(x0, y0, x1, y1, "grass")
        m.ring(x0, y0, x1, y1, "fence")
        m.rect(x0 + 1, y0 + 1, x1 - 1, y1 - 1, "field")
        m.rect(ox, 125, ox, 127, "grass")
    for (x, y) in FARM_HOUSES:
        m.rect(x - 1, y - 1, x + 3, y + 3, "grass")
        m.rect(x, y, x + 2, y + 1, "house")


SOLID = {"water", "deep", "tree", "wall", "rock", "fence", "house", "keep", "innerWall", "chapel"}


def write_layout():
    """집 문 자리 → ascalonLayout.ts (장소 표가 씀)"""
    doors = [(x + 1, y + 2) for (x, y) in HOUSES + FARM_HOUSES]
    shops = {k: door(*v) for k, v in SHOPS.items()}
    lines = [
        "// 생성됨: scripts/art/world_ascalon.py (손으로 고치지 않음) · 아스칼론 필드 문 자리 (칸)",
        "export const ASCALON_HOUSE_DOORS: readonly (readonly [number, number])[] = [" + ", ".join(f"[{x}, {y}]" for x, y in doors) + "];",
        "export const ASCALON_SHOP_DOORS = {" + ", ".join(f"{k}: [{x}, {y}] as const" for k, (x, y) in shops.items()) + "};",
        "",
    ]
    (PLACES / "ascalonLayout.ts").write_text("\n".join(lines), encoding="utf-8")


def check(g):
    """장소 표(ascalonField.ts)·문 자리가 걸을 수 있는 칸인지 · 문 바로 위는 건물인지"""
    src = (PLACES / "ascalonField.ts").read_text(encoding="utf-8")
    pts = [(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)]
    bad = [p for p in pts if g[p[1]][p[0]] in SOLID]
    for (x, y) in [(x + 1, y + 2) for (x, y) in HOUSES + FARM_HOUSES] + [door(*v) for v in SHOPS.values()]:
        if g[y][x] in SOLID or g[y - 1][x] not in ("house", "keep"):
            bad.append((x, y))
    if g[27][100] in SOLID or g[26][100] != "keep":
        bad.append((100, 27))
    cdx, cdy = door(*CHAPEL)
    if g[cdy][cdx] in SOLID or g[cdy - 1][cdx] != "chapel":
        bad.append((cdx, cdy))
    assert not bad, f"걸을 수 없는 장소 자리: {bad}"
    print("장소", len(pts), "곳 · 문", len(HOUSES) + len(FARM_HOUSES) + len(SHOPS), "곳 OK")
