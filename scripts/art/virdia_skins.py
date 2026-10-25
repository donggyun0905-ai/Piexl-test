# 시즌 2 비르디아 여섯 명의 테마 스킨 9개 (python3 scripts/art/virdia_skins.py) → apps/client/public/sprites/skins/{캐릭터}_{테마}.png
# 기본 그림(virdia_sprites)의 옷 색을 테마에 맞게 바꾸고 머리에 테마 소품(산타 모자·마녀 모자·학생모·조바위·머리띠·꽃핀·쪽머리·카우보이 모자·고글 등)을 씌움
# swap(성별 바꾸기): 여자 캐릭터는 짧은 머리의 남자, 장로는 쪽 찐 흰머리 할머니
from s2_common import hx, person, save_sheet
import virdia_sprites as V
from virdia_summer import SUMMER_EXTRA

def P(**kw):
    return {k: hx(v) for k, v in kw.items()}

# ── 머리 소품 (g: 머리 자리 · a: 주색 · b: 보조색) ──
def hat(c, kind, g, a, b):
    v, x0, y0, w, h, cx = g["view"], g["hx"], g["hy"], g["hw"], g["hh"], g["cx"]
    side = v == "side"
    if kind == "santa":
        c.rect(x0 - 1, y0 - 1, w + 2, 2, b)
        for i in range(4): c.rect(x0 + i, y0 - 2 - i, w - i * 2, 1, a)
        tip = x0 + w + 1 if v != "back" else x0 - 2
        c.px(tip - 1, y0 - 5, a); c.px(tip, y0 - 4, b); c.px(tip + 1, y0 - 4, b)
    elif kind == "witch":
        c.rect(x0 - 3, y0, w + 6, 1, a)
        c.rect(x0, y0 - 1, w, 1, b)
        for i in range(5): c.rect(x0 + 1 + i * 0.6, y0 - 2 - i, max(1, w - 2 - i * 1.4), 1, a)
        c.px(cx + 2, y0 - 7, a); c.px(cx + 3, y0 - 7, a)
    elif kind == "cap":
        c.rect(x0, y0 - 1, w, 3, a); c.rect(x0 + 1, y0 - 2, w - 2, 1, a); c.px(cx, y0 - 1, b)
        if v == "front": c.rect(x0 + 1, y0 + 2, w - 2, 1, b)
        elif side: c.rect(x0 + w - 1, y0 + 1, 4, 1, b)
    elif kind == "mortar":
        c.rect(x0, y0, w, 2, a); c.rect(x0 - 2, y0 - 1, w + 4, 1, a); c.px(x0 + w + 1, y0, b); c.px(x0 + w + 1, y0 + 1, b); c.px(x0 + w + 1, y0 + 2, b)
    elif kind == "crown":
        c.rect(x0 + 1, y0 - 1, w - 2, 2, a)
        for x in range(x0 + 1, x0 + w - 1, 2): c.px(x, y0 - 2, a)
        c.px(cx, y0 - 1, b)
    elif kind == "jobawi":
        # 조바위: 머리를 감싼 검은 쓰개 + 앞의 붉은·금 술
        c.rect(x0, y0, w, 2, a); c.rect(x0 - 1, y0 + 1, 1, 3, a); c.rect(x0 + w, y0 + 1, 1, 3, a)
        if v != "back": c.px(cx, y0 + 2, b); c.px(cx, y0 + 3, hx("#ffd040"))
        else: c.px(cx, y0 + 2, b); c.px(cx, y0 + 4, b)
    elif kind == "gat":
        # 갓: 넓은 검은 테 + 높은 원통
        c.rect(x0 - 3, y0, w + 6, 1, a); c.rect(x0 + 2, y0 - 4, w - 4, 4, a); c.rect(x0 + 2, y0 - 1, w - 4, 1, b)
    elif kind == "headband":
        c.rect(x0 - 1, y0 + 1, w + 2, 1, a)
        if v == "front": c.px(cx, y0 + 1, b)
        tie = x0 - 2 if v != "back" else cx
        c.px(tie, y0 + 2, a); c.px(tie - 1, y0 + 3, a)
    elif kind == "flower":
        fx = x0 + w - 1 if v != "back" else x0
        for dx, dy in ((0, -1), (-1, 0), (1, 0), (0, 1)): c.px(fx + dx, y0 + 1 + dy, a)
        c.px(fx, y0 + 1, b); c.px(fx + 1, y0 + 3, hx("#5ac84a"))
    elif kind == "buns":
        for bx in ((x0, x0 + w - 3) if v != "side" else (x0,)): c.rect(bx, y0 - 2, 3, 3, a); c.px(bx + 1, y0 - 3, a)
        c.px(x0 + 1, y0 - 1, b); c.px(x0 + w - 2, y0 - 1, b)
    elif kind == "cowboy":
        c.rect(x0 - 3, y0, w + 6, 1, a); c.px(x0 - 3, y0 - 1, a); c.px(x0 + w + 2, y0 - 1, a)
        c.rect(x0 + 1, y0 - 3, w - 2, 3, a); c.rect(x0 + 1, y0 - 1, w - 2, 1, b); c.px(cx, y0 - 3, b)
    elif kind == "goggles":
        c.rect(x0 - 1, y0 + 1, w + 2, 1, b)
        if v == "front":
            for gx in (x0 + 1, x0 + w - 4): c.rect(gx, y0, 3, 2, a)
        elif side: c.rect(x0 + w - 3, y0, 3, 2, a)
    elif kind == "sunhat":
        c.rect(x0 - 3, y0 + 1, w + 6, 1, a); c.rect(x0, y0 - 2, w, 3, a); c.rect(x0, y0, w, 1, b)
    elif kind == "skullcap":
        c.rect(x0 + 1, y0 - 1, w - 2, 2, a); c.px(cx, y0 - 2, b)
    elif kind == "bun":
        # 할머니 쪽머리 · 비녀
        bx = cx - 2 if v != "side" else x0 - 1
        c.rect(bx, y0 - 2 if v == "back" else y0 - 1, 4, 3, a); c.px(bx - 1, y0, b); c.px(bx + 4, y0, b)

# ── 머리 모양 바꾸기 (swap) ──
def wrap(deco, theme):
    hair_keys = ("hair", "hairD", "hairL")
    def d(c, layer, g):
        k = g["k"]
        cols = {k[x] for x in hair_keys if x in k}
        before = dict(c.p)
        deco(c, layer, g)
        if theme.get("short") and layer in ("back_hair", "hair"):
            # 짧은 머리: 머리 아래로 늘어진 머리카락을 지우고 원래 있던 그림으로 되돌림
            cut = g["hy"] + g["hh"] - 1
            for (x, y), col in list(c.p.items()):
                if y > cut and col in cols:
                    if (x, y) in before: c.p[(x, y)] = before[(x, y)]
                    else: del c.p[(x, y)]
        if theme.get("nobeard") and layer == "hair":
            # 할머니: 수염을 지우고 (얼굴은 살색, 턱 아래는 지움) 하얀 머리를 귀 옆으로
            beard = {k["beard"], k["beardD"]}
            face_bottom = g["hy"] + g["hh"] - 1
            for (x, y), col in list(c.p.items()):
                if col in beard and before.get((x, y)) != col:
                    if y > face_bottom:
                        if (x, y) in before: c.p[(x, y)] = before[(x, y)]
                        else: del c.p[(x, y)]
                    elif y >= g["hy"] + g["hh"] // 2 and g["view"] != "back": c.p[(x, y)] = before.get((x, y), k["skin"])
            x0, y0, w = g["hx"], g["hy"], g["hw"]
            c.rect(x0, y0, w, 2, k["beard"])
            if g["view"] == "front": c.px(g["cx"], y0 + g["hh"] - 2, hx("#d86a6a"))
        if theme.get("extra"):
            theme["extra"](c, layer, g, before)
        if layer == "hat" and theme.get("hat"):
            hat(c, theme["hat"], g, theme["a"], theme["b"])
    return d

# ── 캐릭터마다 테마 (색 바꾸기 · 소품) ──
H = lambda kind, a, b: dict(hat=kind, a=hx(a), b=hx(b))
SANTA = H("santa", "#d8303a", "#ffffff")
WITCH = H("witch", "#2a2032", "#f28a2a")
JOB = H("jobawi", "#2a2028", "#e84a6a")
HB = H("headband", "#f4f4f4", "#e83a3a")
FLOWER = H("flower", "#ff8ab0", "#ffd040")
BUNS = H("buns", "#2a2028", "#e8b030")
COWBOY = H("cowboy", "#8a5a32", "#5a3a20")
GOG = H("goggles", "#8ae8ff", "#2a6a8a")
SUN = H("sunhat", "#f2d898", "#e86a8a")

SKINS = {
    "idra": {
        "summer": (P(outline="#1e9ad8", dress="#fffaf0", dressD="#ffd8e8", top="#fffaf0", bloom="#ff8ab0", gold="#ffd040"), dict(SUN, extra=SUMMER_EXTRA["idra"])),
        "swim": (P(dress="#5ac8f0", dressD="#3a98c8", bloom="#ff6a8a"), SUN),
        "xmas": (P(dress="#d8303a", dressD="#a81e26", gold="#ffffff"), SANTA),
        "halloween": (P(dress="#6a3a9a", dressD="#4a2470", bloom="#f28a2a"), WITCH),
        "school": (P(dress="#2a3a6a", dressD="#1a2448", top="#f4f4f8", bloom="#d83a4a"), H("cap", "#2a3a6a", "#f2c040")),
        "newyear": (P(dress="#f2a0c8", dressD="#d8709a", gold="#ffe080", bloom="#3a6ad8"), JOB),
        "japan": (P(dress="#e85a7a", dressD="#b83a5a", gold="#ffd040"), FLOWER),
        "china": (P(dress="#d8303a", dressD="#a81e26", gold="#ffd040", bloom="#ffd040"), BUNS),
        "usa": (P(dress="#3a5aa8", dressD="#2a3a7a", bloom="#d8303a", gold="#f4f4f4"), COWBOY),
        "swap": (P(dress="#7ab850", dressD="#4a8a3a", bloom="#5ac84a", gold="#2a8a3a"), dict(short=True)),
    },
    "byeonhui": {
        "summer": (P(outline="#1e9ad8", fur="#ffd040", paint="#ff8a6a"), dict(extra=SUMMER_EXTRA["byeonhui"])),
        "swim": (P(crop="#3ac8e8", cropD="#2a98b8", shorts="#2a98b8", fur="#f2d070"), GOG),
        "xmas": (P(crop="#d8303a", cropD="#ffffff", shorts="#d8303a", fur="#ffffff"), SANTA),
        "halloween": (P(crop="#2a2032", cropD="#f28a2a", shorts="#4a2a6a", fur="#f28a2a", paint="#9a4ad8"), WITCH),
        "school": (P(top="#f4f4f8", crop="#2a3458", cropD="#f2c040", shorts="#2a3458", fur="#2a3458"), H("cap", "#2a3458", "#f2c040")),
        "newyear": (P(top="#f2d070", crop="#e84a6a", cropD="#ffd040", shorts="#3a6ad8", fur="#ffffff"), JOB),
        "japan": (P(top="#e8e8f0", crop="#2a3a6a", cropD="#e83a3a", shorts="#2a3a6a", fur="#e83a3a"), HB),
        "china": (P(crop="#c8202a", cropD="#e8b030", shorts="#c8202a", fur="#e8b030"), BUNS),
        "usa": (P(crop="#d8303a", cropD="#f4f4f4", shorts="#3a5aa8", fur="#8a5a32"), COWBOY),
        "swap": (P(crop="#5a4a2a", cropD="#3a2a14", hair="#6a2a14"), dict(short=True)),
    },
    "fly": {
        "summer": (P(outline="#1e9ad8", crop="#1e1e26", legs="#f0d0b8", legsD="#c8a890", shoe="#c8a890"), dict(extra=SUMMER_EXTRA["fly"])),
        "swim": (P(crop="#ff8ac8", cropL="#ffd0e8", legs="#2a8ac8", legsD="#1e6a9a"), GOG),
        "xmas": (P(crop="#d8303a", cropL="#ffffff", legs="#2a6a3a", legsD="#1e4a2a"), SANTA),
        "halloween": (P(crop="#4a2a6a", cropL="#f28a2a", legs="#2a2032", legsD="#1a1420"), WITCH),
        "school": (P(top="#f4f4f8", crop="#2a3458", cropL="#f2c040", legs="#2a3458", legsD="#1a2038"), H("cap", "#2a3458", "#f2c040")),
        "newyear": (P(top="#ffe080", crop="#e84a6a", cropL="#ffd040", legs="#3a6ad8", legsD="#2a4aa8"), JOB),
        "japan": (P(crop="#e8e8f0", cropL="#e83a3a", legs="#2a3a6a", legsD="#1a2440"), HB),
        "china": (P(crop="#c8202a", cropL="#e8b030", legs="#2a2028", legsD="#1a1418"), BUNS),
        "usa": (P(crop="#f4f4f4", cropL="#d8303a", legs="#3a5aa8", legsD="#2a3a7a"), COWBOY),
        "swap": (P(top="#1e1e26", hair="#1a6a88"), dict(short=True)),
    },
    "elder": {
        "summer": (P(outline="#1e9ad8", top="#e0b898", arm="#e0b898", legs="#e0b898", legsD="#b88a6a", shoe="#c89868"), dict(SUN, extra=SUMMER_EXTRA["elder"])),
        "swim": (P(top="#f2a03a", arm="#e0b898", robeL="#ffd070", legs="#3ac8e8", legsD="#2a98b8", sash="#3ac8e8"), SUN),
        "xmas": (P(top="#d8303a", arm="#d8303a", robeL="#ffffff", sash="#ffffff", legs="#a81e26", legsD="#8a1a20"), SANTA),
        "halloween": (P(top="#2a2032", arm="#2a2032", robeL="#6a3a9a", sash="#f28a2a", gem="#f28a2a"), WITCH),
        "school": (P(top="#2a3458", arm="#2a3458", robeL="#f4f4f4", sash="#c8a040", legs="#2a3458"), H("mortar", "#1a1a24", "#f2c040")),
        "newyear": (P(top="#f4f4f0", arm="#f4f4f0", robeL="#3a6ad8", sash="#e84a6a", legs="#e8e8e0"), H("gat", "#1a1a1e", "#5a4a3a")),
        "japan": (P(top="#2a3a6a", arm="#2a3a6a", robeL="#e8e8f0", sash="#e83a3a"), HB),
        "china": (P(top="#a81e26", arm="#a81e26", robeL="#e8b030", sash="#e8b030", legs="#6a1218"), H("skullcap", "#2a2028", "#e8b030")),
        "usa": (P(top="#8a5a32", arm="#8a5a32", robeL="#f4f4f4", legs="#3a5aa8", legsD="#2a3a7a", sash="#d8303a"), COWBOY),
        "swap": (P(top="#8a6a9a", arm="#8a6a9a", robeL="#c8a8d8", sash="#e8a0c0"), dict(nobeard=True, hat="bun", a=hx("#e8e8e4"), b=hx("#c8a040"))),
    },
    "ren": {
        "summer": (P(outline="#1e9ad8", robe="#f8fcf8", robeD="#d8e8dc", robeL="#ffffff", trim="#5ac84a", hood="#6a4a2a", top="#f8fcf8", arm="#f8fcf8", sash="#ffd040", legs="#e8c0a0", legsD="#c09878", shoe="#c09878"), dict(SUN, extra=SUMMER_EXTRA["ren"])),
        "swim": (P(robe="#3ac8e8", robeD="#2a98b8", robeL="#7ad8f8", trim="#f2d070", hood="#2aa8d8", top="#3ac8e8", arm="#3ac8e8"), GOG),
        "xmas": (P(robe="#d8303a", robeD="#a81e26", robeL="#e8484a", trim="#ffffff", hood="#c82a36", top="#d8303a", arm="#d8303a", sash="#2a6a3a"), SANTA),
        "halloween": (P(robe="#2a2032", robeD="#1a1420", robeL="#4a2a6a", trim="#f28a2a", hood="#241c2c", top="#2a2032", arm="#2a2032", sash="#f28a2a"), WITCH),
        "school": (P(robe="#2a3458", robeD="#1a2038", robeL="#4a5a88", trim="#f2c040", hood="#24305a", top="#2a3458", arm="#2a3458", sash="#d83a4a"), H("cap", "#2a3458", "#f2c040")),
        "newyear": (P(robe="#f2a0c8", robeD="#d8709a", robeL="#ffd0e4", trim="#ffd040", hood="#e890b8", top="#f2a0c8", arm="#f2a0c8", sash="#3a6ad8"), JOB),
        "japan": (P(robe="#2a3a6a", robeD="#1a2440", robeL="#4a5a9a", trim="#e83a3a", hood="#24305a", top="#2a3a6a", arm="#2a3a6a", sash="#e83a3a"), FLOWER),
        "china": (P(robe="#a81e26", robeD="#6a1218", robeL="#d8303a", trim="#e8b030", hood="#8a1a20", top="#a81e26", arm="#a81e26", sash="#e8b030"), H("crown", "#e8b030", "#d8303a")),
        "usa": (P(robe="#3a5aa8", robeD="#2a3a7a", robeL="#5a7ac8", trim="#d8303a", hood="#34509a", top="#3a5aa8", arm="#3a5aa8", sash="#f4f4f4"), COWBOY),
        "swap": (P(robe="#6a5232", robeD="#4a3a22", robeL="#8a7048", trim="#c8a040", hood="#5a4628", top="#6a5232", arm="#6a5232", hair="#3a2a18", eyeL="#c86a2a"), dict(short=True)),
    },
    "spiritist": {
        "summer": (P(outline="#1e9ad8", top="#ffffff", arm="#f6dcc8", navy="#5ab8f0", navyL="#8ad8ff", ribbon="#ff6a8a", sock="#f6dcc8", shoe="#e8c890"), dict(SUN, extra=SUMMER_EXTRA["spiritist"])),
        "swim": (P(top="#f4f4f8", arm="#f6dcc8", navy="#3ac8e8", navyL="#7ad8f8", ribbon="#ff6a8a", sock="#f6dcc8"), SUN),
        "xmas": (P(top="#d8303a", arm="#d8303a", navy="#ffffff", navyL="#e8e8e8", ribbon="#2a6a3a", sock="#d8303a"), SANTA),
        "halloween": (P(top="#2a2032", arm="#2a2032", navy="#6a3a9a", navyL="#f28a2a", ribbon="#f28a2a"), WITCH),
        "school": (P(top="#5a3a2a", arm="#5a3a2a", navy="#8a2a3a", navyL="#c84a5a", ribbon="#2a3a6a"), H("cap", "#5a3a2a", "#f2c040")),
        "newyear": (P(top="#ffe080", arm="#ffe080", navy="#e84a6a", navyL="#ff8aa8", ribbon="#3a6ad8", sock="#f4f4f4"), JOB),
        "japan": (P(top="#f4e8f0", arm="#f4e8f0", navy="#2a3a6a", navyL="#e83a3a", ribbon="#e83a3a"), FLOWER),
        "china": (P(top="#c8202a", arm="#c8202a", navy="#e8b030", navyL="#ffd860", ribbon="#e8b030"), BUNS),
        "usa": (P(top="#f4f4f4", arm="#f4f4f4", navy="#3a5aa8", navyL="#2a3a7a", ribbon="#d8303a"), COWBOY),
        "swap": (P(legs="#2a3a6a", legsD="#1a2448", sock="#2a3a6a", ribbon="#2a3a6a", navyL="#2a3a6a"), dict(short=True)),
    },
}

BASES = {
    "idra": (V.IDRA, V.GEO["idra"], V.idra_deco),
    "byeonhui": (V.BYEON, V.GEO["byeonhui"], V.byeon_deco),
    "fly": (V.FLY, V.GEO["fly"], V.fly_deco),
    "elder": (V.ELDER, V.GEO["elder"], V.elder_deco),
    "ren": (V.REN, V.GEO["ren"], V.ren_deco),
    "spiritist": (V.SPIRITIST, V.GEO["spiritist"], V.spiritist_deco),
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
