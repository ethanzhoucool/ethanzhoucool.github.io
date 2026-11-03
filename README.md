# ethanzhou.ca

my personal portfolio — built with react + tailwind css.

features interactive cursor, flip card photo, mouse-tracking gradient bg, magnetic buttons, and proximity text effects.

**live →** [ethanzhou.ca](https://www.ethanzhou.ca)

## run locally

```bash
npm install
npm start          # dev server on http://localhost:3000
```

```bash
npm test           # jest, in watch mode (CI runs it with --watchAll=false)
npm run build      # production build into build/
```

## deploys

vercel builds and deploys `main` to www.ethanzhou.ca. github actions runs the tests and a production build on every push and pull request (`ci.yml`), and checks the live site after each push to `main` (`smoke.yml`).
