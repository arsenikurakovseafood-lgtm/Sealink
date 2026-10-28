# SeaLink 3.0 Phase 1 — homepage review

Base: `feature/sealink-workspace-2-2` at `129102f`. Review branch: `feature/sealink-3-homepage`. This is a homepage replacement, not an internal dashboard redesign. Existing commercial logic, data, prices, application routes and deployment configuration are preserved.

## Before and after

The old hero was a full-width muted ocean photograph with an aspirational headline and no product interface in the first screen. The new hero uses a light integrated composition: the direct headline “Trade seafood. Run your business. One platform.”, two clear actions, industrial imagery and an interactive application preview in the first desktop viewport. The mobile first viewport also includes the product preview's heading and operational counts.

The page now follows seven connected sections: immediate value, Discover → Connect → Manage, marketplace capabilities, business workspace, a linked product experience, indicative memberships and final CTA. The old coastal/meeting-image and filler sections have been removed from the homepage.

| Evidence | Link |
| --- | --- |
| Desktop first-screen comparison (before left, after right) | [Compare](screenshots/homepage-3/desktop-comparison.png) |
| Mobile first-screen comparison (before left, after right) | [Compare](screenshots/homepage-3/mobile-comparison.png) |
| Full desktop before | [Before](screenshots/homepage-3/desktop-before.png) |
| Full desktop after | [After](screenshots/homepage-3/desktop-after.png) |
| Full mobile before | [Before](screenshots/homepage-3/mobile-before.png) |
| Full mobile after | [After](screenshots/homepage-3/mobile-after.png) |

Before images were freshly captured prior to implementation. After images were regenerated against the final local production build. Screenshots use deterministic seeded records and reduced motion; viewport sizes are desktop 1440×1000 and mobile 390×844. Browser checks additionally exercise 768px and 1024px widths.

## Genuine product representation

The hero's Overview, Inbox and Marketplace buttons change a working preview. Counts, RFQs, messages, quotations, company search and activity come from the existing demonstration state and business functions. Company country controls filter actual seed records, and product links open existing company/RFQ/offer pages. No remote notifications or external delivery capability is invented.

The planned email/WhatsApp strip explicitly states that those connections are not operational. Membership remains centralized in `src/data/pricing.ts`, with provisional prices and inactive billing clearly identified. One contextual disclosure and a details dialog replace decorative repetition of demo notices.

## Visual iterations and verification

1. Captured the existing desktop/mobile homepage before implementation and consulted the earlier REVIEW.md and SCREENSHOTS.md baseline.
2. Implemented the new composition, full narrative, read-only data-backed preview, industrial asset and scoped typography/layout system.
3. Captured and visually compared both sizes. Verified a materially different first-screen composition rather than a restyled ocean hero.
4. Measured representative text contrast, found two pale preview labels at 3.79:1 and 4.47:1, and darkened them to 5.32:1 and 5.40:1. Main supporting copy is 18px at 6.85:1; representative body paragraphs are 16px at approximately 5.52–5.53:1. Primary CTA contrast is 4.64:1. The sampled corrected pairs range from 4.58:1 to 6.85:1. These are representative computed CSS color checks, not a complete WCAG audit of every pixel or interaction. Raw measurements are in `screenshots/homepage-3/contrast.json`.
5. Corrected the inherited tablet navigation gap so the mobile menu is also available at 701–900px. Captured the final version and repeated browser review.

Executed checks: ESLint pass; TypeScript pass; production build pass; 14 business-rule tests pass; 12 Chromium browser tests pass. Tests cover all homepage link destinations/anchors, product tabs/search, country selection, disclosure modal, membership selection, assets/fonts, reduced motion, responsive overflow, first-desktop-screen product visibility and preserved sourcing/award/reset, organization, recruitment, logistics and capacity workflows.

Public shell/navigation adjustments and `.home3`-scoped CSS do not redesign `/app/*`. No new package dependency, environment variable, backend service, production authentication, payment processor or external communication integration is added.

## Industrial asset and remaining limits

The container-terminal scene is an original AI-generated concept illustration with visible labeling, not a licensed documentary photograph of a real port or SeaLink facility. It is delivered as a locally served 1400px WebP; no fragile third-party image URL is needed. Original source details and generation record are in ASSET_CREDITS.md. Documentary industrial photography would require a separately cleared asset if preferred in a later content pass.

Application records remain fictional/local. Email and WhatsApp remain planned, and billing remains inactive. No merge or production deployment was performed. A Vercel preview URL must be verified from the actual integration; none is fabricated here.
