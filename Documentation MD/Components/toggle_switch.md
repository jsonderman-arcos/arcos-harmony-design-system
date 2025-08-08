**MUI:** https://mui.com/material-ui/react-switch/

**React Native Paper:** https://callstack.github.io/react-native-paper/docs/components/Switch/

Toggle switches allow users to instantly change the state of a single setting between two mutually exclusive options (on/off), with immediate effect.

## Why to use

**Purpose:** Toggle switches provide immediate feedback and control by instantly applying changes, giving users confidence in real-time system responses for binary settings.

### Selection of an object or state

Enable users to instantly activate or deactivate specific features, settings, or system states.

**Complement:** use what? with what? is what?

**Appositive:** what or who, namely?

**Determiner or modifier:** which? of what kind or measure?

```
✅ Example
Outage Management
━(✓) Automatic crew dispatch
(✕)━ Customer notifications
━(✓) Priority escalation
```

### Adjustment of an action

Configure behavior that applies immediately without requiring confirmation.

**Complement:** use what? with what?

**Adjunct:** do how? when? why?

```
✅ Example
Response Mode
━(✓) Emergency protocols
━(✓) External contractor access
(✕)━ Priority restoration alerts
```

## When to use
- **Binary system settings:** That need immediate effect (enabled or disabled)
- **Real-time system controls:** Where instant feedback is expected (equipment status, alarms)
- **System functionalities:** That users expect to work immediately (power states, connectivity)
- **Standalone settings:** Not part of larger forms

***Note:*** Toggle switches are graphically prominent, making them less suitable for filters where checkboxes work better.

## How to use
### Interaction
- Each toggle switch controls a single binary setting with immediate effect—no save/apply buttons needed
- Toggle switches should never be used in forms with save/apply buttons to avoid user confusion about when changes take effect
- Changes apply instantly upon interaction, matching user expectations for immediate system response

### Visual design
- **Shape:** Pill/capsule shape with sliding indicator to show current state
- **Spacing:** Consistent touch targets (minimum 44 px on mobile, 24 px on web) for accurate interaction
- **Focus States:** Clear visual indicators for keyboard and accessibility compliance

### Labeling
- Avoid negative wording—use positive phrasing for clarity:
  - ❌ Turn off automatic crew dispatch
  - ✅ Automatic crew dispatch
- Be specific: Clear labels improve understanding:
  - ❌ Enable notifications
  - ✅ Customer outage notifications

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
- Proper switch role exposure to accessibility APIs
- Labels must be descriptive, brief, and clear

## States and behavior
| State | Appearance | Purpose | When to use |
|-------|------------|---------|-------------|
| **Off (Default)** | Empty capsule with state indicator on left | Indicates feature is turned off | Initial state for optional features, inactive settings |
| **On** | Filled capsule with state indicator on right | Confirms feature is actively enabled | User has activated the setting, feature is working |
| **Focused** | Visible outline or highlight around toggle | Indicates keyboard navigation position | User navigates via keyboard, accessibility compliance |
| **Hovered (Web only)** | Subtle background change or emphasis | Provides interactive feedback before selection | Mouse interaction, enhances discoverability |
| **Disabled** | Grayed out, reduced opacity, non-interactive | Setting exists but is currently unavailable | Prerequisites not met, insufficient permissions, admin-controlled |
| **Loading** | Animated indicator or spinner | Shows system is processing the change | Network requests, system updates in progress |

## Examples
### ✅ Correct usage

```
Outage Management
━(✓) Automatic crew dispatch
(✕)━ Customer notifications
━(✓) Priority escalation

Storm Response Settings  
━(✓) Emergency protocols
━(✓) External contractor access
(✕)━ Weather integration
```

### ❌ Incorrect usage

```
(✕)━ Turn off automatic notifications (negative wording)
━(✓) Set email as primary contact method (not binary choice)
━(✓) Subscribe to outage alerts (should use checkbox in forms)

Service Request Form
Customer Name: [input field]
Service Address: [input field]
━(✓) Priority request (shouldn't use in forms with submit buttons)
[Submit Request]
```

### Alternative for Non-Binary Choices

```
❌ Incorrect:
━(✓) Set email as primary contact method

✅ Correct:
Primary contact method
◉ Email address
◎ Phone number
```
