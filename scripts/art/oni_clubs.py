# 오니 방망이 10개를 무기마다 따로 그림 (python3 scripts/art/oni_clubs.py) → apps/client/public/sprites/oni_clubs/{무기}.png
# 한 장 = 192×384: 위 4×4칸(48칸) = 몸 뒤에 그릴 방망이 · 아래 4×4칸 = 몸 앞에 그릴 방망이. 칸 자리·장면은 oni_sprites의 몸 시트와 같음
# 게임은 몸 시트를 그리기 전·뒤에 이 두 겹을 같은 칸으로 겹쳐 그림 (game/sprites.drawCharacter)
import os
from PIL import Image
import oni_sprites as O

OUT = os.path.join(os.path.dirname(__file__), "../../apps/client/public/sprites/oni_clubs")
hx = O.hx

def st(grip, band, body, bodyL, stud, glow, base=1.0, top=3.0, deco=()):
    return dict(grip=hx(grip), band=hx(band), body=hx(body), bodyL=hx(bodyL), stud=hx(stud), glow=hx(glow), base=base, top=top, deco=deco)

CLUBS = {
    # 명뢰봉: 검은 쇠 + 노란 번개 금 + 금 가시
    "thunderClub": st("#5a3a24", "#f2c14e", "#2a2838", "#5a5670", "#f2c14e", "#fff27a", deco=("spikes", "cracks")),
    # 빙각금봉: 푸른 얼음 몸 + 삐죽 솟은 얼음 결정
    "frostClub": st("#3a5a7a", "#e0f8ff", "#4a8ab8", "#c8f0ff", "#9ae8ff", "#ffffff", deco=("crystal",)),
    # 홍련신주: 붉은 기둥 + 끝에서 타오르는 업화
    "lotusClub": st("#4a1a10", "#ffb040", "#8a1e14", "#d8422a", "#ffb040", "#ffe08a", top=2.6, deco=("flame",)),
    # 금봉: 온통 금 + 큰 금화 징
    "goldClub": st("#8a5a1a", "#fff6d0", "#d8a020", "#ffe88a", "#fff6d0", "#ffffff", deco=("coins",)),
    # 야마타의 그림자: 보랏빛 검은 몸 + 끝이 세 갈래 뱀 머리
    "yamataClub": st("#2a1a2e", "#9a4aff", "#1e1024", "#4a2a5a", "#c86aff", "#ff6aff", top=2.4, deco=("prongs",)),
    # 창세의 기둥: 흰 대리석 기둥 + 금 고리 + 머리장식
    "genesisPillar": st("#a8986a", "#ffd040", "#e8dcc0", "#ffffff", "#ffd040", "#fff4c0", top=2.5, deco=("pillar",)),
    # 풍신소환: 초록 몸 + 감긴 바람 띠
    "windClub": st("#2a4a3a", "#e0fff0", "#2a6a4a", "#7ae8b0", "#e0fff0", "#bafff0", deco=("ribbon", "spikes")),
    # 류신금봉: 푸른 비늘 몸 + 끝의 물결 마루
    "tideClub": st("#1a3a5a", "#f2c14e", "#1a4a8a", "#4a9ae8", "#e0f4ff", "#ffffff", deco=("wave",)),
    # 명계의 흑뢰봉: 칠흑 몸 + 보랏빛 갈라진 번개
    "blackThunder": st("#1a1020", "#9a6aff", "#0e0a14", "#2a2034", "#9a6aff", "#e0c8ff", top=3.3, deco=("cracks", "spikes")),
    # 극한의 청전: 짙은 푸른 몸 + 하늘빛 번개 + 얼음 결정
    "azureThunder": st("#1a2a4a", "#8ae8ff", "#1a3a6a", "#6ad8ff", "#8ae8ff", "#ffffff", top=3.2, deco=("cracks", "crystal")),
}

def main():
    os.makedirs(OUT, exist_ok=True)
    for wid, style in CLUBS.items():
        O.STYLE = style
        img = Image.new("RGBA", (O.C * 4, O.C * 8), (0, 0, 0, 0))
        img.paste(O.sheet(O.BASE, {}, "behind"), (0, 0))
        img.paste(O.sheet(O.BASE, {}, "front"), (0, O.C * 4))
        img.save(os.path.join(OUT, f"{wid}.png"), optimize=True)
    print("clubs ok")

if __name__ == "__main__":
    main()
