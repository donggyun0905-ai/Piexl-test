# 마법사·떠돌이 새 그림의 테마 스킨 9개 + 한정 '백호' (python3 scripts/art/classic_skins.py) → apps/client/public/sprites/skins/{mage,drifter}_{테마}.png
# 옷 색을 테마에 맞게 바꾸고 머리 소품을 씌움 (소품·머리 모양 바꾸기는 virdia_skins와 같은 것을 씀)
# swap(성별 바꾸기): 마법사는 짧은 머리의 남자, 떠돌이는 긴 머리의 여자
# 한정 '범 풍류' 백호: 예전 한정 스킨 디자인 그대로 (금빛 갈색 테두리 · 마법사 흰 범 두건과 흰·남색·금 옷 · 떠돌이 금테 남색 두건과 흰·금 옷)
from s2_common import hx, person, save_sheet
from virdia_skins import H, P, BUNS, COWBOY, FLOWER, GOG, HB, JOB, SANTA, WITCH, wrap
import classic_sprites as S

def tiger_hood(c, layer, g, before):
    """마법사 백호(예전 한정 스킨 그대로): 머리를 덮는 흰 범 두건 · 회색 줄무늬 · 분홍 속 귀 두 개 · 앞에 붉은 매듭"""
    if layer != "hat": return
    v, x0, y0, w, cx = g["view"], g["hx"], g["hy"], g["hw"], g["cx"]
    white, stripe, pink, red = hx("#f8f6f0"), hx("#b2b1ac"), hx("#f6b0c0"), hx("#e83a3a")
    c.rect(x0 - 1, y0 - 1, w + 2, 4, white)
    c.rect(x0 - 1, y0 + 3, 1, 5, white); c.rect(x0 + w, y0 + 3, 1, 5, white)
    if v == "back": c.rect(x0 - 1, y0 + 3, w + 2, 6, white)
    for x in range(x0, x0 + w, 3): c.px(x, y0, stripe); c.px(x + 1, y0 + 1, stripe)
    # 크게 선 범 귀 (분홍 속)
    for ex in ((x0 - 1, x0 + w - 2) if v != "side" else (x0 + 1,)):
        c.rect(ex, y0 - 4, 3, 4, white); c.px(ex + 1, y0 - 5, white)
        if v != "back": c.px(ex + 1, y0 - 3, pink); c.px(ex + 1, y0 - 2, pink)
        c.px(ex, y0 - 4, stripe)
    if v == "front": c.px(cx, y0 + 1, stripe); c.px(cx - 1, y0 + 2, stripe)

def tiger_mage(c, layer, g, before):
    """마법사 백호: 흰 두건 + 가슴의 붉은 리본 매듭"""
    tiger_hood(c, layer, g, before)
    if layer == "body" and g["view"] == "front":
        cx, ty = g["cx"], g["ty"]
        red = hx("#e83a3a")
        c.px(cx, ty + 1, red); c.px(cx - 1, ty + 1, red); c.px(cx, ty + 2, red); c.px(cx, ty + 3, red)

def tiger_drifter(c, layer, g, before):
    """떠돌이 백호(예전 한정 스킨 그대로): 금테 두른 뾰족한 남색 두건 · 흰 옷 금장식"""
    if layer != "hat": return
    v, x0, y0, w, h, cx = g["view"], g["hx"], g["hy"], g["hw"], g["hh"], g["cx"]
    navy, navyD, gold = hx("#182753"), hx("#101a39"), hx("#e1be54")
    c.rect(x0 - 1, y0 - 1, w + 2, 3, navy)
    for i in range(3): c.rect(cx - 2 + i, y0 - 2 - i, 3 - i, 1, navy)
    c.px(cx, y0 - 5, gold)
    if v == "back":
        c.rect(x0 - 1, y0, w + 2, h + 1, navy); c.rect(x0, y0 + h - 1, w, 1, navyD)
    elif v == "front":
        c.rect(x0 - 1, y0 + 1, 2, h, navy); c.rect(x0 + w - 1, y0 + 1, 2, h, navy)
        c.rect(x0 + 1, y0 + 2, w - 2, 1, gold)
    else:
        c.rect(x0 - 1, y0 + 1, 5, h, navy); c.rect(x0 + 4, y0 + 2, w - 5, 1, gold)

def long_hair(c, layer, g, before):
    """떠돌이 성별 바꾸기: 허리까지 오는 긴 머리"""
    k, v, x0, y0, w, h = g["k"], g["view"], g["hx"], g["hy"], g["hw"], g["hh"]
    if layer == "back_hair" and v != "back": c.rect(x0 - 1, y0 + 3, w + 2, h + 5, k["hairD"])
    if layer == "hair":
        if v == "back": c.rect(x0 - 1, y0, w + 2, h + 7, k["hair"])
        elif v == "front": c.rect(x0 - 1, y0 + 1, 2, h + 4, k["hair"]); c.rect(x0 + w - 1, y0 + 1, 2, h + 4, k["hair"])
        else: c.rect(x0 - 1, y0 + 1, 4, h + 5, k["hair"])

SKINS = {
    "mage": {
        "tiger": (P(outline="#8a5a10", robe="#253176", robeD="#222d74", robeL="#4a5aa8", top="#f8f6f0", arm="#f8f6f0", legs="#253176", legsD="#222d74", cape="#253176", capeD="#ffd860", trim="#ffd860", gem="#ff5a3a", staff="#ffd860", star="#fff6c0", hair="#e8e4ee", hairD="#b2b1ac", hairL="#ffffff"), dict(extra=tiger_mage)),
        "swim": (P(robe="#3ac8e8", robeD="#2a98b8", robeL="#7ad8f8", top="#3ac8e8", arm="#f6dcc8", legs="#3ac8e8", legsD="#2a98b8", cape="#ffffff", trim="#ffd040"), GOG),
        "xmas": (P(robe="#d8303a", robeD="#a81e26", robeL="#e8484a", top="#d8303a", arm="#d8303a", legs="#d8303a", legsD="#a81e26", cape="#ffffff", trim="#2a8a3a"), SANTA),
        "halloween": (P(robe="#2a2032", robeD="#1a1420", robeL="#4a2a6a", top="#2a2032", arm="#2a2032", legs="#2a2032", legsD="#1a1420", cape="#6a3a9a", capeD="#4a2470", trim="#f28a2a", gem="#f28a2a"), WITCH),
        "school": (P(robe="#2a3458", robeD="#1a2038", robeL="#4a5a88", top="#2a3458", arm="#2a3458", legs="#2a3458", legsD="#1a2038", cape="#f4f4f8", trim="#d83a4a"), H("mortar", "#1a1a24", "#f2c040")),
        "newyear": (P(robe="#f2a0c8", robeD="#d8709a", robeL="#ffd0e4", top="#ffe080", arm="#ffe080", legs="#f2a0c8", legsD="#d8709a", cape="#3a6ad8", capeD="#2a4aa8", trim="#ffd040"), JOB),
        "japan": (P(robe="#e85a7a", robeD="#b83a5a", robeL="#ff8aa8", top="#e85a7a", arm="#e85a7a", legs="#e85a7a", legsD="#b83a5a", cape="#f4e8f0", trim="#2a3a6a"), FLOWER),
        "china": (P(robe="#c8202a", robeD="#8a1a20", robeL="#e8484a", top="#c8202a", arm="#c8202a", legs="#c8202a", legsD="#8a1a20", cape="#e8b030", capeD="#c89020", trim="#ffd860"), BUNS),
        "usa": (P(robe="#3a5aa8", robeD="#2a3a7a", robeL="#5a7ac8", top="#3a5aa8", arm="#3a5aa8", legs="#3a5aa8", legsD="#2a3a7a", cape="#f4f4f4", trim="#d8303a"), COWBOY),
        "swap": (P(robe="#3a4a3a", robeD="#24302a", robeL="#5a6a50", top="#3a4a3a", arm="#3a4a3a", legs="#3a4a3a", legsD="#24302a", hair="#6a6a8a", hairD="#4a4a6a", hairL="#9a9ab8"), dict(short=True)),
    },
    "drifter": {
        "tiger": (P(outline="#8a5a10", jacket="#f8f6f1", jacketD="#ede2bc", arm="#f8f6f1", top="#ede2bc", scarf="#182753", scarfD="#101a39", legs="#182753", legsD="#101a39", belt="#e1be54", buckle="#ffd860", strap="#e1be54", shoe="#2e3d69", hair="#182753", hairD="#101a39", hairL="#46537a"), dict(extra=tiger_drifter)),
        "swim": (P(jacket="#ffb040", jacketD="#e08a20", arm="#e8c0a0", top="#ffffff", scarf="#3ac8e8", scarfD="#2a98b8", legs="#2a8ac8", legsD="#1e6a9a", shoe="#e8c890"), GOG),
        "xmas": (P(jacket="#d8303a", jacketD="#a81e26", arm="#d8303a", top="#ffffff", scarf="#2a8a3a", scarfD="#1e6a2a", legs="#2a2a34", legsD="#1a1a22"), SANTA),
        "halloween": (P(jacket="#2a2032", jacketD="#1a1420", arm="#2a2032", top="#f28a2a", scarf="#6a3a9a", scarfD="#4a2470", legs="#2a2032", legsD="#1a1420"), WITCH),
        "school": (P(jacket="#2a3458", jacketD="#1a2038", arm="#2a3458", top="#f4f4f8", scarf="#d83a4a", scarfD="#a82a3a", legs="#2a3458", legsD="#1a2038", shoe="#1a1a24"), H("cap", "#2a3458", "#f2c040")),
        "newyear": (P(jacket="#3a6ad8", jacketD="#2a4aa8", arm="#3a6ad8", top="#ffe080", scarf="#e84a6a", scarfD="#b83050", legs="#f4f4f0", legsD="#d8d8d0"), H("gat", "#1a1a1e", "#5a4a3a")),
        "japan": (P(jacket="#2a3a6a", jacketD="#1a2440", arm="#2a3a6a", top="#e8e8f0", scarf="#e83a3a", scarfD="#b82a2a", legs="#2a3a6a", legsD="#1a2440"), HB),
        "china": (P(jacket="#c8202a", jacketD="#8a1a20", arm="#c8202a", top="#e8b030", scarf="#e8b030", scarfD="#c89020", legs="#2a2028", legsD="#1a1418"), H("skullcap", "#2a2028", "#e8b030")),
        "usa": (P(jacket="#8a5a32", jacketD="#5a3a20", arm="#8a5a32", top="#3a5aa8", scarf="#d8303a", scarfD="#a81e26", legs="#3a5aa8", legsD="#2a3a7a"), COWBOY),
        "swap": (P(jacket="#6a8a4a", jacketD="#4a6a32", arm="#6a8a4a", scarf="#e88aa8", scarfD="#c86a88", hair="#a85a2a", hairD="#7a3a18", hairL="#d88a4a", blush="#f09696"), dict(extra=long_hair)),
    },
}

BASES = {
    "mage": (S.MAGE, S.GEO["mage"], S.mage_deco),
    "drifter": (S.DRIFTER, S.GEO["drifter"], S.drifter_deco),
}

def main():
    for name, themes in SKINS.items():
        base, geo, deco = BASES[name]
        for th, (over, theme) in themes.items():
            k = dict(base); k.update(over)
            d = wrap(deco, theme)
            save_sheet(f"skins/{name}_{th}", lambda r, col, k=k, d=d: person(k, r, col, geo, d))

if __name__ == "__main__":
    main()
