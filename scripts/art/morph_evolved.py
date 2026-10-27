# 변희 각성 동물 열 마리 (python3 scripts/art/morph_evolved.py) → apps/client/public/sprites/morph-{동물}-evo.png
# 기본 동물(morph_animals)을 1.5배 큰 48칸에 그리고, 동물마다 각성한 빛깔로 바꾼 뒤 배·가슴 쪽에 동물마다 상징 색 갑옷 판(금 테 + 원소 보석)을 입히고
# 둘레에 빛나는 테두리를 두름
# 하이울프 · 폭군 곰 · 폭풍 독수리 · 바실리스크 · 철갑 멧돼지 왕 · 사막의 제왕 · 흡혈 박쥐왕 · 매머드 왕 · 여왕 거미 · 태양 불사조
from s2_common import Cell, hx, save_sheet
from morph_animals import ANIMALS, O

S = 48
SCALE = 1.5
OY = 1  # 발이 칸 아래 여백 3 위에 오게

class Big(Cell):
    """32칸 좌표로 그리면 1.5배로 키워 48칸에 찍음 (빈틈 없게 칸을 채움)"""
    def __init__(self):
        super().__init__(S)
    def px(self, x, y, c):
        if c is None: return
        x0, y0 = int(round(x * SCALE)), int(round(y * SCALE + OY))
        x1, y1 = int(round((x + 1) * SCALE)), int(round((y + 1) * SCALE + OY))
        for yy in range(y0, max(y0 + 1, y1)):
            for xx in range(x0, max(x0 + 1, x1)):
                if 0 <= xx < S and 0 <= yy < S: self.p[(xx, yy)] = c

def H(s): return hx(s)

# 동물마다: 원래 색 → 각성 색 · 둘레 빛
EVO = {
    "wolf": ({"#8a8a9a": "#c8d8f0", "#5a5a6a": "#2a3a5a", "#c8c8d4": "#f0f8ff", "#ffd040": "#6ae8ff", "#e84a4a": "#3a8aff"}, "#6ad8ff"),
    "bear": ({"#7a5030": "#3a2418", "#4a3018": "#1e120a", "#c8a070": "#a87040", "#100808": "#ff2a2a"}, "#ff6a2a"),
    "eagle": ({"#5a3a20": "#1e2a4a", "#3a2410": "#101830", "#ffc030": "#ffe04a", "#e08a10": "#ffb020"}, "#a8e8ff"),
    "snake": ({"#4a9a3a": "#4a2a6a", "#2a6a2a": "#24143a", "#c8d870": "#e8c040", "#ffd040": "#ff3a3a", "#e83a3a": "#ff8a2a"}, "#c88aff"),
    "boar": ({"#6a4a3a": "#7a8090", "#4a3024": "#3a3e4a", "#c88a7a": "#c8d0e0", "#ffffff": "#ffd040", "#c8a070": "#ffd040"}, "#ffd040"),
    "scorpion": ({"#a8642a": "#d8a030", "#6a3a14": "#8a5010", "#d8944a": "#ffe08a", "#e83a3a": "#ff2a6a"}, "#ffb040"),
    "bat": ({"#3a2a4a": "#5a0a1a", "#24182e": "#2a0410", "#5a4a6a": "#a81a3a", "#ff4a4a": "#ffd040"}, "#ff3a5a"),
    "elephant": ({"#a0a0b0": "#7a5a3a", "#70707e": "#4a3420", "#f4ecd8": "#fff8e8"}, "#e8c080"),
    "spider": ({"#2a2430": "#1a0a2a", "#4a4450": "#5a2a7a", "#e83a3a": "#ff3ad8"}, "#d86aff"),
    "phoenix": ({"#ff7a2a": "#fff0a0", "#e84a1a": "#ffb040", "#ffd040": "#ffffff", "#ff4a1a": "#6ad8ff"}, "#ffe080"),
}

def recolor(c, table):
    m = {H(k): H(v) for k, v in table.items()}
    for xy, col in list(c.p.items()):
        if col in m: c.p[xy] = m[col]

def glow(c, color):
    """검은 테두리 바깥에 각성 빛 한 겹"""
    add = {}
    g = H(color)
    for (x, y) in list(c.p):
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, y + dy)
            if q not in c.p and 0 <= q[0] < S and 0 <= q[1] < S: add[q] = (g[0], g[1], g[2], 150)
    c.p.update(add)

GOLD, GOLD_D = H("#ffd040"), H("#a87818")

# 동물마다 갑옷 상징 색: 밝은 면 · 바탕 · 이음새(그늘)
PLATE = {
    "wolf": ("#bfe8ff", "#3a8ad8", "#1a3a7a"),
    "bear": ("#ff8a6a", "#c82a2a", "#5a0a0a"),
    "eagle": ("#e0f0ff", "#4a6ac8", "#1a2a6a"),
    "snake": ("#e0b0ff", "#8a3ac8", "#3a0a5a"),
    "boar": ("#ffb08a", "#b8401a", "#5a1a0a"),
    "scorpion": ("#ff9ab0", "#a8183a", "#4a0414"),
    "bat": ("#3a3448", "#1a1424", "#0a060e"),
    "elephant": ("#c8b0ff", "#5a3ab0", "#24145a"),
    "spider": ("#ffb0f0", "#c82aa8", "#5a0a48"),
    "phoenix": ("#ffd0a0", "#e8501a", "#7a1a08"),
}

def armor(c, name, light):
    """배·가슴 쪽 갑옷 판: 몸통 줄(가로로 가장 넓은 줄들) 아래쪽 네 줄을 상징 색 판으로 덮고,
    위는 밝은 면 · 맨 아래는 금 테 · 네 칸마다 이음새 · 가운데 금 받침의 원소 보석"""
    hi, mid, dk = (H(v) for v in PLATE[name])
    rows = {}
    for (x, y) in c.p: rows.setdefault(y, []).append(x)
    widest = max(len(v) for v in rows.values())
    band = [y for y, xs in rows.items() if len(xs) >= widest * 0.6]
    bottom = max(band)
    xs = sorted(rows[bottom])
    left, right = xs[0] + 1, xs[-1] - 1
    for y in range(bottom - 3, bottom + 1):
        for x in range(left, right + 1):
            if (x, y) not in c.p: continue
            k = bottom - y
            col = GOLD if k == 0 else hi if k == 3 else mid
            if k in (1, 2) and (x - left) % 4 == 3: col = dk
            if k == 0 and (x - left) % 4 == 3: col = GOLD_D
            c.p[(x, y)] = col
    # 가운데 보석 (금 받침)
    gx = (left + right) // 2
    gy = bottom - 2
    for dx, dy in ((-1, 0), (2, 0), (0, -1), (1, -1), (0, 2), (1, 2)):
        if (gx + dx, gy + dy) in c.p: c.p[(gx + dx, gy + dy)] = GOLD
    g = H(light)
    for dx, dy in ((0, 0), (1, 0), (0, 1), (1, 1)): c.p[(gx + dx, gy + dy)] = g
    c.p[(gx, gy)] = H("#ffffff")

def frame_for(name, fn):
    table, light = EVO[name]
    def frame(row, col):
        c = Big()
        fn(c, col, row == 3)
        recolor(c, table)
        armor(c, name, light)
        c.outline(O)
        glow(c, light)
        return c
    return frame

def main():
    for name, fn in ANIMALS.items(): save_sheet(f"morph-{name}-evo", frame_for(name, fn), size=S)

if __name__ == "__main__":
    main()
