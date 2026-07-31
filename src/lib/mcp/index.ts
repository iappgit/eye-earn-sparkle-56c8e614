import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import listSavedContent from "./tools/list-saved-content";
import listNotifications from "./tools/list-notifications";
import searchPromotions from "./tools/search-promotions";

// The OAuth issuer MUST be the direct Supabase host (not the .lovable.cloud proxy).
// Derived from the project ref, which Vite inlines at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "eye-rewards",
  title: "Eye Rewards",
  version: "0.1.0",
  instructions:
    "Tools for the Eye Rewards app. Use these to read the signed-in user's profile, saved (watch-later) videos, notifications, and to search active promotions.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getProfile, listSavedContent, listNotifications, searchPromotions],
});
