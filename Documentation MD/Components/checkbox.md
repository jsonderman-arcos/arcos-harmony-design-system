**MUI:** https://mui.com/material-ui/react-checkbox/ 

**React Native Paper:** https://callstack.github.io/react-native-paper/docs/components/Checkbox/ 

Checkboxes allow users to select zero, one, or multiple items from a set, with each selection operating independently.

## Why to use

**Purpose:** Checkboxes give users confidence in their decision-making by providing clear visual feedback and the ability to select multiple options that match their specific needs.

### Selection of an object or state

Enable users to choose and mark specific items, settings, or preferences.

**Complement:** use what? with what? is what?

**Appositive:** what or who, namely?

**Determiner or modifier:** which? of what kind or measure?

```
✅ Example
Sync with
☑ OMS (Outage Management System)
☑ GIS (Geographic Information System)
☐ Weather Feed
```

### Adjustment of an action

Configure behavior or modify how actions will be performed.

**Complement:** use what? with what?

**Adjunct:** do how? when? why?

```
✅ Example
☐ Voltage readings
☐ Crew assignments
☐ Outage history
[Download report]
```

## When to use
- **Multi-selection:** Choose multiple items from a list or group
- **Opt-in/opt-out settings:** Manage subscriptions, permissions, or alerts
- **Forms:** Collect user input when a save or apply step is required (not for immediate actions)
- **Filters:** Ideal for multi-choice filters, even if applied right away
- **Confirmations and agreements:** Acknowledge terms, policies, or declarations

***Note:*** Checkboxes work best when the choice is between clear opposites: enabled/disabled, shown/hidden, included/excluded—where the unchecked state has obvious meaning. When the unchecked state is unclear, use radio buttons or other single-selection components with explicitly labeled options instead.

## How to use
### Interaction
- Each checkbox operates independently—selecting one doesn't affect others. It ensures precise, error‑free selections
- Parent checkboxes can control child checkboxes with intermediate states for partial selection. It matches users' expectations
- Use with save/apply buttons rather than immediate reactions (unlike toggle switches). It helps to avoid confusion

### Visual design
- **Shape:** Square shape to match user expectations
- **Layout:** Stack multiple checkboxes vertically for optimal readability and scanning
- **Size:** Consistent touch targets (minimum 44 px on mobile, 24 px on web) to avoid 'fat-finger' mistakes
- **Focus States:** Clear visual indicators for keyboard and accessibility

### Labeling
- Label on the right and clickable to ease clicking and improve accuracy
- Avoid negative wording—use positive phrasing instead, as it improves clarity
- Avoid generic labels; be specific. "Receive newsletter" is clear; "Yes" isn't

## Accessibility requirements

### WCAG 2.2 compliance
- Minimum contrast: 4.5:1 for labels, 3:1 for borders and focus indicators
- Focus visible indicators required for keyboard navigation
- Content readable when zoomed to 320 CSS pixels without horizontal scrolling

### Keyboard navigation
- Reachable via Tab key, activatable with Spacebar
- Custom controls need tabindex="0" for keyboard focus
- Tab order follows logical reading sequence

### Screen reader support
- Use aria-label when no visible label exists
- Proper checkbox role exposure to accessibility APIs
- Labels must be descriptive, brief, and clear

## States and behavior
| State | Appearance | Purpose | When to use |
|-------|------------|---------|-------------|
| **Unchecked (Default)** | Empty square checkbox | Indicates option is available but not selected | Initial state for most options, optional selections |
| **Checked** | Square with checkmark or filled indicator | Confirms user has actively selected this option | User has made a deliberate selection, option is enabled/active |
| **Indeterminate (Mixed)** | Square with dash/line or partial fill | Shows partial selection in hierarchical structures | Parent checkbox when some (but not all) child options are selected |
| **Disabled** | Grayed out, reduced opacity, non-interactive | Option exists but is currently unavailable | Prerequisites not met, insufficient permissions, contextually irrelevant |
| **Focused** | Visible outline or highlight around checkbox | Indicates keyboard navigation position | User navigates via keyboard, accessibility compliance |
| **Hovered (Web only)** | Subtle background change or border emphasis | Provides interactive feedback before selection | Mouse interaction, enhances discoverability |
| **Error** | Red border or background, often with error message | Indicates validation failure or required selection missing | Form validation fails, required checkbox unchecked |

## Examples
### ✅ Correct usage
```
Notify via
☑ Email notifications
☐ Push notifications  
☑ SMS alerts

Security settings
☑ Two-factor authentication
☐ Limit sessions to one device
```

### ❌ Incorrect usage
```
☐ Turn off notifications (negative wording)
☐ Confirm subscription (verb form suitable for buttons)
☐ Yes, I agree (yes/no format)
```

### ✅ Hierarchical structure
```
⊟ All notifications
  ☑ Email alerts
  ☐ SMS alerts
  ☑ Push notifications
```