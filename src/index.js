export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "GET, HEAD, OPTIONS",
          "access-control-allow-headers": "*, Authorization",
          "access-control-max-age": "86400",
        },
      });
    }

    // API_KEY が設定されている場合は認証を要求
    if (env.API_KEY) {
      const key =
        url.searchParams.get("key") ||
        request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");

      if (key !== env.API_KEY) {
        return jsonResponse({ error: "Unauthorized" }, 401, origin);
      }
    }

    const targetUrl = url.searchParams.get("url");
    if (!targetUrl) {
      return jsonResponse({ error: "url parameter is required" }, 400, origin);
    }

    let parsed;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return jsonResponse({ error: "Invalid URL" }, 400, origin);
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return jsonResponse({ error: "Only http/https allowed" }, 400, origin);
    }

    try {
      const upstream = await fetch(targetUrl, {
        method: request.method,
        headers: {
          "user-agent":
            request.headers.get("user-agent") || "cloudflare-proxy/1.0",
          accept: request.headers.get("accept") || "*/*",
          "accept-language": request.headers.get("accept-language") || "",
        },
        cf: {
          cacheTtl: 300,
          cacheEverything: true,
        },
      });

      const responseHeaders = new Headers(upstream.headers);
      responseHeaders.set("access-control-allow-origin", origin);
      responseHeaders.set("access-control-expose-headers", "*");

      return new Response(upstream.body, {
        status: upstream.status,
        headers: responseHeaders,
      });
    } catch (e) {
      return jsonResponse(
        { error: "Failed to fetch", detail: String(e) },
        502,
        origin,
      );
    }
  },
};

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
    },
  });
}
