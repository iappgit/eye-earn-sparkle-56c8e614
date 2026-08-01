# Fix `useNotifications` Realtime Subscription Order

## Goal
Resolve the runtime error `cannot add postgres_changes callbacks ... after subscribe()` in `src/hooks/useNotifications.ts` by ensuring every `postgres_changes` listener is registered before `.subscribe()` is called. Keep all existing behavior intact.

## Current State
The real-time subscription block in `useNotifications.ts` currently has only one `INSERT` listener on `public.notifications`. It is already chained before `.subscribe()`. We will inspect the actual build/runtime error to confirm whether additional handlers have been added out of order or whether the issue is in a related hook (e.g., `useRealtime.ts` or `realtime.service.ts`).

## Steps
1. Re-read `src/hooks/useNotifications.ts` and any other real-time hooks that may have changed since the last audit.
2. Re-order the channel chain so that every `.on('postgres_changes', ...)` call appears before `.subscribe()`.
3. If the channel needs multiple events (INSERT, UPDATE, DELETE), chain them in sequence before subscribe, then attach the subscription status callback at the end if needed.
4. Run a TypeScript/build check to ensure no type regressions.
5. Rebuild the preview to confirm the app renders normally.

## Scope
This is a narrow bug fix only. No UI changes, no new features, no changes to data contracts or business logic.

## Validation
- `bun run build` (or the project's build command) passes without errors.
- The dev server / preview renders without the Realtime subscription error.
