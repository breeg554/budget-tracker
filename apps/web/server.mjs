import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import { createProxyMiddleware } from "http-proxy-middleware";
import compression from "compression";
import express from "express";
import morgan from "morgan";

installGlobals();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const isProd = process.env.NODE_ENV === "production";

const viteDevServer = isProd
  ? undefined
  : await import("vite").then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
        logLevel: "info",
      })
    );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.API_URL,
    changeOrigin: true,
  })
);

app.use(morgan(isProd ? "tiny" : "combined"));

// handle SSR requests
app.all("*", remixHandler);

app.listen(port, (err) => {
  if (err) console.log(`Error during server setup 🚨   `);
  console.log(`App listening at: ${port} ✅  `);
});
