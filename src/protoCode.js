import hljs from "highlight.js";
import githubSyntax from "highlight.js/styles/github.css?inline";
import githubSyntaxDark from "highlight.js/styles/github-dark.css?inline";

import switchInput from "/styles/proto-css/form/switch.css?inline";
import tooltip from "/styles/proto-css/components/tooltip.css?inline";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { LitElement, css, html, unsafeCSS } from "lit";
import xmlSyntax from "highlight.js/lib/languages/xml";
import cssSyntax from "highlight.js/lib/languages/css";
import jsSyntax from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("xml", xmlSyntax);
hljs.registerLanguage("css", cssSyntax);
hljs.registerLanguage("js", jsSyntax);

export class ProtoCode extends LitElement {
  static properties = {
    code: { type: String },
    preview: { type: Boolean },
    language: { type: String },
    colorScheme: { type: String },
  };
  static styles = css`
    ${unsafeCSS(switchInput)}
    ${unsafeCSS(tooltip)}

    @media (prefers-color-scheme: light) {
      ${unsafeCSS(githubSyntax)}
    }
    @media (prefers-color-scheme: dark) {
      ${unsafeCSS(githubSyntaxDark)}
    }

    :host([data-theme="light"]) {
      ${unsafeCSS(githubSyntax)}
    }
    :host([data-theme="dark"]) {
      ${unsafeCSS(githubSyntaxDark)}
    }

    :host {
      display: block;
      margin: var(--space-gap-sm) 0 var(--space-gap) 0;
    }

    .wrapper {
      gap: var(--space-gap);
    }

    .rendered {
      margin-bottom: -1px;
      border: 1px solid var(--color-border);
      border-top-right-radius: var(--border-radius);
      border-top-left-radius: var(--border-radius);
      padding: var(--space-5);
    }

    .code {
      border: 1px solid var(--color-border);
      border-radius: var(--internal-border-radius);
      background: var(--color-contrast-1);
      .controls {
        border-bottom: 1px solid var(--color-border);
        padding: var(--space-2) var(--space-3);
        color: var(--color-text-muted);
        font-size: 14px;
        label {
          display: flex;
          align-items: center;
          gap: var(--space-gap-sm);
        }
      }

      .source-wrapper {
        position: relative;
        button {
          position: absolute;
          top: var(--space-2);
          transition: color 0.2s ease;
          cursor: pointer;
          inset-inline-end: var(--space-2);
          border: none;
          border-radius: var(--border-radius);
          background: transparent;
          color: var(--color-text);
          font-size: var(--text-small);

          &:hover {
            color: var(--color-primary);
          }
        }
        .source {
          padding: var(--space-3);
          overflow-x: auto;
          font-size: 14px;

          pre {
            margin: 0;
          }
        }
      }
    }
  `;

  constructor() {
    super();
    this.toolbar = false;
    this.code = null;
    this.preview = false;
    this.language = "xml";
    this.colorScheme = null;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("proto-config-changed", this.#handleConfigChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("proto-config-changed", this.#handleConfigChange);
  }

  #handleConfigChange = (e) => {
    this.colorScheme = e.detail.colorScheme;
    this.dataset.theme = this.colorScheme === "light dark" ? "system" : this.colorScheme;
  };

  render() {
    return html` <div class="wrapper">
      <div ?hidden=${!this.preview} class="rendered">
        <div class="preview">
          <slot name="wrapper" @slotchange=${this.#onSlotchange}></slot>
          <slot @slotchange=${this.#onSlotchange}></slot>
        </div>
      </div>
      <div
        class="code"
        style="${this.preview
          ? "--internal-border-radius: 0 0 var(--border-radius) var(--border-radius)"
          : "--internal-border-radius: var(--border-radius)"}"
      >
        <div class="controls" hidden>
          <div style="display: flex; justify-content: end;">
            <label>
              Version
              <select>
                <option>System</option>
                <option>Light</option>
                <option>Dark</option>
                <option>Playful</option>
              </select>
            </label>
          </div>
        </div>
        <div class="source-wrapper">
          <button
            aria-label="Copy"
            aria-describedby="tip-copy"
            @click=${this.#copyToClipboard}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"
              />
              <path
                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"
              />
            </svg>
          </button>
          <span id="tip-copy" role="tooltip">Copy the code</span>
          <div class="source">
            <pre><code>${unsafeHTML(highligtCode(this.code, this.language))}</code></pre>
          </div>
        </div>
      </div>
    </div>`;
  }

  async #copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.code);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  #onSlotchange(e) {
    const slot = e.target;
    const nodes = slot.assignedNodes({ flatten: false });

    const code = nodes
      .map((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return slot.name ? node.innerHTML : node.outerHTML;
        }
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent;
        }
        return "";
      })
      .join("");

    if (code.trim().length != 0) {
      this.code = formatCode(code);
    }
  }
}
customElements.define("proto-code", ProtoCode);

function formatCode(code) {
  return dedentHTML(cleanAttributes(code)).trim();
}

function dedentHTML(html) {
  const lines = html.split("\n");

  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();

  let indent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^(\s*)/)[0].length),
  );

  return lines.map((l) => l.slice(indent)).join("\n");
}

function cleanAttributes(html) {
  const booleanAttributes = ["disabled", "checked", "required", "readonly", "open"];

  for (const attribute of booleanAttributes) {
    html = html.replaceAll(`${attribute}=""`, attribute);
  }

  html = html.replaceAll("<!-- prettier-ignore -->", "");
  html = html.replaceAll('=""', "");

  return html;
}

function highligtCode(code, language) {
  if (!code) return;
  return hljs.highlight(code, { language }).value;
}
