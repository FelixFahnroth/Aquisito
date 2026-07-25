# Placeholder register

`CLAUDE.md` rule 10: **placeholders must never reach production.**

Every `{{TOKEN}}` in the codebase is listed here. The pre-launch check is:

```bash
grep -rn "{{" --include="*.html" --include="*.css" --include="*.js" .
```

It must return nothing.

---

## Blocked on content from the Verein

| Token | Where | Needs |
|---|---|---|
| `{{BAND_IMG_1}}` | `index.html` | landscape photo ≥2400px — see `assets.md` §Photography brief |
| `{{BAND_IMG_2}}` | `freiwillige.html` | as above |
| `{{BAND_IMG_3}}` | `spenden.html` | as above |
| `{{BAND_LINE_1}}` | `index.html` | ≤8 words. Candidate: `Wo Mery hingeht, da sind auch Kinder.` (real, from `landing.md:106`, exactly eight words) |
| `{{BAND_LINE_2}}` | `freiwillige.html` | ≤8 words. Candidate: `Sechs Monate, die dich länger begleiten.` |
| `{{BAND_LINE_3}}` | `spenden.html` | ≤8 words. Candidate: `Aquisito heißt hier. Nicht dort, nicht irgendwann.` |
| `{{STAT_1_FIGURE}}` / `{{STAT_1_LABEL}}` | `index.html` | verified figure — candidates below |
| `{{STAT_2_FIGURE}}` / `{{STAT_2_LABEL}}` | `index.html` | as above |
| `{{STAT_3_FIGURE}}` / `{{STAT_3_LABEL}}` | `index.html` | as above |
| `{{OUTCOME_20}}` / `{{OUTCOME_40}}` / `{{OUTCOME_80}}` | `spenden.html` | cost-per-amount lines, confirmed by Thomas against Finanzbericht 2025 |
| `{{SPLIT_PROJEKTE}}` / `{{SPLIT_VERWALTUNG}}` / `{{SPLIT_FUNDRAISING}}` | `spenden.html` | percentages from Finanzbericht 2025. Must total 100. |
| `{{KONTAKT_SPENDEN_NAME}}` / `{{KONTAKT_SPENDEN_TEL}}` | `spenden.html` | a named human for the trust block — a named contact converts better than any badge |
| `{{PORTRAIT_*}}` | `index.html` | the full team portrait set, or none at all |
| `{{STAT_MITGLIEDER}}` | `index.html`, `transparenz.html` | current count of active members — `transparenz.md` said 22, undated |
| `{{STAT_FOERDERMITGLIEDER}}` | `transparenz.html` | current count of Fördermitglieder — `transparenz.md` said 16, undated |
| `{{KONTAKT_SPENDEN_NAME}}` / `{{KONTAKT_SPENDEN_TEL}}` | `spenden.html` | named human for the trust block |
| `{{KOCHBUCH_POSTER}}` | `spenden.html` | poster frame for the 9,7 MB cookbook video. Optional but better than an empty box: `ffmpeg -i assets/video/kochbuch.mp4 -ss 3 -frames:v 1 assets/img/kochbuch-poster.jpg` |

## Blocked on a factual decision

| Token | Where | Blocker |
|---|---|---|
| `{{REGISTERGERICHT}}` | `impressum.html`, every footer | `footer.md` says *Vereinsregister Aachen*; the Sitz is Raesfeld; the Satzung §1(2) says *Sitz ist Aachen*. Three sources, two answers. See `content.md` §Contradictions. |
| `{{IMPRESSUM_MSTV}}` | `impressum.html` | the person responsible under §18 Abs. 2 MStV |

## Blocked on operations

Introduced by the rewritten Datenschutzerklärung. Each one describes something
the site actually does, so none can be dropped — they have to be answered.

| Token | Where | Needs |
|---|---|---|
| `{{HOSTING_ANBIETER}}` | `datenschutz.html` | the chosen host, plus a signed Art. 28 DSGVO processing agreement |
| `{{LOG_SPEICHERDAUER}}` | `datenschutz.html` | how long the host keeps server logs — ask them, typically 7–14 days |
| `{{ANFRAGE_SPEICHERDAUER}}` | `datenschutz.html` | internal retention decision for volunteer enquiries. Suggested: 12 months |
| `{{DATENSCHUTZBEAUFTRAGTE}}` | `datenschutz.html` | Satzung § 10 provides for electing one *if legally required*. If none is required, replace the whole line with a sentence saying so — do not leave it blank |
| `{{DATENSCHUTZ_STAND}}` | `datenschutz.html` | the date the reviewed policy is signed off |

The volunteer form posts to `/api/anmeldung`, which **does not exist yet**. Until
an endpoint is live the form submits into nothing. Whatever handles it becomes a
processor and has to be named in the Datenschutzerklärung.

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
