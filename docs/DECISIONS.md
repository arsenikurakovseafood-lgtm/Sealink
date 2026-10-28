# Decisions

1. **Preview before infrastructure.** All actions are local. No Supabase, database, Stripe, email, AI endpoint or real verification.
2. **One connected state tree.** RFQ status, offers, saved companies and organization updates are shared rather than copied between screens.
3. **Fixed demo period.** Records use October–December 2026 to support a consistent founder demonstration. This is not live availability or market pricing.
4. **Transparent matching.** Species and certification claims determine fit; supplier capacity, delivery and grade remain unconfirmed. A partial match is not a guarantee.
5. **Constrained smart search.** Supported keyword grammar is exposed in the interface. Arbitrary natural language is rejected.
6. **Accessible, lightweight UI.** Lucide icons, composable shadcn-style Button, native modal focus handling and CSS responsive layout avoid an unnecessarily large component dependency surface.
7. **No automatic price normalization.** Unit/currency differences prevent ranking, and differing delivery terms require manual evaluation.
8. **Local storage only.** Convenience persistence is deliberately unsuitable for sensitive information. Preferences about future emails do not enable email delivery.
9. **No remote publication implied.** A local app and production build do not constitute a deployment.
10. **Webpack for this runtime.** Turbopack worker socket binding was restricted in the cloud sandbox. The equivalent supported webpack build and development mode are used and tested.
