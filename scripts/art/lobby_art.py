"""로비 그림(docs/ART_NOW.md 2~8) → apps/client/public/lobby/
- 바닥 art/로비/arcade/floor.png → floor.png 256×256 (로비 4×4칸) · 벽 wall.png → wall.png 192×64 (벽 높이 2칸, 가로 6칸)
- 묶음 그림(초록·마젠타 배경)은 배경을 지우고 왼쪽부터 잘라 이름.png (높이 H픽셀 = 로비 H/4픽셀)
- 목록 apps/client/src/lobby/lobbyArtList.ts
실행: python3 scripts/art/lobby_art.py
"""
from pathlib import Path
import sys
import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from world_art import components, cut_background, quantize, save_png, seamless, tone  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "art" / "로비"
OUT = ROOT / "apps/client/public/lobby"
LIST = ROOT / "apps/client/src/lobby/lobbyArtList.ts"
# 묶음 → 왼쪽부터 (이름, 높이 픽셀)
SHEETS = {
    "arcade/props": [("fountain", 88), ("sofa", 60), ("plant", 72), ("vending", 108), ("sideTable", 48)],
    "common/machines1": [("m_blackjack", 112), ("m_tiles", 112), ("m_apples", 112), ("m_blocks", 112), ("m_joker", 112)],
    "common/machines2": [("m_slots", 112), ("m_dice", 112), ("m_hilo", 112), ("m_pets", 124)],
    "common/pets1": [("pet_cat", 44), ("pet_dog", 48), ("pet_slime", 40), ("pet_dragon", 56)],
    "common/pets2": [("pet_bunny", 52), ("pet_chick", 36), ("pet_phoenix", 56), ("pet_turtle", 36)],
}


def cut(sheet, items):
    img = cut_background(Image.open(SRC / f"{sheet}.png"))
    comps = components(np.asarray(img.getchannel("A")))
    big = max(c[4] for c in comps)
    main = sorted([c for c in comps if c[4] >= big * 0.08], key=lambda c: (c[0] + c[2]) / 2)
    for c in comps:
        if c[4] >= big * 0.08:
            continue
        k = min(main, key=lambda b: abs((b[0] + b[2]) / 2 - (c[0] + c[2]) / 2))
        gap = max(k[0] - c[2], c[0] - k[2], k[1] - c[3], c[1] - k[3])
        if c[4] < big * 0.01 and gap > 24:
            continue
        k[0], k[1], k[2], k[3] = min(k[0], c[0]), min(k[1], c[1]), max(k[2], c[2]), max(k[3], c[3])
    if len(main) != len(items):
        print(f"  ! {sheet}: {len(main)}개 (기대 {len(items)})", file=sys.stderr)
    names = []
    for (name, h), b in zip(items, main):
        part = img.crop(tuple(b[:4]))
        part = part.resize((max(1, round(part.width * h / part.height)), h), Image.Resampling.LANCZOS)
        part = quantize(part, 64)
        bb = part.getbbox()
        save_png(part.crop(bb) if bb else part, OUT / f"{name}.png")
        names.append(name)
    return names


OUT.mkdir(parents=True, exist_ok=True)
names = []
floor = Image.open(SRC / "arcade/floor.png").convert("RGB").resize((256, 256), Image.Resampling.LANCZOS)
save_png(quantize(tone(seamless(floor), (0.85, 0.75)).convert("RGBA"), 64), OUT / "floor.png")
wall = Image.open(SRC / "arcade/wall.png").convert("RGB").resize((192, 64), Image.Resampling.LANCZOS)
a = np.asarray(wall, np.float32)
w = np.clip(np.minimum(np.arange(192), 191 - np.arange(192)) / 48, 0, 1)[None, :, None]
wall = Image.fromarray((a * w + np.roll(a, 96, axis=1) * (1 - w)).astype(np.uint8))
save_png(quantize(wall.convert("RGBA"), 64), OUT / "wall.png")
names += ["floor", "wall"]
for s, items in SHEETS.items():
    names += cut(s, items)
LIST.write_text("// 로비 그림이 있는 이름 (scripts/art/lobby_art.py가 만듦, 손으로 고치지 않음)\nexport const LOBBY_ART: ReadonlySet<string> = new Set([\n"
                + "".join(f'  "{n}",\n' for n in sorted(names)) + "]);\n", encoding="utf8")
print(len(names), "장")
