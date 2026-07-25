# aquisito.de

Static site for Aquisito e.V. Plain HTML, vanilla CSS, a little ES-module
JavaScript. No framework, no build step beyond minification and image
processing.

The reasoning, from the playbook: eight pages, content that changes a few times a
year, maintained by volunteers who will not have a Node toolchain. A React build
here is a liability that outlives whoever set it up. If a framework ever becomes
genuinely necessary, Astro is the migration target.

## Run it

```bash
python -m http.server 8080     # or any static server
```

Then open <http://127.0.0.1:8080/>. There is nothing to install and nothing to
compile.

## Layout

```
index.html                 /                      landing
freiwillige.html           /freiwillige           volunteer sign-up
spenden.html               /spenden               donations
danke.html                 /spenden/danke         after a donation
impressum.html             /impressum         ┐
datenschutz.html           /datenschutz       │
transparenz.html           /transparenz       ├ legal tier: one prose template,
satzung.html               /satzung           │ no band, no marker, no images
foerdervereinbarung.html   /foerdervereinbarung ┘
styleguide.html            —                      visual contract, noindex

css/tokens.css        the only file allowed to contain a hex value
css/base.css          reset, type, layout primitives, @font-face
css/components.css    anything used on two or more pages
css/pages/*.css       page-specific

js/nav.js             mobile menu, focus trap, sticky header
js/reveal.js          scroll reveal, fires once
js/donate.js          amount selector, live outcome line
js/form.js            inline validation for the sign-up

inventory/            what the old site contained and where it went
_redirects            every old URL. Test individually, never sampled.
```

## The rules that are easy to break

From `aquisito_redesign_playbook/CLAUDE.md`, with the two amendments this project
made. Read that file before changing anything visual.

1. **No hardcoded colours.** Every colour is `var(--token)`. One documented
   exception: the marker SVG in `components.css` carries `%23f7f166`, because a
   data-URI cannot read a CSS variable.
2. **`#b5b5b5` is never text** (2.05:1). Use `--ink-muted`.
3. **`#809e00` is never body text** (3.08:1). Display type, icons, borders only.
4. **Gold appears once per screenful.** It means "donate".
5. **One band per page.** Grep for it.
6. **One `<h1>`, one marker per page**, and the marker lives in the `<h1>`.
7. **Focus rings are never removed.**
8. **No `<div onclick>`.**
9. **German, `Du` form, sentence case, no exclamation marks.** ← amended
10. **No placeholder reaches production.** See `inventory/placeholders.md`.

### Amendment to rule 9 — `Du`, not `Sie`

`DESIGN.md` §7 argues for `Sie` on the grounds that donation audiences skew
older. Overridden by the client: `/freiwillige` recruits 18–26 year olds for a
BMFSFJ-funded Freiwilligendienst, and the entire existing body of copy is `Du`.
Sentence case and the ban on exclamation marks still apply.

**`DESIGN.md` §7 still says `Sie` and needs editing to match** — two files
disagreeing is how a rule gets silently re-broken later.

### The gold logo, and why the header sun is olive

The Aquisito sun (`assets/img/sonne.svg`) and wordmark are `#ffc700` — the token
`--gold`, which rule 4 reserves for "donate". The header is sticky and carries the
gold donate pill on every page, so a gold sun in the chrome would break rule 4
permanently.

The header lockup therefore renders a `--forest` wordmark with the sun in
`--olive` (permitted for shapes and icons at 3.08:1). Gold survives untouched in
the favicon, on flyers and in print. On `/spenden` the header's Spenden link is
not a gold pill either — the gold there belongs to the submit button. It keeps
its position, it just stops shouting, because the visitor has already arrived.

## Editing content

Header and footer markup is duplicated across the HTML files. That is the price
of having no build step, and it is deliberate — but it means **a change to the
navigation has to be made in all nine files**. After editing, run:

```bash
grep -c 'site-footer__legal' *.html     # 9 expected
```

## Before calling anything done

```bash
grep -rn "{{" --include="*.html" .                              # rule 10
grep -rniE '#[0-9a-f]{6}' css/ | grep -v tokens.css             # rule 1
grep -c 'class="band"' index.html freiwillige.html spenden.html # 1 each
npx @axe-core/cli http://localhost:8080 --exit
npx lighthouse http://localhost:8080 --preset=mobile
```

And by hand, because tools catch about a third: tab the whole page, check it at
320px and 200% zoom, disable JavaScript, disable CSS, submit the form empty, and
confirm exactly one element is gold on any screenful.

## Known gaps

| Gap | Where it is written down |
|---|---|
| Fonts are not in the repo | `assets/fonts/README.md` |
| The band has no photography — no recovered image exceeds 1600px, the band needs 2400px | `inventory/assets.md` |
| Team grid shows name plates, not portraits (3 of ~19 exist; mixing is forbidden) | `inventory/assets.md` |
| Statistics, outcome lines and the cost split are placeholders | `inventory/placeholders.md` |
| Impressum and Datenschutz are drafts needing legal review | both pages carry a visible editorial note |
| `/api/anmeldung` does not exist — the volunteer form posts into nothing | `inventory/placeholders.md` |
| Pre-outage URLs are not in `_redirects` | `inventory/pages.md` §Gap |

## Hosting

Needs a host that serves `_redirects` (Cloudflare Pages, Netlify) — GitHub Pages
cannot issue 301s, and Phase 1 of the playbook depends on them. The volunteer
form also needs a server-side endpoint.
