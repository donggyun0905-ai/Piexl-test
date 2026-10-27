# 시즌 2 히든 캐릭터 방향 시트 (python3 scripts/art/secret_sprites.py) → apps/client/public/sprites/{miner}.png
# 몸·얼굴은 s2_common.person (시즌 1 그림체), 캐릭터마다 다른 것은 *_deco 꾸밈 함수에만
from s2_common import hx, person, save_sheet

MINER = dict(
    skin=hx("#e8c4a4"), skinD=hx("#c09878"), eye=hx("#2a1a14"), eyeL=hx("#6a4a3a"), outline=hx("#4e4262"),
    top=hx("#c8503a"), arm=hx("#c8503a"), legs=hx("#3a5a8a"), legsD=hx("#26406a"), shoe=hx("#4a3020"),
    hair=hx("#6a4428"), hairD=hx("#4a2c18"), hairL=hx("#8a6040"),
    overall=hx("#3a5a8a"), overallD=hx("#26406a"), helmet=hx("#ffd040"), helmetD=hx("#c8a020"),
    lamp=hx("#c8fbff"), ether=hx("#5ad8e8"), wood=hx("#8a5a2a"), iron=hx("#b8c0d0"), dirt=hx("#5a3a20"),
)

def pickaxe(c, k, x, y):
    """곡괭이: (x, y) 손에서 앞으로 내리찍은 모습"""
    c.line(x, y, x + 7, y - 2, k["wood"]); c.line(x + 6, y - 6, x + 8, y + 3, k["iron"]); c.px(x + 8, y + 4, k["ether"])

def miner_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "back_hair" and not g["cast"]:
        # 등에 멘 곡괭이 (뒤·옆에서 보임)
        if v == "back": c.line(cx - 5, ty + th, cx + 4, ty - 3, k["wood"]); c.line(cx + 1, ty - 4, cx + 7, ty - 1, k["iron"])
        elif v == "side": c.line(cx - 6, ty + th, cx - 1, ty - 2, k["wood"]); c.line(cx - 4, ty - 3, cx + 1, ty - 1, k["iron"])
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
        if g["cast"]:
            # 곡괭이질
            if v == "front":
                # 앞에서는 머리 위로 치켜든 곡괭이
                x = tx + tw + 4
                c.line(x, ty + 1, x + 1, ty - 9, k["wood"]); c.line(x - 3, ty - 9, x + 4, ty - 10, k["iron"]); c.px(x - 4, ty - 8, k["iron"]); c.px(x + 5, ty - 9, k["ether"])
            else: pickaxe(c, k, cx + 7, ty + 2)
    if layer == "hair":
        # 짧은 갈색 머리 (안전모 아래로 옆머리만)
        if v == "front":
            c.rect(hx0, hy + 2, hw, 2, k["hair"]); c.rect(hx0 - 1, hy + 2, 2, hh - 4, k["hair"]); c.rect(hx0 + hw - 1, hy + 2, 2, hh - 4, k["hair"])
        elif v == "back":
            c.rect(hx0 - 1, hy + 2, hw + 2, hh - 2, k["hair"]); c.rect(hx0, hy + hh - 1, hw, 1, k["hairD"])
        else:
            c.rect(hx0, hy + 2, hw, 2, k["hair"]); c.rect(hx0 - 1, hy + 2, 4, hh - 3, k["hair"])
    if layer == "hat":
        # 노란 안전모 (둥근 머리 · 넓은 챙) · 앞에 하늘빛 광부 등불
        c.rect(hx0, hy - 1, hw, 3, k["helmet"]); c.rect(hx0 + 1, hy - 2, hw - 2, 1, k["helmet"])
        c.rect(hx0 - 1, hy + 2, hw + 2, 1, k["helmetD"])
        if v == "front": c.rect(cx - 1, hy - 1, 2, 2, k["lamp"]); c.px(cx, hy - 2, k["ether"])
        elif v == "side": c.rect(hx0 + hw - 2, hy, 2, 2, k["lamp"]); c.px(hx0 + hw + 1, hy + 2, k["helmetD"])

GEO = {
    "miner": dict(head=(10, 9), torso=(10, 8), leg=7),
}

def main():
    save_sheet("miner", lambda r, col: person(MINER, r, col, GEO["miner"], miner_deco))

if __name__ == "__main__":
    main()
