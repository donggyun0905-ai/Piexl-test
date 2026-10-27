# 변희 각성 동물 열 마리 (python3 scripts/art/morph_evolved.py) → apps/client/public/sprites/morph-{동물}-evo.png
# 기본 동물(morph_animals)을 1.5배 큰 48칸에 그리고, 동물마다 각성한 빛깔로 바꾼 뒤 겹친 금속 가슴판·어깨 보호대(동물마다 상징 빛의 보석)·번쩍이는 기운을 입히고
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

# 갑옷 금속 (밝은 면 · 가운데 · 그늘 · 테두리)
MET_L, MET, MET_D, MET_E = H("#eef2fa"), H("#a8b2c8"), H("#5a6480"), H("#2a3044")

# 동물마다 상징 빛 (보석·기운): 진한 색 · 밝은 색
PLATE = {
    "wolf": ("#3a8ad8", "#9ae8ff"),
    "bear": ("#c82a2a", "#ff9a6a"),
    "eagle": ("#4a6ac8", "#c8e0ff"),
    "snake": ("#8a3ac8", "#e0a8ff"),
    "boar": ("#d8601a", "#ffc070"),
    "scorpion": ("#c81a4a", "#ff9ab8"),
    "bat": ("#a81a3a", "#ff6a8a"),
    "elephant": ("#5a3ab0", "#c8b0ff"),
    "spider": ("#c82aa8", "#ffa8f0"),
    "phoenix": ("#e8501a", "#fff0a0"),
}

def gem(c, x, y, dark, light):
    """빛나는 둥근 보석: 금속 테 · 진한 빛 · 밝은 빛 · 흰 가운데"""
    for dx in range(-2, 3):
        for dy in range(-2, 3):
            if abs(dx) + abs(dy) <= 3: c.p[(x + dx, y + dy)] = MET_E
    for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, -1), (-1, 1), (1, 1)): c.p[(x + dx, y + dy)] = dark
    for dx, dy in ((0, 0), (-1, 0), (0, -1)): c.p[(x + dx, y + dy)] = light
    c.p[(x - 1, y - 1)] = H("#ffffff")

def armor(c, name, col):
    """사진처럼: 몸통 앞쪽(머리 쪽)을 겹친 금속 판으로 덮는 가슴판 + 앞다리 위 둥근 어깨 보호대(보석) + 둘레에 번쩍이는 기운"""
    dark, light = (H(v) for v in PLATE[name])
    rows = {}
    for (x, y) in c.p: rows.setdefault(y, []).append(x)
    widest = max(len(v) for v in rows.values())
    band = sorted(y for y, xs in rows.items() if len(xs) >= widest * 0.6)
    top, bottom = band[0], band[-1]
    xs = sorted(rows[bottom])
    left, right = xs[0], xs[-1]
    front = left + (right - left) * 45 // 100
    # 가슴판: 몸통 앞쪽을 덮는 둥근 판 · V자로 겹친 판(밝은 윗줄 · 그늘 아랫줄) · 가장자리는 상징 색 테
    cx, cy = (front + right) / 2 + 1, (top + bottom) / 2 + 1
    rx, ry = (right - front) / 2 + 0.5, (bottom - top) / 2 + 1.5
    inside = lambda x, y: ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1
    for y in range(top, bottom + 2):
        for x in range(front, right + 1):
            if (x, y) not in c.p or not inside(x, y): continue
            edge = not all(inside(x + dx, y + dy) and (x + dx, y + dy) in c.p for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
            k = int(y - cy + abs(x - cx) * 0.6 + 40) % 4
            c.p[(x, y)] = dark if edge else (MET_L, MET, MET, MET_D)[k]
    # 가운데 보석 + 둘레 은은한 빛
    gx, gy = int(cx), int(cy)
    for dx in range(-4, 5):
        for dy in range(-4, 5):
            if 9 <= dx * dx + dy * dy <= 16 and (gx + dx, gy + dy) in c.p and c.p[(gx + dx, gy + dy)] in (MET, MET_D, MET_L): c.p[(gx + dx, gy + dy)] = light[:3] + (255,) if (dx + dy) % 3 == 0 else c.p[(gx + dx, gy + dy)]
    gem(c, gx, gy, dark, light)
    # 어깨 보호대: 가슴판 위쪽 앞에 둥근 판 + 보석
    sx, sy = int(cx) + 1, top - 1
    for dx in range(-4, 5):
        for dy in range(-3, 3):
            if (dx / 4.5) ** 2 + (dy / 3) ** 2 <= 1: c.p[(sx + dx, sy + dy)] = MET_L if dy < -1 else MET if dy < 1 else MET_D
    for dx in range(-3, 4): c.p[(sx + dx, sy + 2)] = dark
    c.p[(sx - 4, sy + 1)] = dark; c.p[(sx + 4, sy + 1)] = dark
    gem(c, sx, sy, dark, light)
    # 번쩍이는 기운: 어깨 위로 짧은 번개 갈래 (칸마다 모양이 바뀜)
    zig = [(0, -4), (1, -5), (0, -6), (2, -7), (1, -8)] if col % 2 == 0 else [(-1, -4), (-2, -5), (-1, -6), (-3, -7)]
    for dx, dy in zig: c.p[(sx + dx, sy + dy)] = light
    c.p[(sx + 5, sy - 3 - col % 2)] = light
    c.p[(sx - 5, sy - 2 + col % 2)] = light

def frame_for(name, fn):
    table, light = EVO[name]
    def frame(row, col):
        c = Big()
        fn(c, col, row == 3)
        recolor(c, table)
        armor(c, name, col)
        c.outline(O)
        glow(c, light)
        return c
    return frame

def main():
    for name, fn in ANIMALS.items(): save_sheet(f"morph-{name}-evo", frame_for(name, fn), size=S)

if __name__ == "__main__":
    main()
