# 시즌 2 테라코어 다섯 명의 테마 스킨 9개 + 여름 한정 (python3 scripts/art/terra2_skins.py) → apps/client/public/sprites/skins/{캐릭터}_{테마}.png
# 기본 그림(terra2_sprites)의 옷 색을 테마에 맞게 바꾸고 소품을 얹음 (virdia_skins의 wrap·hat 같이 씀)
# 펑크·오토마타: 모자 대신 머리 장식과 옷 색만 (예쁘게) · 라이더: 오토바이 색도 테마에 맞춤
# swap(성별 바꾸기): 오토마타·펑크는 짧은 머리의 남자, 라이더·붐버·아티팩터는 긴 머리의 여자
from s2_common import hx, person, save_sheet
import terra2_sprites as Ts
from virdia_skins import P, H, wrap, SANTA, WITCH, JOB, HB, FLOWER, COWBOY, GOG
from helios2_skins import long_hair
from terra2_summer import SUMMER, SUMMER_COLORS

NOHAT = dict()
CAP = H("cap", "#2a3458", "#f2c040")

SKINS = {
    "automata": {
        "swim": (P(top="#e8f8ff", dress="#3ac8e8", dressL="#7ad8f8", glow="#ffffff", shoe="#3ac8e8"), FLOWER),
        "xmas": (P(top="#f4f4f8", dress="#c8202a", dressL="#e8484a", glow="#3ad87a", shoe="#c8202a"), NOHAT),
        "halloween": (P(top="#3a2a4a", dress="#2a2032", dressL="#4a2a6a", glow="#f28a2a", eyeL="#f28a2a", shoe="#2a2032"), NOHAT),
        "school": (P(top="#f4f4f8", dress="#2a3458", dressL="#4a5a88", glow="#d83a4a", shoe="#1a1a24"), NOHAT),
        "newyear": (P(top="#ffd0e4", dress="#e84a6a", dressL="#f2a0c8", glow="#ffd040", shoe="#3a6ad8"), NOHAT),
        "japan": (P(top="#f4f0f4", dress="#e85a7a", dressL="#ff8aa8", glow="#ffd040", shoe="#2a2028"), FLOWER),
        "china": (P(top="#f4e8d8", dress="#c8202a", dressL="#e8484a", glow="#e8b030", shoe="#1a1424"), NOHAT),
        "usa": (P(top="#f4f4f4", dress="#3a5aa8", dressL="#5a7ac8", glow="#d8303a", hair="#e8c060", hairD="#a8803a", hairL="#fff0a0", shoe="#d8303a"), NOHAT),
        "swap": (P(dress="#2a2a34", dressL="#4a4a5a", glow="#5aff9a"), dict(short=True)),
    },
    "rider": {
        "swim": (P(top="#1a7aa8", arm="#1a7aa8", stripe="#ffffff", bike="#3ac8e8", bikeD="#1e7a9a", bikeL="#8ae8ff"), NOHAT),
        "xmas": (P(top="#c8202a", arm="#c8202a", stripe="#ffffff", bike="#2a6a3a", bikeD="#1e4a2a", bikeL="#4a9a5a", goggle="#ffd040"), SANTA),
        "halloween": (P(top="#2a2032", arm="#2a2032", stripe="#f28a2a", bike="#f28a2a", bikeD="#a8501a", bikeL="#ffb04a", goggle="#a8ff4a"), WITCH),
        "school": (P(top="#2a3458", arm="#2a3458", stripe="#f4f4f8", bike="#f2c040", bikeD="#a8802a", bikeL="#ffe080"), CAP),
        "newyear": (P(top="#e84a6a", arm="#e84a6a", stripe="#ffd040", bike="#f2a0c8", bikeD="#c86a98", bikeL="#ffd0e4"), JOB),
        "japan": (P(top="#2a3a6a", arm="#2a3a6a", stripe="#e83a3a", bike="#f4f4f8", bikeD="#a8a8b8", bikeL="#ffffff", goggle="#e83a3a"), HB),
        "china": (P(top="#a81e26", arm="#a81e26", stripe="#e8b030", bike="#e8b030", bikeD="#a8802a", bikeL="#ffe080"), NOHAT),
        "usa": (P(top="#8a5a32", arm="#8a5a32", stripe="#f4f4f4", bike="#d8303a", bikeD="#8a1a20", bikeL="#ff6a6a", legs="#3a5aa8", legsD="#2a3a7a"), COWBOY),
        "swap": (P(stripe="#c83aa8", bike="#7a2ac8", bikeD="#4a1a7a", bikeL="#b07aff"), dict(extra=long_hair(hx("#1a1a28"), hx("#0c0c14")))),
    },
    "bomber": {
        "swim": (P(top="#3ac8e8", arm="#3ac8e8", scarf="#ffffff", legs="#2a98b8", legsD="#1e6a8a"), GOG),
        "xmas": (P(top="#c8202a", arm="#c8202a", scarf="#ffffff", belt="#2a6a3a", legs="#2a6a3a", legsD="#1e4a2a"), SANTA),
        "halloween": (P(top="#4a2a6a", arm="#4a2a6a", scarf="#f28a2a", bomb="#f28a2a", fuse="#a8ff4a"), WITCH),
        "school": (P(top="#2a3458", arm="#2a3458", scarf="#d83a4a", legs="#2a3458"), CAP),
        "newyear": (P(top="#e84a6a", arm="#e84a6a", scarf="#ffd040", legs="#3a6ad8", legsD="#2a4aa8"), JOB),
        "japan": (P(top="#2a3a6a", arm="#2a3a6a", scarf="#e83a3a"), HB),
        "china": (P(top="#a81e26", arm="#a81e26", scarf="#e8b030", belt="#e8b030"), H("skullcap", "#2a2028", "#e8b030")),
        "usa": (P(top="#3a5aa8", arm="#3a5aa8", scarf="#d8303a", legs="#3a5aa8"), COWBOY),
        "swap": (P(scarf="#ff6aa8"), dict(extra=long_hair(hx("#8a2a1a"), hx("#5a180e")))),
    },
    "artifacter": {
        "swim": (P(top="#1a5a8a", coat="#3ac8e8", legs="#1a5a8a", legsD="#123e60"), GOG),
        "xmas": (P(top="#c8202a", coat="#2a6a3a", ink="#ffd040", inkL="#ffffff", brass="#ffffff"), SANTA),
        "halloween": (P(top="#2a2032", coat="#4a2a6a", ink="#f28a2a", inkL="#ffd040"), WITCH),
        "school": (P(top="#2a3458", coat="#4a5a88", ink="#d83a4a", inkL="#ff8a9a"), CAP),
        "newyear": (P(top="#e84a6a", coat="#f2a0c8", ink="#3a6ad8", inkL="#8ab0ff"), JOB),
        "japan": (P(top="#2a3a6a", coat="#e8e8f0", ink="#e83a3a", inkL="#ff8a8a"), HB),
        "china": (P(top="#a81e26", coat="#e8b030", ink="#e8b030", inkL="#fff0a0"), H("crown", "#e8b030", "#d8303a")),
        "usa": (P(top="#8a5a32", coat="#3a5aa8", ink="#d8303a", inkL="#ffffff"), COWBOY),
        "swap": (P(coat="#4a3a6a", ink="#c87aff", inkL="#f0c8ff"), dict(extra=long_hair(hx("#e8ecf4"), hx("#a8b0c4")))),
    },
    "punk": {
        "swim": (P(jacket="#1a7aa8", neon="#ffffff", shorts="#3ac8e8", hair="#3ac8e8", hairD="#1e7a9a", hairL="#a8f0ff", tip="#ffffff"), NOHAT),
        "xmas": (P(jacket="#c8202a", neon="#ffffff", shorts="#2a6a3a", hair="#f4f4f8", hairD="#c8c8d8", hairL="#ffffff", tip="#e83a3a"), NOHAT),
        "halloween": (P(jacket="#2a2032", neon="#f28a2a", shorts="#4a2a6a", hair="#8a3ae8", hairD="#4a1a8a", hairL="#c8a0ff", tip="#f28a2a", eyeL="#f28a2a"), NOHAT),
        "school": (P(jacket="#2a3458", neon="#f4f4f8", shorts="#6a2a3a", hair="#2a2028", hairD="#14101c", hairL="#5a4a6a", tip="#d83a4a"), NOHAT),
        "newyear": (P(jacket="#e84a6a", neon="#ffd040", shorts="#3a6ad8", hair="#ffb0d8", hairD="#d878a8", hairL="#ffe0f0", tip="#ffd040"), NOHAT),
        "japan": (P(jacket="#2a3a6a", neon="#e83a3a", shorts="#e8e8f0", hair="#1a1a24", hairD="#0e0e14", hairL="#3a3a4a", tip="#e83a3a"), FLOWER),
        "china": (P(jacket="#c8202a", neon="#e8b030", shorts="#c8202a", hair="#1a1424", hairD="#0e0a16", hairL="#3e3254", tip="#e8b030"), NOHAT),
        "usa": (P(jacket="#3a5aa8", neon="#f4f4f4", shorts="#d8303a", hair="#e8c060", hairD="#a8803a", hairL="#fff0a0", tip="#d8303a"), NOHAT),
        "swap": (P(jacket="#1a1a24", hair="#4af0ff", hairD="#1e8a9a", hairL="#b0faff"), dict(short=True)),
    },
}

BASES = {
    "automata": (Ts.AUTOMATA, Ts.automata_deco),
    "rider": (Ts.RIDER, Ts.rider_deco),
    "bomber": (Ts.BOMBER, Ts.bomber_deco),
    "artifacter": (Ts.ARTIFACTER, Ts.artifacter_deco),
    "punk": (Ts.PUNK, Ts.punk_deco),
}

def main():
    for name, themes in SKINS.items():
        themes = dict(themes, summer=(SUMMER_COLORS[name], dict(extra=SUMMER[name])))
        base, deco = BASES[name]
        geo = Ts.GEO[name]
        size = geo.get("size", 32)
        for th, (over, theme) in themes.items():
            k = dict(base); k.update(over)
            d = wrap(deco, theme)
            save_sheet(f"skins/{name}_{th}", lambda r, col, k=k, d=d: person(k, r, col, geo, d), size=size)
        print(name, "ok")

if __name__ == "__main__":
    main()
