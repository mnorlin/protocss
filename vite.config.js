import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";
import fg from "fast-glob";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE = process.env.NODE_ENV === "production" ? "/prod-prefix/" : "/";

function getHtmlInputs() {
  const files = fg.sync("src/docs/**/*.html");

  return files.reduce((inputs, file) => {
    // Creates names like: docs/accordion
    const name = relative("src/docs", file)
      .replace(/\.html$/, "")
      .replace(/\\/g, "/");

    inputs[name] = resolve(__dirname, file);
    return inputs;
  }, {});
}

function rewriteAbsoluteLinks() {
  return {
    name: "rewrite-absolute-links",
    transformIndexHtml(html) {
      // Rewrite absolute links in href and src attributes
      return html
        .replace(/href="\/(?!\/)/g, `href="${BASE}`)
        .replace(/src="\/(?!\/)/g, `src="${BASE}`);
    },
  };
}

export default defineConfig({
  root: "src",
  plugins: [injectHTML(), rewriteAbsoluteLinks()],
  base: BASE,
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        ...getHtmlInputs(),
      },
    },
  },
});
