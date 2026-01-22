# ProtoCSS

ProtoCSS is a lightweight CSS framework that makes semantic HTML elements look great out-of-the-box, without the need for extra classes. It’s designed to be accessible, easy to use, and flexible for projects of any size.

## Features

- **Automatic Styling of Semantic Elements**  
  ProtoCSS formats standard HTML elements like `<button>` automatically, no additional classes needed.

- **Easy Opt-Out**  
  Want the browser default styles? Simply add the `reset` class to any element, and you can then easily override it with another class
  ```html
  <button class="reset my-big-btn">Custom styled button</button>
  ```

* **Class-Based Components**
  Every component also has a corresponding class. For example, you can use either a semantic element:

  ```html
  <section>Content</section>
  ```

  ...or a class-based alternative:

  ```html
  <div class="card">Content</div>
  ```

* **Light and Dark Mode Support**
  ProtoCSS supports light and dark modes:

  ```css
  :root {
    color-scheme: light dark; /* default is following the system settings */
  }
  ```

  You can set a specific theme for the entire site:

  ```html
  <body data-theme="dark"></body>
  ```

  Or set it per component:

  ```html
  <table data-theme="dark"></table>
  ```

* **Global CSS Variables**
  Easily customize your project with global variables:

  ```css
  :root {
    --color-primary: #0073e4;
    --space-base: 4px;
    --border-radius: var(--space-base);
  }
  ```

  > **Note:** Spacing is defined in pixels so users who increase font sizes for accessibility don’t unintentionally scale the entire UI.

* **Utility Classes for Spacing**
  ProtoCSS provides utility classes for margins, padding, and spacing. Examples:

  ```html
  <div class="mt-3">
    <!-- margin-top: var(--space-3) -->
    <div class="space-y-4"><!-- vertical spacing between children --></div>
  </div>
  ```

### When to Use ProtoCSS

- **Quick prototyping** – Build functional, visually consistent websites without writing custom CSS.
- **Accessible design** – Automatically styled semantic elements help meet accessibility standards.
- **Flexible styling** – Use the `.reset` class to revert elements to browser defaults whenever needed, making it easy to grow and adapt your project.
- **Light/Dark mode support out-of-the-box** – Perfect for modern websites needing theme flexibility.
- **Customizable without complexity** – Easily override global variables or use utility classes for precise spacing and layout.
- **Projects where simplicity matters** – Keep your markup clean and readable while still looking polished.

## License

ProtoCSS is released under the [MIT License](./LICENSE.md). It uses [SVG icons](./src/styles/proto-css/symbols.css) from [Pico CSS](https://picocss.com/) and [Bootstrap](https://getbootstrap.com/).
