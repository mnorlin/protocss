import hljs from "highlight.js";
import githubSyntax from "highlight.js/styles/github.css?inline";
import { LitElement, css, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import langCss from "highlight.js/lib/languages/css";
import formComponents from "/styles/proto-css/form/index.css?inline";
import buttonComponent from "/styles/proto-css/components/button.css?inline";
hljs.registerLanguage("css", langCss);

const defaultConfig = {
  colorScheme: "light dark",
  primaryColor: "#1c71d8",
  //primaryHue: 260,
  spaceBase: 4,
  fontSize: 16,
  radiusFactor: 1,
};

export class ProtoCode extends LitElement {
  static properties = {
    configId: { type: String },
    styleCode: { type: String },
    config: { type: Object },
  };

  static styles = css`
    ${unsafeCSS(githubSyntax)}
    ${unsafeCSS(formComponents)}
    ${unsafeCSS(buttonComponent)}
    :host {
      font-size: 16px;
    }
    pre {
      border: 1px solid var(--color-contrast-2);
      border-radius: 4px;
      background-color: var(--color-contrast-1);
      padding: 4px;
      overflow-x: auto;
      font-size: 12px;
    }

    .buttons {
      display: flex;
      gap: var(--space-gap);
    }
  `;

  constructor() {
    super();
    this.configId = null;
    this.config = defaultConfig;
  }

  firstUpdated() {
    this.restoreFromLocalStorage();
  }

  updated() {
    const style = document.getElementById(this.configId);
    this.styleCode = dedentCss(`
    :root {
      color-scheme: ${this.config.colorScheme};
      --color-primary: ${this.config.primaryHue ? `oklch(0.58 0.23 ${this.config.primaryHue})` : this.config.primaryColor};
      --space-base: ${this.config.spaceBase}px;
      --border-radius: calc(${this.config.radiusFactor} * var(--space-base));
      font-size: ${this.config.fontSize}px;
    }`);
    style.innerText = this.styleCode;
    this.saveToLocalStorage();
  }

  restoreFromLocalStorage() {
    this.config = JSON.parse(window.localStorage.getItem("protocss")) ?? defaultConfig;
  }

  saveToLocalStorage() {
    window.localStorage.setItem("protocss", JSON.stringify(this.config));
    this.dispatchEvent(
      new CustomEvent("proto-config-changed", {
        detail: { colorScheme: this.config.colorScheme },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <form
        id="style-form"
        @submit=${(e) => {
          this.#copyToClipboard();
          e.preventDefault();
        }}
        @input=${(e) => {
          this.config = { ...this.config, [e.target.name]: e.target.value };
        }}
        @reset=${() => (this.config = defaultConfig)}
      >
        <!--
        <label>
          Primary color
          <input
            name="primaryHue"
            type="range"
            min="0"
            max="360"
            value=${this.config.primaryHue}
          />
        </label>
        -->
        <label>
          Primary color
          <input name="primaryColor" type="color" value=${this.config.primaryColor} />
        </label>

        <label>
          Spacing
          <input
            name="spaceBase"
            type="range"
            min="0"
            max="12"
            value=${this.config.spaceBase}
            step="0.1"
          />
        </label>

        <label>
          Border radius
          <input
            name="radiusFactor"
            type="range"
            min="0"
            max="8"
            value=${this.config.radiusFactor}
            step="0.1"
          />
        </label>

        <label>
          Font size
          <input
            name="fontSize"
            type="range"
            min="10"
            max="32"
            value=${this.config.fontSize}
            step="0.1"
          />
        </label>

        <label>
          Color preference
          <select name="colorScheme">
            <option
              ?selected=${this.config.colorScheme == "light dark"}
              value="light dark"
            >
              System
            </option>
            <option ?selected=${this.config.colorScheme == "light"} value="light">
              Light
            </option>
            <option ?selected=${this.config.colorScheme == "dark"} value="dark">
              Dark
            </option>
          </select>
        </label>
      </form>
      <pre><code>${unsafeHTML(highligtCode(this.styleCode))}</code></pre>
      <div class="buttons">
        <input form="style-form" type="submit" value="Copy" />
        <input form="style-form" type="reset" value="Reset" />
      </div>
    `;
  }

  async #copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.styleCode);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }
}
customElements.define("proto-config", ProtoCode);

function highligtCode(code) {
  if (!code) return;
  return hljs.highlight(code, { language: "css" }).value;
}

function dedentCss(css) {
  const lines = css.split("\n");

  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();

  let indent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^(\s*)/)[0].length),
  );

  return lines.map((l) => l.slice(indent)).join("\n");
}
