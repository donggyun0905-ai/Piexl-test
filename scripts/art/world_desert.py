"""사막 필드 256×160 (docs/WORLD_MAP.md 4장: 아스칼론 남쪽, 나라가 아닌 지나가는 땅 · 헬리오스로 가는 길)
- 북쪽: 아스칼론 길(서) · 테라코어 길(동) / 남쪽: 헬리오스 길 — 묻힌 돌길(대상 길)로 이어짐
- 서쪽: 세레스티아 (모래에 묻힌 옛 도시: 무너진 성벽·돌길·기둥·석상 · 옛 왕묘 던전)
- 가운데: 오아시스(야자수)와 대상 천막 / 동쪽: 태초의 신전 (광야의 새벽) · 갈라진 땅 / 북동: 자갈 벌판 · 곳곳 바위
장소 좌표는 apps/client/src/world/places/desertField.ts · 장식(야자수·선인장·기둥…) 자리는 생성기가 desertLayout.ts로 씀
"""
import math
import re
from pathlib import Path

from world_map import Grid

W, H = 256, 160
ROOT = Path(__file__).resolve().parents[2]
PLACES = ROOT / "apps/client/src/world/places"
SOFT = ("dune", "gravel", "cracked", "grass", "rock")
SOLID = {"water", "deep", "tree", "wall", "rock", "oasis", "temple"}
WALK = {"dune", "gravel", "cracked", "buriedRoad", "grass", "path", "sand", "flower"}
OASIS = (150, 78)
TEMPLE = (203, 98, 217, 106)  # 사암 신전 (앞 가운데 입구 = 210, 107)
CELESTIA = (14, 48, 84, 128)
DECOS = []  # (그림, x, y)


def desert():
    m = Grid(W, H, "dune", seed=59)
    rnd = m.rnd
    for y in range(H):
        for x in range(W):
            edge = min(x, y, W - 1 - x, H - 1 - y)
            if edge < 1 or (edge < 3 and rnd.random() < 0.4):
                m.put(x, y, "rock")
    # 자갈 벌판(북동) · 갈라진 땅(동·남) · 바위 무리
    m.blob(200, 40, 26, "gravel")
    m.blob(120, 140, 18, "gravel")
    m.blob(210, 110, 22, "cracked")
    m.blob(60, 20, 12, "cracked")
    m.scatter(10, 10, 246, 150, "rock", 22, (2, 6), only=("dune", "gravel", "cracked"))
    # 오아시스 (풀밭 둘레 · 물)
    m.blob(*OASIS, 10, "grass")
    m.blob(*OASIS, 5.5, "oasis")
    celestia(m)
    # 신전
    x0, y0, x1, y1 = TEMPLE
    m.rect(x0 - 3, y0 - 3, x1 + 3, y1 + 5, "buriedRoad")
    m.rect(x0, y0, x1, y1, "temple")
    # 대상 길 (묻힌 돌길): 아스칼론 길 · 테라코어 길 → 오아시스 → 헬리오스 길 · 신전 · 세레스티아
    road = dict(k="buriedRoad", only=SOFT)
    m.road([(100, 1), (110, 30), (138, 66)], **road)
    m.road([(200, 1), (186, 34), (162, 70)], **road)
    m.road([(150, 92), (140, 120), (128, 158)], **road)
    m.road([(162, 84), (190, 100), (204, 111)], **road)
    m.road([(136, 80), (100, 86), (84, 88)], **road)
    m.road([(216, 112), (236, 98), (254, 92)], k="buriedRoad", only=SOFT + ("rock",))
    m.rect(0, 0, W - 1, 0, "rock")
    m.rect(0, H - 1, W - 1, H - 1, "rock")
    decorate(m)
    return m.g


def celestia(m):
    """세레스티아: 무너진 사각 성벽(군데군데 끊김) · 십자 돌길 · 무너진 집터 · 북서 왕묘(던전)"""
    x0, y0, x1, y1 = CELESTIA
    m.ring(x0, y0, x1, y1, "temple")
    for (x, y, w, h) in [(30, y0, 6, 1), (60, y0, 5, 1), (x0, 70, 1, 6), (x1, 84, 1, 6), (40, y1, 7, 1), (70, y1, 4, 1), (x0, 100, 1, 5)]:
        m.rect(x, y, x + w - 1, y + h - 1, "dune")
    m.rect(x0 + 1, 86, x1 - 1, 89, "buriedRoad")
    m.rect(47, y0 + 1, 50, y1 - 1, "buriedRoad")
    for (x, y) in [(22, 58), (60, 58), (24, 100), (62, 100), (70, 74)]:
        m.ring(x, y, x + 6, y + 4, "temple")
        m.rect(x + 2, y + 4, x + 4, y + 4, "dune")
    # 왕묘 (작은 사암 건물, 앞 가운데 입구 = 31, 74)
    m.rect(26, 68, 36, 73, "temple")
    m.rect(28, 74, 34, 77, "buriedRoad")
    m.scatter(x0 + 2, y0 + 2, x1 - 2, y1 - 2, "buriedRoad", 14, (3, 7), only=("dune",))


def decorate(m):
    """장식 자리: 오아시스 야자수 · 천막 · 세레스티아 기둥·석상 · 사막 곳곳 선인장·덤불·뼈 · 신전 앞 기둥"""
    rnd = m.rnd
    # 장소(표지판·이동석·사람) 자리는 비워 둠
    src = (PLACES / "desertField.ts").read_text(encoding="utf-8")
    used = {(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)}

    def put(art, x, y):
        if m.get(x, y) in WALK and m.get(x, y) != "buriedRoad" and all(abs(x - a) + abs(y - b) > 2 for (a, b) in used):
            DECOS.append((art, x, y))
            used.add((x, y))
            return True
        return False

    for i in range(14):
        a = i / 14 * math.tau
        put("palm" if i % 3 else "palm2", round(OASIS[0] + math.cos(a) * 8), round(OASIS[1] + math.sin(a) * 7))
    for (x, y) in [(164, 88), (170, 92), (166, 96)]:
        put("tent", x, y)
    for (x, y) in [(200, 112), (220, 112), (198, 104), (222, 104), (28, 80), (34, 80)]:
        put("column", x, y)
    n = 0
    while n < 26:
        x, y = rnd.randrange(CELESTIA[0] + 2, CELESTIA[2] - 1), rnd.randrange(CELESTIA[1] + 2, CELESTIA[3] - 1)
        n += 1
        put(rnd.choice(["column", "column", "stoneHead"]), x, y)
    for _ in range(90):
        x, y = rnd.randrange(6, W - 6), rnd.randrange(6, H - 6)
        if CELESTIA[0] <= x <= CELESTIA[2] and CELESTIA[1] <= y <= CELESTIA[3]:
            continue
        put(rnd.choice(["cactus", "cactus", "tumbleweed", "ribcage"]), x, y)


def write_layout(g):
    lines = [
        "// 생성됨: scripts/art/world_desert.py (손으로 고치지 않음) · 사막 장식 자리 [그림, x, y] (칸)",
        'import type { DesertDeco } from "../worldDecoDesert";',
        "",
        "export const DESERT_DECO_SPOTS: readonly (readonly [DesertDeco, number, number])[] = [" + ", ".join(f'["{a}", {x}, {y}]' for a, x, y in DECOS) + "];",
        "",
    ]
    (PLACES / "desertLayout.ts").write_text("\n".join(lines), encoding="utf-8")


def check(g):
    """장소 표(desertField.ts)가 걸을 수 있는 칸인지 · 신전·왕묘 입구 위는 사암 건물인지"""
    src = (PLACES / "desertField.ts").read_text(encoding="utf-8")
    pts = [(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)]
    bad = [p for p in pts if g[p[1]][p[0]] in SOLID]
    for (x, y) in [(210, 107), (31, 74)]:
        if g[y][x] in SOLID or g[y - 1][x] != "temple":
            bad.append((x, y))
    assert not bad, f"걸을 수 없는 장소 자리: {bad}"
    print("사막 장소", len(pts), "곳 · 장식", len(DECOS), "개 OK")
