# Calcorp Andorra — Marketing Site

Marketing website for [Calcorp](https://calcorp.ad), a digital agency based in Andorra. Built with Astro 4 and Tailwind CSS, supporting three languages: English, Spanish, and Catalan.

## Tech Stack

- **[Astro 4](https://astro.build)** — static site generator
- **[Tailwind CSS](https://tailwindcss.com)** — utility-first styling
- **[Netlify](https://netlify.com)** — hosting and form handling
- **npm** — package manager
- **[Vitest](https://vitest.dev)** — unit test runner

## Development

```bash
npm install         # Install dependencies
npm run dev         # Start dev server at localhost:4321
npm run build       # Production build
npm run preview     # Preview production build locally
```

## Testing

```bash
npm test                # Run all tests once
npm run test:watch      # Watch mode
npm run test:coverage   # Run with coverage report
```

Tests live next to the source files they cover (`*.test.js`). The test suite covers:

- `src/utils/all.js` — `getFormattedDate` utility
- `src/utils/grants.js` — grants calculator logic (`calculateSubsidy`, `calculateFinalCost`, `calculateTotals`, `formatEur`)
- `src/content/grants/services-data.js` — data integrity (unique IDs, valid rates, pack references)

## Deployment

The site is hosted on Netlify. Every push to `main` triggers an automatic deployment.

No manual deploy steps are needed — just merge to `main`.

## Contact Form

The contact form uses [Netlify Forms](https://docs.netlify.com/forms/setup/) (`data-netlify="true"`). Form submissions are captured automatically by Netlify on deploy. No backend or third-party service required.

## Project Structure

```
src/
├── components/       # Section components (Hero, Services, Navbar, etc.)
├── content/          # All user-facing copy, organised by section and language
│   ├── hero/
│   ├── services/
│   ├── nav/
│   ├── contactform/
│   └── ...
├── layouts/          # Layout.astro (wraps all pages)
├── pages/            # One file per route, duplicated per language
│   ├── index.astro          # English (default)
│   ├── es/index.astro       # Spanish
│   └── cat/index.astro      # Catalan
└── icons/            # Custom local SVG icons
```

## i18n

Languages are handled via route prefixes (`/` for English, `/es/` for Spanish, `/cat/` for Catalan). The `lang` prop is passed explicitly from each page down to its components, which dynamically import the correct content file.

To edit copy, modify the files in `src/content/` — not the components.

## Adding Integrations

```bash
npm run astro add <integration>
```
