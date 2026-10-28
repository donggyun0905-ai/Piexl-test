# 시즌 2 새 보스 넷 몬스터 그림 (python3 scripts/art/s2_bosses.py) → apps/client/public/sprites/enemies/{toad,salamander,jelly,captain}.png
# 규격(docs/ART.md): 움직임 칸 2장을 가로로, 오른쪽을 봄, 몸보다 1.6~2배
# 두꺼비 왕: 둥근 초록 몸 · 밝은 배 · 우툴두툴 점 · 위로 솟은 큰 눈 · 작은 금관 (2칸: 목주머니가 부풂)
# 불도롱뇽: 옆모습 주황·붉은 도롱뇽 · 검은 점 · 등의 노란 빛줄 · 꼬리 (2칸: 꼬리를 흔들고 등에 불꽃)
# 번개 해파리: 비치는 푸른 갓 · 노란 빛 속 · 늘어진 촉수 (2칸: 촉수가 물결치고 번개가 튐)
# 유령선 선장: 해골 무늬 삼각모 · 쪽빛 긴 코트 · 청록 유령 얼굴과 빛나는 눈 · 수염 · 해적 칼 · 흐릿한 아랫몸 (2칸: 코트가 날림)
from s2_common import Cell, hx
from umbra_beasts import poly, save, thick

def toad(f):
    S = 48
    c = Cell(S)
    body, dark, light, belly = hx("#5a8a3a"), hx("#3a5a24"), hx("#8ab85a"), hx("#e0d898")
    sac = hx("#f0d870") if f else belly
    c.oval(24, 30, 18, 13, body)
    c.oval(26, 34, 12, 8, belly)
    if f: c.oval(34, 34, 7, 6, sac)
    for x, y in ((14, 24), (20, 20), (30, 22), (12, 32), (36, 26)):
        c.oval(x, y, 2, 2, dark)
    # 앞다리 · 뒷다리
    c.oval(36, 41, 5, 3, body); c.oval(13, 41, 7, 3, dark)
    for x in (33, 36, 39): c.px(x, 44, light)
    # 큰 눈 둘 (위로 솟음)
    for ex in (27, 36):
        c.oval(ex, 17, 4, 4, body)
        c.oval(ex, 16, 3, 3, hx("#f8f0a0"))
        c.rect(ex, 15, 2, 3, hx("#1a1a10"))
        c.px(ex - 1, 15, hx("#ffffff"))
    # 넓은 입
    c.line(30, 29, 43, 27, dark)
    # 작은 금관
    for i, x in enumerate((28, 31, 34)):
        c.rect(x, 9 - (i % 2), 2, 4 + (i % 2), hx("#f2c040"))
    c.rect(27, 12, 10, 2, hx("#c89020"))
    c.px(31, 11, hx("#e83a4a"))
    c.outline(hx("#1a240e"))
    return c

def salamander(f):
    S = 44
    c = Cell(S)
    body, dark, light, belly = hx("#e8602a"), hx("#9a2a10"), hx("#ffd84a"), hx("#ffb070")
    # 꼬리 (2칸은 위로 흔듦)
    tail = [(14, 26), (8, 22 if f else 28), (3, 16 if f else 30)]
    thick(c, 16, 26, tail[0][0], tail[0][1], 3, body)
    thick(c, tail[0][0], tail[0][1], tail[1][0], tail[1][1], 2, body)
    thick(c, tail[1][0], tail[1][1], tail[2][0], tail[2][1], 1, body)
    # 몸통 · 머리
    c.oval(23, 26, 10, 5, body)
    c.oval(23, 28, 8, 2, belly)
    c.oval(35, 24, 6, 5, body)
    c.oval(39, 25, 3, 3, body)
    # 다리
    for x in (17, 28):
        c.rect(x, 30, 2, 5, dark); c.rect(x + 1, 34, 3, 1, dark)
    # 등의 빛줄 · 검은 점
    c.line(15, 21, 31, 21, light)
    for x, y in ((19, 24), (25, 23), (29, 26), (36, 21)):
        c.px(x, y, hx("#1a0a06")); c.px(x + 1, y, hx("#1a0a06"))
    # 눈 · 입
    c.rect(37, 21, 2, 2, hx("#fff27a")); c.px(38, 22, hx("#1a0a06"))
    c.line(37, 27, 42, 26, dark)
    if f:
        # 등에 불꽃
        for x, h in ((20, 5), (24, 7), (28, 4)):
            c.line(x, 20, x, 20 - h, hx("#ff8a2a")); c.px(x, 20 - h - 1, light)
    c.outline(hx("#2a0e06"))
    return c

def jelly(f):
    S = 44
    c = Cell(S)
    bell, dark, light, core = hx("#7ac8f8"), hx("#3a7ab8"), hx("#d8f4ff"), hx("#fff27a")
    # 갓
    poly(c, [(8, 22), (12, 10), (22, 5), (32, 10), (36, 22)], bell)
    c.oval(22, 22, 14, 3, dark)
    c.oval(22, 15, 6, 5, core)
    c.oval(22, 15, 3, 2, hx("#ffffff"))
    c.line(14, 10, 18, 7, light); c.px(13, 12, light)
    # 촉수 (물결)
    for i, x in enumerate(range(11, 35, 4)):
        for y in range(24, 40):
            wob = (1 if ((y // 3 + i + f) % 2) else -1)
            c.px(x + wob, y, bell if y < 34 else dark)
    if f:
        # 번개가 튐
        for x0, y0 in ((6, 14), (38, 12)):
            c.line(x0, y0, x0 + (2 if x0 < 20 else -2), y0 + 4, core)
            c.line(x0 + (2 if x0 < 20 else -2), y0 + 4, x0, y0 + 8, core)
    c.outline(hx("#123a5a"))
    return c

def captain(f):
    S = 44
    c = Cell(S)
    coat, coatD, ghost, ghostD, gold = hx("#2a3a6a"), hx("#1a2448"), hx("#8ae8d8"), hx("#4ab0a0"), hx("#e8c040")
    # 흐릿한 아랫몸 (유령 꼬리)
    poly(c, [(15, 30), (29, 30), (26, 40 if f else 38), (20, 42), (17, 38)], ghostD)
    for y in range(36, 42):
        if y % 2: c.px(20 + (y % 3), y, ghost)
    # 긴 코트 (2칸은 뒤로 날림)
    poly(c, [(15, 18), (29, 18), (31, 32), (24, 33), (13 - (3 if f else 0), 33)], coat)
    c.line(22, 18, 22, 32, coatD)
    for y in (21, 25, 29): c.px(24, y, gold)
    c.rect(15, 26, 14, 2, hx("#5a2a2a"))
    # 얼굴 · 빛나는 눈 · 수염
    c.oval(22, 13, 5, 5, ghost)
    c.rect(20, 12, 2, 2, hx("#ffffff")); c.rect(24, 12, 2, 2, hx("#ffffff"))
    c.px(21, 13, hx("#4af0ff")); c.px(25, 13, hx("#4af0ff"))
    poly(c, [(18, 15), (27, 15), (25, 21), (22, 22), (20, 21)], hx("#d8f4f0"))
    # 삼각모 · 해골 무늬
    poly(c, [(12, 9), (22, 3), (33, 9), (28, 10), (22, 8), (16, 10)], hx("#14141c"))
    c.rect(21, 5, 3, 2, hx("#f4f0e0")); c.px(22, 7, hx("#f4f0e0"))
    c.line(12, 9, 33, 9, gold)
    # 해적 칼 (오른손)
    c.line(29, 22, 31, 24, hx("#6a4a2a"))
    c.line(31, 24, 39, 16 if f else 18, hx("#e8ecf4"))
    c.px(30, 23, gold); c.px(31, 23, gold)
    c.outline(hx("#0a0e1a"))
    return c

def main():
    save("toad", [toad(0), toad(1)], 48)
    save("salamander", [salamander(0), salamander(1)], 44)
    save("jelly", [jelly(0), jelly(1)], 44)
    save("captain", [captain(0), captain(1)], 44)

if __name__ == "__main__":
    main()
