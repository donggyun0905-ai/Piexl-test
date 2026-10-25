# 변희 각성 동물 열 마리 (python3 scripts/art/morph_evolved.py) → apps/client/public/sprites/morph-{동물}-evo.png
# 기본 동물(morph_animals)을 1.5배 큰 48칸에 그리고, 동물마다 각성한 빛깔로 바꾼 뒤 둘레에 빛나는 테두리를 두름
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

def frame_for(name, fn):
    table, light = EVO[name]
    def frame(row, col):
        c = Big()
        fn(c, col, row == 3)
        recolor(c, table)
        c.outline(O)
        glow(c, light)
        return c
    return frame

def main():
    for name, fn in ANIMALS.items(): save_sheet(f"morph-{name}-evo", frame_for(name, fn), size=S)

if __name__ == "__main__":
    main()
