# Content inventory

Prose extracted from the recovered site as plain markdown, with its source noted,
**before** any layout was designed — so the design is built against real German
string lengths rather than lorem.

Voice: `Du` form (D2, amends `CLAUDE.md` rule 9). Sentence case. **No exclamation
marks** — the old copy is full of them and they all go.

---

## Blocks that land on `/`

### Tagline → `h1` with the marker
> **Gemeinsam Groß Werden**
> *— `landing.md:11`*

New: `Gemeinsam groß werden` — sentence-cased, marker on `groß`.

### Lead
> eine Kooperation zwischen dem Kinder- und Jugendzentrum CADSE in Bolivien und
> Aquisito e.V. in Deutschland
> *— `landing.md:13`*

### The Mery paragraph → team section intro
> Seit 2017 bietet die einheimische Pädagogin Mery mit ihrer Tageseinrichtung
> CADSE Kindern in Cochabamba (Bolivien) einen sicheren Ort zum Aufwachsen. Neben
> Hausaufgabenbetreuung erhalten sie die Möglichkeit, sorglos in die Zukunft
> blicken zu können. Bei Sport-, Kunst- oder Englischunterricht lernen die Kinder
> Werte wie Zusammenhalt, Selbstbewusstsein und Toleranz kennen, für welche in
> der Schule keine Zeit bleibt. Wir sind stolz, der gemeinnütziger Partnerverein
> in Deutschland zu sein!
> *— `landing.md:112`*

Two edits required. `DESIGN.md` §7 bans `Wir sind stolz darauf` by name, and the
sentence has a grammar error (`gemeinnütziger` should be `gemeinnützige`). Final
sentence is cut; the fact that Aquisito is the German partner is carried by the
page, not asserted.

### Pull quote
> Wo Mery hingeht, da sind auch Kinder. Diese Kinder fühlen sich geborgen,
> geliebt und ernst genommen.
> *— `landing.md:106`*

First sentence is exactly eight words — a band-line candidate (`DESIGN.md` §5.1).

### The name — currently buried at the bottom, promoted to its own section
> `"Aquisito"` ist die spanische Verniedlichung für `"Hier"` … die vor allem in
> Cochabamba häufig verwendet wird. Wir von Aquisito e.V. wollen niemanden
> vorschreiben, was Entwicklungszusammenarbeit ist und wissen auch nicht immer,
> wo die meiste Unterstützung gebraucht wird. Mery und ihr Team kommen selbst aus
> dem Stadtteil und kennen die Bedürfnisse und Umstände der Familien. Aus diesem
> Grund kann CADSE lokal und gezielt Probleme anpacken.
> *— `landing.md:115`*

This is the strongest piece of writing on the old site and it sits below the
fold under a code-formatted heading. It becomes a section of its own.

### `Was wir tun` — four pillars compressed to three cards

`PAGES.md` allows three activity cards. `what-we-do.md` has four pillars, and
*Bildung* and *Lernen* overlap almost entirely — both are schooling support.

| Card | Merged from | Source |
|---|---|---|
| **Bildung & Lernen** | Bildung + Lernen | `what-we-do.md:13`, `:39` |
| **Freizeit & Sport** | Freizeit | `what-we-do.md:24` |
| **Ernährung & Jugend** | Ernährung | `what-we-do.md:52` |

Long-form text for all four sections is preserved on `/transparenz` rather than
discarded — it explains what donations actually buy.

Card 1 source:
> Der Tag im Kinder- und Jugendzentrum CADSE beginnt mit Schularbeit. Jedes Kind
> macht zuerst mithilfe der Freiwilligen seine Hausaufgaben und arbeitet danach
> mit Arbeitsblättern und Lernspielen an seinen persönlichen Schwachstellen.
> *— `what-we-do.md:15`*

Card 2 source:
> Einmal pro Woche wird CADSE künstlerisch aktiv: Beim Malen und Basteln lernen
> die Kinder eigenständiges Arbeiten und selber Ideen zu entwickeln. […] Ein
> anderer Tag der Woche wird dem Sport gewidmet.
> *— `what-we-do.md:26`, `:28`*

Card 3 source:
> CADSE versucht den Kindern auf eine spielerische Art und Weise eine ausgewogene
> Ernährung zu erklären. […] Seit ein Ofen gespendet wurde, können sie gemeinsam
> in Gruppen kochen und backen. Inzwischen organisieren sie selber Pizzatage,
> Tanzkurse oder Geburtstagsfeiern.
> *— `what-we-do.md:54`, `:56`*

### Team — 19 people
`team.md:9–155`. Names and roles carry over verbatim:

Mery (Koordinatorin von CADSE, Leitung und Außenrepräsentation) · Natha
(Stellvertretende Vorsitzende, Kooperationen) · Erika (Interne Leitung von CADSE)
· Toni (Erste Vorsitzende) · Thomas (Rechnungsführer, Finanzen & Kooperationen) ·
Maria (Vorstandsbeisitzerin, Marketing) · Felix (Vorstandsbeisitzer, Marketing) ·
Melvy (Kinderbetreuung, Kreativität & Psychologie) · Pamela (Kinderbetreuung,
Kunst & Kreativität) · Julia (Aquisito-Familie, Kochbuch) · Fernando
(Kinderbetreuung, IT-Unterricht und Englisch) · Felix (Marketing & Events) ·
Olli · Kathi · JD · Antonia · Marit · Lea · Lukas (Aquisito-Familie)

⚠️ Two entries are named **Felix** with different roles. Confirm whether these
are two people or one duplicated entry before the grid is built.

⚠️ `team.md` lists **Antonia** and **Toni** separately, while `footer.md` gives
the Vorsitzende as *Antonia Tröll*. Likely the same person listed twice. Resolve.

### Team page intro
> Das sind wir! Wenn du auch Teil der Aquisito-Familie werden möchtest, schreib
> uns an info@aquisito.de. Wir freuen uns auf dich!
> *— `team.md:3`*

Two exclamation marks removed:
`Das sind wir. Wenn du Teil der Aquisito-Familie werden möchtest, schreib uns an info@aquisito.de.`

---

## Blocks that land on `/spenden`

### Lead
> Die Kinder und Betreuer/innen in Bolivien freuen sich über jede Spende, egal
> wie hoch sie ist. Mit einer Fördermitgliedschaft gibst du dem Projekt ein
> sicheres Einkommen, mit dem sie in Zukunft planen können, aber auch eine
> einmalige Spende kann bereits Großes leisten.
> *— `donations.md:11`*

### Fördermitgliedschaft
> Der beste Weg uns zu helfen ist eine Fördermitgliedschaft. So kann CADSE in
> Bolivien mit einem festen Betrag rechnen und für die Zukunft planen. Du hast
> als Fördermitglied außer deinem selbst gewählten Beitrag keinerlei
> Verpflichtungen und kannst jederzeit aus dem Verein austreten.
> *— `donations.md:16`*

Route: filled-in PDF by post to the Vereinsadresse, or by mail to
`info@aquisito.de` (`donations.md:20`).

### Spendenbescheinigung
> Sowohl der Beitrag von Fördermitgliedern als auch Spenden können steuerlich
> abgesetzt werden. Wir versenden die Bescheinigungen für Beträge über 300 €
> jährlich im Februar. Für kleinere Beträge kannst du ganz einfach einen
> Kontoauszug einreichen.
> *— `donations.md:40`*

Typo in source heading: `Spendenbvescheinigung` (`donations.md:38`).

### Payment details — verbatim, checked twice
```
Aquisito e.V.
IBAN: DE72 4306 0967 1003 9179 00
BIC:  GENODEM1GLS
```
*— `donations.md:32`, repeated in `footer.md:45`*

PayPal hosted button (donations): `BWK48NNFGLMQJ` — `donations.md:28`
PayPal hosted button (Kochbuch):  `7LRKA636K85E6` — `news_germany.md:12`

### Kochbuch → `/spenden#kochbuch`
> In einem großen Gemeinschaftsprojekt haben CADSE und Aquisito zusammen ein
> Kochbuch geschrieben, das Deutschland die Türen zur bolivianischen Küche
> öffnet. Bestelle dir jetzt dein Exemplar und unterstütze damit die Arbeit von
> CADSE in Bolivien!
> *— `news_germany.md:9`, duplicated at `landing.md:82`*

### Real project costs — the raw material for the outcome line
From `news_bolivia.md`. These are the only numbers on the site precise enough to
name a concrete outcome, which `PAGES.md` says is worth more than the rest of the
page.

| Amount | Bought | Source |
|---|---|---|
| 33,48 € | Ferien-Schulvorbereitung, Januar 2024 | `:159` |
| 40,17 € | Fußballturnier — Medaillen und Obst | `:148` |
| 93,74 € | Hygiene-Projekt — Zähneputzen, Händewaschen, 5 Monate | `:137` |
| 239,42 € | **Internet für CADSE, ein ganzes Jahr** | `:115` |
| 263,62 € | Canastones — Lebensmittelkörbe zum Jahresabschluss | `:187` |
| 348,15 € | Familienschule — 9 Monate Elternseminare | `:104` |
| 401,71 € | Fußballschule — Trainerin und Material | `:126` |
| 468,66 € | Nagelpflege-Schulung für 16 arbeitssuchende Frauen | `:93` |
| 560,66 € | Fenstergitter und Türvergitterung | `:216` |
| 933,30 € | Englischkurs für CADSE-Engagierte | `:176` |
| 1.472,95 € | Schulische Bildung, ganzes Jahr 2024 | `:71` |
| 2.410,27 € | Koordination durch Mery, ganzes Jahr 2024 | `:82` |
| 9.990 € | Libélula-Förderung der Schmitz Stiftung | `landing.md:40` |

`239,42 € / 12 ≈ 20 €` per month of internet for every child at CADSE — the
cleanest derivation available for a preset pill.

---

## Blocks that land on `/freiwillige`

### Lead
> Bolivien ist ein tolles Land und CADSE ein Projekt, das den Freiwilligen ganz
> viel Liebe und Erfahrung zurückgibt. Wie du direkt vor Ort bei CADSE helfen
> kannst, erklären wir dir hier.
> *— `volunteers.md:9`*

### Two routes — `volunteers.md:16–37`

**Internationaler Jugendfreiwilligendienst**, with Beethovianos Internacional e.V.,
BMFSFJ part-funded:
- Alter: zwischen 18 und 26 Jahre
- Dauer: 6–12 Monate
- Teilfinanziert durch das BMFSFJ
- Eine Spende in Höhe von 1500–2000 € ist wünschenswert
- Bewerbung: <https://beethovianos-internacional.de/freiwilligendienste/>

**Auf eigene Faust**:
- Alter: egal
- Dauer: mindestens drei Monate
- Finanzierung: Selbstfinanzierung
- Qualifikation: grundlegende Spanischkenntnisse
- Bewerbung: `info@aquisito.de`

### Deine Aufgaben — `volunteers.md:42–46`
> Zuerst wirst du bei der **Hausaufgabenbetreuung** helfen und bei Aktivitäten
> unterstützen. Sehr schnell kannst du aber auch schon deine ersten eigenen Ideen
> verwirklichen und den Kindern Fußball beibringen, mit ihnen singen oder ein
> **Rennauto bauen**.

### Dein Leben in Bolivien — `volunteers.md:50–60`
Six labelled blocks, near-verbatim. The best-written passage on the old site.

Wohnen · Anfahrt · Verpflegung · Sicherheit · Reisen · Klima

> **Klima:** Cochabamba trägt den Beinamen "Stadt des ewigen Frühlings". Selten
> wird es weit über 30 oder unter 15 Grad. Nimm also Sonnencreme für die
> Höhensonne und ein paar Pullover für die Nacht mit.

⚠️ `volunteers.md:56` reads *"bist du so sicher wie in Italien."* — reads as a
throwaway line in a safety section. Rewrite or drop; safety copy should not be
glib.

### Bolivia background essay — `volunteers.md:69–92`
Three long sections: *Gesellschaft und Kultur*, *Kinder und Bildung*, *Land und
Natur*. Roughly 900 words. Genuinely good, but it must not push the sign-up form
down the page — placed below the form, or moved to `/transparenz`.

Contains Spanish terms needing `lang="es"`: *indígenas, Quechua, Guaraní, Aymara,
desfile, Diablada, Caporales, Tinkus, Morenada, Pujllay, Salar de Uyuni, Isla
Incahuasi, casero/-as*.

---

## Blocks that land on the legal tier

| File | Source | Treatment |
|---|---|---|
| `/transparenz` | `transparenz.md` (3.2 KB) + `news_bolivia.md` catalogue + `what-we-do.md` long form | ten Initiative points verbatim; project table under `#projekte` |
| `/satzung` | `satzung.md` (11.4 KB) | near-verbatim |
| `/foerdervereinbarung` | `foerdervereinbarung.md` (5.3 KB) | near-verbatim |
| `/datenschutz` | `datenschutz.md` (71 KB, 2020) | **rewritten, not copied** |
| `/impressum` | `impressum.md` (13 bytes) | **written from scratch** |

### Extraction damage in `satzung.md`
Hyphenation and spacing lost in a PDF-to-text conversion. Examples:

- `:5` — `gemeinnützi-geund mildtätige Zwecke` → `gemeinnützige und mildtätige Zwecke`
- `:5` — `Er soll in das Vereinsregister eingetragen werdenund nach Eintra-gung den Rechtsformzusatz` → `… werden und nach Eintragung den …`
- `:16` — `durcha)die Beschaffung` → `durch a) die Beschaffung`
- `:16` — `tätig sind. Insbesondere gefördert werden Jugendzentren für Kinder und Jugendlichein Bolivien;b)die Durchführung` → `… Jugendliche in Bolivien; b) die Durchführung`
- `:30` — `schriftlichenAntrag`, `Bei-spiel`, `Internetseitedes`

Fix on migration. A statute with broken words undermines the document it is
meant to authenticate. **The corrected text must be checked against the signed
original, not against intuition.**

### Numbers to preserve exactly

| Value | Source |
|---|---|
| IBAN `DE72 4306 0967 1003 9179 00`, BIC `GENODEM1GLS` | `footer.md:45` |
| SteuerNr. `201 5905 6228` / `201/5905/6228` | `footer.md:38`, `transparenz.md:27` |
| Registernummer `VR6037` | `footer.md:39` |
| Sitz `Ant Stäppken 33, 46348 Raesfeld` | `footer.md:37` |
| Vorsitzende `Antonia Tröll`, Tel. `015774266766` | `footer.md:23` |
| Finanzamt `Aachen-Stadt` | `transparenz.md:26` |
| `§ 5 Abs. 1 Nr. 9 KStG`, `§ 3 Nr. 6 GewStG`, Freistellungsbescheid 2023 | `transparenz.md:16` |
| 22 aktive Mitglieder + 16 Fördermitglieder | `transparenz.md:45` |
| Kassenstände 2020–2025: 0 / 2.722,73 / 8.693,06 / 10.588,60 / 14.138,73 / 8.026,58 / 7.547,38 € | `transparenz.md:61` |

### Contradictions to resolve before the Impressum is written

1. **Register court.** `footer.md:40` says *Vereinsregister Aachen* while the
   Sitz is Raesfeld (`footer.md:37`). Raesfeld falls under Amtsgericht
   Dorsten/Recklinghausen, not Aachen. Either the seat moved and the footer was
   half-updated, or the court is misstated. The Impressum cannot be written until
   this is settled — `{{REGISTERGERICHT}}`.
2. **Address and representative.** `datenschutz.md:17` gives *Antonia Tröll,
   Pontwall 2, 52062 Aachen* and *Vertretungsberechtigte Personen: Julia Moj*,
   with contact `antonia@troell.de`. `footer.md` gives Raesfeld and
   `info@aquisito.de`. The 2020 policy is stale.
3. **Satzung §1(2)** states *Sitz des Vereins ist Aachen* — which contradicts the
   footer's Raesfeld. If the seat genuinely moved, the Satzung was amended and
   the amended version must be the one published.

---

## Delete on sight

Per `REDESIGN-PLAYBOOK.md` §"Things not to carry over", found in the recovered files:

- Inline `style=` attributes — `landing.md:9`, `:34`, `:48`, `:61`
- `font-family: 'Sensei'` — a font never loaded, silently falling back
- The six "Technische Schwierigkeiten" admonitions
- `myst.yml:8`/`:24` — `landing.md` listed twice in the TOC
- `index.md` meta-refresh + `window.location.href` redirect
- Dead anchors: `#libelula`, `#weiterbildung` (targets never defined)
- Missing images: `libelula-img-04/05/06.jpg`, `images/mery` (no extension)
- "Dummy Image 2" / "Dummy Image 3" captions on a repeated photo
- Every exclamation mark

Not found, and worth recording as *absent*: jQuery, Bootstrap, Font Awesome,
carousels, newsletter modals, layout tables, cookie banners, social scripts,
PHP mailers, analytics. The MyST site was clean in this respect and the rebuild
keeps it that way — **which is why no consent banner is needed**.
