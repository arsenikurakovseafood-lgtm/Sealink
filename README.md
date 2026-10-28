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

## SeaLink 2.0

Public pages: `/`, `/join`, `/login`. Workspace: `/app`, `/app/marketplace`, existing `/app/discover`, `/app/rfqs`, `/app/offers`, `/app/capacity`, plus `/app/logistics`, `/app/jobs`, `/app/profile`, `/app/publish-capacity`. Original company data and RFQ workflows remain. No additional environment variables or services are needed.

New prices and tier benefits in `src/data/pricing.ts` are provisional, not finalized commercial policy. All new logistics, recruitment and publishing workflows are local-only demonstrations. The premium redesign replaces the illustration with locally served, licensed maritime photography; see docs/ASSET_CREDITS.md. No deployment is claimed by the source implementation.

## Premium visual redesign

Public pages now use self-hosted Manrope with Instrument Serif editorial accents, a cinematic ocean hero, asymmetrical photographic panels, a fisheries-collaboration image section, refined membership hierarchy and reduced-motion-aware transitions. Operational business logic is unchanged. Four distinct photographs and two font subsets ship with the repository; no external image/font hosts or new environment variables are required. Sources, transformations and license notices are in [asset credits](docs/ASSET_CREDITS.md), with public attribution at `/credits`.

The redesign is based on `feature/sealink-2` so the existing public site and all new operations workflows remain included. Review the full branch against main; do not merge automatically.

## SeaLink 2.2 workspace

- `/app`: daily overview with actionable local review records and state-derived metrics.
- `/app/inbox`: internal category/search/unread filters and persistent read decisions.
- `/app/organization`, `/app/team`, `/app/business`, `/app/communications`, `/app/company-preferences`: company profile and local business management.
- `/app/orders`, `/app/shipments`: clearly labeled planning prototypes based on awarded RFQs and saved transport inquiries, with local notes.
- `/app/network-overview`: the preserved discovery-focused dashboard.

Sidebar groups and desktop compact mode persist separately from existing demonstration data. Mobile navigation includes focus containment and Escape dismissal. No external messaging integrations, team authorization, purchase orders or actual shipment tracking are implemented. No new dependencies, backend services or environment variables are required. Public photo treatments gain subtle orange accents while retaining documented licensed imagery; dedicated industrial replacement photography remains a sourcing follow-up.

See [SeaLink 2.2 review and screenshots](docs/WORKSPACE_22_REVIEW.md) for the implemented workspace flows, validation evidence and known limits.
