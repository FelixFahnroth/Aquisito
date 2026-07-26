# URL map

Every URL the recovered site served, where its content lands, and what redirect
is required. Source: `aquisito_backup/aquisito/` (MyST), built slugs verified
against `_build/site/content/*.json`.

Implemented in `../_redirects`. **Every row is tested individually before
launch — not sampled.**

## Core redirects

| Old URL | What it was | Lands at | Status |
|---|---|---|---|
| `/` | `index.md`, a meta-refresh to `/landing` | `/` | rewritten — refresh removed |
| `/landing` | the de-facto homepage | `/` | **301 — highest priority** |
| `/what-we-do` | 4 pillars (Bildung, Freizeit, Lernen, Ernährung) | `/#was-wir-tun` | 301 |
| `/team` | 19 people as cards | `/#team` | 301 |
| `/news-bolivia` | project catalogue 2022–2024 with funded amounts | `/transparenz#projekte` | 301 |
| `/news_bolivia` | broken underscore variant, linked from `landing.md` and `transparenz.md` | `/transparenz#projekte` | 301 |
| `/news-germany` | the cookbook, one paragraph | `/spenden#kochbuch` | 301 |
| `/news_germany` | underscore variant | `/spenden#kochbuch` | 301 |
| `/volunteers` | volunteering + Bolivia background essay | `/freiwillige` | 301 |
| `/donations` | donations | `/spenden` | 301 |
| `/transparenz` | 10 Initiative points | `/transparenz` | unchanged |
| `/impressum` | heading only, 13 bytes | `/impressum` | unchanged, content written from scratch |
| `/satzung` | statutes | `/satzung` | unchanged |
| `/datenschutz` | privacy policy, 2020 | `/datenschutz` | unchanged, content rewritten |
| `/foerdervereinbarung` | funding criteria | `/foerdervereinbarung` | unchanged |

### Why `/landing` is first on the list

Commit `629cceb` ("adjusted landing page to be main page, due to QR codes on the
flyers") records that printed material points at this URL. A 404 there is the
single most expensive failure in the migration.

## Documents — paths preserved byte-identically

These are cited in grant applications and annual reports. They do not move and
they do not get renamed.

```
/documents/22-Jahresbericht-CADSE.pdf
/documents/Aquisito_Fördermitgliedsantrag.pdf
/documents/Finanzbericht-2020.pdf
/documents/Finanzbericht-2021.pdf
/documents/Finanzbericht-2022.pdf
/documents/Finanzbericht-2023.pdf
/documents/Finanzbericht-2024.pdf
/documents/Finanzbericht-2025.pdf
/documents/Jahresbericht-2021.pdf
/documents/Tatigkeitsbericht-fur-das-Jahr-2020.pdf
```

Not migrated: `/documents/Projekte.pdf` — unreferenced anywhere in the recovered
site. Kept in the legacy tree; add a redirect only if a backlink turns up.

### Umlaut trap

`Aquisito_Fördermitgliedsantrag.pdf` contains `ö`. Mail clients and PDF readers
disagree about whether to send `%C3%B6` (UTF-8) or `%F6` (Latin-1), so a link
pasted into an email can arrive as either. Keep the path byte-identical **and**
add an ASCII alias:

```
/documents/Aquisito_Foerdermitgliedsantrag.pdf  →  /documents/Aquisito_Fördermitgliedsantrag.pdf  301
```

## Gap: the pre-outage URL set

The Jimdo-era aquisito.de URLs are unknown. `Aquisito/index.php` is an Archivarix
loader whose content directory (`.content.xxxxxxxx/`, containing `structure.db`)
was never committed — this is the **only** thing that repo is useful for.

If anyone still holds the Archivarix snapshot:

```sql
SELECT request_uri FROM structure
WHERE mimetype = 'text/html' AND enabled = 1 AND redirect = ''
ORDER BY request_uri;
```

Merge the result into the table above. Until then this map covers only the MyST
era (March 2025 onward), and any ranking the original site held is not recovered.

## Deleted with intent

Recorded here rather than dropped quietly, per the playbook.

| Gone | Why |
|---|---|
| The `Aktuelles` blog structure (`news-bolivia`, `news-germany` as *news*) | Both carried a "News-Blogs im Moment nicht verfügbar" notice. A blog nobody updates is worse than no blog. The project catalogue survives as transparency content; the cookbook survives on `/spenden`. |
| `index.md` meta-refresh | Replaced by a real page at `/`. |
| Six "Technische Schwierigkeiten" banners | The outage they describe is what this rebuild ends. |
| The newsletter signup as implemented | It was already disabled and replaced by a mailto instruction. Footer field is rebuilt against a real endpoint or removed. |
