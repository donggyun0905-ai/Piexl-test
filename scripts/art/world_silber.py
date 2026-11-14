"""실베르 필드 256×160 (docs/WORLD_MAP.md 4장: 맨 북쪽, 북부를 지키는 수호국 · 침공이 일상인 혹독한 북부)
- 남쪽: 아스칼론 북쪽 산길과 이어진 입구 / 가운데: 두꺼운 성벽의 수호성 (눈 덮인 돌바닥 · 성채 · 무기고 · 민가 · 막사·화로)
- 북쪽: 얼어붙은 싸움터(마물 뼈·부러진 창·투석기·바리케이드)와 맨 위 악마의 문 (경비원 → 타워 디펜스)
- 서쪽: 얼어붙은 호수 / 동쪽: 망루 초소 / 북동: 바위산 얼음 동굴 던전 · 곳곳 눈 덮인 침엽수
장소 좌표는 apps/client/src/world/places/silberField.ts · 집 문·장식 자리는 생성기가 silberLayout.ts로 씀
"""
import re
from pathlib import Path

from world_lands import pave
from world_map import Grid

W, H = 256, 160
ROOT = Path(__file__).resolve().parents[2]
PLACES = ROOT / "apps/client/src/world/places"
SOFT = ("deepSnow", "snowPine", "rock", "frozenMud", "snow")
SOLID = {"water", "deep", "rock", "house", "keep", "thickWall", "snowPine"}
WALK = {"deepSnow", "frozenMud", "snowStone", "snow", "ice"}
FORT = (88, 56, 168, 112)
HOUSES = [(x, y) for y in (98, 104) for x in (94, 100, 106, 112, 142, 148, 154, 160)]
ARMORY = (94, 70)
DECOS = []  # (그림, x, y)
FIXED = [("demonGate", 128, 12)] + [("brazier", x, y) for (x, y) in [(124, 54), (132, 54), (124, 114), (132, 114), (114, 76), (142, 76), (120, 20), (136, 20)]] \
    + [("armyTent", x, y) for (x, y) in [(146, 66), (154, 66), (162, 66), (146, 74), (154, 74)]] \
    + [("watchtower", x, y) for (x, y) in [(206, 86), (222, 86), (206, 100), (222, 100), (84, 50), (172, 50)]] \
    + [("barricade", x, y) for (x, y) in [(112, 30), (120, 32), (136, 32), (144, 30), (200, 93), (228, 93)]] \
    + [("catapult", x, y) for (x, y) in [(108, 44), (148, 44)]]


def silber():
    m = Grid(W, H, "deepSnow", seed=71)
    rnd = m.rnd
    for y in range(H):
        for x in range(W):
            edge = min(x, y, W - 1 - x, H - 1 - y)
            if edge < 1:
                m.put(x, y, "rock")
            elif edge < 4 and rnd.random() < 0.6:
                m.put(x, y, "snowPine")
    m.scatter(4, 4, 250, 156, "snowPine", 230, (4, 10), only=("deepSnow",))
    # 북동 바위산 (얼음 동굴) · 서쪽 얼어붙은 호수
    for y in range(1, 34):
        for x in range(176, 254):
            if rnd.random() < 0.95 - y * 0.03 - abs(x - 215) * 0.008:
                m.put(x, y, "rock")
    m.blob(46, 72, 15, "deepSnow", only=SOFT)
    m.blob(46, 72, 12, "ice")
    for (x, y, r) in [(40, 68, 2.2), (52, 78, 1.8), (48, 64, 1.4)]:
        m.blob(x, y, r, "water")
    # 북쪽 싸움터 (얼어붙은 진흙 · 문 앞 공터)
    m.blob(128, 32, 30, "frozenMud", only=SOFT)
    m.blob(128, 14, 10, "frozenMud", only=SOFT + ("rock",))
    fortress(m)
    # 길: 아스칼론 입구 → 남문 · 북문 → 악마의 문 · 서문 → 호수 · 동문 → 초소 · 얼음 동굴
    road = dict(k="frozenMud", only=SOFT)
    m.road([(128, 158), (126, 136), (128, 113)], **road)
    m.road([(128, 55), (128, 22)], **road)
    m.road([(87, 84), (64, 80)], **road)
    m.road([(169, 84), (196, 88), (214, 94)], **road)
    m.road([(184, 84), (200, 50), (208, 26)], **road)
    for (x, y, r) in [(208, 24, 2.6), (214, 94, 6.0), (126, 150, 3.0)]:
        m.blob(x, y, r, "frozenMud", only=SOFT)
    decorate(m)
    # 요새 안 눈밭은 돌 바닥 (floor 칸 + skin tileRoad), 길은 눈 덮인 돌 그대로
    pave(m, (89, 58, 167, 111), "floor", soft=("snow",))
    return m.g


def fortress(m):
    x0, y0, x1, y1 = FORT
    m.rect(x0, y0, x1, y1, "snow")
    m.ring(x0, y0, x1, y1, "thickWall")
    m.ring(x0, y0 + 1, x1, y1, "thickWall")
    m.rect(126, y0, 130, y1, "snowStone")
    m.rect(x0, 82, x1, 86, "snowStone")
    m.rect(112, 74, 144, 94, "snowStone")
    # 성채 (북쪽) · 무기고 · 민가 · 민가 앞 골목
    m.rect(116, 60, 140, 66, "keep")
    m.rect(127, 67, 129, 74, "snowStone")
    ax, ay = ARMORY
    m.rect(ax, ay, ax + 4, ay + 2, "house")
    m.rect(ax + 2, ay + 3, ax + 2, 82, "snowStone")
    for (x, y) in HOUSES:
        m.rect(x, y, x + 2, y + 1, "house")
    for y in (100, 106):
        m.rect(x0 + 2, y, 118, y, "snowStone")
        m.rect(138, y, x1 - 2, y, "snowStone")


def decorate(m):
    rnd = m.rnd
    src = (PLACES / "silberField.ts").read_text(encoding="utf-8").split("SILBER_INSIDE")[0]
    used = {(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)}
    for (art, x, y) in FIXED:
        DECOS.append((art, x, y))
        used.add((x, y))

    def put(art, x, y):
        if m.get(x, y) in WALK and m.get(x, y) != "snowStone" and all(abs(x - a) + abs(y - b) > 3 for (a, b) in used):
            DECOS.append((art, x, y))
            used.add((x, y))

    for _ in range(60):
        x, y = rnd.randrange(96, 162), rnd.randrange(16, 52)
        put(rnd.choice(["skull", "spears", "spears", "iceCrystal"]), x, y)
    for _ in range(40):
        x, y = rnd.randrange(8, 248), rnd.randrange(36, 152)
        if not (FORT[0] - 2 <= x <= FORT[2] + 2 and FORT[1] - 2 <= y <= FORT[3] + 2):
            put(rnd.choice(["iceCrystal", "skull"]), x, y)


def write_layout():
    lines = [
        "// 생성됨: scripts/art/world_silber.py (손으로 고치지 않음) · 실베르 필드 집 문·장식 자리 (칸)",
        'import type { NorthDeco } from "../worldDecoNorth";',
        "",
        "export const SILBER_HOUSE_DOORS: readonly (readonly [number, number])[] = [" + ", ".join(f"[{x + 1}, {y + 2}]" for x, y in HOUSES) + "];",
        f"export const SILBER_ARMORY_DOOR = [{ARMORY[0] + 2}, {ARMORY[1] + 3}] as const;",
        "export const SILBER_DECO_SPOTS: readonly (readonly [NorthDeco, number, number])[] = [" + ", ".join(f'["{a}", {x}, {y}]' for a, x, y in DECOS) + "];",
        "",
    ]
    (PLACES / "silberLayout.ts").write_text("\n".join(lines), encoding="utf-8")


def check(g):
    """장소 표(silberField.ts)·장식·문 자리가 걸을 수 있는 칸인지 · 문 바로 위는 집·성채인지"""
    src = (PLACES / "silberField.ts").read_text(encoding="utf-8").split("SILBER_INSIDE")[0]
    pts = [(int(a), int(b)) for a, b in re.findall(r"tx: (\d+), ty: (\d+)", src)] + [(x, y) for (_, x, y) in DECOS]
    bad = [p for p in pts if g[p[1]][p[0]] in SOLID]
    for (x, y) in [(x + 1, y + 2) for (x, y) in HOUSES] + [(ARMORY[0] + 2, ARMORY[1] + 3), (128, 67)]:
        if g[y][x] in SOLID or g[y - 1][x] not in ("house", "keep"):
            bad.append((x, y))
    assert not bad, f"걸을 수 없는 장소 자리: {bad}"
    print("실베르 장소", len(pts), "곳 OK")
