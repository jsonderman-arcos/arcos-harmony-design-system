
import axios from 'axios';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_PERSONAL_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const FIGMA_VARIABLES_ENDPOINT = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;
const OUTPUT_PATH = path.resolve(__dirname, '../src/tokens/raw/tokens-raw-response.json');

async function fetchFigmaTokens() {
  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.error('Missing FIGMA_PERSONAL_TOKEN or FIGMA_FILE_KEY in .env');
    process.exit(1);
  }
  try {
    const response = await axios.get(FIGMA_VARIABLES_ENDPOINT, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN }
    });
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(response.data, null, 2));
    console.log('Figma tokens fetched and saved to', OUTPUT_PATH);
  } catch (err) {
    console.error('Error fetching Figma tokens:', err);
    process.exit(1);
  }
}

fetchFigmaTokens();
