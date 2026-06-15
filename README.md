# The New Me 2.0 — Reverse Aging

A landing page for the book *The New Me 2.0 — Reverse Aging* by **Gagan Dhawan**.

The design language (cream-paper palette, condensed editorial display type, eyebrow→headline→body rhythm, floating book cover, audio-intro widget, infinite marquee, smooth-scroll + scroll-reveal animations) is modeled on `findworkhappiness.com`, rebuilt from scratch with original content and branding.

## Stack
- **Vite + React 18**
- **Tailwind CSS v3** (design tokens in `tailwind.config.js`)
- **Framer Motion** — scroll reveals, parallax, hero/cover motion
- **Lenis** — smooth scrolling
- Fonts: **Oswald** (display) + **Hanken Grotesk** (body) via Google Fonts

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Structure
```
src/
  App.jsx                 # layout + Lenis smooth scroll
  components/
    Header.jsx            # sticky nav
    Hero.jsx              # Section 1 — Why It Matters Now + book cover
    AudioWidget.jsx       # "Listen to the intro" player
    Marquee.jsx           # infinite pillar marquee
    Author.jsx            # Section 2 — About the Author
    TurningPoint.jsx      # Section 3 — The Turning Point
    Inside.jsx            # authored "What's Inside" pillars
    FinalCTA.jsx          # order / preview CTA
    Footer.jsx
    Reveal.jsx            # scroll-reveal helpers
public/
  book.webp              # book cover
```

## To customize
- **Colors / fonts:** `tailwind.config.js` → `theme.extend`
- **Book cover:** replace `public/book.webp`
- **Author photo:** `Author.jsx` — currently an illustrated placeholder card; drop in a real image
- **Order/Download links:** `FinalCTA.jsx` and `Header.jsx` `href="#"` → real store / file URLs
- **Copy:** each section component holds its own text
