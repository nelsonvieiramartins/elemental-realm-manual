"""
Convert all ELEMENTOS images to WebP with smart size limits per category.
Originals are kept untouched; WebP files are overwritten if they exist.
"""
import sys
import io
from pathlib import Path
from PIL import Image

Image.MAX_IMAGE_PIXELS = 300_000_000
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE = Path(__file__).parent / "ELEMENTOS"
QUALITY = 88  # Raised from 82 — better detail, still very efficient WebP

# Max long-edge px per category (first match wins).
# Larger values = more detail in lightbox; smaller = lighter tokens/grids.
SIZE_RULES = [
    ("MAPAS",                    2000),  # Lightbox full-screen clarity
    ("TABULEIRO DE RODADAS",     2000),
    ("TABULEIRO DOS PERSONAGENS", 1400), # Player boards need readable text
    ("ACAMPAMENTO",              1200),
    ("ILUSTRAÇÕES",              1200),  # Character portraits
    ("CRIATURAS GUARDIÃS",       1200),  # Boss cards opened large
    ("CRIATURAS",                1000),
    ("EVENTOS",                  1000),
    ("CARTAS DE ITENS",          1000),
    ("PERSONAGENS",              1000),
    ("AÇÕES DOS JOGADORES",      1000),
    ("TOKENS",                    600),  # Tokens only shown small
]
DEFAULT_MAX = 1000

def max_size_for(path: Path) -> int:
    parts = str(path).upper()
    for keyword, size in SIZE_RULES:
        if keyword in parts:
            return size
    return DEFAULT_MAX

def convert(src: Path) -> tuple[int, int]:
    """Return (original_bytes, new_bytes). Overwrites existing webp."""
    dst = src.with_suffix(".webp")
    orig_size = src.stat().st_size
    try:
        img = Image.open(src)
        if img.mode not in ("RGB", "RGBA", "L", "LA"):
            img = img.convert("RGBA" if img.mode in ("P", "PA") else "RGB")

        max_px = max_size_for(src)
        if max(img.size) > max_px:
            img.thumbnail((max_px, max_px), Image.LANCZOS)

        if img.mode == "RGBA":
            bg = Image.new("RGB", img.size, (9, 23, 26))
            bg.paste(img, mask=img.split()[3])
            img = bg

        img.save(dst, "WEBP", quality=QUALITY, method=4)
        return orig_size, dst.stat().st_size
    except Exception as e:
        print(f"\n  ERROR {src.name}: {e}")
        return orig_size, orig_size

def fmt(b):
    return f"{b/1024/1024:.1f}MB" if b >= 1024*1024 else f"{b/1024:.0f}KB"

def main():
    exts = {".png", ".jpg", ".jpeg"}
    files = sorted(p for p in BASE.rglob("*") if p.suffix.lower() in exts)
    total = len(files)
    print(f"Found {total} images — quality={QUALITY}, overwriting existing WebP\n")

    webp_total = 0
    converted = 0

    for i, src in enumerate(files, 1):
        orig, new = convert(src)
        webp_total += new
        converted += 1
        pct = (1 - new/orig)*100 if orig else 0
        line = f"[{i}/{total}] {fmt(orig):>8} -> {fmt(new):>7} ({pct:2.0f}% down)  {src.name[:45]}"
        sys.stdout.write(f"\r{line}    ")
        sys.stdout.flush()

    print(f"\n\nDone. {converted} images converted.")
    print(f"  Total WebP size : {fmt(webp_total)}")
    print(f"  Target          : <=50MB")
    status = "OK" if webp_total <= 50*1024*1024 else "OVER — reduce quality or dimensions"
    print(f"  Status          : {status}")

if __name__ == "__main__":
    main()
