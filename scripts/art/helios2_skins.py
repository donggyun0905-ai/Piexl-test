# 시즌 2 헬리오스 다섯 명의 테마 스킨 9개 + 여름 한정 (python3 scripts/art/helios2_skins.py) → apps/client/public/sprites/skins/{캐릭터}_{테마}.png
# 기본 그림(helios2_sprites)의 옷 색을 테마에 맞게 바꾸고 소품을 얹음 (virdia_skins의 wrap·hat 같이 씀)
# 역병의사: 새부리 가면과 챙 넓은 모자는 그대로 두고 색만 · 학살자·사멸: 모자 없이 옷 색과 머리 장식만 (예쁘게)
# swap(성별 바꾸기): 역병의사·이터·묵인은 긴 머리의 여자, 학살자·사멸은 짧은 머리의 남자
from s2_common import hx, person, save_sheet
import helios2_sprites as Hs
from virdia_skins import P, H, wrap, SANTA, WITCH, JOB, HB, FLOWER, COWBOY, GOG
from helios2_summer import SUMMER, SUMMER_COLORS

def long_hair(col, colD):
    """긴 머리 덧그림 (성별 바꾸기): 머리 뒤로 어깨 아래까지"""
    def extra(c, layer, g, before):
        if layer != "back_hair": return
        x0, y0, w, hh = g["hx"], g["hy"], g["hw"], g["hh"]
        c.rect(x0 - 1, y0 + 2, w + 2, hh + 5, col); c.rect(x0, y0 + hh + 6, w, 1, colD)
    return extra

NOHAT = dict()
CAP = H("cap", "#2a3458", "#f2c040")

SKINS = {
    "plague": {
        "swim": (P(coat="#3ac8e8", coatL="#7ad8f8", top="#3ac8e8", arm="#3ac8e8", hair="#e8c878", hairD="#c8a050", brim="#e8c878", belt="#ff6a8a"), NOHAT),
        "xmas": (P(coat="#c8202a", coatL="#ffffff", top="#c8202a", arm="#c8202a", hair="#c8202a", brim="#ffffff", belt="#2a6a3a"), NOHAT),
        "halloween": (P(coat="#4a2a6a", coatL="#f28a2a", top="#4a2a6a", arm="#4a2a6a", hair="#2a2032", brim="#f28a2a", beak="#f2a03a", beakD="#c86a1a", eyeL="#ffe040"), NOHAT),
        "school": (P(coat="#2a3458", coatL="#f4f4f8", top="#2a3458", arm="#2a3458", hair="#2a3458", brim="#f2c040", belt="#d83a4a"), NOHAT),
        "newyear": (P(coat="#f2a0c8", coatL="#ffd0e4", top="#f2a0c8", arm="#f2a0c8", hair="#2a2028", brim="#e84a6a", belt="#3a6ad8"), NOHAT),
        "japan": (P(coat="#2a3a6a", coatL="#e8e8f0", top="#2a3a6a", arm="#2a3a6a", hair="#1a1a24", brim="#e83a3a", belt="#e83a3a"), NOHAT),
        "china": (P(coat="#a81e26", coatL="#e8b030", top="#a81e26", arm="#a81e26", hair="#2a2028", brim="#e8b030", belt="#e8b030"), NOHAT),
        "usa": (P(coat="#8a5a32", coatL="#f4f4f4", top="#8a5a32", arm="#8a5a32", hair="#5a3a20", brim="#8a5a32", belt="#d8303a", legs="#3a5aa8", legsD="#2a3a7a"), NOHAT),
        "swap": (P(coat="#5a2a3a", coatL="#8a4a5a", top="#5a2a3a", arm="#5a2a3a", belt="#c8a040"), dict(extra=long_hair(hx("#d8c8a8"), hx("#a8987a")))),
    },
    "slayer": {
        "swim": (P(top="#2a98b8", trim="#ffffff", skirt="#3ac8e8", lace="#ffffff"), NOHAT),
        "xmas": (P(top="#c8202a", trim="#ffffff", skirt="#c8202a", lace="#2a6a3a", legs="#f4f4f4", legsD="#d8d8e0"), NOHAT),
        "halloween": (P(top="#2a2032", trim="#f28a2a", skirt="#4a2a6a", lace="#f28a2a", hair="#7a3aa8", hairD="#4a1a70", hairL="#b07ae0"), NOHAT),
        "school": (P(top="#2a3458", trim="#f4f4f8", skirt="#6a2a3a", lace="#d83a4a"), NOHAT),
        "newyear": (P(top="#f2a0c8", trim="#ffd040", skirt="#3a6ad8", lace="#e84a6a"), NOHAT),
        "japan": (P(top="#2a3a6a", trim="#e83a3a", skirt="#e8e8f0", lace="#e83a3a"), FLOWER),
        "china": (P(top="#c8202a", trim="#e8b030", skirt="#c8202a", lace="#e8b030", hair="#1a1424", hairD="#0e0a16", hairL="#3e3254"), NOHAT),
        "usa": (P(top="#3a5aa8", trim="#f4f4f4", skirt="#d8303a", lace="#f4f4f4", hair="#e8c060", hairD="#a8803a", hairL="#fff0a0"), NOHAT),
        "swap": (P(skirt="#1a0e14", trim="#a01828", hair="#6a1018", hairD="#3a0810"), dict(short=True)),
    },
    "eater": {
        "swim": (P(top="#1a5a8a", arm="#1a5a8a", legs="#1a5a8a", legsD="#123e60"), GOG),
        "xmas": (P(top="#c8202a", arm="#c8202a", legs="#2a6a3a", legsD="#1e4a2a", wisp="#ffffff"), SANTA),
        "halloween": (P(top="#4a2a6a", arm="#4a2a6a", wisp="#f28a2a", eye="#f28a2a"), WITCH),
        "school": (P(top="#2a3458", arm="#2a3458", legs="#2a3458"), CAP),
        "newyear": (P(top="#e84a6a", arm="#e84a6a", legs="#3a6ad8", wisp="#ffd040"), JOB),
        "japan": (P(top="#2a3a6a", arm="#2a3a6a", wisp="#e83a3a"), HB),
        "china": (P(top="#a81e26", arm="#a81e26", wisp="#e8b030"), H("skullcap", "#2a2028", "#e8b030")),
        "usa": (P(top="#3a5aa8", arm="#3a5aa8", legs="#3a5aa8", wisp="#d8303a"), COWBOY),
        "swap": (P(wisp="#6a2a8a"), dict(extra=long_hair(hx("#120e18"), hx("#2a0a3a")))),
    },
    "mukin": {
        "swim": (P(cloth="#3ac8e8", clothD="#2a98b8", legs="#2a98b8", legsD="#1e6a8a"), GOG),
        "xmas": (P(cloth="#c8202a", clothD="#8a1a20", plate="#2a6a3a", plateL="#4a9a5a", plateD="#1e4a2a", rivet="#ffffff"), SANTA),
        "halloween": (P(plate="#3a2a4a", plateL="#6a4a8a", plateD="#241a30", cloth="#f28a2a", clothD="#c86a1a"), WITCH),
        "school": (P(plate="#2a3458", plateL="#4a5a88", plateD="#1a2038", cloth="#d83a4a"), CAP),
        "newyear": (P(plate="#c8a040", plateL="#ffe080", plateD="#8a6a2a", cloth="#e84a6a"), H("gat", "#1a1a1e", "#5a4a3a")),
        "japan": (P(plate="#2a2a34", plateL="#4a4a5a", plateD="#16161e", cloth="#e83a3a"), HB),
        "china": (P(plate="#a81e26", plateL="#e8484a", plateD="#6a1218", cloth="#e8b030", clothD="#a8802a"), H("crown", "#e8b030", "#d8303a")),
        "usa": (P(plate="#3a5aa8", plateL="#5a7ac8", plateD="#2a3a7a", cloth="#d8303a"), COWBOY),
        "swap": (P(cloth="#5a2a6a", hair="#6a2a14"), dict(extra=long_hair(hx("#6a2a14"), hx("#4a1a0a")))),
    },
    "samyeol": {
        "swim": (P(dress="#3ac8e8", dressL="#7ad8f8", jade="#ffffff"), NOHAT),
        "xmas": (P(dress="#c8202a", dressL="#e8484a", jade="#ffffff", gold="#3a9a4a"), NOHAT),
        "halloween": (P(dress="#2a2032", dressL="#4a2a6a", jade="#f28a2a"), NOHAT),
        "school": (P(dress="#2a3458", dressL="#4a5a88", jade="#d83a4a", gold="#f4f4f8"), NOHAT),
        "newyear": (P(dress="#f2a0c8", dressL="#ffd0e4", jade="#3a6ad8"), NOHAT),
        "japan": (P(dress="#e85a7a", dressL="#ff8aa8", jade="#ffd040"), FLOWER),
        "china": (P(dress="#c8202a", dressL="#e8484a", jade="#e8b030"), NOHAT),
        "usa": (P(dress="#3a5aa8", dressL="#5a7ac8", jade="#d8303a", gold="#f4f4f4", hair="#e8c060", hairD="#a8803a", hairL="#fff0a0"), NOHAT),
        "swap": (P(dress="#2a1a4a", dressL="#4a3a6a"), dict(short=True)),
    },
}

BASES = {
    "plague": (Hs.PLAGUE, Hs.plague_deco),
    "slayer": (Hs.SLAYER, Hs.slayer_deco),
    "eater": (Hs.EATER, Hs.eater_deco),
    "mukin": (Hs.MUKIN, Hs.mukin_deco),
    "samyeol": (Hs.SAMYEOL, Hs.samyeol_deco),
}

def main():
    for name, themes in SKINS.items():
        themes = dict(themes, summer=(SUMMER_COLORS[name], dict(extra=SUMMER[name])))
        base, deco = BASES[name]
        geo = Hs.GEO[name]
        size = geo.get("size", 32)
        for th, (over, theme) in themes.items():
            k = dict(base); k.update(over)
            d = wrap(deco, theme)
            save_sheet(f"skins/{name}_{th}", lambda r, col, k=k, d=d: person(k, r, col, geo, d), size=size)
        print(name, "ok")

if __name__ == "__main__":
    main()
