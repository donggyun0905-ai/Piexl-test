"""헬리오스 필드 256×160 (docs/WORLD_MAP.md 4장: 사막 너머 제국 도시, 아스칼론처럼 평범한 기후 · 강 → 남쪽 바다)
- 가운데: 돌 성벽 제국 도시 (붉은 벽돌 큰길 · 대리석 광장(황제 석상 = 레이드 아레나 · 황금 분수 둘 · 깃발) · 북쪽 금빛 돌 앞뜰과 황금 궁전 ·
  북서 시장(가게·술집) · 북동 뒷골목(검은 제단) · 동·서 주거지(제국 집) · 북·남·서·동 성문)
- 북쪽: 사막 끝과 테라코어로 가는 사막 길 / 동쪽: 남쪽 바다로 흐르는 강(다리) / 서쪽: 농장 / 남서: 버려진 수로 던전 / 남쪽: 항구와 바다
장소 좌표는 apps/client/src/world/places/heliosField.ts · 집 문은 생성기가 heliosLayout.ts로 씀
"""
import math
import re
from pathlib import Path

from world_map import Grid

W, H = 256, 160
ROOT = Path(__file__).resolve().parents[2]
PLACES = ROOT / "apps/client/src/world/places"
SOFT = ("grass", "flower", "tree", "rock")
SOLID = {"water", "deep", "tree", "wall", "rock", "fence", "house", "keep", "innerWall", "palace", "villa", "chapel", "warehouse"}

CITY = (60, 22, 196, 112)
# 제국 집 (3×4: 위 세 줄 지붕 · 아래 줄 앞벽, 문은 가운데 아래 칸)
VILLAS = [(x, y) for y in (75, 85, 95) for x in (66, 72, 78, 84, 90, 96, 156, 162, 168, 174, 180, 186)]
SHOPS = {"market": (70, 34), "tavern": (86, 34), "armor": (70, 46)}
# 교회 (x0, y0, 폭, 높이): 남쪽 큰길 서쪽 · 문 (112, 106)에서 큰길까지 벽돌길
CHAPEL = (110, 102, 5, 4)
RIVER = [(254, 28), (230, 40), (214, 70), (210, 100), (196, 124), (168, 142), (150, 152)]


def helios():
    m = Grid(W, H, "grass", seed=47)
    rnd = m.rnd
    for y in range(H):
        for x in range(W):
            edge = min(x, y, W - 1 - x, H - 1 - y)
            if edge < 2 or (edge < 4 and rnd.random() < 0.4):
                m.put(x, y, "tree")
    for (cx, cy) in [(30, 30), (230, 120), (20, 100), (240, 80), (40, 120), (100, 130)]:
        m.scatter(cx - 8, cy - 5, cx + 8, cy + 5, "tree", 5, (4, 9))
    m.scatter(8, 14, 248, 140, "flower", 26, (3, 8))
    # 북쪽 사막 끝 (테라코어로 가는 사막 길)
    for x in range(2, W - 2):
        bot = 9 + round(2 * math.sin(x / 7) + math.sin(x / 3.1))
        for y in range(2, bot):
            m.put(x, y, "sand")
    # 남쪽 바다 · 모래 해변
    for x in range(W):
        top = 146 + round(2 * math.sin(x / 11) + math.sin(x / 4.3))
        for y in range(top, H):
            m.put(x, y, "sand" if y < top + 3 else "water" if y < top + 7 else "deep")
    river(m)
    farms(m)
    # 남서 버려진 수로 던전 (바위 언덕)
    for y in range(124, 144):
        for x in range(8, 52):
            if rnd.random() < 0.85 - abs(y - 130) * 0.06 - abs(x - 30) * 0.02:
                m.put(x, y, "rock")
    city(m)
    # 길: 북문 → 사막 길 · 남문 → 항구 · 서문 → 농장 · 동문 → 다리 · 던전 갈림
    m.road([(128, 21), (128, 6)], only=SOFT + ("sand",))
    m.road([(128, 113), (128, 146)], only=SOFT + ("sand",))
    m.road([(59, 67), (20, 68)], only=SOFT)
    m.road([(197, 67), (250, 66)], only=SOFT)
    m.road([(40, 68), (34, 100), (32, 122)], only=SOFT + ("rock",))
    for (cx, cy, r) in [(32, 124, 2.6), (128, 6, 2.4), (40, 68, 2.2)]:
        m.blob(cx, cy, r, "path", only=SOFT + ("sand", "rock"))
    m.rect(208, 64, 222, 68, "bridge", only=("water", "deep", "sand"))
    # 항구: 나무 부두 둘 (물 위 다리)
    for x in (118, 136):
        m.rect(x, 146, x + 2, 155, "bridge", only=("water", "deep", "sand"))
    m.rect(110, 143, 146, 145, "redBrick")
    return m.g


def river(m):
    m.line(RIVER, lambda x, y: m.blob(x, y, 2.6, "water", only=SOFT + ("sand", "path")))
    m.line(RIVER, lambda x, y: m.blob(x, y, 1.0, "deep"))


def farms(m):
    """서문 밖 농장 (울타리 밭 넷)"""
    for (x, y) in [(10, 40), (30, 40), (10, 76), (30, 78)]:
        m.rect(x, y, x + 14, y + 10, "field")
        m.ring(x - 1, y - 1, x + 15, y + 11, "fence")
        m.put(x + 7, y + 11, "grass")


def city(m):
    x0, y0, x1, y1 = CITY
    m.rect(x0, y0, x1, y1, "grass")
    m.ring(x0, y0, x1, y1, "wall")
    # 큰길 (성문 넷) · 광장 · 궁전 앞뜰
    m.rect(126, y0, 130, y1, "redBrick")
    # 북문·남문은 3칸 (높은 문 그림 city_gate가 얹힘, 장소 표 장식)
    for y in (y0, y1):
        m.put(126, y, "wall")
        m.put(130, y, "wall")
    m.rect(x0, 65, x1, 69, "redBrick")
    m.rect(106, 52, 150, 82, "marble")
    m.rect(100, 24, 156, 46, "goldStone")
    m.rect(121, 28, 135, 38, "palace")
    for (x, y) in [(106, 30), (110, 34), (146, 30), (150, 34), (104, 40), (152, 40)]:
        m.blob(x, y, 1.6, "flower")
        m.put(x, y, "tree")
    # 광장 화단 넷 (꽃·가운데 나무)
    for (cx, cy) in [(114, 60), (142, 60), (114, 78), (142, 78)]:
        m.blob(cx, cy, 2.4, "flower")
        m.put(cx, cy, "tree")
    # 시장 거리 (북서) · 뒷골목 (북동, 나무와 어두운 돌바닥)
    m.rect(x0 + 2, 40, 104, 42, "redBrick")
    for (k, (x, y)) in SHOPS.items():
        # 술집은 창고 칸 + skin(술집 겉모습 그림 tavern_outside)
        m.rect(x, y, x + 2, y + 3, "warehouse" if k == "tavern" else "villa")
        m.rect(x + 1, y + 4, x + 1, 40 if y < 40 else y + 4, "redBrick")
    m.scatter(160, 26, 192, 58, "tree", 10, (2, 5))
    m.rect(170, 40, 178, 46, "floor")
    # 주거지 집 · 앞 골목
    for y in (79, 89, 99):
        m.rect(x0 + 2, y, 104, y, "redBrick")
        m.rect(152, y, x1 - 2, y, "redBrick")
    for (x, y) in VILLAS:
        m.rect(x, y, x + 2, y + 3, "villa")
    x, y, w, h = CHAPEL
    m.rect(x, y, x + w - 1, y + h - 1, "chapel")
    m.rect(x + w // 2, y + h, 125, y + h + 1, "redBrick")
    # 성 안 정원 나무
    for (x, y) in [(64, 28), (192, 104), (64, 104), (104, 60), (152, 60), (104, 76), (152, 76)]:
        m.put(x, y, "tree")


def write_layout():
    shops = ", ".join(f"{k}: [{x + 1}, {y + 4}]" for k, (x, y) in SHOPS.items())
    lines = [
        "// 생성됨: scripts/art/world_helios.py (손으로 고치지 않음) · 헬리오스 필드 집·가게 문 자리 (칸)",
        "export const HELIOS_HOUSE_DOORS: readonly (readonly [number, number])[] = [" + ", ".join(f"[{x + 1}, {y + 4}]" for x, y in VILLAS) + "];",
        f"export const HELIOS_SHOP_DOORS = {{ {shops} }} as const;",
        "",
    ]
    (PLACES / "heliosLayout.ts").write_text("\n".join(lines), encoding="utf-8")


def check(g):
    """장소 표(heliosField.ts)·문 자리가 걸을 수 있는 칸인지 · 문 바로 위는 집·궁전인지"""
    src = (PLACES / "heliosField.ts").read_text(encoding="utf-8").split("HELIOS_INSIDE")[0]
    pts = [(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)]
    bad = [p for p in pts if g[p[1]][p[0]] in SOLID]
    for (x, y) in [(x + 1, y + 4) for (x, y) in VILLAS + list(SHOPS.values())] + [(128, 39), (CHAPEL[0] + 2, CHAPEL[1] + 4)]:
        if g[y][x] in SOLID or g[y - 1][x] not in ("villa", "palace", "chapel", "warehouse"):
            bad.append((x, y))
    assert not bad, f"걸을 수 없는 장소 자리: {bad}"
    print("헬리오스 장소", len(pts), "곳 OK")
