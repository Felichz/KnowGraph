/* global Request, Response, Headers */
// The demo site is static assets; this runs only for its videos (run_worker_first in wrangler.jsonc).

/**
 * A video with byte ranges. Static assets always answer 200 with the whole file, and without a 206 the
 * browser can't seek in a video: a chapter click starts it over from 0. So the videos go through here,
 * the asset is read once, and the requested slice comes back as a 206.
 */
async function ranged(request, env) {
  const asset = await env.ASSETS.fetch(new Request(request.url, { method: "GET" }));
  if (!asset.ok) return asset;
  const headers = new Headers(asset.headers);
  headers.set("accept-ranges", "bytes");
  headers.delete("content-encoding");
  const head = request.method === "HEAD";
  const m = /^bytes=(\d*)-(\d*)$/.exec((request.headers.get("range") || "").trim());
  if (!m || (m[1] === "" && m[2] === "")) return new Response(head ? null : asset.body, { status: 200, headers });
  const body = await asset.arrayBuffer();
  const size = body.byteLength;
  let start, end;
  if (m[1] === "") {
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { "content-range": `bytes */${size}` } });
  }
  headers.set("content-range", `bytes ${start}-${end}/${size}`);
  headers.set("content-length", String(end - start + 1));
  return new Response(head ? null : body.slice(start, end + 1), { status: 206, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/media/") && url.pathname.endsWith(".mp4")) return ranged(request, env);
    return env.ASSETS.fetch(request);
  },
};
