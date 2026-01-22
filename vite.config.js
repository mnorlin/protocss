import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";
import fg from "fast-glob";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

export default defineConfig({
  root: "src",
  plugins: [injectHTML()],
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
