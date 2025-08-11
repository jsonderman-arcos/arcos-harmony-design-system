import { createTheme, ThemeOptions } from '@mui/material/styles'
import coreTokens from './tokens/coreTokens.json'
import darkModeTokens from './tokens/darkModeTokens.json'
import largescreenModeTokens from './tokens/largescreenModeTokens.json'
import lightModeTokens from './tokens/lightModeTokens.json'
import mobileModeTokens from './tokens/mobileModeTokens.json'

// Available theme modes
type ThemeMode = 'dark' | 'largescreen' | 'light' | 'mobile' | string;

// Theme tokens by mode
const themeTokensByMode: Record<ThemeMode, Record<string, unknown>> = {
  'dark': darkModeTokens,
  'largescreen': largescreenModeTokens,
  'light': lightModeTokens,
  'mobile': mobileModeTokens,
  // Add additional themes dynamically as they become available
}

// Current theme mode
let currentThemeMode: ThemeMode = 'dark';

//cache for resolved token values
const resolvedTokenCache: Record<string, unknown> = {}

// Clear the token cache when switching themes
function clearTokenCache() {
  Object.keys(resolvedTokenCache).forEach(key => {
    delete resolvedTokenCache[key];
  });
}

// Recursively resolve {token.references} in $value fields
function resolveTokenValue(path: string, visited = new Set<string>()): unknown {
  if (resolvedTokenCache[path] !== undefined) return resolvedTokenCache[path]

  const modeTokens = themeTokensByMode[currentThemeMode] || darkModeTokens;
  let value = getValueByPath(modeTokens, path) ?? getValueByPath(coreTokens, path)
  if (typeof value === 'object' && value && '$value' in value)
    value = (value as { $value: unknown }).$value
  if (
    typeof value === 'string' &&
    value.startsWith('{') &&
    value.endsWith('}')
  ) {
    const refPath = value.slice(1, -1).replace(/\//g, '.')
    if (visited.has(refPath)) throw new Error(`Circular reference: ${refPath}`)
    visited.add(refPath)
    return resolveTokenValue(refPath, visited)
  }

  // Store in cache before returning
  resolvedTokenCache[path] = value

  return value
}

// Recursively get value
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split('.')
    .reduce(
      (o, k) =>
        o && typeof o === 'object' && k in o
          ? (o as Record<string, unknown>)[k]
          : undefined,
      obj as unknown
    )
}

function parsePxToNumber(px: string): number {
  return Number(px.replace('px', ''))
}

const scrollbarThumb = getValueByTokenName('Base._components.avatar.fill')
const scrollbarTrack = getValueByTokenName('Base._native.scrollbar-bg')

export function getThemeByTokens() {
  return createTheme({
    palette: {
      mode: 'dark'
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: parsePxToNumber(getValueByTokenName('breakpoints.breakpoint-sm')),
        md: parsePxToNumber(getValueByTokenName('breakpoints.breakpoint-md')),
        lg: parsePxToNumber(getValueByTokenName('breakpoints.breakpoint-lg')),
        xl: parsePxToNumber(getValueByTokenName('breakpoints.breakpoint-xl'))
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            scrollbarColor: `${scrollbarThumb} ${scrollbarTrack}`,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: `${scrollbarThumb} ${scrollbarTrack}`,
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: `${scrollbarThumb} ${scrollbarTrack}`
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: `${scrollbarThumb} ${scrollbarTrack}`
            }
          },
          '&::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0
          },
          '&::-webkit-outer-spin-button': {
            WebkitAppearance: 'none',
            margin: 0
          },
          '.Mui-error': {
            color: `${getValueByTokenName('Base.feedback.error.main')} !important`
          },
          '.MuiOutlinedInput-root.Mui-error': {
            '& fieldset': {
              borderColor: `${getValueByTokenName('Base.feedback.error.main')} !important`
            },
            '&.Mui-focused fieldset': {
              borderColor: `${getValueByTokenName('Base.feedback.error.main')} !important`
            }
          },
          '.MuiPickersOutlinedInput-root.Mui-error': {
            '& fieldset': {
              borderColor: `${getValueByTokenName('Base.feedback.error.main')} !important`
            },
            '&.Mui-focused fieldset': {
              borderColor: `${getValueByTokenName('Base.feedback.error.main')} !important`
            }
          },
          '.MuiFormControl-root': {
            width: '100%'
          },
          '.MuiToggleButton-root': {
            textTransform: 'none !important',
            paddingLeft: '16px !important',
            paddingRight: '16px !important'
          },
          '.MuiToggleButton-sizeSmall ': {
            height: '40px !important'
          },
          '.MuiButton-root': {
            textTransform: 'none !important'
          },
          '.MuiInputLabel-root': {
            paddingTop: '2px !important'
          },
          '.MuiAlert-filledSuccess': {
            backgroundColor: `${getValueByTokenName('Base.feedback.success.main')} !important`
          },
          '.MuiAlert-colorSuccess': {
            color: `${getValueByTokenName('Base.feedback.success.contrast-text')} !important`
          },
          '.MuiAlert-filledError': {
            backgroundColor: `${getValueByTokenName('Base.feedback.error.main')} !important`
          },
          '.MuiAlert-colorError': {
            color: `${getValueByTokenName('Base.feedback.error.contrast-text')} !important`
          },
          '.mapboxgl-popup': {
            background: 'transparent !important',
            padding: '0 !important',
            maxWidth: 'none !important'
          },
          '.mapboxgl-popup-tip': {
            display: 'none !important'
          },
          '.mapboxgl-popup-content': {
            background: 'transparent !important',
            padding: '0 !important'
          }
        }
      }
    }
  })
}

// Get a resolved value by token path
export function getValueByTokenName(tokenPath: string) {
  return resolveTokenValue(tokenPath) as string
}

/**
 * Set the current theme mode
 * @param mode - The theme mode to set ('light', 'dark', or any other available mode)
 * @returns The updated theme after switching modes
 */
export function setThemeMode(mode: ThemeMode) {
  // Check if the requested mode exists
  if (!themeTokensByMode[mode]) {
    console.warn(`Theme mode '${mode}' not found, falling back to dark mode`);
    mode = 'dark';
  }
  
  // Update the current mode
  currentThemeMode = mode;
  
  // Clear the token cache to ensure fresh values
  clearTokenCache();
  
  // Generate new theme with the updated mode
  const newTheme = getThemeByTokens();
  
  console.log(`Theme switched to ${mode} mode`);
  return newTheme;
}

/**
 * Get the current theme mode
 * @returns The current theme mode
 */
export function getCurrentThemeMode(): ThemeMode {
  return currentThemeMode;
}

/**
 * Get all available theme modes
 * @returns Array of available theme modes
 */
export function getAvailableThemeModes(): ThemeMode[] {
  return Object.keys(themeTokensByMode);
}

// Export the default theme
export const theme = getThemeByTokens()