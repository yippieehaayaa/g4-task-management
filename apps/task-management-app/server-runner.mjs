/**
 * Production server runner for TanStack Start.
 * Converts Node HTTP requests to Fetch API and runs the built server handler.
 */
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3000);

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function buildRequest(req, body) {
  const protocol = req.socket.encrypted ? "https:" : "http:";
  const host = req.headers.host ?? `localhost:${PORT}`;
  const url = `${protocol}//${host}${req.url}`;
  return new Request(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" && body?.length > 0 ? body : undefined,
  });
}

async function sendResponse(res, response) {
  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  if (response.body) {
    for await (const chunk of response.body) res.write(chunk);
  }
  res.end();
}

async function main() {
  const serverModule = await import(join(__dirname, "dist/server/server.js"));
  const handler = serverModule.default;

  const listener = async (req, res) => {
    try {
      const body = await readBody(req);
      const request = buildRequest(req, body);
      const response = await handler.fetch(request);
      await sendResponse(res, response);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  };

  const server = createServer(listener);
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

main().catch(console.error);
