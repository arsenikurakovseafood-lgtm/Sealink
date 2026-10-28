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

Photography remains an explicitly labeled illustration placeholder. Replace it with downloaded, appropriately licensed maritime photography and record attribution before public production launch. No real carrier availability, jobs or company verification is asserted.
