"""세계 지도 나라 필드 그림 생성기 (docs/WORLD_MAP.md W2): 한 픽셀 = 한 칸, 색 = 땅 종류
색표는 apps/client/src/world/worldTiles.ts TILE_DEFS key와 같아야 함 · 장소 좌표는 world/worldPlaces.ts
실행: python3 scripts/art/world_map.py → apps/client/public/world/*.png (아스칼론 필드는 world_ascalon.py)
"""
import math
import random
from pathlib import Path
from PIL import Image

KEY = {
    "grass": (80, 168, 72), "path": (200, 168, 112), "water": (56, 120, 216), "deep": (24, 56, 144),
    "sand": (232, 216, 152), "tree": (24, 96, 40), "wall": (120, 112, 128), "floor": (176, 160, 144),
    "rock": (104, 88, 72), "bridge": (152, 104, 56), "snow": (240, 244, 252), "flower": (232, 120, 168),
    "field": (216, 192, 72), "fence": (168, 72, 40), "house": (200, 64, 120),
    "keep": (96, 96, 168), "woodFloor": (184, 136, 88), "innerWall": (56, 44, 64), "carpet": (168, 32, 48),
    "metal": (140, 150, 160), "rail": (90, 70, 60), "factory": (180, 90, 40), "pipe": (60, 140, 140), "arena": (210, 190, 150),
    "moss": (60, 110, 70), "bigTree": (110, 70, 40), "hedge": (40, 130, 90),
    "marble": (236, 232, 220), "redBrick": (150, 50, 40), "goldStone": (200, 180, 120), "palace": (230, 180, 40), "villa": (210, 120, 100),
    "dune": (226, 196, 120), "gravel": (170, 130, 100), "cracked": (200, 140, 90), "buriedRoad": (190, 170, 130), "oasis": (60, 200, 190), "temple": (160, 110, 60),
    "deepSnow": (226, 236, 248), "ice": (150, 210, 236), "frozenMud": (120, 110, 104), "snowStone": (176, 184, 196), "thickWall": (70, 76, 92), "snowPine": (40, 80, 70),
    "wetStone": (90, 96, 100), "dockPlank": (140, 110, 80), "beach": (240, 228, 190), "sea": (70, 200, 220), "ocean": (20, 60, 120), "warehouse": (120, 90, 60),
    "chapel": (236, 236, 250),
}
OUT = Path(__file__).resolve().parents[2] / "apps/client/public/world"


class Grid:
    """땅 칸 표 + 그리기 도구 (점·사각형·원·구불구불한 길)"""

    def __init__(self, w, h, fill, seed=7):
        self.W, self.H = w, h
        self.g = [[fill] * w for _ in range(h)]
        self.rnd = random.Random(seed)

    def get(self, x, y):
        return self.g[y][x] if 0 <= x < self.W and 0 <= y < self.H else None

    def put(self, x, y, k):
        if 0 <= x < self.W and 0 <= y < self.H:
            self.g[y][x] = k

    def rect(self, x0, y0, x1, y1, k, only=None):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if only is None or self.get(x, y) in only:
                    self.put(x, y, k)

    def ring(self, x0, y0, x1, y1, k):
        """사각형 테두리만 (성벽)"""
        for x in range(x0, x1 + 1):
            self.put(x, y0, k)
            self.put(x, y1, k)
        for y in range(y0, y1 + 1):
            self.put(x0, y, k)
            self.put(x1, y, k)

    def blob(self, cx, cy, r, k, only=None):
        for y in range(int(cy - r) - 1, int(cy + r) + 2):
            for x in range(int(cx - r) - 1, int(cx + r) + 2):
                if (x - cx) ** 2 + (y - cy) ** 2 <= r * r and (only is None or self.get(x, y) in only):
                    self.put(x, y, k)

    def line(self, pts, fn):
        """꺾은선 위 점마다 fn(x, y) (반 칸 간격)"""
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            n = max(abs(x1 - x0), abs(y1 - y0), 1) * 2
            for i in range(n + 1):
                fn(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n)

    def road(self, pts, k="path", width=1.1, only=("grass", "flower", "tree", "rock")):
        """구불구불한 길: 굵기 2~3칸 · 좌우로 살짝 흔들림"""
        st = {"wob": 0.0}

        def dot(x, y):
            st["wob"] = max(-0.8, min(0.8, st["wob"] + self.rnd.uniform(-0.25, 0.25)))
            self.blob(x + st["wob"] * 0.5, y + st["wob"] * 0.5, width + self.rnd.random() * 0.5, k, only=only)

        self.line(pts, dot)

    def scatter(self, x0, y0, x1, y1, k, n, size=(3, 7), only=("grass",)):
        """무리 지어 흩뿌림 (꽃·나무)"""
        for _ in range(n):
            cx, cy = self.rnd.randrange(x0, x1), self.rnd.randrange(y0, y1)
            for _ in range(self.rnd.randrange(*size)):
                x, y = cx + self.rnd.randrange(-2, 3), cy + self.rnd.randrange(-2, 3)
                if self.get(x, y) in only:
                    self.put(x, y, k)



def room(W, H, floor):
    """실내 틀: 위 두 줄 벽(아래 줄이 앞면) · 양옆·아래 한 줄 벽 · 안은 바닥"""
    g = [[floor] * W for _ in range(H)]
    for y in range(H):
        for x in range(W):
            if y < 2 or y == H - 1 or x == 0 or x == W - 1:
                g[y][x] = "innerWall"
    return g


def ascalon_house():
    """민가 안 12×9: 나무 바닥 · 가운데 카펫 · 아래 가운데(5,7)가 나가는 문 (가구는 worldPlaces 장식)"""
    g = room(12, 9, "woodFloor")
    for y in range(4, 7):
        for x in range(4, 8):
            g[y][x] = "carpet"
    return g


def ascalon_keep():
    """성채 안 19×13: 돌 바닥 · 문(9,11)에서 왕좌(9,2)까지 붉은 카펫"""
    g = room(19, 13, "floor")
    for y in range(3, 12):
        for x in range(8, 11):
            g[y][x] = "carpet"
    return g


def ascalon_shop():
    """가게 안 13×9 (무기·방어구·물약·잡화가 같이 씀): 나무 바닥 · 문 앞 카펫 · 나가는 문 (6,7) · 진열대·주인은 장소 표"""
    g = room(13, 9, "woodFloor")
    for y in range(5, 8):
        for x in range(5, 8):
            g[y][x] = "carpet"
    return g


def ascalon_smithy():
    """대장간 안 13×9: 돌 바닥 · 나가는 문 (6,7) · 화덕·모루는 장소 표"""
    return room(13, 9, "floor")


def ascalon_inn():
    """여관 안 17×11: 나무 바닥 · 문(8,9)에서 주인 앞까지 카펫"""
    g = room(17, 11, "woodFloor")
    for y in range(5, 10):
        for x in range(7, 10):
            g[y][x] = "carpet"
    return g


def save(name, g):
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (len(g[0]), len(g)))
    img.putdata([KEY[k] for row in g for k in row])
    img.save(OUT / f"{name}.png", optimize=True)
    print(OUT / f"{name}.png", img.size)


if __name__ == "__main__":
    from world_ascalon import ascalon, check, write_layout

    field = ascalon()
    write_layout()
    check(field)
    save("ascalon", field)
    from world_terra import check as check_terra, terra, write_layout as terra_layout

    tf = terra()
    terra_layout()
    check_terra(tf)
    save("terracore", tf)
    from world_virdia import check as check_virdia, virdia, write_layout as virdia_layout

    vf = virdia()
    virdia_layout()
    check_virdia(vf)
    save("virdia", vf)
    from world_helios import check as check_helios, helios, write_layout as helios_layout

    hf = helios()
    helios_layout()
    check_helios(hf)
    save("helios", hf)
    from world_desert import check as check_desert, desert, write_layout as desert_layout

    df = desert()
    desert_layout(df)
    check_desert(df)
    save("desert", df)
    from world_silber import check as check_silber, silber, write_layout as silber_layout

    sf = silber()
    silber_layout()
    check_silber(sf)
    save("silber", sf)
    from world_thalassia import check as check_thal, thalassia, write_layout as thal_layout

    tf2 = thalassia()
    thal_layout()
    check_thal(tf2)
    save("thalassia", tf2)
    # 0.53.0 새 지역 (있는 칸 + Region.skin 그림) · 안 지도 (해저 열차·새벽의 성흔 아지트)
    import world_cyber
    import world_hell
    import world_rooms
    import world_seongguk
    import world_undersea
    import world_windtown

    grids = {"ascalon": field, "terracore": tf, "virdia": vf, "helios": hf, "desert": df, "silber": sf, "thalassia": tf2}
    for mod, name in [(world_hell, "hell"), (world_undersea, "undersea"), (world_cyber, "cyber"), (world_windtown, "windtown"), (world_seongguk, "seongguk")]:
        g = getattr(mod, name)()
        mod.write_layout()
        mod.check(g)
        save(name, g)
        grids[name] = g
    from world_lands import check_doors

    check_doors(grids)
    save("church", world_rooms.church())
    save("sea_train", world_rooms.sea_train())
    save("dawn_hideout", world_rooms.dawn_hideout())
    save("ascalon_shop", ascalon_shop())
    save("ascalon_smithy", ascalon_smithy())
    save("ascalon_inn", ascalon_inn())
    save("ascalon_house", ascalon_house())
    save("ascalon_keep", ascalon_keep())
