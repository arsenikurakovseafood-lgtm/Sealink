# Architecture

A modular frontend monolith. Next.js App Router provides a shared layout and catch-all route dispatcher. Feature modules render client-side application screens within the common shell.

- `src/app`: layout, route adapter, Tailwind entry point and responsive design tokens/styles.
- `src/components`: navigation shell and reusable UI. Button follows the shadcn/ui Slot + CVA composition pattern; `components.json` records aliases and styling configuration. Modal uses native dialog for focus containment and Escape handling.
- `src/features`: dashboard, company network, commercial workflows, capacity/messages/organization/settings and state provider.
- `src/data`: 18 fictional companies, 8 initial RFQs, 15 quotations, 10 capacity listings and three initial conversations.
- `src/types`: domain records and the versioned demonstration state contract.
- `src/lib`: business rules, utilities and behavioral tests.

React Context holds a single client-side state tree. Initialization reads localStorage after mount while the shell renders a loading state, avoiding hydration mismatches. Updates persist after initialization. Corrupt or incompatible storage falls back to seeds. Storage failures show a message and leave in-memory use available. Reset creates independent fresh records.

Company discovery combines exact structured filters with case-insensitive text lookup. Smart search is a constrained keyword parser: country/species alternatives use OR and capabilities/certifications use AND. Unsupported language gets an explanation rather than invented results.

RFQ input uses React Hook Form and Zod. Matching checks listed species and certification claims; it explicitly leaves delivery, grade and volume unknown. Simulated quotations reference invited suppliers and RFQs. Comparison is same-RFQ only; a price ranking requires equal unit and currency. Different Incoterms are disclosed and no landed-cost equivalence is asserted.

Future integrations should replace the state boundary with authorized server-side repositories and commands. Tenant IDs, permissions and secure storage must precede production data. Do not expose localStorage records as production entities without migration and access-control design.

## SeaLink 2.0

`/` is the public marketing homepage; `/join` and `/login` are explicit demonstration entry flows, not authentication. Existing trade screens now use `/app/*`; legacy paths redirect. `features/public.tsx` implements the public shell and onboarding. `data/pricing.ts` centralizes provisional monthly prices and benefits; no billing occurs.

`features/expansion.tsx` owns local logistics, recruitment, professional profiles and capacity publishing. These records use `sealink-expansion-v1` independently of the unchanged v1 trade storage. The reset event clears both datasets and the local onboarding marker (`sealink-account`). Company IDs continue referencing the original 18 records. New capacity listings appear in Capacity Exchange. Applicant information appears only in the local employer review view; this is a single-browser demonstration, not authorization or tenant isolation.

The premium visual layer lives in `src/app/premium.css`, imported after the base UI stylesheet. Local WebP photography is rendered with Next Image, including responsive sizes, lazy loading below the fold and a priority hero. Local WOFF2 typography uses font-display: swap. Sources and licenses are recorded in `docs/ASSET_CREDITS.md` and `/credits`. No real carrier availability, jobs or company verification is asserted.

## SeaLink 2.2 workspace

`src/lib/workspace.ts` adapts existing trade and operations records into a typed internal inbox projection. It does not create remote events. Read markers are separate from RFQ/offer statuses. Message keys include the conversation entry count so a new entry can be unread without discarding old review decisions. Future external integrations should supply authorized source adapters, not masquerade as these local records.

`src/features/workspace-state.tsx` owns the versioned `sealink-workspace-v22` local state: sidebar group expansion, compact mode, reviewed record IDs, illustrative team directory, company preferences and prototype planning notes. A Zod schema validates restoration. The existing `sealink-demo-v1`, `sealink-expansion-v1` and account marker remain in place. Reset Demo Data clears workspace state through the existing reset event.

The daily dashboard consumes the same inbox projection and existing RFQs. The previous network dashboard remains accessible at `/app/network-overview`. Organization profile editing remains the same form, now within organization section navigation. Added organization sections are `/app/team`, `/app/business`, `/app/communications`, and `/app/company-preferences`.

`/app/orders` displays awarded RFQs as unconfirmed planning context. `/app/shipments` displays saved logistics inquiries, not actual shipments. Notes persist locally. Neither screen creates purchase orders, bookings, transport tracking or contracts. Team roles and membership are local prototypes with no invitations or permission enforcement.

`src/components/workspace-nav.tsx` provides grouped accessible buttons and links, state persistence, route indicators and desktop icon-only navigation. Mobile navigation supports Escape, focus containment and focus restoration; compact styling remains desktop-only. Additional workspace styling lives in `src/app/workspace.css`.

## SeaLink 3.0 Phase 1 homepage

`src/features/homepage-3.tsx` replaces only the homepage content. It reads existing demo, operations and workspace state without mutating commercial records. Its interactive preview uses actual company filters, RFQs, offers, inbox projections and activity; local tabs and country/search controls change only the presentation. Links open the existing application routes.

`src/app/homepage-3.css` is scoped to `.home3-site` and `.home3` to keep operational screen styling intact. The public shell applies the scope only at `/`; onboarding, credits and `/app/*` remain on their existing shells. A mobile public-navigation control and homepage main landmark are included. Prices continue to come from `src/data/pricing.ts`. No backend, auth, email, WhatsApp, billing or deployment configuration changes are introduced.

The hero uses local generated industrial imagery, explicitly disclosed as a concept illustration. No runtime image CDN dependency is introduced. Homepage tests now assert the new headline, product-preview interactions, country filtering, every linked destination/anchor, responsive layouts, reduced motion and asset loading. Previous screenshot expectations for the removed ocean composition were replaced; existing business workflow tests remain in place.
