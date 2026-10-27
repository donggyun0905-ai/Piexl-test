# 시즌 2 아스칼론 캐릭터의 테마 스킨 9개 + 여름 한정 (python3 scripts/art/ascalon_skins.py) → apps/client/public/sprites/skins/{캐릭터}_{테마}.png
# 기본 그림(ascalon_sprites)의 옷 색을 테마에 맞게 바꾸고 소품을 얹음 (virdia_skins의 wrap·hat 같이 씀)
# swap(성별 바꾸기): 추적자·잊혀진 자는 짧은 머리의 남자, 잔영·방랑객은 긴 머리의 여자
# 방랑객은 삿갓을 늘 쓰므로 테마 모자 대신 삿갓·옷 색을 테마에 맞춤
from s2_common import hx, person, save_sheet
from helios2_skins import long_hair
import ascalon_sprites as As
from virdia_skins import P, H, wrap, SANTA, WITCH, JOB, HB, BUNS, COWBOY, GOG, FLOWER
from ascalon_summer import SUMMER, SUMMER_COLORS

SKINS = {
    "tracker": {
        "swim": (P(top="#3ac8e8", arm="#3ac8e8", cloak="#ffffff", cloakD="#c8e8f4", belt="#ffb040", legs="#2a8ac8", legsD="#1e6a9a"), GOG),
        "xmas": (P(top="#c8202a", arm="#c8202a", cloak="#2a6a3a", cloakD="#1e4a2a", belt="#f4f4f8", ammo="#ffd040"), SANTA),
        "halloween": (P(top="#2a2032", arm="#2a2032", cloak="#4a2a6a", cloakD="#2e1a44", belt="#f28a2a", ammo="#a8ff4a", scope="#a8ff4a"), WITCH),
        "school": (P(top="#2a3458", arm="#2a3458", cloak="#f4f4f8", cloakD="#c8c8d8", belt="#d83a4a", legs="#2a3458", legsD="#1a2038"), H("mortar", "#1a1a24", "#f2c040")),
        "newyear": (P(top="#e84a6a", arm="#e84a6a", cloak="#3a6ad8", cloakD="#2a4aa8", belt="#ffd040", legs="#f2a0c8", legsD="#d8709a"), JOB),
        "japan": (P(top="#2a3a6a", arm="#2a3a6a", cloak="#e85a7a", cloakD="#b83a5a", belt="#e8e8f0", legs="#2a3a6a", legsD="#1a2440"), HB),
        "china": (P(top="#c8202a", arm="#c8202a", cloak="#e8b030", cloakD="#c89020", belt="#ffd860", hair="#1a1424", hairD="#0e0a16", hairL="#3e3254"), BUNS),
        "usa": (P(top="#3a5aa8", arm="#3a5aa8", cloak="#8a5a32", cloakD="#5a3a20", belt="#d8303a", legs="#3a5aa8", legsD="#2a3a7a", hair="#e8c060", hairD="#a8803a", hairL="#fff0a0"), COWBOY),
        "swap": (P(top="#3a3a44", arm="#3a3a44", cloak="#5a4a3a", cloakD="#3a2e24", hair="#2a2a34", hairD="#16161e", hairL="#4a4a5a") | {"blush": None}, dict(short=True)),
    },
    "forgotten": {
        "swim": (P(dress="#7ad8f8", dressD="#3ab0d8", gold="#ffffff", gem="#ffd040", shoe="#ffffff"), FLOWER),
        "xmas": (P(dress="#d8303a", dressD="#a81e26", gold="#ffffff", gem="#3ad87a", shoe="#d8303a"), SANTA),
        "halloween": (P(dress="#3a2a4a", dressD="#24182e", gold="#f28a2a", gem="#a8ff4a", hair="#e8e0f0", hairD="#a898c0", hairL="#ffffff", eyeL="#f28a2a"), WITCH),
        "school": (P(dress="#2a3458", dressD="#1a2038", gold="#d83a4a", gem="#f4f4f8", shoe="#1a1a24"), H("mortar", "#1a1a24", "#f2c040")),
        "newyear": (P(dress="#f2a0c8", dressD="#d8709a", gold="#ffd040", gem="#3a6ad8"), JOB),
        "japan": (P(dress="#e85a7a", dressD="#b83a5a", gold="#2a3a6a", gem="#ffd040", hair="#1a1a24", hairD="#0e0e14", hairL="#4a4a5a", eyeL="#e85a7a"), FLOWER),
        "china": (P(dress="#c8202a", dressD="#8a1a20", gold="#e8b030", gem="#3ad87a", hair="#1a1424", hairD="#0e0a16", hairL="#3e3254"), BUNS),
        "usa": (P(dress="#3a5aa8", dressD="#2a3a7a", gold="#d8303a", gem="#ffffff"), COWBOY),
        "swap": (P(dress="#e8eaf4", dressD="#a8aed0", gold="#c89a3a", hair="#e8d8a0", hairD="#b89a58", hairL="#fff6d0") | {"blush": None}, dict(short=True)),
    },
    "remnant": {
        "swim": (P(hood="#1a5a8a", hoodD="#123e60", scarf="#5ad0ff", scarfD="#2a98b8", top="#1e3a5a", arm="#1e3a5a"), GOG),
        "xmas": (P(hood="#a81e26", hoodD="#7a1218", scarf="#ffffff", scarfD="#c8c8d8", top="#2a2a34", arm="#2a2a34", belt="#2a8a3a"), SANTA),
        "halloween": (P(hood="#2a1a36", hoodD="#1a1022", scarf="#f28a2a", scarfD="#a8501a", eyeL="#f28a2a"), WITCH),
        "school": (P(hood="#2a3458", hoodD="#1a2038", scarf="#d83a4a", scarfD="#a82a3a", top="#f4f4f8", arm="#2a3458"), H("cap", "#2a3458", "#f2c040")),
        "newyear": (P(hood="#3a6ad8", hoodD="#2a4aa8", scarf="#ffd040", scarfD="#c8a020", top="#e84a6a", arm="#e84a6a"), JOB),
        "japan": (P(hood="#2a3a6a", hoodD="#1a2440", scarf="#e83a3a", scarfD="#b82a2a", eyeL="#ff8a8a"), HB),
        "china": (P(hood="#8a1a20", hoodD="#5a1014", scarf="#e8b030", scarfD="#c89020", top="#c8202a", arm="#c8202a"), H("skullcap", "#2a2028", "#e8b030")),
        "usa": (P(hood="#3a5aa8", hoodD="#2a3a7a", scarf="#d8303a", scarfD="#a81e26", top="#8a5a32", arm="#8a5a32"), COWBOY),
        "swap": (P(scarf="#ff6aa8", scarfD="#c84a88", hair="#c8c8dc", hairD="#8a8aa0", hairL="#ffffff", blush="#f0a0b0"), dict(extra=long_hair(hx("#c8c8dc"), hx("#8a8aa0")))),
    },
    "wanderer": {
        "swim": (P(coat="#1a7aa8", coatD="#125a80", arm="#1a7aa8", sash="#ffd040", hat="#f4f0e0", hatD="#c8c0a8", legs="#2a8ac8", legsD="#1e6a9a"), {}),
        "xmas": (P(coat="#c8202a", coatD="#8a1a20", arm="#c8202a", sash="#2a8a3a", hat="#ffffff", hatD="#c8c8d8", top="#ffffff"), {}),
        "halloween": (P(coat="#2a2032", coatD="#1a1420", arm="#2a2032", sash="#f28a2a", hat="#4a2a6a", hatD="#2e1a44", eyeL="#f28a2a"), {}),
        "school": (P(coat="#2a3458", coatD="#1a2038", arm="#2a3458", sash="#d83a4a", hat="#1a1a24", hatD="#0e0e14", top="#f4f4f8"), {}),
        "newyear": (P(coat="#e84a6a", coatD="#b83050", arm="#e84a6a", sash="#ffd040", hat="#ffd040", hatD="#c8a020", legs="#3a6ad8", legsD="#2a4aa8"), {}),
        "japan": (P(coat="#f4f0f4", coatD="#c8c0d0", arm="#f4f0f4", sash="#e83a3a", top="#e85a7a", legs="#2a2028", legsD="#1a1418"), {}),
        "china": (P(coat="#c8202a", coatD="#8a1a20", arm="#c8202a", sash="#e8b030", hat="#e8b030", hatD="#a8802a", legs="#2a2028"), {}),
        "usa": (P(coat="#8a5a32", coatD="#5a3a20", arm="#8a5a32", sash="#d8303a", hat="#c8a070", hatD="#8a6a3a", legs="#3a5aa8", legsD="#2a3a7a", top="#f4f4f4"), {}),
        "swap": (P(coat="#6a2a4a", coatD="#4a1a32", arm="#6a2a4a", sash="#f0c8d8", blush="#f09696", hair="#1e1a20"), dict(extra=long_hair(hx("#1e1a20"), hx("#100e12")))),
    },
    "silk": {
        "swim": (P(dress="#1a7aa8", dressD="#125a80", trim="#7ae8ff", hair="#2a5a9a", hairD="#183a6a", hairL="#6aa8e8"), FLOWER),
        "xmas": (P(dress="#c8202a", dressD="#8a1a20", trim="#ffffff", ring="#3ad87a"), SANTA),
        "halloween": (P(dress="#2a1a36", dressD="#1a1022", trim="#f28a2a", hair="#3a1a4a", hairD="#24102e", hairL="#8a4ab8", eyeL="#f28a2a"), WITCH),
        "school": (P(dress="#2a3458", dressD="#1a2038", trim="#d83a4a", top="#f4f4f8", hair="#1a1a24", hairD="#0e0e14", hairL="#4a4a5a"), H("mortar", "#1a1a24", "#f2c040")),
        "newyear": (P(dress="#e84a6a", dressD="#b83050", trim="#ffd040", hair="#1a1424", hairD="#0e0a16", hairL="#5a3a6a"), JOB),
        "japan": (P(dress="#4a1a5a", dressD="#2e0e3a", trim="#ff8aa8", hair="#1a1a24", hairD="#0e0e14", hairL="#4a4a5a"), FLOWER),
        "china": (P(dress="#c8202a", dressD="#8a1a20", trim="#e8b030", hair="#1a1424", hairD="#0e0a16", hairL="#3e3254"), BUNS),
        "usa": (P(dress="#3a5aa8", dressD="#2a3a7a", trim="#d8303a", hair="#e8c060", hairD="#a8803a", hairL="#fff0a0"), COWBOY),
        "swap": (P(dress="#2a1a2e", dressD="#1a0e1e", top="#2a1a2e", arm="#2a1a2e", legs="#2a2a34", legsD="#1a1a22") | {"blush": None}, dict(short=True)),
    },
}

BASES = {
    "tracker": (As.TRACKER, As.tracker_deco),
    "forgotten": (As.FORGOTTEN, As.forgotten_deco),
    "remnant": (As.REMNANT, As.remnant_deco),
    "wanderer": (As.WANDERER, As.wanderer_deco),
    "silk": (As.SILK, As.silk_deco),
}

def main():
    for name, themes in SKINS.items():
        themes = dict(themes, summer=(SUMMER_COLORS[name], dict(extra=SUMMER[name])))
        base, deco = BASES[name]
        geo = As.GEO[name]
        for th, (over, theme) in themes.items():
            k = dict(base); k.update(over)
            d = wrap(deco, theme)
            save_sheet(f"skins/{name}_{th}", lambda r, col, k=k, d=d: person(k, r, col, geo, d))

if __name__ == "__main__":
    main()
