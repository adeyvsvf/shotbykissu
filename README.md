# Shot by Kissu

Wedding, brand and event content creator site, Atlanta, GA.

## Run locally

Any static server works. From this folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Stack

- Plain HTML, CSS and JavaScript. No build step, no frameworks.
- Google Fonts: Poppins (body and interface), Playfair Display (headings and quotes), Dancing Script (the "Kissu" logo).
- Formspree for the inquiry form.

All colors, type sizes, spacing, radii and motion timings are CSS custom properties at the top of `css/site.css`. The brand hex values there must not change.

## Media

The original footage lives in `assets/nunu/` (about 1.7 GB of HEVC). It is ignored by git because several files are over GitHub's 100 MB limit. The site uses web versions in `assets/web/`, built with:

```bash
scripts/build-media.sh
```

```bash
python3 scripts/make-og.py
```

The first needs `ffmpeg` and `cwebp`. The second needs Python with Pillow and builds the social share image. To add a reel, add a line to the `REELS` list in `scripts/build-media.sh`, run it, then copy one `<li class="reels__item">` block in `index.html`.

## Before launch

1. **Formspree:** replace `YOUR_FORM_ID` in `index.html` with the real form endpoint. Until then the form shows its "didn't send" message.
2. **Email:** `hello@shotbykissu.com` appears in the page, the form error message (`js/main.js`) and the structured data. Confirm it's a real inbox.
3. **Social links:** Instagram and TikTok point to `@shotbykissu`. Confirm both handles.
4. **Domain:** the canonical URL, share image URL and structured data assume `https://shotbykissu.com/`.
5. **Made-up initials:** three clips use placeholder initials. A & T is the highrise wedding, N.K. is the fashion brand shoot, and L.R. is the makeup masterclass.
6. **Logo:** the script "Kissu" mark comes from a 200px PNG. A vector (SVG) version would be sharper on large screens.

## Structure

```
index.html
css/site.css            tokens, layout and components
js/main.js              hero, menu, work filter, reel player, form, copy email
scripts/build-media.sh  originals -> web video, posters, portrait
scripts/make-og.py      social share image
assets/web/             published media (committed)
assets/nunu/            original media (not committed)
```
