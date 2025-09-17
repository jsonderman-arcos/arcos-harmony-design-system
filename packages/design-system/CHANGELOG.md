# Changelog

All notable changes to this project will be documented in this file.

## Unreleased
- Restructured repository into `packages/design-system` workspace, enabling Changesets and CI.
- Added tsup build pipeline with dual ESM/CJS outputs and generated types.
- Added Storybook documentation, linting, formatting, and release automation workflows.

## v1.2.0 - 2025-09-16
- Add MUI Dialog override that defaults to `theme-base-background-elevations-highest`.
- Align dialog paper defaults with lighthouse elevation tokens.

## v1.1.0 - 2025-09-15
- Add ESM build (`dist/index.mjs`) alongside CommonJS.
- Update `exports` map to provide `import` and `require` entry points.
- Set `module` field to ESM for better bundler support.
- Add `tsconfig.esm.json` and adjust build script.

## v1.0.0 - 2024-09-12
- Initial release of design tokens and MUI theme assets.
