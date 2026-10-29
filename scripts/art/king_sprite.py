# 거대한 왕 방향 시트 (python3 scripts/art/king_sprite.py) → apps/client/public/sprites/crownKing.png
# crownKing: 바스러져가는 왕관으로 변신한 옛 제국의 왕 (금 테 두른 진홍·강철 갑옷 · 붉은 망토 · 금관 투구 · 연두색 영혼 빛)
# (몰락한 왕 fallenKing은 scripts/art/fallen_king_sprite.py)
# 둘 다 거인만 한 몸(80칸 시트, 발 여백 3) · 붉은 츠바이핸더(긴 손잡이·넓은 십자 날밑·리카소)를 어깨에 걸침, 공격 줄은 앞으로 내려 벰
# 대검이 어깨 위로 크게 삐죽 나오게 픽셀을 굵게 (날 폭 4칸)
from s2_common import Cell, hx, save_sheet, shade

S = 80
FOOT = S - 3
CX = 40

PAL = {
    "crownKing": dict(
        plate=hx("#9aa2b4"), plateD=hx("#5c6478"), plateL=hx("#d8dee8"), trim=hx("#e0b030"), trimD=hx("#9a7010"),
        cloth=hx("#a01a2a"), clothD=hx("#6a0e1a"), cape=hx("#b8202e"), capeD=hx("#7a1020"),
        skin=None, hair=None, eye=None, visor=hx("#1a1420"), glow=hx("#8aff6a"), glowL=hx("#d8ffc0"),
        outline=hx("#2a1418"), crown=True,
    ),
}
BLADE = hx("#d8202a")
BLADE_L = hx("#ff8a7a")
BLADE_D = hx("#8a0a14")
GUARD = hx("#e0b030")
GRIP = hx("#3a2418")


def zweihander(c, x0, y0, x1, y1, k):
    """츠바이핸더: (x0,y0) 손잡이 끝 → (x1,y1) 칼끝. 긴 손잡이 · 넓은 십자 날밑 · 리카소 · 날 폭 4칸 (가운데 밝은 줄)"""
    import math
    L = math.hypot(x1 - x0, y1 - y0)
    ux, uy = (x1 - x0) / L, (y1 - y0) / L
    nx, ny = -uy, ux
    at = lambda t, w: (x0 + ux * t + nx * w, y0 + uy * t + ny * w)
    for t in range(0, 12):  # 손잡이 (가죽 감김) · 둥근 폼멜
        for w in (-1, 0, 1):
            x, y = at(t, w * 0.8)
            c.px(x, y, GRIP if t % 3 else k["trimD"])
    px, py = at(-1, 0)
    c.oval(px, py, 2, 2, GUARD)
    for w in range(-7, 8):  # 넓은 십자 날밑 (끝이 휘어 올라감)
        for d in (11, 12):
            x, y = at(d - (1 if abs(w) > 5 else 0), w)
            c.px(x, y, GUARD)
    for t in range(13, int(L)):  # 날 (리카소는 좁게, 끝으로 갈수록 뾰족)
        half = 1.2 if t < 18 else 2.2 if t < L - 6 else 2.2 * (L - t) / 6
        for wq in range(-3, 4):
            w = wq * 0.75
            if abs(w) > half: continue
            x, y = at(t, w)
            c.px(x, y, BLADE_L if abs(w) < 0.5 else BLADE_D if w > half - 0.8 else BLADE)
    for t in (14, 16):  # 리카소 작은 날개
        for w in (-3, 3):
            x, y = at(t, w)
            c.px(x, y, GUARD)


def flame(c, x, y, tick, k, n=3):
    """갑옷 마디 사이 일렁이는 불꽃 (몰락한 왕 푸른 불꽃 · 왕관 왕은 연두 영혼 빛)"""
    for i in range(n):
        h = 2 + (tick + i * 2) % 3
        for j in range(h):
            c.px(x + i - n // 2 + (j % 2 if (tick + i) % 2 else 0), y - j, k["glowL"] if j == 0 else k["glow"])


def frame_for(name):
    k = PAL[name]

    def frame(row, col):
        c = Cell(S)
        view = "front" if row == 0 or (row == 3 and col < 3) else "back" if row == 1 else "side"
        cast = row == 3
        step = 0 if cast else col
        dy = 1 if step in (1, 3) else 0
        top = 18 + dy
        # 망토 (뒤로 넓게 흘러내림)
        if view != "side":
            c.rect(CX - 15, top + 16, 30, FOOT - top - 22, k["capeD"] if view == "front" else k["cape"])
            for x in range(CX - 15, CX + 15, 4): c.rect(x, FOOT - 7, 2, 2, k["capeD"])
        else:
            c.rect(CX - 14, top + 16, 10, FOOT - top - 22, k["cape"])
        if view == "back" and not cast:
            # 뒤: 손잡이·날밑은 몸 앞쪽이라 가려지고, 어깨 위로 칼날만 보임 (몸보다 먼저 그림)
            zweihander(c, CX - 6, top + 28, CX - 34, top - 16, k)
        # 대검 (어깨에 걸침: 오른손 위 → 등 뒤 왼쪽 위로 삐죽) · 공격 줄은 앞쪽 아래로 휘두름
        # 다리 (굵은 정강이 갑옷 · 쇠 장화)
        lift = (0, 2, 0, -2)[step]
        if view in ("front", "back"):
            for i, lx in enumerate((CX - 10, CX + 3)):
                up = max(0, lift) if i == 0 else max(0, -lift)
                c.rect(lx, top + 38, 7, FOOT - top - 38 - up, k["plate"])
                c.rect(lx, top + 38, 7, 2, k["trim"])
                c.rect(lx + 1, top + 44, 5, 3, k["plateL"])
                c.rect(lx - 1, FOOT - 4 - up, 9, 4, k["plateD"])
                if not k["crown"]: flame(c, lx + 3, top + 43, col + i, k, 3)
        else:
            stride = (0, 3, 0, -3)[step]
            for i, sx in enumerate((CX - 4 + stride, CX - 2 - stride)):
                c.rect(sx, top + 38, 7, FOOT - top - 38, k["plate"] if i == 0 else k["plateD"])
                c.rect(sx, FOOT - 4, 10, 4, k["plateD"])
        # 허리 치마 갑옷 (진홍/남색 천 + 금 테)
        w = 28 if view != "side" else 16
        c.rect(CX - w // 2, top + 32, w, 8, k["cloth"])
        for x in range(CX - w // 2, CX + w // 2, 4): c.rect(x, top + 33, 1, 7, k["clothD"])
        c.rect(CX - w // 2, top + 31, w, 2, k["trim"])
        # 몸통 흉갑 (넓은 어깨, 가운데 문장)
        tw = 26 if view != "side" else 16
        c.rect(CX - tw // 2, top + 14, tw, 18, k["plate"])
        c.rect(CX - tw // 2 + 2, top + 16, tw - 4, 3, k["plateL"])
        c.rect(CX - tw // 2, top + 29, tw, 2, k["plateD"])
        if view == "front":
            c.rect(CX - 3, top + 19, 6, 8, k["trim"]); c.rect(CX - 2, top + 20, 4, 6, k["cloth"])
            c.px(CX, top + 22, k["glowL"]); c.px(CX, top + 23, k["glow"])
        if not k["crown"]:  # 흉갑 마디 사이 불꽃
            flame(c, CX - 8, top + 30, col, k, 3); flame(c, CX + 8, top + 30, col + 1, k, 3)
        # 어깨 갑옷 (크고 둥근 견갑, 금 테 · 뾰족 장식)
        if view != "side":
            for sx in (-1, 1):
                ex = CX + sx * 15
                c.oval(ex, top + 15, 7, 5, k["plate"]); c.oval(ex - sx, top + 14, 5, 3, k["plateL"])
                c.rect(ex - 7, top + 18, 14, 2, k["trim"])
                c.line(ex, top + 10, ex + sx * 3, top + 6, k["trim"])
                if not k["crown"]: flame(c, ex, top + 21, col + (sx > 0), k, 4)
        else:
            c.oval(CX + 1, top + 15, 7, 5, k["plate"]); c.rect(CX - 6, top + 18, 14, 2, k["trim"])
        # 팔 (건틀릿) · 손 · 공격 줄은 두 손으로 대검을 앞 아래로
        if view == "front":
            c.rect(CX - 19, top + 19, 6, 13, k["plate"]); c.rect(CX - 19, top + 30, 6, 4, k["plateD"])
            c.rect(CX + 13, top + 19, 6, 9, k["plate"]); c.rect(CX + 11, top + 26, 6, 4, k["plateD"])
            if cast:
                g = col
                zweihander(c, CX + 4, top + 26, CX + 22 + g * 4, FOOT - 4 - g * 6, k)
        elif view == "back":
            c.rect(CX - 19, top + 19, 6, 13, k["plate"]); c.rect(CX + 13, top + 19, 6, 13, k["plate"])
        else:
            if cast:
                c.rect(CX + 2, top + 20, 12, 5, k["plate"])
                zweihander(c, CX + 8, top + 22, CX + 40, top + 30, k)
            else:
                c.rect(CX - 1, top + 19, 6, 11, k["plate"]); c.rect(CX - 1, top + 28, 6, 4, k["plateD"])
        # 머리: 왕관 왕 = 금관 얹은 투구(눈 틈 연두 빛) · 몰락한 왕 = 맨얼굴(검은 머리·짙은 푸른 눈·하늘색 피부)
        hy = top - 6
        if k["crown"]:
            c.rect(CX - 7, hy + 1, 14, 18, k["plate"]); c.rect(CX - 6, hy + 2, 12, 2, k["plateL"]); c.rect(CX - 7, hy + 14, 14, 2, k["trim"])
            if view == "front":
                c.rect(CX - 5, hy + 7, 10, 2, k["visor"]); c.px(CX - 3, hy + 7, k["glow"]); c.px(CX + 2, hy + 7, k["glow"])
                for x in range(CX - 4, CX + 5, 2): c.px(x, hy + 10, k["visor"])
            elif view == "side":
                c.rect(CX + 1, hy + 6, 6, 2, k["visor"]); c.px(CX + 4, hy + 6, k["glow"])
            # 금관 (뾰족 다섯 · 붉은 보석)
            c.rect(CX - 8, hy - 1, 16, 3, k["trim"])
            for x in (CX - 8, CX - 4, CX, CX + 4, CX + 7):
                c.rect(x, hy - 4, 2, 3, k["trim"]); c.px(x, hy - 5, k["trim"])
            c.px(CX, hy, BLADE); c.px(CX - 5, hy, BLADE); c.px(CX + 5, hy, BLADE)
        else:
            c.rect(CX - 7, hy, 14, 6, k["hair"]); c.rect(CX - 8, hy + 2, 16, 4, k["hair"])
            c.rect(CX - 5, hy - 1, 8, 1, k["hairL"])
            if view == "back":
                c.rect(CX - 7, hy + 5, 14, 12, k["hair"]); c.rect(CX - 6, hy + 16, 12, 3, k["hair"])
            else:
                fx0 = CX - 6 if view == "front" else CX - 2
                fw = 12 if view == "front" else 9
                c.rect(fx0, hy + 5, fw, 12, k["skin"]); c.rect(fx0 + 1, hy + 16, fw - 2, 2, k["skinD"])
                c.rect(fx0 - 1, hy + 4, 4, 6, k["hair"])
                if view == "front":
                    c.rect(CX + 3, hy + 4, 4, 5, k["hair"])
                    for ex in (CX - 4, CX + 2):
                        c.rect(ex - 1, hy + 9, 3, 2, k["eye"]); c.px(ex, hy + 9, k["eyeL"]); c.rect(ex - 1, hy + 8, 3, 1, k["hair"])
                    c.rect(CX - 1, hy + 14, 2, 1, k["skinD"])
                else:
                    c.rect(CX + 3, hy + 9, 3, 2, k["eye"]); c.px(CX + 4, hy + 9, k["eyeL"]); c.rect(CX + 3, hy + 8, 3, 1, k["hair"])
                # 목 보호대 (갑옷 깃)
                c.rect(CX - 7, hy + 18, 14, 2, k["plateD"])
            flame(c, CX - 9, top + 12, col, k, 2); flame(c, CX + 9, top + 12, col + 2, k, 2)
        # 걸을 때: 오른손에 쥔 대검을 오른쪽 어깨에 기댐 (몸 앞으로, 칼날이 어깨 위로 크게) · 옆은 앞쪽 어깨에 기대 뒤로
        if not cast and view == "front":
            zweihander(c, CX + 10, top + 36, CX + 36, top - 16, k)
            c.rect(CX + 10, top + 26, 6, 5, k["plateD"]); c.rect(CX + 10, top + 26, 6, 1, k["trim"])
        elif not cast and view == "side":
            zweihander(c, CX + 10, top + 32, CX - 30, top - 12, k)
            c.rect(CX + 6, top + 24, 6, 5, k["plateD"])
        shade(c)
        c.outline(k["outline"])
        return c

    return frame


def main():
    for name in PAL:
        save_sheet(name, frame_for(name), size=S)


if __name__ == "__main__":
    main()
