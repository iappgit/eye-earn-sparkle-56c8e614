import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function db(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "search_promotions",
  title: "Search promotions",
  description: "Search active Eye Rewards promotions by keyword or category. Returns location, reward, and business info.",
  inputSchema: {
    query: z.string().trim().optional().describe("Free-text search matched against business name/description"),
    category: z.string().trim().optional(),
    limit: z.number().int().positive().default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ query, category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let q = db(ctx)
      .from("promotions")
      .select("id,business_name,description,category,reward_type,reward_amount,address,latitude,longitude,expires_at,image_url")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (category) q = q.eq("category", category);
    if (query) q = q.or(`business_name.ilike.%${query}%,description.ilike.%${query}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { promotions: data ?? [] },
    };
  },
});
