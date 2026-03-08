# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (localhost:4321)
pnpm build        # Production build
pnpm preview      # Preview production build locally
pnpm astro add    # Add Astro integrations
```

There is no linter or test suite configured.

## Architecture

This is an **Astro 4** marketing site for Calcorp Andorra (a digital agency), built on the Astroship template with Tailwind CSS. It supports three languages: English (default), Spanish (`/es/`), and Catalan (`/cat/`).

### Routing & i18n

- Routes are duplicated per language: `src/pages/index.astro`, `src/pages/es/index.astro`, `src/pages/cat/index.astro`
- The `lang` prop is passed explicitly from each page down to every component
- Language detection in layouts/navbar uses `Astro.url.pathname` prefix matching

### Content / Copy

All user-facing text lives in `src/content/` as plain JS files, not in Astro Content Collections. Each section has its own subdirectory with one file per language:

```
src/content/
  hero/hero-texts.js         # .es.js and .cat.js variants
  services/services-texts.js
  cta-texts.js
  nav/nav-items.en.js
  contactform/contactform-texts.en.js
  clients.js                 # client logos list
  ...
```

Components dynamically import the correct language file using `await import(...)` based on the `lang` prop. **To add or edit any copy, edit the content files — not the components.**

Astro Content Collections (with Zod schemas in `src/content/config.ts`) are only used for `blog` and `team` Markdown/MDX content collections.

### Component Model

Pages compose layout components — each page is thin. The standard page structure:

```astro
<Layout title="...">
  <Container>
    <Hero lang="en" />
    <Services lang="en" />
    <Logos lang="en" />
    <Cta lang="en" />
  </Container>
</Layout>
```

- `Layout.astro` — wraps `<html>`, includes Navbar and Footer, handles SEO via `astro-seo`
- `Container.astro` — max-width centering wrapper
- All other `.astro` files in `src/components/` are section components

### Path Aliases

Configured in `tsconfig.json`:
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@assets/*` → `src/assets/*`
- `@utils/*` → `src/utils/*`

### Icons

Uses `astro-icon` with Boxicons (`bx:` prefix) and Simple Icons (`simple-icons:` prefix) from `@iconify-json/bx` and `@iconify-json/simple-icons`. Custom local SVG icons go in `src/icons/` and use the `local:` prefix.

### Fonts

Bricolage Grotesque Variable (primary) and Inter Variable — both loaded via `@fontsource-variable` in `Layout.astro`.

### Contact Form

The contact form in `src/components/contactform.astro` submits to Netlify Forms (`data-netlify="true"`). The inline `<script>` handles client-side validation and `fetch` submission. Success/error messages are defined in the language-specific content files under `contactform-texts`.

### Deployment

Configured for Netlify. The `site` URL is read from `SITE_URL` or `URL` environment variables (Netlify sets `URL` automatically).

---

## Design Context

### Users

Mixed audience: traditional small-medium business owners in Andorra/Catalonia who want to go digital (not tech-savvy), and digital-native founders or startups evaluating agencies. Both audiences must feel at home — the site must be sophisticated enough for the tech-savvy and clear enough for someone who has never hired an agency.

### Brand Personality

**Approachable & human.** Calcorp is a team of experts who speak plainly — no jargon, no corporate coldness, no hype. Confident but never arrogant. The copy is direct and warm ("We build websites that sell", "Bring AI into your business with no fuss"). In three words: **Clear. Human. Capable.**

Emotional goal: visitors should feel *reassured and energised* — like they've found someone who gets it and will actually deliver.

### Aesthetic Direction

**Reference**: Stripe / Shopify — polished, trustworthy, generous white space, subtle colour accents on a white base.

**Anti-references**: No generic SaaS purple gradients (Webflow templates), no stiff corporate enterprise look, no dark-mode hacker aesthetic.

**Theme**: Light mode only. Current palette is black/white with slate grays. Accents should feel warm and intentional, not decorative. Typography leads — Bricolage Grotesque is expressive and should do heavy lifting.

### Design Principles

1. **White space is a design element.** Resist filling space. Density feels corporate; breathing room feels confident.
2. **Typography earns trust.** Bricolage Grotesque is the brand voice made visible. Use size, weight, and tracking to create hierarchy — not colour or decoration.
3. **Interactions confirm quality.** Hover states, transitions, and micro-interactions should feel smooth and considered. They signal craft without calling attention to themselves.
4. **Clarity before cleverness.** For an audience that ranges from tech founders to shop owners, the message must land immediately. No ambiguity in layout, copy, or calls to action.
5. **Human warmth, not corporate polish.** Prefer approachable language, natural imagery, and rounded details over sharp/sterile or overly slick aesthetics.
