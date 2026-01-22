# Agents

This document describes the various agents (tools and dependencies) used in the ProtoCSS project for building, processing, and documenting the CSS framework.

## Build Agents

### Vite

- **Role**: Development server and build tool for the documentation site.
- **Configuration**: `vite.config.js`
- **Scripts**: `npm run dev`, `npm run build:docs`, `npm run preview`
- **Dependencies**: `vite`, `vite-plugin-html-inject`, `fast-glob`

Vite handles the development environment, builds the HTML documentation pages from `src/docs/`, and serves the preview.

### PostCSS

- **Role**: CSS processor for importing and minifying stylesheets.
- **Configuration**: `postcss.config.cjs`
- **Scripts**: `npm run build:css`
- **Dependencies**: `postcss`, `postcss-cli`, `postcss-import`, `cssnano`

PostCSS processes the main CSS file (`src/styles/index.css`) to produce the minified `dist/protocss.min.css`.

## Documentation Agents

### Highlight.js

- **Role**: Syntax highlighting for code examples in documentation.
- **Usage**: Integrated into the docs site for displaying CSS/HTML code snippets.

### HTMX

- **Role**: Enables dynamic interactions in the documentation site (e.g., interactive components).
- **Usage**: Used in HTML files under `src/docs/` for enhanced user experience.

### Lit

- **Role**: Web components library for building interactive examples.
- **Usage**: Potentially used in documentation components for demonstrating ProtoCSS features.

### Modern Normalize

- **Role**: CSS reset/normalize for consistent styling across browsers.
- **Usage**: Included in the CSS build process to ensure baseline styles.

## Development Tools

### Prettier

- **Role**: Code formatter for CSS and other files.
- **Configuration**: `package.json` (prettier section)
- **Dependencies**: `prettier`, `prettier-plugin-css-order`

Ensures consistent formatting of CSS files with ordered properties.

## Summary

ProtoCSS itself is a pure CSS framework, with all dependencies focused on build automation, CSS processing, and documentation generation. The build process separates the core CSS output (`build:css`) from the documentation site build (`build:docs`).
