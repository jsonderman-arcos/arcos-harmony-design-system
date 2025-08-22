# MUI Theming with CSS Variables: Approach & Acceptance Criteria

## Acceptance Criteria

1. **CSS Variable Definition**
   - All button color and padding values for each color scheme (`light`, `dark`, `mobile`) must be defined as CSS custom properties (variables) in a CSS file.
   - Each scheme must have its own set of variables, scoped using a unique selector (e.g., `:root`, `[data-theme="dark"]`, `[data-theme="mobile"]`).

2. **CSS Variable Usage**
   - Button styles (padding, background color, text color) must use the defined CSS variables, either in the MUI theme’s `styleOverrides` or via the `sx` prop.

3. **Theme Switching**
   - Switching the color scheme in the app must update the `data-theme` attribute on the `<body>` or a top-level container, so the correct CSS variables are applied.

4. **No Hardcoding**
   - No button color or padding values may be hardcoded in the theme or component code; all must reference the appropriate CSS variable.

5. **Visual Confirmation**
   - When switching between modes, both button color and padding must visibly change according to the CSS variable values for each mode.

6. **Token Alignment**
   - The values of the CSS variables must match the `$rawValue` from your design token files for each mode.

7. **Single Source of Truth**
   - The CSS file with variables must be the only place where button color and padding values are defined for all modes.

---

## Documentation References

- [MUI v5: Customizing Components](https://mui.com/material-ui/customization/components/)
- [MUI v5: The sx Prop](https://mui.com/system/the-sx-prop/)
- [MDN: Using CSS Custom Properties (Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## Explanation

- **Why CSS Variables?**
  - CSS variables allow you to change theme values (like button color and padding) at runtime without recreating the JS theme object.
  - This approach is especially useful for design systems with many tokens and dynamic theming needs.

- **How it Works:**
  1. Define all needed values as CSS variables in a CSS file.
  2. Reference those variables in your MUI theme (in `styleOverrides` or `sx`).
  3. Change the `data-theme` attribute to switch between modes; the CSS variables update automatically.

---

## Example: theme-tokens.css

```css
:root {
  --button-padding-vertical: 8px;
  --button-padding-horizontal: 20px;
  --button-bg: rgba(50, 98, 141, 1);
  --button-text: rgba(235, 239, 244, 1);
}
[data-theme="dark"] {
  --button-padding-vertical: 8px;
  --button-padding-horizontal: 20px;
  --button-bg: rgba(156, 203, 251, 1);
  --button-text: rgba(43, 56, 70, 1);
}
[data-theme="mobile"] {
  --button-padding-vertical: 12px;
  --button-padding-horizontal: 20px;
  --button-bg: rgba(50, 98, 141, 1);
  --button-text: rgba(255, 255, 255, 1);
}
```

---

## Example: theme.json (or theme object)

```json
{
  "components": {
    "MuiButton": {
      "styleOverrides": {
        "root": {
          "padding": "var(--button-padding-vertical) var(--button-padding-horizontal)",
          "backgroundColor": "var(--button-bg)",
          "color": "var(--button-text)"
        }
      }
    }
  }
  // ...other theme keys (palette, typography, etc.) as needed
}
```

---

## Example: Setting the Theme in JS

```js
// When switching theme mode
function setTheme(mode) {
  document.body.setAttribute('data-theme', mode);
}
```

---

## Notes
- You can use CSS variables in both `styleOverrides` and the `sx` prop.
- This approach keeps your design tokens as the single source of truth and makes runtime theming very efficient.
