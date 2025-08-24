// src/tokens/utils/tokenUtils.ts
import core from '@theme/core.muiflat.json';
import theme from '@theme/theme.muiflat.json';

const TOKENS: Record<string, string> = {
  ...core,
  ...theme,
};

/** Return the raw value of a token key (rgba/hex/px/etc). 
export function token(key: string, fallback?: string): string {
  const v = TOKENS[key];
  if (!v || v === 'var(undefined)') return fallback ?? '';

  const aliasMatch = v.match(/^var\((--[^)]+)\)$/);
  if (aliasMatch) {
    const aliasKey = aliasMatch[1].replace(/^--/, '');
    return TOKENS[aliasKey] || fallback || '';
  }

  return v;
}*/

let CURRENT_MODE = 'Light';

const activeMode = () => CURRENT_MODE || 'Light';

function byModeKey(key: string, mode = activeMode()): string | undefined {
  return (
    TOKENS[`${key}.valuesByMode.${mode}`] ??
    TOKENS[`${key}.valuesByMode.Default`] ??
    TOKENS[`${key}.valuesByMode.Light`]
  );
}

function choose(keys: string[], mode = activeMode(), fallback?: string): string {
  for (const k of keys) {
    const v = byModeKey(k, mode);
    if (v != null && v !== '' && v !== 'var(undefined)') return v;
  }
  return fallback ?? '';
}

export function setTokenMode(mode: 'Light' | 'Dark' | 'Mobile') {
  CURRENT_MODE = mode;
}

export function token(key: string, fallback?: string): string {
  const mode = activeMode();

  // 1) Direct lookup by mode
  let modeValue = byModeKey(key, mode);

  // 2) Resolve var(--alias) if present (should be rare since builder resolves, but safe)
  if (modeValue?.startsWith('var(')) {
    const alias = modeValue.match(/^var\((--[^)]+)\)$/)?.[1]?.replace(/^--/, '');
    if (alias) {
      const aliasVal = byModeKey(alias, mode);
      if (aliasVal) return aliasVal;
    }
  }

  // 3) Resolve aliasOf metadata
  const aliasOf = TOKENS[`${key}.aliasOf`]?.replace(/^--/, '');
  if (!modeValue && aliasOf) {
    const aliased = byModeKey(aliasOf, mode);
    if (aliased) return aliased;
  }

  // 4) Return the found value or fallback
  return modeValue ?? fallback ?? '';
}

/** Utility to resolve number tokens (px/rem without units) */
export function tokenNumber(key: string, fallback = 0): number {
  const val = token(key);
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
}

/** Shorthand reads for common design tokens */
export const t = {
  // Base text & surfaces
  textPrimary: () =>
    choose(['theme-base-content.text-primary', 'theme-base-text-primary']),
  textSecondary: () =>
    choose(['theme-base-content.text-secondary', 'theme-base-text-secondary']),
  textDisabled: () =>
    choose(['theme-base-content.text-disabled', 'theme-base-text-disabled']),
  divider: () =>
    choose(['theme-base-borders.divider', 'theme-base-divider-default']),
  surface: () =>
    choose([
      'theme-base-surface.surface',
      'theme-base-background-paper-elevation-0',
    ]),
  surfaceRaised: () =>
    choose([
      'theme-base-surface.surface-raised',
      'theme-base-background-paper-elevation-1',
    ]),

  // Primary
  primaryMain: () =>
    choose([
      'theme-base-brand-primary.main',
      'theme-base-primary-primary-main',
      'theme-base-primary-main',
    ]),
  primaryLight: () =>
    choose(['theme-base-primary-primary-light', 'theme-base-primary-light']),
  primaryDark: () =>
    choose(['theme-base-primary-primary-dark', 'theme-base-primary-dark']),
  onPrimary: () =>
    choose(['theme-base-on-primary.main', 'theme-base-primary-contrast-text']),
  primaryHover: () =>
    choose(['theme-base-primary.states-hover', 'theme-base-primary-states-hover']),
  primarySelected: () =>
    choose([
      'theme-base-primary.states-selected',
      'theme-base-primary-states-selected',
    ]),
  primaryFocusRing: () =>
    choose([
      'theme-base-primary.states-focus-visible',
      'theme-base-primary-states-focus-visible',
    ]),

  // Secondary (if you need it)
  secondaryMain: () =>
    choose([
      'theme-base-brand-secondary.main',
      'theme-base-secondary-main',
    ]),

  // Focus / generic states
  focusRing: () =>
    choose(['theme-base-text.states-focus-visible', 'theme-base-text-states-focus-visible']),
  actionHover: () =>
    choose(['theme-base-action.hover', 'theme-base-action-hover']),
  actionSelected: () =>
    choose(['theme-base-action.selected', 'theme-base-action-selected']),
  actionDisabled: () =>
    choose(['theme-base-action.disabled', 'theme-base-action-disabled']),
  actionDisabledBg: () =>
    choose(['theme-base-action.disabled-bg', 'theme-base-action-disabled-background']),

  // Radius / borders (falls back if token missing)
  radius: Number(token('theme-base-shape.radius', token('core-radii-border-radius', '8'))),
  borderSize: Number(token('theme-base-border-size.default', token('theme-base-border-size-default', '1'))),
};
console.log(t.radius)
export function createTokenUtils(tokens: Record<string, string>) {
  // Helper to read a value-by-mode key safely
  const byMode = (key: string, mode = activeMode()) =>
    tokens[`${key}.valuesByMode.${mode}`] ??
    tokens[`${key}.valuesByMode.Default`] ??
    tokens[`${key}.valuesByMode.Light`];
  
  // Try multiple canonical keys and return the first hit (mode-aware)
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const v =
        byMode(k) ??
        tokens[k]; // final non-mode fallback if a flat key exists
      if (v != null && v !== '' && v !== 'var(undefined)') return String(v);
    }
    return '';
  };
  
  // Parse a numeric token, with a fallback
  const getNumber = (key: string, fallback: number) => {
    const raw =
      tokens[key] ??
      tokens[`${key}.valuesByMode.${activeMode()}`] ??
      tokens[`${key}.valuesByMode.Default`];
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };
  
  return {
    // Base text & surfaces
    textPrimary: () =>
      get('theme-base-content.text-primary', 'theme-base-text-primary'),
    textSecondary: () =>
      get('theme-base-content.text-secondary', 'theme-base-text-secondary'),
    textDisabled: () =>
      get('theme-base-content.text-disabled', 'theme-base-text-disabled'),
    divider: () =>
      get('theme-base-borders.divider', 'theme-base-divider-default'),
    surface: () =>
      get('theme-base-surface.surface', 'theme-base-background-paper-elevation-0'),
    surfaceRaised: () =>
      get('theme-base-surface.surface-raised', 'theme-base-background-paper-elevation-1'),
  
    // Primary
    primaryMain: () =>
      get(
        'theme-base-brand-primary.main',
        'theme-base-primary-primary-main',
        'theme-base-primary-main'
      ),
    primaryLight: () =>
      get('theme-base-primary-primary-light', 'theme-base-primary-light'),
    primaryDark: () =>
      get('theme-base-primary-primary-dark', 'theme-base-primary-dark'),
    onPrimary: () =>
      get('theme-base-on-primary.main', 'theme-base-primary-contrast-text'),
    primaryHover: () =>
      get('theme-base-primary.states-hover', 'theme-base-primary-states-hover'),
    primarySelected: () =>
      get('theme-base-primary.states-selected', 'theme-base-primary-states-selected'),
    primaryFocusRing: () =>
      get(
        'theme-base-primary.states-focus-visible',
        'theme-base-primary-states-focus-visible'
      ),

    // ---- Status (only tokens present in theme.muiflat.json)
    // Arrived
    statusArrivedDefault: () =>
      get('theme-base-status-status-arrived-default'),
    statusArrivedLightest: () =>
      get('theme-base-status-status-arrived-lightest'),
    statusArrivedLight: () =>
      get('theme-base-status-status-arrived-light'),
    statusArrivedDark: () =>
      get('theme-base-status-status-arrived-dark'),
    statusArrivedDarker: () =>
      get('theme-base-status-status-arrived-darker'),
    statusArrivedDarkest: () =>
      get('theme-base-status-status-arrived-darkest'),
    statusArrivedScreen: () =>
      get('theme-base-status-status-arrived-screen'),
    statusArrivedStatesHover: () =>
      get('theme-base-status-status-arrived-states-hover'),
    statusArrivedStatesSelected: () =>
      get('theme-base-status-status-arrived-states-selected'),
    statusArrivedStatesFocusVisible: () =>
      get('theme-base-status-status-arrived-states-focus-visible'),
    statusArrivedStatesOutlinedBorder: () =>
      get('theme-base-status-status-arrived-states-outlined-border'),

    // Checked In
    statusCheckedinDefault: () =>
      get('theme-base-status-status-checkedin-default'),
    statusCheckedinLightest: () =>
      get('theme-base-status-status-checkedin-lightest'),
    statusCheckedinLight: () =>
      get('theme-base-status-status-checkedin-light'),
    statusCheckedinDark: () =>
      get('theme-base-status-status-checkedin-dark'),
    statusCheckedinDarker: () =>
      get('theme-base-status-status-checkedin-darker'),
    statusCheckedinDarkest: () =>
      get('theme-base-status-status-checkedin-darkest'),
    statusCheckedinScreen: () =>
      get('theme-base-status-status-checkedin-screen'),

    // Idle
    statusIdleDefault: () =>
      get('theme-base-status-status-idle-default'),
    statusIdleLightest: () =>
      get('theme-base-status-status-idle-lightest'),
    statusIdleLight: () =>
      get('theme-base-status-status-idle-light'),
    statusIdleDark: () =>
      get('theme-base-status-status-idle-dark'),
    statusIdleDarker: () =>
      get('theme-base-status-status-idle-darker'),
    statusIdleDarkest: () =>
      get('theme-base-status-status-idle-darkest'),
    statusIdleScreen: () =>
      get('theme-base-status-status-idle-screen'),
    statusIdleStatesHover: () =>
      get('theme-base-status-status-idle-states-hover'),
    statusIdleStatesSelected: () =>
      get('theme-base-status-status-idle-states-selected'),
    statusIdleStatesFocusVisible: () =>
      get('theme-base-status-status-idle-states-focus-visible'),
    statusIdleStatesOutlineBorder: () =>
      get('theme-base-status-status-idle-states-outline-border'),

    // Inbound
    statusInboundDefault: () =>
      get('theme-base-status-status-inbound-default'),
    statusInboundLightest: () =>
      get('theme-base-status-status-inbound-lightest'),
    statusInboundLight: () =>
      get('theme-base-status-status-inbound-light'),
    statusInboundDark: () =>
      get('theme-base-status-status-inbound-dark'),
    statusInboundDarker: () =>
      get('theme-base-status-status-inbound-darker'),
    statusInboundDarkest: () =>
      get('theme-base-status-status-inbound-darkest'),
    statusInboundScreen: () =>
      get('theme-base-status-status-inbound-screen'),
    statusInboundStatesHover: () =>
      get('theme-base-status-status-inbound-states-hover'),
    statusInboundStatesSelected: () =>
      get('theme-base-status-status-inbound-states-selected'),
    statusInboundStatesFocusVisible: () =>
      get('theme-base-status-status-inbound-states-focus-visible'),
    statusInboundStatesOutlinedBorder: () =>
      get('theme-base-status-status-inbound-states-outlined-border'),

    // Regroup
    statusRegroupDefault: () =>
      get('theme-base-status-status-regroup-default'),
    statusRegroupDarker: () =>
      get('theme-base-status-status-regroup-darker'),
    statusRegroupDarkest: () =>
      get('theme-base-status-status-regroup-darkest'),
    statusRegroupLightest: () =>
      get('theme-base-status-status-regroup-lightest'),
    statusRegroupScreen: () =>
      get('theme-base-status-status-regroup-screen'),

    // Mobilize
    statusMobilizeDefault: () =>
      get('theme-base-status-status-mobilize-default'),
    statusMobilizeLightest: () =>
      get('theme-base-status-status-mobilize-lightest'),
    statusMobilizeDarker: () =>
      get('theme-base-status-status-mobilize-darker'),
    statusMobilizeDarkest: () =>
      get('theme-base-status-status-mobilize-darkest'),
    statusMobilizeScreen: () =>
      get('theme-base-status-status-mobilize-screen'),

    // ---- Feedback (from theme-base-feedback-*)
    feedbackErrorMain: () =>
      get('theme-base-feedback-error-main'),
    feedbackErrorDark: () =>
      get('theme-base-feedback-error-dark'),
    feedbackErrorLight: () =>
      get('theme-base-feedback-error-light'),
    feedbackErrorContrastText: () =>
      get('theme-base-feedback-error-contrast-text'),

    feedbackWarningMain: () =>
      get('theme-base-feedback-warning-main'),
    feedbackWarningDark: () =>
      get('theme-base-feedback-warning-dark'),
    feedbackWarningLight: () =>
      get('theme-base-feedback-warning-light'),
    feedbackWarningContrastText: () =>
      get('theme-base-feedback-warning-contrast-text'),

    feedbackInfoMain: () =>
      get('theme-base-feedback-info-main'),
    feedbackInfoDark: () =>
      get('theme-base-feedback-info-dark'),
    feedbackInfoLight: () =>
      get('theme-base-feedback-info-light'),
    feedbackInfoContrastText: () =>
      get('theme-base-feedback-info-contrast-text'),

    feedbackSuccessMain: () =>
      get('theme-base-feedback-success-main'),
    feedbackSuccessDark: () =>
      get('theme-base-feedback-success-dark'),
    feedbackSuccessLight: () =>
      get('theme-base-feedback-success-light'),
    feedbackSuccessContrastText: () =>
      get('theme-base-feedback-success-contrast-text'),

    // ---- Proxies so palette/components can use MUI-like names mapped to feedback tokens
    errorMain:   () => get('theme-base-feedback-error-main'),
    onError:     () => get('theme-base-feedback-error-contrast-text'),
    warningMain: () => get('theme-base-feedback-warning-main'),
    onWarning:   () => get('theme-base-feedback-warning-contrast-text'),
    infoMain:    () => get('theme-base-feedback-info-main'),
    onInfo:      () => get('theme-base-feedback-info-contrast-text'),
    successMain: () => get('theme-base-feedback-success-main'),
    onSuccess:   () => get('theme-base-feedback-success-contrast-text'),

    // Secondary
    secondaryMain: () =>
      get('theme-base-brand-secondary.main', 'theme-base-secondary-main'),
  
    // Focus / generic states
    focusRing: () =>
      get('theme-base-text.states-focus-visible', 'theme-base-text-states-focus-visible'),
    actionHover: () => get('theme-base-action.hover', 'theme-base-action-hover'),
    actionSelected: () =>
      get('theme-base-action.selected', 'theme-base-action-selected'),
    actionDisabled: () =>
      get('theme-base-action.disabled', 'theme-base-action-disabled'),
    actionDisabledBg: () =>
      get('theme-base-action.disabled-bg', 'theme-base-action-disabled-background'),
  
    // Shape / numeric
    radius: getNumber('theme-base-shape.radius', getNumber('core-radii-border-radius', 8)),
    borderSize: getNumber('theme-base-border-size.default', getNumber('theme-base-border-size-default', 1)),
  };
}