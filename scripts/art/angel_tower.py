# 천사장 보스의 탑 (enemies/tower.png): 2배 촘촘 (칸 44 = 게임 22) · 2장 (빛 창·수정이 깜박임)
# 계단 대리석 받침 · 금테 기둥 · 빛나는 아치 창 · 양옆 작은 날개 장식 · 금테 첨탑 · 떠 있는 빛 수정
# python3 scripts/art/angel_tower.py → apps/client/public/sprites/enemies/tower.png (game/enemySprites ENEMY_SRC tower: 2)
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "..", "apps", "client", "public", "sprites", "enemies", "tower.png")
C = 44
OL = (42, 32, 64, 255)
M1, M2, M3, M4 = (250, 248, 255, 255), (222, 218, 240, 255), (184, 176, 212, 255), (140, 130, 176, 255)
G1, G2, G3 = (255, 236, 150, 255), (240, 190, 70, 255), (178, 120, 40, 255)
L1, L2 = (255, 255, 230, 255), (255, 240, 160, 255)


def frame(k):
    im = Image.new("RGBA", (C, C), (0, 0, 0, 0))
    px = im.load()

    def put(x, y, c):
        if 0 <= x < C and 0 <= y < C:
            px[x, y] = c

    def rect(x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                put(x, y, c)

    cx = 22
    # 받침: 계단 세 단 (왼쪽 위에서 빛)
    for (y0, y1, hw) in [(40, 43, 16), (37, 39, 13), (34, 36, 11)]:
        rect(cx - hw, y0, cx + hw - 1, y1, M2)
        rect(cx - hw, y0, cx + hw - 1, y0, M1)
        rect(cx + hw - 4, y0 + 1, cx + hw - 1, y1, M3)
        rect(cx - hw, y1, cx + hw - 1, y1, M4)
    rect(cx - 11, 34, cx + 10, 34, G2)
    # 기둥 (밝은 왼쪽 · 어두운 오른쪽 · 세로 홈)
    rect(cx - 8, 13, cx + 7, 33, M2)
    rect(cx - 8, 13, cx - 5, 33, M1)
    rect(cx + 4, 13, cx + 7, 33, M3)
    for gx in (cx - 3, cx + 2):
        rect(gx, 15, gx, 32, M3)
    # 금테 (위·아래) + 보석
    for y in (13, 14, 31, 32):
        rect(cx - 9, y, cx + 8, y, G2 if y in (14, 31) else G1)
    put(cx - 1, 31, (120, 200, 255, 255)); put(cx, 31, (120, 200, 255, 255))
    # 아치 창 (빛이 깜박임)
    glow = L1 if k == 0 else L2
    rect(cx - 3, 20, cx + 2, 28, glow)
    rect(cx - 2, 18, cx + 1, 19, glow)
    for (x, y) in [(cx - 4, 19), (cx - 4, 20), (cx + 3, 19), (cx + 3, 20), (cx - 3, 17), (cx + 2, 17), (cx - 2, 17), (cx + 1, 17)]:
        put(x, y, G3)
    rect(cx - 4, 21, cx - 4, 28, G3); rect(cx + 3, 21, cx + 3, 28, G3); rect(cx - 4, 29, cx + 3, 29, G3)
    rect(cx - 1, 20, cx, 28, (255, 250, 200, 255))
    # 양옆 작은 날개 장식 (깃털 셋)
    for side in (-1, 1):
        bx = cx - 9 if side < 0 else cx + 8
        for i, (dx, dy, ln) in enumerate([(1, 0, 6), (1, 2, 5), (1, 4, 4)]):
            for t in range(ln):
                x = bx + side * (dx + t)
                y = 15 + dy - (t // 2)
                put(x, y, M1 if i == 0 else M2)
                put(x, y + 1, M3)
    # 첨탑 (금테 고깔)
    for y in range(4, 13):
        hw = (y - 3) // 1 * 9 // 9
        hw = max(1, (y - 3))
        rect(cx - hw, y, cx + hw - 1, y, M2)
        put(cx - hw, y, M1)
        put(cx + hw - 1, y, M3)
    rect(cx - 10, 12, cx + 9, 12, G2)
    rect(cx - 10, 11, cx + 9, 11, G1)
    for y in range(5, 11, 2):
        put(cx - 1, y, G2); put(cx, y, G2)
    # 떠 있는 빛 수정 (2장째는 1칸 위·더 밝게)
    oy = 0 if k == 0 else -1
    for (x, y, c) in [(0, 0, L1), (-1, 1, L2), (0, 1, L1), (1, 1, L2), (-1, 2, L2), (0, 2, L1), (1, 2, G1), (0, 3, G1), (0, -1, L2)]:
        put(cx - 1 + x, 1 + oy + y, c)
        put(cx + x, 1 + oy + y, c)
    if k == 1:
        for (x, y) in [(cx - 4, 2), (cx + 3, 2), (cx - 1, -0), (cx, -0)]:
            put(x, y + 1, (255, 255, 255, 200))
    # 테두리
    a = im.copy().load()
    for y in range(C):
        for x in range(C):
            if a[x, y][3]:
                continue
            if any(0 <= x + dx < C and 0 <= y + dy < C and a[x + dx, y + dy][3] > 150 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                px[x, y] = OL
    return im


sheet = Image.new("RGBA", (C * 2, C), (0, 0, 0, 0))
for k in range(2):
    sheet.alpha_composite(frame(k), (k * C, 0))
sheet.save(OUT)
print("tower ok", sheet.size)
