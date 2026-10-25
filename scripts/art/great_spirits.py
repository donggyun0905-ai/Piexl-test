# 정령사의 대정령 10 (python3 scripts/art/great_spirits.py) → apps/client/public/sprites/spirit-{대정령}.png
# 한 칸 48×48, 2칸(빛이 숨 쉬듯 바뀜). 플레이어 어깨 뒤에 크게 떠 있음 (render/spirits)
# 이드라 = 어른이 된 미래의 이드라: 길게 흐르는 초록 머리 · 금빛 관 · 하얀 초록 드레스 · 꽃 · 여신 같은 모습
from s2_common import Cell, hx, save_sheet

S = 48
O = hx("#0c0a12")
WH = hx("#ffffff")

def titanCore(c, f):
    rock, rockD, rockL, core = hx("#8a8478"), hx("#5a5448"), hx("#b8b0a0"), hx("#ff9a3a") if f == 0 else hx("#ffd060")
    c.oval(24, 30, 15, 12, rock); c.oval(24, 14, 9, 8, rock); c.rect(17, 12, 14, 3, rockD)
    c.oval(9, 30, 5, 8, rockD); c.oval(39, 30, 5, 8, rockD); c.rect(5, 37, 9, 6, rock); c.rect(34, 37, 9, 6, rock)
    c.rect(19, 13, 3, 2, core); c.rect(26, 13, 3, 2, core)
    c.oval(24, 29, 4, 4, core); c.oval(24, 29, 2, 2, WH)
    for x, y in ((14, 22), (31, 24), (20, 38), (29, 36)): c.line(x, y, x + 3, y + 2, rockD)
    for x, y in ((12, 26), (35, 30), (22, 8)): c.px(x, y, rockL)

def ironHide(c, f):
    iron, ironD, ironL, eye = hx("#6a7080"), hx("#3a3e4a"), hx("#c8d0e0"), hx("#ff4a4a")
    c.oval(26, 28, 16, 10, iron); c.oval(12, 22, 9, 8, iron); c.rect(4, 20, 6, 6, ironD)
    for x in (12, 20, 30, 38): c.rect(x, 34, 4, 9, ironD)
    for i, x in enumerate(range(16, 40, 5)): c.line(x, 18 - (i % 2), x + 2, 26, ironL)
    c.line(6, 17, 2, 11, ironL); c.line(10, 15, 9, 9, ironL)
    c.rect(8, 20, 3, 2, eye if f == 0 else hx("#ffa04a")); c.rect(4, 26, 5, 1, WH)

def chronoSpire(c, f):
    stone, stoneD, glow, gold = hx("#3a4a6a"), hx("#24304a"), hx("#6ad8ff"), hx("#ffd040")
    c.rect(19, 10, 10, 34, stone); c.rect(17, 40, 14, 4, stoneD); c.rect(21, 4, 6, 8, stone); c.px(24, 2, gold); c.px(24, 3, gold)
    for y in (14, 22, 30): c.rect(20, y, 8, 2, glow)
    # 둘레를 도는 시계 고리
    import math
    for i in range(24):
        a = i / 24 * math.tau + f * 0.13
        c.px(24 + math.cos(a) * 17, 22 + math.sin(a) * 6, gold if i % 3 else glow)
    c.line(24, 22, 24, 17, gold); c.line(24, 22, 28, 22, gold)

def nightWeaver(c, f):
    body, bodyD, skin, eye, thread = hx("#2a1a4a"), hx("#1a1030"), hx("#c8b8e8"), hx("#e8a8ff"), hx("#d8c8ff")
    for i, (dx, dy) in enumerate(((-16, -10), (-18, 2), (-15, 14), (16, -10), (18, 2), (15, 14))):
        c.line(24, 28, 24 + dx, 28 + dy - (f if i % 2 else 0), bodyD); c.line(24 + dx, 28 + dy, 24 + dx * 1.2, 44, bodyD)
    c.oval(24, 32, 8, 7, body); c.oval(24, 18, 5, 7, body)
    c.oval(24, 10, 4, 4, skin); c.rect(20, 6, 9, 3, body); c.rect(19, 8, 2, 10, body); c.rect(28, 8, 2, 10, body)
    c.px(22, 10, eye); c.px(26, 10, eye)
    for x in (4, 44): c.line(24, 18, x, 2, thread)

def umbra(c, f):
    dark, darkL, eye = hx("#140a20"), hx("#3a2a5a"), hx("#ff3a6a") if f == 0 else hx("#ff8aa8")
    c.oval(24, 20, 13, 14, dark); c.oval(24, 34, 15, 9, dark)
    for x in range(10, 40, 5): c.line(x, 38, x - 2 + (f * 2), 46, dark)
    c.oval(24, 20, 10, 11, darkL); c.oval(24, 21, 8, 9, dark)
    c.rect(18, 18, 4, 2, eye); c.rect(27, 18, 4, 2, eye); c.line(19, 26, 29, 26, eye)
    c.line(10, 8, 6, 2, darkL); c.line(38, 8, 42, 2, darkL)

def venomHide(c, f):
    sc, scD, belly, eye, venom = hx("#3a8a3a"), hx("#1e5a2a"), hx("#c8d870"), hx("#ffd040"), hx("#9aff5a")
    import math
    pts = [(10 + i * 2.2, 40 - math.sin(i * 0.5 + f) * 4) for i in range(10)]
    for x, y in pts: c.oval(x, y, 4, 3, sc)
    c.line(30, 38, 32, 18, sc); c.oval(32, 22, 5, 9, sc); c.oval(32, 26, 3, 6, belly)
    c.oval(33, 10, 7, 6, sc); c.rect(26, 6, 14, 2, scD)
    for x in (27, 39): c.line(x, 8, x + (-3 if x < 30 else 3), 3, scD)
    c.px(30, 9, eye); c.px(36, 9, eye); c.line(33, 15, 33, 19, hx("#e83a3a"))
    for x, y in ((12, 38), (18, 36), (24, 40)): c.px(x, y - 2, scD)
    if f: c.px(33, 21, venom); c.px(34, 23, venom)

def idra(c, f):
    # 어른이 된 이드라: 큰 키 · 바닥까지 흐르는 초록 머리 · 금빛 관 · 빛나는 드레스
    hair, hairD, hairL, skin, skinD = hx("#5ac84a"), hx("#2a8a3a"), hx("#a8f080"), hx("#f6dcc4"), hx("#d8b49a")
    dress, dressD, gold, bloom, eye = hx("#f0fae8"), hx("#b8e0a0"), hx("#ffd040"), hx("#ff8ac8"), hx("#1e6a2a")
    sway = (0, 1)[f]
    c.oval(24, 22, 11, 16, hairD); c.rect(13, 22, 22, 22, hairD)
    for i in range(4): c.line(14 + i * 2, 24, 10 + i * 2 - sway, 46, hair)
    for i in range(4): c.line(28 + i * 2, 24, 32 + i * 2 + sway, 46, hair)
    for i in range(12): c.rect(24 - 4 - i // 2, 22 + i, 8 + i, 1, dress if i % 4 else dressD)
    c.rect(17, 34, 14, 12, dress); c.rect(17, 44, 14, 2, dressD)
    c.rect(20, 18, 8, 5, dress); c.px(24, 20, gold)
    c.line(19, 20, 13, 30, skin); c.line(29, 20, 35, 30, skin)
    c.oval(24, 11, 5, 6, skin); c.rect(20, 15, 8, 1, skinD)
    c.px(22, 11, eye); c.px(26, 11, eye); c.px(24, 14, hx("#e8907a"))
    c.rect(18, 4, 12, 4, hair); c.rect(17, 6, 3, 14, hair); c.rect(28, 6, 3, 14, hair); c.px(20, 7, hairL); c.px(27, 7, hairL)
    c.rect(19, 3, 10, 1, gold)
    for x in (19, 22, 24, 26, 29): c.px(x, 2 - (1 if x == 24 else 0), gold)
    for x, y in ((16, 9), (31, 10), (14, 36), (33, 40), (24, 43)): c.px(x, y, bloom)
    c.px(13, 31, gold); c.px(35, 31, gold)

def briarHeart(c, f):
    heart, heartD, vine, thorn = hx("#c82a4a") if f == 0 else hx("#e84a6a"), hx("#7a1a2a"), hx("#3a8a2a"), hx("#c8e8a0")
    c.oval(18, 18, 8, 8, heart); c.oval(30, 18, 8, 8, heart)
    for i in range(14): c.rect(12 + i // 2, 22 + i, 24 - i, 1, heart)
    c.oval(20, 16, 3, 3, hx("#ff8aa8")); c.line(24, 22, 24, 34, heartD)
    import math
    for k in range(3):
        for i in range(40):
            a = i / 40 * math.tau + k * 2
            x = 24 + math.cos(a) * (18 - k * 2); y = 24 + math.sin(a * 2) * 6 + math.sin(a) * 10
            c.px(x, y, vine)
            if i % 7 == 0: c.px(x + 1, y - 1, thorn)

def sylvanGuard(c, f):
    cloak, cloakD, skin, leaf, wood, string = hx("#3a7a3a"), hx("#2a5a2a"), hx("#e8c8a0"), hx("#7ae05a"), hx("#8a6a3a"), hx("#e8f0d8")
    c.oval(22, 30, 10, 14, cloak); c.rect(13, 30, 18, 14, cloak); c.rect(13, 42, 18, 3, cloakD)
    c.oval(22, 12, 7, 7, cloakD); c.oval(22, 14, 4, 4, skin); c.px(20, 14, hx("#1e3a1e")); c.px(24, 14, hx("#1e3a1e"))
    for x, y in ((15, 8), (29, 9), (14, 26), (30, 32)): c.px(x, y, leaf)
    # 큰 활
    import math
    for i in range(-14, 15):
        c.px(36 + math.cos(i / 14 * 1.2) * 4 - 4, 26 + i, wood)
    c.line(32, 12, 32, 40, string)
    if f: c.line(26, 26, 40, 26, string); c.px(41, 26, leaf)
    c.line(13, 24, 31, 26, skin)

def abyssRuin(c, f):
    void, ring, glow, core = hx("#140a20"), hx("#6a3aa8"), hx("#c88aff"), WH
    import math
    for k, r in enumerate((20, 15, 10)):
        for i in range(60):
            a = i / 60 * math.tau + f * 0.2 * (1 if k % 2 else -1)
            c.px(24 + math.cos(a) * r, 24 + math.sin(a) * r * 0.9, (ring, glow, ring)[k])
    c.oval(24, 24, 8, 8, void)
    for i in range(6):
        a = i / 6 * math.tau + f * 0.3
        c.line(24 + math.cos(a) * 8, 24 + math.sin(a) * 8, 24 + math.cos(a + 0.4) * 22, 24 + math.sin(a + 0.4) * 20, ring)
    c.oval(24, 24, 3, 3, glow); c.px(24, 24, core)

SPIRITS = dict(titanCore=titanCore, ironHide=ironHide, chronoSpire=chronoSpire, nightWeaver=nightWeaver, umbra=umbra, venomHide=venomHide, idra=idra, briarHeart=briarHeart, sylvanGuard=sylvanGuard, abyssRuin=abyssRuin)

def main():
    for name, fn in SPIRITS.items():
        def frame(row, col, fn=fn):
            c = Cell(S)
            fn(c, col)
            c.outline(O)
            return c
        save_sheet(f"spirit-{name}", frame, rows=1, cols=2, size=S)

if __name__ == "__main__":
    main()
