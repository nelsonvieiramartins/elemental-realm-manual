"""
Replace .png/.jpg/.jpeg -> .webp references in all HTML files,
but only for paths where a .webp version actually exists.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent

# Collect every .webp we generated (relative paths from ROOT, forward slashes)
webp_set = {
    p.relative_to(ROOT).as_posix().lower()
    for p in ROOT.rglob("*.webp")
}

html_files = list(ROOT.glob("*.html")) + list((ROOT / "manual").glob("*.html"))

pattern = re.compile(r"(ELEMENTOS/[^'\"]+?\.(png|jpg|jpeg))", re.IGNORECASE)

total_replaced = 0

for html_path in sorted(html_files):
    text = html_path.read_text(encoding="utf-8")
    replacements = 0

    def replace_ext(m):
        global replacements
        orig = m.group(1)
        candidate = re.sub(r'\.(png|jpg|jpeg)$', '.webp', orig, flags=re.IGNORECASE)
        if candidate.lower() in webp_set:
            replacements += 1
            return candidate
        return orig

    new_text = pattern.sub(replace_ext, text)
    if replacements:
        html_path.write_text(new_text, encoding="utf-8")
        total_replaced += replacements
        print(f"  {html_path.name}: {replacements} refs updated")

print(f"\nTotal refs updated: {total_replaced}")
