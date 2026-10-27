# 마법사·떠돌이 새 캐릭터 시트 (python3 scripts/art/classic_sprites.py) → apps/client/public/sprites/{mage,drifter}.png
# 마법사 '별빛 마법사': 은빛 긴 머리 · 보석 이마띠·초승달 핀 · 남색 로브(금 테·별 무늬) · 흰 어깨 망토 · 수정 지팡이
# 떠돌이 '바람 유랑자': 헝클어진 밤색 머리 · 바람에 날리는 청록 목도리 · 열린 가죽 재킷 · 화살통 끈 · 허리 주머니 · 부츠
from s2_common import hx, person, save_sheet

MAGE = dict(
    skin=hx("#f6dcc8"), skinD=hx("#d8b4a0"), eye=hx("#3a2a8a"), eyeL=hx("#8a7aff"), mouth=hx("#e0907a"), outline=hx("#3a3458"),
    top=hx("#2a3070"), arm=hx("#2a3070"), legs=hx("#2a3070"), legsD=hx("#1a1e4a"), shoe=hx("#1a1e4a"),
    hair=hx("#c8c0e8"), hairD=hx("#8a80b8"), hairL=hx("#f4f0ff"),
    robe=hx("#2a3070"), robeD=hx("#1a1e4a"), robeL=hx("#4a5aa8"), trim=hx("#f2c84a"), cape=hx("#f0f0f8"), capeD=hx("#c8c8dc"),
    gem=hx("#7ae8ff"), staff=hx("#8a6a4a"), star=hx("#fff6c0"),
)

def mage_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    if layer == "back_hair" and v != "back":
        # 허리까지 오는 긴 은빛 머리 (뒤쪽)
        c.rect(hx0 - 1, hy + 3, hw + 2, hh + 6, k["hairD"])
    if layer == "legs":
        # 발목까지 오는 로브 자락 · 금 테 · 별 무늬
        sway = (0, 1, 0, -1)[g["step"]]
        top = hip - 1
        for i, y in enumerate(range(top, 27)):
            w = tw + (i * 2) // 3
            x0 = cx - w // 2 + (sway if y > 23 else 0)
            c.rect(x0, y, w, 1, k["robe"])
            if v != "back": c.px(x0, y, k["robeD"]); c.px(x0 + w - 1, y, k["robeD"])
        bw = tw + ((26 - top) * 2) // 3
        c.rect(cx - bw // 2 + sway, 26, bw, 1, k["trim"])
        if v == "front":
            c.px(cx - 2, hip + 2, k["star"]); c.px(cx + 2, hip + 4, k["star"]); c.px(cx - 1, hip + 6, k["star"])
    if layer == "body":
        # 흰 어깨 망토(금 테) · 가슴 보석 · 수정 지팡이
        if v in ("front", "back"):
            c.rect(tx - 1, ty, tw + 2, 3, k["cape"]); c.rect(tx - 1, ty + 3, tw + 2, 1, k["capeD"]); c.px(tx - 1, ty + 3, k["trim"]); c.px(tx + tw, ty + 3, k["trim"])
            if v == "front": c.px(cx, ty + 2, k["gem"]); c.px(cx - 1, ty + 2, k["trim"])
            c.rect(tx if v == "front" else tx + 1, hip - 2, tw - (0 if v == "front" else 2), 1, k["trim"])
        else:
            c.rect(cx - 4, ty, 8, 3, k["cape"]); c.rect(cx - 4, ty + 3, 8, 1, k["capeD"])
        if not g["cast"] or v != "front":
            sx = tx - 3 if v == "front" else tx + tw + 2 if v == "back" else cx + 3
            c.rect(sx, ty - 5, 1, 26 - ty + 5, k["staff"])
            c.px(sx, ty - 7, k["gem"]); c.px(sx - 1, ty - 6, k["gem"]); c.px(sx + 1, ty - 6, k["gem"]); c.px(sx, ty - 6, k["star"]); c.px(sx, ty - 5, k["trim"])
        else:
            # 공격: 뻗은 손끝에 별빛
            c.px(tx + tw + 6, ty, k["star"]); c.px(tx + tw + 7, ty + 1, k["gem"]); c.px(tx + tw + 6, ty + 2, k["star"])
    if layer == "hair":
        if v == "back":
            c.rect(hx0 - 1, hy, hw + 2, hh + 8, k["hair"]); c.rect(hx0, hy + hh + 5, hw, 3, k["hairD"])
            for x in (hx0 + 1, hx0 + 4, hx0 + 7): c.px(x, hy + 2, k["hairL"])
        elif v == "front":
            c.rect(hx0, hy, hw, 3, k["hair"]); c.px(hx0 + 2, hy + 3, k["hair"]); c.px(hx0 + hw - 3, hy + 3, k["hair"])
            c.rect(hx0 - 1, hy + 1, 2, hh + 5, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, hh + 5, k["hair"])
        else:
            c.rect(hx0, hy, hw, 3, k["hair"]); c.rect(hx0 - 1, hy + 1, 5, hh + 6, k["hair"])
    if layer == "hat":
        # 보석 이마띠 · 초승달 핀
        if v == "front":
            c.rect(hx0, hy + 2, hw, 1, k["trim"]); c.px(g["cx"], hy + 2, k["gem"]); c.px(g["cx"] - 1, hy + 2, k["gem"])
        elif v == "side":
            c.rect(hx0, hy + 2, hw, 1, k["trim"]); c.px(hx0 + hw - 1, hy + 2, k["gem"])
        else:
            c.rect(hx0, hy + 2, hw, 1, k["trim"])
        mx = hx0 + hw - 1 if v != "back" else hx0
        c.px(mx, hy, k["trim"]); c.px(mx + 1, hy + 1, k["trim"]); c.px(mx, hy + 1, k["star"])

DRIFTER = dict(
    skin=hx("#e8c0a0"), skinD=hx("#c09878"), eye=hx("#2a3a1a"), eyeL=hx("#6aa84a"), mouth=hx("#b86a5a"), outline=hx("#3a2e2a"), blush=None,
    top=hx("#e8e0c8"), arm=hx("#a87a4a"), legs=hx("#4a4a5a"), legsD=hx("#34343e"), shoe=hx("#5a3a20"),
    hair=hx("#7a4a2a"), hairD=hx("#4a2a14"), hairL=hx("#b0703a"),
    jacket=hx("#a87a4a"), jacketD=hx("#7a5432"), scarf=hx("#2aa8a0"), scarfD=hx("#1a7a74"), belt=hx("#4a2e18"), buckle=hx("#e8c060"), strap=hx("#6a4a2a"),
)

def drifter_deco(c, layer, g):
    k = g["k"]
    v, hx0, hy, hw, hh = g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    tx, ty, tw, th, cx, hip = g["tx"], g["ty"], g["tw"], g["th"], g["cx"], g["hip"]
    flap = (0, 1, 0, -1)[g["step"]]
    if layer == "legs":
        # 부츠 (발목 위 두 줄)
        if v in ("front", "back"):
            for lx in (cx - tw // 2 + 1, cx + tw // 2 - 3): c.rect(lx, 25, 2, 2, k["shoe"])
        else:
            c.rect(cx - 2, 25, 4, 2, k["shoe"])
    if layer == "body":
        if v in ("front", "back"):
            # 열린 가죽 재킷 (가운데 셔츠) · 허리띠 · 주머니
            c.rect(tx, ty, tw, th, k["jacket"])
            if v == "front":
                c.rect(cx - 1, ty + 1, 2, th - 1, k["top"]); c.px(cx - 2, ty + 1, k["jacketD"]); c.px(cx + 1, ty + 1, k["jacketD"])
                # 화살통 끈 (어깨에서 허리로)
                c.line(tx, ty + 1, tx + tw - 1, hip - 2, k["strap"])
            else:
                c.rect(tx + 1, ty + 1, tw - 2, th - 2, k["jacketD"])
                # 등의 화살통 (깃 세 개)
                c.rect(tx + tw - 3, ty - 2, 2, th + 1, k["strap"]); c.px(tx + tw - 3, ty - 3, hx("#e8e8e0")); c.px(tx + tw - 2, ty - 4, hx("#d83a3a"))
            c.rect(tx, hip - 1, tw, 1, k["belt"]); c.px(cx, hip - 1, k["buckle"])
            c.rect(tx + tw - 2, hip, 2, 2, k["belt"])
            # 목도리: 목에 두르고 끝이 바람에 날림
            c.rect(tx, ty, tw, 2, k["scarf"]); c.rect(tx + 1, ty + 1, tw - 2, 1, k["scarfD"])
            if v == "front": c.rect(tx + 1, ty + 2, 2, 3 + flap, k["scarf"])
            else: c.rect(cx - 1, ty + 2, 2, 4 + flap, k["scarf"]); c.px(cx - 1, ty + 6 + flap, k["scarfD"])
        else:
            c.rect(cx - 3, ty, 6, th, k["jacket"]); c.rect(cx - 3, hip - 1, 6, 1, k["belt"])
            c.rect(cx - 3, ty, 6, 2, k["scarf"])
            # 뒤로 날리는 목도리 끝
            c.rect(cx - 6, ty + 1 + flap, 3, 1, k["scarf"]); c.rect(cx - 8, ty + 2 + flap, 2, 1, k["scarfD"])
            c.rect(cx - 5, ty - 1, 2, th, k["strap"]); c.px(cx - 5, ty - 2, hx("#d83a3a"))
    if layer == "hair":
        # 헝클어진 짧은 머리 (삐친 머리카락)
        c.rect(hx0, hy, hw, 3, k["hair"])
        if v == "back":
            c.rect(hx0, hy, hw, hh - 1, k["hair"]); c.rect(hx0 + 1, hy + hh - 2, hw - 2, 1, k["hairD"])
        elif v == "front":
            c.rect(hx0 - 1, hy + 1, 2, 4, k["hair"]); c.rect(hx0 + hw - 1, hy + 1, 2, 4, k["hair"])
            c.px(hx0 + 3, hy + 3, k["hair"]); c.px(hx0 + 4, hy + 3, k["hair"]); c.px(hx0 + 7, hy + 3, k["hair"])
        else:
            c.rect(hx0 - 1, hy + 1, 5, 5, k["hair"])
        for x in (hx0 + 1, hx0 + 4, hx0 + 8): c.px(x, hy - 1, k["hair"])
        c.px(hx0 + 6, hy - 2, k["hairL"])

GEO = {
    "mage": dict(head=(10, 9), torso=(8, 7), leg=8),
    "drifter": dict(head=(10, 9), torso=(8, 8), leg=8),
}

def main():
    save_sheet("mage", lambda r, col: person(MAGE, r, col, GEO["mage"], mage_deco))
    save_sheet("drifter", lambda r, col: person(DRIFTER, r, col, GEO["drifter"], drifter_deco))

if __name__ == "__main__":
    main()
