# Asset inventory

Dimensions measured with `System.Drawing`, not estimated. Source:
`aquisito_backup/aquisito/images/` and `.../documents/`.

## Photography

| File | Pixels | Size | Verdict |
|---|---|---|---|
| `projects_bolivia/WhatsApp Image 2025-06-04 at 03.35.50.jpeg` | 1600×1200 | 146 KB | widest landscape in the entire set — and it is a WhatsApp copy |
| `projects_bolivia/WhatsApp Image 2025-06-04 at 03.35.505.jpeg` | 1200×1600 | 161 KB | unused in the old site |
| `projects_bolivia/working_kids.jpeg` | 1200×1600 | 121 KB | portrait; used three times on `news_bolivia.md`, twice labelled "Dummy Image" |
| `natha.jpg` | 1080×1080 | 326 KB | **portrait, consistent square crop** |
| `toni.jpg` | 1080×1080 | 189 KB | **portrait, consistent square crop** |
| `thomas.jpeg` | 1080×1080 | 114 KB | **portrait, consistent square crop** |
| `leapfrog.jpg` | 1024×1024 | 359 KB | hero image on the old landing page |
| `libelula_placeholder.png` | 1024×1024 | 1.4 MB | PNG carrying a photograph — re-encode |
| `volunteer.jpg` | 1024×576 | 212 KB | only 16:9 frame available |
| `beethovianos.jpg` | 1024×768 | 102 KB | — |
| `bastel.jpg` | 768×1023 | 104 KB | — |
| `mery.jpg` | 768×1024 | **2.6 MB** | absurd quality-to-size ratio; re-encode. Referenced as `images/mery` without extension in `landing.md:108`, so it never rendered. |

## Brand and UI

| File | Pixels | Note |
|---|---|---|
| `Logo21_dark_ohneHintergrund.svg` | vector | wordmark + sun lockup, `rgb(100%,78%,0%)` = `#ffc700` |
| `sonne.svg` | vector | standalone sun, `#ffc700` + `#f7f166` |
| `sonne.ico` | — | favicon, keeps gold |
| `Transparente_ZivilgesellschaftPNG.png` | 735×200 | Initiative seal, fine at native size |

## Not migrated

`newsletter.png` (150×150), `spenden.png` (150×150), `sonne.png` (353×356),
`documents/Projekte.pdf`, both `WhatsApp Image …` files. Unreferenced by any
surviving page.

## Video

`videos/kochbuch.mp4` — **9.7 MB**. Used on `/spenden#kochbuch`. Never autoplay,
never `preload="auto"`: poster image plus click-to-play, or replaced by a still
if a poster frame is all that is needed.

---

## The finding that changes the design

**No recovered image can carry the band.**

`DESIGN.md` §5.1 requires a minimum of 2400px on the long edge. The widest asset
in the entire set is 1600px, and it reached that width through WhatsApp, which
re-encodes and caps at 1600. The playbook is explicit: *do not upscale — an
upscaled JPEG at 2400px in a full-bleed band will look worse than no band.*

**Consequence:** the band ships against the SVG graphic placeholder adapted from
`styleguide.html`, and swaps to `<picture>` when real photography arrives. The
markup contract in `COMPONENTS.md` is identical either way, so the swap is a
file replacement and an `alt=""` — no layout work.

### Photography brief

Three landscape frames, one per page.

- **≥2400px on the long edge.** Camera originals, transferred by cable, cloud
  link or AirDrop. **Not WhatsApp** — that is exactly what capped the current set.
- **Horizon or ground line in the lower third.** The band's arcs cut the top and
  bottom edges, so anything important there is lost.
- Real children and volunteers **mid-action, not looking at the camera**.
- No posed group shots, no one holding a donation cheque.
- **Written consent from a parent or guardian for every recognisable child**
  before publication. This is the blocker most likely to be forgotten.

Suggested subjects, drawn from what the copy already describes: homework support
at CADSE, the Fußballschule, cooking in the Jugendgruppe, the Libélula site in
northern Cochabamba.

### Portraits

Three of roughly nineteen people are photographed today, all 1080×1080 and
visually consistent — good raw material. `PAGES.md` forbids mixing photographed
and unphotographed people in the team grid: *"If good photos do not exist, use
name plates on `--forest-tint` and skip photos entirely rather than mixing."*

So it is all or none. Until the full set exists the grid renders name plates for
everyone, including the three who do have portraits. Requirements for the rest:
square crop, plain background, even light, shoulders up.
