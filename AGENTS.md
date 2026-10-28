# Working on SeaLink

Use the existing checkout: cloud tasks are isolated; do not create worktrees unless requested.

- Node 24 and npm 11. Install with `npm ci`; run `npm run dev` on port 3000.
- Required checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
- `src/data/demo.ts` is the coherent fictional source dataset. Preserve valid company/RFQ/quotation/capacity relationships.
- `src/lib/business.ts` owns filtering, matching, validation, comparison and persistence parsing. Test behavioral changes here.
- `src/features/store.tsx` owns versioned local state. Never access localStorage during server render. Do not add credentials or production information.
- All commercial operations must remain explicitly simulated until a separate backend milestone is authorized. No email, AI API, authentication or billing integrations in this preview.
- Maintain keyboard-accessible controls, responsive tables and explicit feedback. Certification claims are never independently verified.
- Update documentation when behavior changes. Keep the modular feature structure; do not turn pages into disconnected datasets.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

- For browser checks, start the app and run `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e` in this cloud machine. Elsewhere install Playwright Chromium or set the executable path appropriately.
