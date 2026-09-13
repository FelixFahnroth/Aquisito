# Fonts — self-hosted, present

Added 2026-09-13 via Route A below. Five files, 93 KB in total:

| Filename | Family | Weight | Size |
|---|---|---|---|
| `familjen-grotesk-400-latin-ext.woff2` | Familjen Grotesk | 400 | 16 KB |
| `familjen-grotesk-500-latin-ext.woff2` | Familjen Grotesk | 500 | 17 KB |
| `familjen-grotesk-600-latin-ext.woff2` | Familjen Grotesk | 600 | 17 KB |
| `atkinson-hyperlegible-400-latin-ext.woff2` | Atkinson Hyperlegible | 400 | 20 KB |
| `atkinson-hyperlegible-700-latin-ext.woff2` | Atkinson Hyperlegible | 700 | 21 KB |

## Why three static weights and not one variable file

This file originally specified a single variable `familjen-grotesk-latin-ext.woff2`
covering 400–600. Google serves the variable build **split per unicode subset** —
one file for `latin`, another for `latin-ext` — and neither can sit behind the
single combined `unicode-range` in `base.css` without dropping half the
characters. The static instances from google-webfonts-helper carry latin and
latin-ext together in one file, which is what that `unicode-range` needs.

Three weights because the display face is set at 400, 500 and 600 across the
stylesheets — `--weight-medium` (500) alone is used eighteen times. Shipping only
400 would leave the browser to synthesise the other two, which looks wrong at
heading sizes.

Only the body 400 and the display 500 are preloaded; those two carry first paint.

## Why self-hosted and not Google Fonts

Loading from `fonts.googleapis.com` transmits the visitor's IP address to Google
without consent. LG München I, 3 O 17493/20 (20 January 2022) awarded damages
against a site operator for exactly this. For a German Verein publishing a
Datenschutzerklärung, it is not a defensible dependency — and it would force a
consent banner onto a site that otherwise needs none.

`styleguide.html` in the playbook loads from Google for portability. That is the
one thing in it not to copy.

## Obtaining the files

Both families are open source: Familjen Grotesk is SIL OFL 1.1, Atkinson
Hyperlegible is a Braille Institute open licence. Either route works:

**Route A — google-webfonts-helper** (no build tooling)

1. <https://gwfh.mranftl.com/fonts/familjen-grotesk>
2. Charsets: tick **latin** and **latin-ext**.
3. Download the woff2, rename to the filename in the table above.
4. Repeat for `atkinson-hyperlegible`, taking 400 and 700 as separate files.

**Route B — subset locally** (smaller files, needs Python)

```bash
pip install fonttools brotli
pyftsubset FamiljenGrotesk[wght].ttf \
  --unicodes="U+0000-00FF,U+0100-024F,U+0259,U+1E00-1EFF,U+2000-206F,U+2074,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF" \
  --layout-features="kern,liga,tnum" \
  --flavor=woff2 \
  --output-file=familjen-grotesk-latin-ext.woff2
```

Keep `tnum` — statistics use `font-variant-numeric: tabular-nums`.

## Why latin-ext and not latin

`latin` alone drops characters the content actually contains:

- **Spanish**, throughout: Libélula, indígenas, Guaraní, Salar de Uyuni, casero/-as
- **German**: ä ö ü ß — in `latin`, but the € sign and the thin space used as a
  thousands separator are not guaranteed
- `Cochabamba`, `Ushpa Ushpa`, `Quechua`, `Aymara` are plain ASCII, but the
  Spanish accents around them are not

A missing glyph falls back to a different font mid-word, which is more visible
than any file-size saving is worth.

## Verifying

After changing any file here:

```bash
# Both preloads must resolve — a 404 here silently costs you the whole design
grep -rn "preload" ../../*.html
```

Then load a page with the network tab open and confirm two woff2 requests, both
200, both from the same origin. Any request to `fonts.gstatic.com` is a bug.
