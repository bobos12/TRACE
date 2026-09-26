"""
satori (next/og) cannot parse variable fonts, so the OG images need a static
instance of Instrument Sans at the display weight.

Run once after changing public/fonts/InstrumentSans-Variable.woff2:

    python scripts/instance-variable-font.py

The output is committed, so builds never need Python.
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SRC = "assets/og-fonts/InstrumentSans-Variable.ttf"
OUT = "assets/og-fonts/InstrumentSans-600.ttf"
WEIGHT = 600

font = TTFont(SRC)
if "fvar" not in font:
    print(f"{SRC} is not variable; nothing to do")
    sys.exit(0)

static = instancer.instantiateVariableFont(font, {"wght": WEIGHT}, inplace=False)
static.save(OUT)
print(f"{SRC} -> {OUT} @ wght={WEIGHT}")
