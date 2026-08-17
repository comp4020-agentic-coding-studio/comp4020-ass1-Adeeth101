import { readdirSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite";

// Every .html file in the repo is a page and a build entry, so a multi-page
// hand-written site needs no build config: add pages, link them, ship.
// (Vite's default would build only the root index.html and silently drop the
// rest from dist/ — fine locally, 404s deployed.)
const SKIP = new Set(["node_modules", "dist", "spec", "scripts", "reflections"]);

function htmlEntries(dir = "."): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") || SKIP.has(entry.name)) return [];
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlEntries(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

// `base: "./"` makes built asset URLs relative, so the site works under any
// GitHub Pages path (username.github.io/your-repo/) without further config.
export default defineConfig({
  base: "./",
  build: {
    // Frame-sequence frames are never inlined, however small they are. Vite's
    // 4 kB default swallowed 119 of the 208 frames into the JS bundle as
    // base64, taking it from 64 kB to 428 kB: base64 costs a third more bytes
    // than binary, the frames stop being separately cacheable, and every one
    // of them has to be parsed before the page can run — for images most
    // readers will never scroll to. Everything else keeps the default, which
    // is what inlines the small SVG stand-ins.
    assetsInlineLimit: (filePath: string) =>
      filePath.includes("images/frames/") || filePath.includes("images\\frames\\")
        ? false
        : undefined,
    rollupOptions: {
      input: htmlEntries(),
    },
  },
});
