# 시즌 2 히든 캐릭터 방향 시트 (python3 scripts/art/secret_sprites.py) → apps/client/public/sprites/{miner}.png
# 몸·얼굴은 s2_common.person (시즌 1 그림체), 캐릭터마다 다른 것은 *_deco 꾸밈 함수에만
# 에테르 광부는 거대한 곡괭이를 들어서 64칸 (몸 크기는 32칸 캐릭터와 같음)
import math
from s2_common import hx, person, save_sheet

MINER = dict(
    skin=hx("#e8c4a4"), skinD=hx("#c09878"), eye=hx("#2a1a14"), eyeL=hx("#6a4a3a"), outline=hx("#4e4262"),
    top=hx("#c8503a"), arm=hx("#c8503a"), legs=hx("#3a5a8a"), legsD=hx("#26406a"), shoe=hx("#4a3020"),
    hair=hx("#6a4428"), hairD=hx("#4a2c18"), hairL=hx("#8a6040"),
    overall=hx("#3a5a8a"), overallD=hx("#26406a"), helmet=hx("#ffd040"), helmetD=hx("#c8a020"),
    lamp=hx("#c8fbff"), ether=hx("#5ad8e8"),
    shaft=hx("#1a2448"), shaftL=hx("#2e3e7a"), blade=hx("#2a5ad8"), bladeD=hx("#16306e"), edge=hx("#8ac8ff"), grip=hx("#0e1430"),
)

def big_pick(c, k, x, y, deg, L=26, H=14, bend=6):
    """거대한 곡괭이: 손 (x, y)에서 deg 방향(0 = 오른쪽, -90 = 위)으로 긴 남색 자루 · 끝에 가로로 걸친 ^ 파란 날 (양끝이 뾰족하게 가늘어짐)"""
    dx, dy = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    nx, ny = -dy, dx
    # 자루 (손 뒤로 조금 · 손잡이 감은 부분은 더 짙게)
    for i in range(-3, L + 1):
        c.px(x + dx * i, y + dy * i, k["grip"] if i < 4 else k["shaft"])
        c.px(x + dx * i + nx, y + dy * i + ny, k["grip"] if i < 4 else k["shaftL"])
    ex, ey = x + dx * L, y + dy * L
    # 날: 가운데가 두껍고(3) 끝으로 갈수록 가늘게(1) · 앞쪽 가장자리는 밝은 날빛 · 뒤쪽은 짙은 남색
    for j in range(-H * 4, H * 4 + 1):
        s = j / 4
        u = abs(s) / H
        back = bend * u * u
        bx, by = ex + nx * s - dx * back, ey + ny * s - dy * back
        thick = 3 if u < 0.45 else 2 if u < 0.8 else 1
        for d in range(thick):
            col = k["edge"] if d == thick - 1 and thick > 1 else k["blade"] if d else k["bladeD"]
            c.px(bx + dx * (d - 1), by + dy * (d - 1), col)
    # 날 끝은 뾰족하게 한 칸 더 · 자루를 감싼 쇠고리
    for sg in (1, -1):
        c.px(ex + nx * (H + 1) * sg - dx * (bend + 1.5), ey + ny * (H + 1) * sg - dy * (bend + 1.5), k["edge"])
    c.px(ex, ey, k["edge"]); c.px(ex - dx, ey - dy, k["bladeD"])

def miner_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "body":
        # 붉은 셔츠 위 파란 멜빵바지(가슴판·멜빵) · 허리에 하늘색 에테르 결정 주머니
        if v in ("front", "back"):
            c.rect(tx + 1, ty + 3, tw - 2, th - 3, k["overall"])
            c.px(tx + 1, ty, k["overall"]); c.px(tx + 1, ty + 1, k["overall"]); c.px(tx + 1, ty + 2, k["overall"])
            c.px(tx + tw - 2, ty, k["overall"]); c.px(tx + tw - 2, ty + 1, k["overall"]); c.px(tx + tw - 2, ty + 2, k["overall"])
            if v == "front":
                c.rect(cx - 1, ty + 4, 2, 2, k["overallD"]); c.px(tx + 1, ty + 3, k["helmet"]); c.px(tx + tw - 2, ty + 3, k["helmet"])
                c.px(tx + tw - 1, hip - 1, k["ether"]); c.px(tx + tw - 1, hip - 2, k["lamp"])
        else:
            c.rect(cx - 3, ty + 3, 6, th - 3, k["overall"]); c.px(cx - 1, ty, k["overall"]); c.px(cx - 1, ty + 1, k["overall"]); c.px(cx - 1, ty + 2, k["overall"])
            c.px(cx + 2, hip - 2, k["ether"])
    if layer == "hair":
        # 짧은 갈색 머리 (안전모 아래로 옆머리만)
        if v == "front":
            c.rect(hx0, hy + 2, hw, 2, k["hair"]); c.rect(hx0 - 1, hy + 2, 2, hh - 4, k["hair"]); c.rect(hx0 + hw - 1, hy + 2, 2, hh - 4, k["hair"])
        elif v == "back":
            c.rect(hx0 - 1, hy + 2, hw + 2, hh - 2, k["hair"]); c.rect(hx0, hy + hh - 1, hw, 1, k["hairD"])
        else:
            c.rect(hx0, hy + 2, hw, 2, k["hair"]); c.rect(hx0 - 1, hy + 2, 4, hh - 3, k["hair"])
    if layer == "hat":
        miner_pick(c, k, g)
        # 노란 안전모 (둥근 머리 · 넓은 챙) · 앞에 하늘빛 광부 등불
        c.rect(hx0, hy - 1, hw, 3, k["helmet"]); c.rect(hx0 + 1, hy - 2, hw - 2, 1, k["helmet"])
        c.rect(hx0 - 1, hy + 2, hw + 2, 1, k["helmetD"])
        if v == "front": c.rect(cx - 1, hy - 1, 2, 2, k["lamp"]); c.px(cx, hy - 2, k["ether"])
        elif v == "side": c.rect(hx0 + hw - 2, hy, 2, 2, k["lamp"]); c.px(hx0 + hw + 1, hy + 2, k["helmetD"])

def miner_pick(c, k, g):
    """곡괭이 자세: 걸을 때는 어깨에 메고, 공격 줄은 치켜듦 → 앞으로 → 내리찍음 (4칸은 옆에서 내리찍음)"""
    v, tx, ty, tw, th, cx = g["view"], g["tx"], g["ty"], g["tw"], g["th"], g["cx"]
    if g["cast"]:
        if v == "front":
            hand = (tx + tw + 5, ty + 1)
            deg = (-100, -50, -12)[min(g["col"], 2)]
        else:
            hand, deg = (cx + 3, ty + 1), 0
    elif v == "front": hand, deg = (tx + tw + 1, ty + th - 1), -65
    elif v == "back": hand, deg = (tx - 2, ty + th - 1), -115
    else: hand, deg = (cx, ty + th - 2), -130
    # 휘두를 때는 칸 안에 들어오게 자루를 조금 짧게
    big_pick(c, k, hand[0], hand[1], deg, L=18 if g["cast"] and deg > -90 else 26)

GEO = {
    "miner": dict(head=(10, 9), torso=(10, 8), leg=7, size=64),
}

def main():
    save_sheet("miner", lambda r, col: person(MINER, r, col, GEO["miner"], miner_deco), size=64)

if __name__ == "__main__":
    main()
