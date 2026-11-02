"""Builds the 1200x630 social share image from the portrait and the logo.

Run after scripts/build-media.sh:  python3 scripts/make-og.py
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "assets" / "web" / "img"

BLUSH = (255, 240, 245)
PINK_HOT = (255, 45, 123)

W, H = 1200, 630

canvas = Image.new("RGB", (W, H), BLUSH)

# Portrait fills the right side, cropped to the head and shoulders
portrait = Image.open(ROOT / "assets" / "nunu" / "Kissu.JPG").convert("RGB")
pw = 480
scale = pw / portrait.width
portrait = portrait.resize((pw, round(portrait.height * scale)), Image.LANCZOS)
canvas.paste(portrait.crop((0, 0, pw, H)), (W - pw, 0))

# Hot-pink band down the seam, the one strong color moment
canvas.paste(Image.new("RGB", (16, H), PINK_HOT), (W - pw - 16, 0))

# Script logo, tinted hot pink, large on the left
logo_alpha = Image.open(WEB / "logo.png").getchannel("A")
lw = 560
logo_alpha = logo_alpha.resize((lw, round(logo_alpha.height * lw / logo_alpha.width)), Image.LANCZOS)
logo = Image.new("RGB", logo_alpha.size, PINK_HOT)
canvas.paste(logo, (64, (H - logo_alpha.height) // 2), logo_alpha)

canvas.save(WEB / "og.jpg", quality=86, optimize=True)
print("wrote", WEB / "og.jpg")
