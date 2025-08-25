import { SELECTORS } from '../theme/selectors';
import { activeMode } from '../core/tokenCore';
import { allCoreRadii, radiusMax, radiusByName, radiiSorted } from '../families/radii';
import { allCoreSpacing, spacingByName, spacingClosest } from '../families/spacing';
import { paperElevationToken } from '../families/elevation';

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
    // semantic selectors
    ...Object.fromEntries(
      Object.entries(SELECTORS).map(([name, keys]) => [name, () => get(...keys)])
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

    // Spacing family (core-spacing-spacing-*)
    spacingsAll: () => allCoreSpacing(),
    spacingBy: (name: string, fb?: number) => spacingByName(name, fb),
    spacingClosest: (px: number) => spacingClosest(px).value,
    // Radii family (core-radii-border-radius-*)
    radiiAll: () => allCoreRadii(),
    radiusMax: () => radiusMax(),
    radiusBy: (name: string, fb?: number) => radiusByName(name, fb),
    radiiSorted: () => radiiSorted(),
    // Paper elevation mapping
    paperElevationToken: (level: number) => paperElevationToken(level),
    paperBackgroundForElevation: (level: number) => get(paperElevationToken(level), 'theme-base-background-elevations-highest'),
    // Shape / numeric
    radius: getNumber('theme-base-shape.radius', getNumber('core-radii-border-radius', 8)),
    borderSize: getNumber('theme-base-border-size.default', getNumber('theme-base-border-size-default', 1)),
  };
}