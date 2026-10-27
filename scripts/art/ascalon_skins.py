# 시즌 2 아스칼론 캐릭터의 테마 스킨 9개 + 여름 한정 (python3 scripts/art/ascalon_skins.py) → apps/client/public/sprites/skins/{캐릭터}_{테마}.png
# 기본 그림(ascalon_sprites)의 옷 색을 테마에 맞게 바꾸고 소품을 얹음 (virdia_skins의 wrap·hat 같이 씀)
# swap(성별 바꾸기): 추적자는 짧은 머리의 남자
from s2_common import person, save_sheet
import ascalon_sprites as As
from virdia_skins import P, H, wrap, SANTA, WITCH, JOB, HB, BUNS, COWBOY, GOG
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
}

BASES = {
    "tracker": (As.TRACKER, As.tracker_deco),
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
