# Eye Rewards → [ i ] MVP: Base-or-Reference Audit

Read-only audit. No code changed.

Target loop: open app → choose earn campaign → attention verification → earn reward → wallet updates → convert → spend.

## 1. What already supports the loop

The loop exists **twice**, in two disconnected tracks.

**Demo track (`src/demo/`, ~5.5k lines, no backend):** covers the full loop end-to-end today.
`DemoSplash → DemoFeed → DemoOffer → DemoVerify → DemoReward → DemoWallet → convert/pay/withdraw/tip → DemoReceipt`, driven by one reducer (`useDemoState.tsx`) and static `demoData.ts`. Verification is timer-based (~4.5s) with a local camera POP-signal preview (`useDemoPopTracking`, MediaPipe with synthetic fallback) that is illustrative, not gating.

**Production track (`src/pages/Index.tsx` + components, backend-connected):** also covers the loop, but through much heavier machinery.
Feed (`MediaCard`, `PersonalizedFeed`, `UnifiedContentFeed`) → `validate-attention` / `track-interaction` edge functions → `issue-reward` with daily caps (`daily_reward_caps`, `reward_logs`) → `WalletScreen` reading `profiles.icoin_balance` / `vicoin_balance` and `transactions` → convert via `atomic_convert_coins` RPC → spend via `tip-creator` / `request-payout`.

Coin model differs: demo uses acoin/icoin, production uses icoin/vicoin. That mismatch has to be resolved once, deliberately.

## 2. Screens/components closest to the MVP

Closest, near-reusable as-is:
- `src/demo/screens/DemoFeed.tsx`, `DemoOffer.tsx`, `DemoVerify.tsx`, `DemoReward.tsx`, `DemoWallet.tsx`, `DemoReceipt.tsx`
- `src/demo/useDemoState.tsx` (clean single-reducer loop contract)
- `src/demo/hooks/useDemoPopTracking.ts` + `lib/demoPopSignalMath.ts` (attention simulation with graceful fallback)
- `src/components/EyeTrackingIndicator.tsx`, `AttentionProgressBar.tsx`, `LiveAttentionGraph.tsx`, `RewardAnimation3D.tsx`, `CoinDisplay.tsx`, `BottomNavigation.tsx`, `FeedTopBar.tsx`, `FeedCreatorChip.tsx`

Usable but needs trimming: `WalletScreen.tsx` (453 lines, mixed convert/payout/KYC), `MediaCard.tsx` (730 lines, feed + attention + rewards + tipping in one file).

Not MVP: `Index.tsx` (897 lines, orchestrates ~20 subsystems), `Studio.tsx` (1273), `Create.tsx` (679), `SettingsScreen.tsx` (653, source of the recent `label` crash).

## 3. Backend / realtime risk when simplifying

- **49 distinct tables** referenced across the app, plus **26 edge functions**. Only ~8 tables are needed for the MVP loop (`profiles`, `transactions`, `user_content`/`promotions`, `reward_logs`, `daily_reward_caps`, `content_interactions`, `user_roles`, `notifications`).
- **`profiles` is a hub table** (30 call sites) carrying balances, KYC, phone, follow counts. Balance mutations are locked behind SECURITY DEFINER RPCs (`atomic_convert_coins`, `atomic_tip_creator`, `atomic_request_payout`, `atomic_update_balance`) with advisory locks. Do not touch or re-implement these — reuse them.
- **Column-level grants + private RPCs** from the two security hardening passes (`get_my_profile_private`, `get_leaderboard`, revoked anon execute). Naively selecting `*` from `profiles` or `user_levels` will fail with permission errors, not empty results.
- **Triggers are load-bearing**: `handle_new_user` creates profile + default role; balance/count triggers on likes, follows, contributors. Removing tables that triggers write into breaks signup.
- **Realtime** is used in 8 files, mostly chat (`messages`, `conversation_participants`, `typing`) which the MVP does not need. `useNotifications` realtime has already caused blank-screen crashes (subscribe-order bug, fixed by per-mount topics) — treat realtime as opt-in for MVP, not baseline.
- **Storage buckets** `content-uploads`, `studio-media`, `kyc-documents`; only content-uploads matters for MVP.

Riskiest simplification moves: deleting tables/functions referenced by triggers, changing the coin schema, and stripping auth/roles.

## 4. Extra scope — hide or defer

Defer behind flags or route removal (keep code, hide entry points):
- Studio + Create suite (editor, blur, drawing, AI text/voice/music/SFX/subtitles/imoji)
- Eye-gesture remote control, gesture combos, target command system, calibration flows
- Discovery map, routes, proximity alerts, check-ins, favorite locations
- Messaging/chat, group chat, stories, duet/stitch, social imports and unified feed
- Gamification: XP, levels, leaderboard, achievements, spin wheel, streaks, challenges, tasks
- Referrals, subscriptions/Stripe, KYC + payouts, MCP/OAuth server, admin console, PWA install/offline sync

Keep in MVP: auth, feed, attention verification, reward issuance with caps, wallet + transactions, convert, one spend action.

## 5. Recommendation

**Use Eye Rewards as the base — but build the MVP on the demo track, not the production track.**

Rationale: a clean project would still need to re-earn the two hardest assets here — the hardened balance/reward backend (atomic RPCs, caps, grants, triggers) and the attention-simulation stack. Those are the parts most expensive to rebuild and least likely to be reproduced correctly. The liability is the surrounding 90k lines of feature sprawl, and that is a scoping problem, solvable by hiding routes, not a rewrite problem.

"Attention Wallet as a clean base" is the right call only if the MVP must ship without real balances or verification (pure clickable prototype). If the MVP needs real persisted balances, it is cheaper to carve down Eye Rewards.

Concretely: promote the demo loop to a first-class `/app` surface, then swap its reducer's mocked mutations for the existing edge functions and RPCs one node at a time.

## 6. Safest duplicate/branch/variant strategy

Order matters — do this before any implementation:

1. **Publish + tag the current state** as the investor-demo reference build so `/demo` stays presentable regardless of MVP churn.
2. **Push to GitHub** and branch (`mvp-i`). Do the carve-down on the branch; keep `main` as the reference build.
3. **Add a route variant, do not fork the repo.** New `/app` route tree reusing demo screens, alongside existing `/` and `/demo`. Same Supabase project, no schema fork.
4. **Feature-flag deferred areas** via the existing `feature_flags` table + `featureFlags.service.ts` rather than deleting components — reversible, and avoids trigger/grant breakage.
5. **Do not fork the database.** Schema stays; MVP simply reads/writes a subset.
6. Delete nothing in phase 1. Removal happens only after `/app` is verified end-to-end.

## 7. Phased plan (not implemented)

**Phase 0 — Freeze and branch:** tag reference build, GitHub sync, `mvp-i` branch, inventory of MVP-critical tables/functions. Decide the coin model (recommend adopting production `icoin`/`vicoin` and renaming demo `acoin`).

**Phase 1 — `/app` shell from demo screens:** new route tree, demo screens copied into `src/app/`, still mock-driven. Trim nav to Feed / Wallet / Profile. Outcome: full loop clickable at `/app` with zero backend risk.

**Phase 2 — Real auth + real balances:** wire `/app` to `AuthContext`, read balances via `get_my_profile_private`, read history from `transactions`. Convert uses `atomic_convert_coins`. Verification still simulated. Outcome: wallet numbers persist.

**Phase 3 — Real reward issuance:** connect verification completion to `validate-attention` → `issue-reward`, honoring `daily_reward_caps` and `reward_logs` idempotency. Surface cap-reached and already-claimed states. Outcome: earning is genuine and non-farmable.

**Phase 4 — Real campaigns + one spend path:** feed reads live `promotions` / `user_content` instead of `demoData`; enable exactly one spend action (tip via `atomic_tip_creator`) and keep payout/KYC deferred. Outcome: loop closed on real data.

**Phase 5 — Harden and hide:** flag off everything in section 4, run the security scanner and linter, verify signup triggers and grants on a fresh account, confirm no realtime subscription leaks. Outcome: shippable MVP; reference build untouched.

**Phase 6 (optional) — Re-introduce differentiators:** eye-gesture control and target commands return as an opt-in enhancement layer on the stable loop, not as a dependency of it.
