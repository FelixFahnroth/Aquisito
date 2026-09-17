# Placeholder register

`CLAUDE.md` rule 10: **placeholders must never reach production.**

Every `{{TOKEN}}` in the codebase is listed here. The pre-launch check is:

```bash
grep -rn "{{" --include="*.html" --include="*.css" --include="*.js" .
```

It must return nothing.

---

## Resolved 2026-07-26 — content delivered by the Verein

The Verein supplied camera-original photography (`pictures_for_website/`) and the
three landing figures. Now filled and out of the register:

- **Band photography** — `{{BAND_IMG_1..3}}` → real `<picture>` on all three pages
  (`band-index`, `band-freiwillige`, `band-spenden`, WebP + JPG at 2400/1200px).
- **Band lines** — `{{BAND_LINE_1..3}}` → the documented candidate sentences.
  Editorial, still swappable.
- **Landing figures** — `9` Jahre gemeinsam mit CADSE · `120` Kinder erreicht ·
  `10.000 €` für CADSE gefördert. Given by the client; confirm the exact euro
  figure against the Finanzberichte before launch.
- **Team portraits** — 5 of ~19 now real (Mery, Erika, Toni, Natha, Thomas). The
  rest still flip to the sun placeholder; `{{PORTRAIT_*}}` stays open below.

## Resolved 2026-07-26 (second batch)

- **Spenden band** swapped to the funded playground in use (`KidsPlayingAtNewPlayground1`).
- **Hero photo** — client override of the "no image" hero: a framed `ArtsPictureOfKidsHand`
  slightly overlapping the lead. `index.css` records the override.
- **`{{REGISTERGERICHT}}` → Aachen** (client-confirmed). Note: the Sitz in the
  footer is Raesfeld while the register is Aachen — flag this Sitz/Registergericht
  pairing for the legal review, but the register value is now decided.
- **`{{STAT_MITGLIEDER}}` → 5**, **`{{STAT_FOERDERMITGLIEDER}}` → 25** (client-confirmed).

## Blocked on content from the Verein

| Token | Where | Needs |
|---|---|---|
| `{{OUTCOME_20}}` / `{{OUTCOME_40}}` / `{{OUTCOME_80}}` | `spenden.html` | cost-per-amount lines, confirmed by Thomas against Finanzbericht 2025 |
| `{{SPLIT_PROJEKTE}}` / `{{SPLIT_VERWALTUNG}}` / `{{SPLIT_FUNDRAISING}}` | `spenden.html` | percentages from Finanzbericht 2025. Must total 100. |
| `{{KONTAKT_SPENDEN_NAME}}` / `{{KONTAKT_SPENDEN_TEL}}` | `spenden.html` | a named human for the trust block — a named contact converts better than any badge |
| `{{PORTRAIT_*}}` | `index.html` | the full team portrait set, or none at all |
| `{{KOCHBUCH_POSTER}}` | `spenden.html` | poster frame for the 9,7 MB cookbook video. Optional but better than an empty box: `ffmpeg -i assets/video/kochbuch.mp4 -ss 3 -frames:v 1 assets/img/kochbuch-poster.jpg` |

## Blocked on a factual decision

| Token | Where | Blocker |
|---|---|---|
| `{{IMPRESSUM_MSTV}}` | `impressum.html` | the person responsible under §18 Abs. 2 MStV |

## Resolved 2026-09-17

- **`{{DATENSCHUTZBEAUFTRAGTE}}` → Maria**, named as Datenschutzbeauftragte on
  `datenschutz.html` and in the team grid (her role there changed from
  Vorstandsbeisitzerin · Marketing). Contact runs through `info@aquisito.de`
  with a subject line, because the Strato tariff allows only one mailbox.
  Open: she is published by first name only, and whether the Verein is even
  *required* to appoint one under Art. 37 DSGVO was never established —
  Satzung § 10 only says "if legally required".

## Resolved 2026-09-17 (second batch)

All three remaining tokens in `datenschutz.html` are filled. **No placeholder
reaches production any more** — rule 10 is satisfied for the first time.

- **`{{ANFRAGE_SPEICHERDAUER}}` → 12 Monate** (client decision). Means: how long
  enquiries stay in the `info@aquisito.de` mailbox, since the relay stores
  nothing.
- **`{{HOSTING_ANBIETER}}` → no external processor.** The Verein runs the server
  itself, so the Auftragsverarbeiter line now says so instead of naming a
  company, and the prose above it says "unser Server" rather than "unser
  Hoster". **If the machine is a rented VPS or root server, the datacentre
  operator is normally still named here** — revisit if that is the case.
- **`{{LOG_SPEICHERDAUER}}` → 14 Tage** (client estimate, not a measurement).

  ⚠️ **The 14 days are not yet enforced.** Docker's json-file driver had no
  rotation at all, so logs grew without limit; `docker-compose.yml` now caps
  them at 10 MB × 3 per service, which stops the disk filling but rotates by
  **size, not time**. On a quiet site that can hold far more than 14 days.
  To make the sentence literally true, either run `logrotate` on the host
  against `/var/lib/docker/containers/*/*-json.log` with `daily` + `rotate 14`,
  or turn the nginx access log off entirely and reword the section — the site
  has no analytics, so almost nothing depends on it.

`{{DATENSCHUTZ_STAND}}` was listed here but never existed in any page.

~~The volunteer form posts to `/api/anmeldung`, which **does not exist yet**.~~
**Resolved 2026-09-13.** `/api/anmeldung` is now a small self-hosted service
(`api/anmeldung.py`, started by `docker-compose.yml`, reached through an nginx
`proxy_pass`). It takes the POST, sends the contents to `MAIL_TO` over SMTP and
keeps nothing — no database, no log of form contents.

Because it runs on the Verein's own infrastructure, **no new processor is
involved** and `{{HOSTING_ANBIETER}}` remains the only one to name. The mailbox
provider behind `SMTP_HOST` does process the message in transit, so if that is
someone other than the host already named, add them.

`{{ANFRAGE_SPEICHERDAUER}}` is still open and now means something concrete: how
long enquiries stay in the `info@aquisito.de` mailbox, since that is the only
place they are kept.

---

## Statistic candidates

`PAGES.md`: *"Real numbers only. If a number is not yet known, remove the column
— do not invent one and do not write `100+`."* Three columns, all checkable.

| Candidate | Value | Source | Checkable? |
|---|---|---|---|
| Years CADSE has existed | seit 2017 | `landing.md:112` | yes |
| Years Aquisito has existed | seit Mai 2020 | `transparenz.md:61` | yes |
| Active members | 22 + 16 Fördermitglieder | `transparenz.md:45` | yes, but dated |
| Children at Libélula | Ziel: bis zu 48 | `landing.md:41` | **no — a target, not an achievement.** Do not use. |
| Total funded since 2020 | derivable from the Finanzberichte | `documents/Finanzbericht-*.pdf` | needs Thomas |
| Children reached at CADSE | not recorded anywhere | — | **needs the Verein** |

Recommended set, subject to confirmation: *years alongside CADSE* · *children
reached* · *share going into projects*. The middle one is the most persuasive
number the organisation could publish and it currently does not exist in any file.

---

## Cost-per-amount

Presets are chosen to **land on** real costs, not near them
(`inventory/content.md` §Real project costs).

| Preset | Derivation | Draft line |
|---|---|---|
| 20 € | `239,42 € ÷ 12` — internet for CADSE, one year | `20 € = ein Monat Internet für alle Kinder bei CADSE` |
| 40 € | `401,71 €` Fußballschule ÷ 10 | `40 € = Bälle und Hütchen für ein Jahr Fußballschule` |
| 80 € | `93,74 €` Hygiene-Projekt, near-exact | `80 € = Zahnbürsten und Seife für fünf Monate` |

Draft only. Thomas (Rechnungsführer) confirms against Finanzbericht 2025 before
launch — the outcome line is the single most load-bearing sentence on `/spenden`
and it must survive a donor checking it against the published accounts.

---

## Deliberately not a placeholder

These read like gaps but are resolved decisions, recorded so nobody "fills them in":

- **No analytics, no cookie banner.** The recovered site had no tracking and the
  rebuild keeps it that way. `PAGES.md`: do not add a notice if analytics are not used.
- **No dark mode.** `DESIGN.md` §2. `color-scheme: only light`.
- **No fourth activity card.** `what-we-do.md` has four pillars; `PAGES.md` allows
  three. Bildung and Lernen are merged. The long form survives on `/transparenz`.
- **No blog.** Both `Aktuelles` pages carried an "not available" notice. Not rebuilt.
