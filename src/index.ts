import { env } from "cloudflare:workers";

import { createMcpAgent } from "@cloudflare/playwright-mcp";

const PlaywrightMCP = createMcpAgent(env.BROWSER);

const sseHandler = PlaywrightMCP.mount("/sse");

// Custom fetch handler to check for API key
export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);
    if (url.pathname === "/sse") {
      const apiKey = request.headers.get("x-api-key");
      if (!env.API_KEY || apiKey !== env.API_KEY) {
        return new Response("Unauthorized", { status: 401 });
      }
    }
    return sseHandler.fetch(request, env, ctx);
  },
};
