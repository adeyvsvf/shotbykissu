# SHOTBYKISSU

Wedding & event videographer site — Atlanta, GA.

## Run locally

Any static server works. From this folder:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000

## Stack

- HTML5 + Tailwind CSS (via CDN)
- Vanilla JS
- Google Fonts (Playfair Display, Dancing Script, Poppins)
- Swiper.js (testimonials)
- GLightbox (portfolio video lightbox)
- AOS.js (scroll animations)
- Formspree (contact form backend)

## Before launch

1. **Formspree**: replace `YOUR_FORM_ID` in `index.html` with your real endpoint from formspree.io.
2. **Assets**: image and video URLs currently hotlink to Unsplash/Coverr placeholders. Download real assets into `assets/` and swap the paths.
3. **Tailwind**: CDN is fine for dev. For production, run a PostCSS build and replace the CDN tag.
4. **Social links**: footer + mobile menu point to `#`. Replace with real IG/TikTok/YouTube/Pinterest URLs.
5. **Contact email**: `hello@shotbykissu.com` in footer and form.js — update to real inbox.

## Structure

```
shotbykissu/
├── index.html
├── css/custom.css
├── js/
│   ├── main.js         nav, preloader, mobile menu, hero clip-path
│   ├── portfolio.js    GLightbox + filter tabs
│   ├── testimonials.js Swiper carousel
│   ├── faq.js          accordion
│   └── form.js         Formspree submit + success/error
└── assets/             (video/, img/, icons/ — add real files here)
```
