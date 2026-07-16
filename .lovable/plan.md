
# Read-only audit — investor prototype of [ i ]

Scope: architecture inspection only. No files changed, no services touched.

## 1. Current architecture

- **Stack:** Vite + React 18 + TS, Tailwind + shadcn/Radix, react-router, TanStack Query, framer-motion, Capacitor (iOS/Android), MediaPipe (face/eye), Mapbox, Supabase (Lovable Cloud) client + 26 edge functions, MCP server exposed via `@lovable.dev/mcp-js`.
- **Size:** ~94k LOC TS/TSX. `src/components/` has **168 components**, `src/hooks/` has 40 hooks, 11 pages. `Index.tsx` = 906 LOC, `Studio.tsx` = 1,273 LOC, `Auth.tsx` = 587 LOC, `Create.tsx` = 679 LOC.
- **App areas (routes):**
  - `/start` LaunchChooser, `/demo` fully separate DemoApp (its own state/router/screens), `/auth`, `/`, `/create`, `/studio`, `/admin`, `/my-page`, `/social-connect`, `/promotion/:id`, `/.lovable/oauth/consent`, `/install`.
- **Feature clusters** (from component names): eye/gesture control (Blink*, Eye*, Gesture*, Combo*, FloatingControls, TargetOverlay/Editor), studio/creation (Studio, Create, ContentUpload, DuetStitch, Blur/AI text designer), discovery (DiscoveryMap, FavoriteLocations, NearbyPromotions, RoutePlanner), wallet/economy (Coin*, EarningBreakdownChart, DailySpinWheel, CoinGifting, TipCreator), social (Chat, GroupChat, Friends, LinkedSocialAccounts, MyPage), gamification (Achievements, Badges, Challenges, Leaderboard, SpinWheel), admin.
- **Backend:** 26 Edge Functions cover feed, rewards, referrals, tips, transfers, checkins, payouts, subscriptions, media metadata, AI (music/sfx/voiceover/subtitles/imoji/reply/text-style), attention validation, MCP. Two rounds of security hardening (RLS, GRANTs, security-definer RPCs) already applied per memory.

## 2. Investor-demo flow status

- A **dedicated demo track exists and is investor-ready in shape**: `src/demo/DemoApp.tsx` with 15 screens (splash → feed → offer → verify → reward → wallet → moneyMap → receipt → creator profile → campaign builder → click-earn → ELO overlay → product map → brand dashboard → attention analytics), guided tour + recording badge, isolated state (`useDemoState`), no auth wall.
- **Production track** (`/`) depends on auth, live data, MediaPipe camera, Mapbox — more fragile for a live pitch.
- **Verdict:** the `/demo` route is the correct investor surface; it is largely self-contained and can be polished without touching production code.

## 3. Strongest reusable assets (keep)

- **Design system** — cyberpunk tokens in `index.css`, shadcn base, safe-area/mobile-first patterns; consistent and distinctive.
- **Demo track** (`src/demo/**`) — narrative + screens already wired; the highest-leverage asset for investors.
- **Edge Functions + hardened RLS/GRANTs** — most business logic (rewards, tips, transfers, referrals, attention validation, MCP) is server-side and already secured.
- **Eye/gesture stack** — MediaPipe hooks (`useBlinkDetection`, `useEyeTracking`, `useGazeDirection`, `useGestureCombos`, `useScreenTargets`) + calibration + target editor is a differentiated feature.
- **MCP server** — OAuth-protected agent integration is a strong investor talking point.
- **Auth + role/security model** — user_roles table, security-definer `has_role`, RPCs, and 2 completed hardening waves.

## 4. Technical debt & duplication

- **Component explosion:** 168 components with many overlapping concerns (e.g. ~15 layout/button manager components: `ButtonFunctionManager`, `ButtonGroupManager`, `ButtonPresetManager`, `HiddenButtonsManager`, `LayoutEditor`, `LayoutTemplates`, `LayoutImportExport`, `LayoutHistoryControls`, `FloatingActionMenu`, `FloatingControls`, `DraggableButton`, …). Strong candidate for consolidation.
- **God pages:** `Studio.tsx` (1.3k), `Index.tsx` (906), `Create.tsx` (679) mix data-fetching, gesture wiring, UI, and business logic.
- **Type-safety escape hatches:** prior fixes used `as any` casts for dynamic Supabase updates in `CoinGifting`, `DailySpinWheel`, `useTasks` — silent runtime risk.
- **Two feature surfaces (demo vs. prod)** for similar flows (wallet, feed, campaigns). Fine for now, but risks divergence.
- **Heavy dependency surface:** Capacitor + MediaPipe + Mapbox + framer-motion + full Radix set — good for scope, but expensive to keep green on native builds.

## 5. Likely broken / risky areas

- **Eye-control on-device** on laptops/phones during a live demo: camera permission, lighting, calibration drift. Session-replay-driven bugfix history suggests this path has been iterated a lot; treat as demo risk.
- **Mapbox token** edge function was just rewritten (JWT-gated); needs a smoke test before pitching. Same for `validate-attention` (recent 400 on watchDuration bounds).
- **Type-cast update paths** noted above — can throw at runtime under real data.
- **Realtime + RLS interactions** after hardening — anon reads were revoked on several tables; any unauth-facing screen that still expects them will 401 silently.
- **Capacitor iOS/Android builds** are not verified in this audit; native permissions (camera, push) can regress.
- **Bundle size** at 94k LOC + MediaPipe/Mapbox likely produces a heavy first paint on `/` (less an issue for `/demo`).

## 6. Refactor vs. rebuild — recommendation

**Refactor, don't rebuild.** Justification:
- The demo path is already narrated end-to-end and isolated from production complexity — a rebuild would throw this away.
- Backend (26 functions, RLS, MCP, OAuth) is the expensive part and it is in good shape after two security waves.
- Debt is concentrated in a few god-files and a bloated component tree — mechanically fixable.
- Rebuild cost: months to reach current surface. Refactor cost to investor-ready: ~1–2 focused weeks (see phase plan).
- Only rebuild if the target audience needs a radically different product thesis than what `/demo` shows.

## 7. Phased execution plan (investor prototype)

**Phase 0 — Demo lock (1–2 days)**
- Freeze `/demo` as the pitch surface. Land a single "Investor Mode" entry from `/start`.
- Smoke-test each of the 15 demo screens; capture screenshots via Playwright; fix any visual/nav regressions only.
- Verify offline-friendly assets (no live camera/Mapbox dependency on the demo path).

**Phase 1 — Production hero paths (3–5 days)**
- Pick 3 hero flows to make bulletproof on `/`: (a) sign-in + onboarding, (b) feed + reward claim, (c) eye-control target demo on a controlled screen.
- Smoke-test edge functions used by those paths: `get-mapbox-token`, `validate-attention`, `issue-reward`, `get-personalized-feed`, `track-interaction`.
- Add a "kiosk / pitch" toggle that pre-authenticates a demo account and pins to hero flows.

**Phase 2 — Debt triage (3–4 days, parallelizable)**
- Split `Studio.tsx`, `Index.tsx`, `Create.tsx` into feature folders (data hook + view + subcomponents).
- Consolidate the 15+ layout/button-manager components behind one `LayoutManager` API.
- Replace `as any` Supabase casts with typed helpers.

**Phase 3 — Investor polish (2–3 days)**
- MCP live demo (Claude/ChatGPT connecting to iView tools) — already implemented, needs a scripted moment.
- Attention analytics + brand dashboard screens: real numbers seeded, not lorem.
- Perf pass: lazy-load MediaPipe/Mapbox only on routes that need them; verify `/demo` bundle stays lean.

**Phase 4 — Native + record (1–2 days)**
- Verify Capacitor iOS/Android build once, capture a screen-recorded demo as fallback if live camera fails on stage.

**Out of scope for the prototype (defer):**
- Rebuilding auth, redesigning tokens, replacing Supabase, adding new business features not on the demo storyboard.

## Bottom line

Keep the project. The `/demo` track + hardened backend + MCP already tell the investor story; the work is disciplined polish and de-bloating, not a rewrite.
