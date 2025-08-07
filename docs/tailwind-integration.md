# Using the Design System with Tailwind CSS

This guide explains how to integrate our design system with Tailwind CSS in your projects.

## Setup

### 1. Install Tailwind CSS in your project

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Copy the generated config

Copy the `tailwind.config.js` file from this repository to your project.

### 3. Include the Tailwind directives in your CSS

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Using the Design System Tokens

### Colors

Use the color tokens directly in your Tailwind classes:

```html
<div class="bg-base-primary text-base-onPrimary">
  Primary Button
</div>

<!-- Dark mode -->
<div class="dark:bg-dark-base-primary dark:text-dark-base-onPrimary">
  Dark Mode Button
</div>
```

### Spacing

Use the spacing scale in padding, margin, gap, etc.:

```html
<div class="p-md mb-lg gap-sm">
  Content with design system spacing
</div>
```

### Typography

Use the font size and weight utilities:

```html
<h1 class="text-2xl font-bold">Heading</h1>
<p class="text-sm font-regular">Paragraph text</p>
```

### Responsive Design

The breakpoints from the design system are mapped directly to Tailwind:

```html
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
  Responsive grid item
</div>
```

## Dark Mode

The configuration uses Tailwind's `class` strategy for dark mode. To enable dark mode:

1. Add the `dark` class to your `<html>` or containing element:

```javascript
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

2. Use dark mode variants in your components:

```html
<button class="bg-base-primary dark:bg-dark-base-primary">
  Button that changes in dark mode
</button>
```

## Customizing Further

If you need to extend the design system:

1. Edit your local `tailwind.config.js` file
2. Add your custom values in the `extend` section to avoid overriding the design system tokens
