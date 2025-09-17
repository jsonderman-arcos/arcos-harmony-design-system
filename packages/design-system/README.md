# arcos-harmony-design-system

Source package for the Arcos Harmony design tokens, MUI theme, and automation scripts. This folder
is published to npm as `arcos-harmony-design-system`.

## Scripts

All commands below are run from the repository root (`yarn workspace arcos-harmony-design-system …`).

| Script | Purpose |
| --- | --- |
| `tokens:fetch` | Fetch raw variables from Figma (requires `FIGMA_PERSONAL_TOKEN` + `FIGMA_FILE_KEY`). |
| `tokens:build` | Normalize raw payloads into flattened JSON + CSS under `src/theme`. |
| `theme:build`  | Generate MUI ThemeOptions JSON + TypeScript + component overrides. |
| `build`        | Clean output, rebuild theme, bundle with tsup, copy CSS/JSON assets. |
| `storybook`    | Local docs for tokens + components. |
| `storybook:build` | Static Storybook bundle for publishing. |
| `lint` / `typecheck` | Quality gates for sources and scripts. |

## Generated Assets

- `src/theme/*.json` – flattened token maps and `mui-theme.json`
- `src/theme/*.css` – compiled custom properties for primitives and semantic tokens
- `dist/esm|cjs` – runtime entrypoints for consumers
- `dist/types` – emitted declaration files
- `dist/theme/*.css` – published CSS bundles
- `dist/tailwind/preset.cjs` – optional Tailwind mapping

## Token Flow

1. `yarn tokens:fetch`
2. `yarn tokens:build`
3. `yarn theme:build`
4. `yarn build`

Each step is idempotent, making it easy to diff upstream Figma changes.

## Publishing

Use Changesets to stage releases. `yarn changeset` creates a release entry; merge to `main` to
trigger the `release.yml` workflow that publishes to npm with `yarn release`.

