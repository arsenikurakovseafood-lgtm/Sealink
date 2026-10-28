# SeaLink

A connected B2B seafood industry product preview built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Lucide, React Hook Form and Zod. No backend, accounts, credentials or external commercial delivery.

## Run

Requires Node.js 24 and npm 11 (validated with Node 24.19.0).

```sh
npm ci
npm run dev
```

Open `http://localhost:3000` in a browser on the machine running the app. In a cloud workspace, use its supported port forwarding for port 3000, if available. No hosted deployment is included.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## Explore

- Dashboard: metrics derived from commercial records, active sourcing, recommendations and activity.
- Discover / Companies: combined structured filters, constrained keyword search, profiles and saved companies.
- RFQs: validated drafts, editing, supplier matching, recipient selection, simulated distribution and responses.
- Offers: details, shortlisting, comparison restricted to the same RFQ, simulated awards.
- Capacity Exchange: services, countries, species and date filtering; local inquiry messages.
- Messages: fictional threads and local-only messages.
- My Organization: editable multi-activity company profile reflected in the shell.
- Settings: density and notification preferences, illustrative plans and confirmed demo reset.

All data is fictional. Certification claims are self-reported and unverified. Prices are illustrative. The fixed demonstration period is October–December 2026. Browser localStorage persists demo edits under `sealink-demo-v1`; use fictional information only. The app is unsuitable for sensitive data or real procurement.

See [Demo guide](docs/DEMO_GUIDE.md), [Architecture](docs/ARCHITECTURE.md), [Product vision](docs/PRODUCT_VISION.md) and [Decisions](docs/DECISIONS.md).

## Browser checks

Start the app, then run `npm run test:e2e`. Install a Playwright browser with `npx playwright install chromium` first, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` to use this cloud environment’s installed browser. The two tests exercise the connected sourcing flow, local persistence/reset, all primary routes and mobile navigation.

`npm run build` and `npm run dev` use webpack for compatibility with cloud environments that restrict Turbopack worker sockets.
