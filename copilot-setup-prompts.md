# 🤖 GitHub Copilot Setup Prompts for MUI Theme Library

This file contains structured prompts to guide Copilot in building the MUI theme library project using Figma MCP and Style Dictionary.

---

## 🧱 Stage 1: Project Setup — Structure + Dependencies

> I want to scaffold a new React + MUI component library project using TypeScript and Vite.  
>
> ✅ Create this folder and file structure:
> ```
> /ux-design-system/
> ├── .env
> ├── package.json
> ├── vite.config.ts
> ├── tsconfig.json
> ├── src/
> │   ├── tokens/
> │   │   ├── raw/
> │   │   ├── transformed/
> │   ├── theme/
> │   │   └── muiTheme.ts
> │   ├── components/
> │   └── index.ts
> ├── scripts/
> │   ├── fetchFigmaTokens.ts
> │   └── transformTokens.ts
> ├── style-dictionary/
> │   └── config.js
> └── dist/
> ```
> ✅ Then install dependencies:
> ```bash
> yarn add @emotion/react @emotion/styled @mui/material axios dotenv style-dictionary
> yarn add -D @vitejs/plugin-react ts-node typescript vite
> ```

---

## ⚙️ Stage 2: Configure Scripts and Builds

> Now help me configure the build and token scripts for this project.  
>
> ✅ Do the following:
> 1. Add `vite.config.ts` to bundle the library with UMD + ES output
> 2. Add these `package.json` scripts:
> ```json
> {
>   "scripts": {
>     "fetch": "ts-node scripts/fetchFigmaTokens.ts",
>     "transform": "ts-node scripts/transformTokens.ts",
>     "tokens": "yarn fetch && yarn transform && style-dictionary build",
>     "build": "vite build",
>     "prepare": "yarn build"
>   }
> }
> ```
> 3. Create a `publish.sh` that builds and publishes:
> ```bash
> #!/bin/bash
> yarn tokens
> yarn build
> npm publish --access public
> ```

---

## 🧪 Stage 3: Token Scripts — Fetch + Transform

> Now create two TypeScript scripts:
>
> ✅ `scripts/fetchFigmaTokens.ts`
> - Uses axios to fetch from: `https://api.figma.com/v1/files/{FILE_KEY}/variables`
> - Reads `FIGMA_PERSONAL_TOKEN` and `FIGMA_FILE_KEY` from `.env`
> - Saves JSON to: `src/tokens/raw/tokens-raw-response.json`
>
> ✅ `scripts/transformTokens.ts`
> - Reads the raw Figma JSON
> - Resolves:
>   - `valuesByMode`
>   - color values `{r,g,b,a}` to `rgba()`
>   - aliases recursively by `id`
> - Outputs per collection + mode, like:
>   - `core.default.json`
>   - `application.light.json`
> - Uses Style Dictionary JSON format

---

## ✅ Usage Tip

When you’re ready to run a stage:
1. Copy that section from this file
2. Paste it into Copilot Chat in VS Code
3. Wait for Copilot to respond and generate code

---