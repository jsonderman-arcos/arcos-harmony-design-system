**MUI:** https://mui.com/material-ui/react-radio-button/

**React Native Paper:** https://callstack.github.io/react-native-paper/docs/components/RadioButton/

Radio buttons allow users to select one option from a set of mutually exclusive choices, with all available options visible at once.

## Why to use

**Purpose:** Radio buttons provide clear visual presentation of all available options, enabling users to make informed decisions by comparing choices before selecting one.

### Selection of an object or state

Enable users to choose one option from multiple mutually exclusive alternatives.

**Complement:** use what? with what? is what?

**Appositive:** what or who, namely?

**Determiner or modifier:** which? of what kind or measure?

```
✅ Example
Service priority
◉ Emergency response
◎ Standard maintenance  
◎ Scheduled upgrade
```

### Adjustment of an action

Configure how an action should be performed from predefined methods.

**Complement:** use what? with what?

**Adjunct:** do how? when? why?

```
✅ Example
Restoration method
◉ Automatic switching
◎ Manual crew dispatch
◎ Customer self-service
```

## When to use
- **Single selection:** Choose only one option from a set
- **Visible alternatives:** Help users compare options side by side
- **Settings with one active value:** Use for preferences like frequency or priority
- **Default-driven choices:** Guide decisions with a recommended pre-selected option

***Note:*** If space is limited or the list is long, consider using a Dropdown Menu Select component to save space.

## How to use
### Interaction
- Each radio button group allows selection of exactly one option—previous selections are automatically deselected
- Radio buttons should always appear in groups, never individually, as choosing from a single option makes no sense
- The most commonly used option should be selected by default to guide users toward expected choices

### Visual design
- **Shape:** Circular indicators with clear selected/unselected states
- **Spacing:** Radio button circles should be close together to show they form a group
- **Grouping:** Place radio buttons underneath each other vertically; use horizontal segmented controls for inline layouts

### Labeling
- Avoid confirmation language—don't use "Yes/No" or "Confirm/Refuse" patterns
- Remove repeated words as common factors in group labels
- Use positive wording for binary choices—consider checkboxes instead

## Accessibility requirements

### WCAG 2.2 compliance
- Minimum contrast: 4.5:1 for labels, 3:1 for indicators and focus states
- Focus visible indicators required for keyboard navigation
- Content readable when zoomed to 320 CSS pixels without horizontal scrolling

### Keyboard navigation
- Reachable via Tab key, navigatable with Arrow keys within group
- Custom controls need tabindex="0" for keyboard focus
- Tab order follows logical reading sequence

### Screen reader support
- Use fieldset and legend for group labeling
- Proper radio role exposure to accessibility APIs
- Labels must be descriptive, brief, and clear

## States and behavior
| State | Appearance | Purpose | When to use |
|-------|------------|---------|-------------|
| **Unselected** | Empty circle with border | Indicates available but not chosen option | Default state for non-default options |
| **Selected** | Filled circle with center dot | Confirms user's active choice | User has made selection, represents current state |
| **Disabled** | Grayed out, reduced opacity, non-interactive | Option exists but is currently unavailable | Prerequisites not met, insufficient permissions |
| **Focused** | Visible outline or highlight around option | Indicates keyboard navigation position | User navigates via keyboard, accessibility compliance |
| **Hovered (Web only)** | Subtle background change or emphasis | Provides interactive feedback before selection | Mouse interaction, enhances discoverability |

## Examples
### ✅ Correct usage

```
Outage response priority
◉ Critical infrastructure
◎ Commercial customers
◎ Residential areas

Storm preparation level
◉ Full activation
◎ Partial activation
◎ Monitoring only

Assign crew to:
◉ Vegetation Management
◎ Line Repair
◎ Damage Assessment
```

### ❌ Incorrect usage

```
Notification settings (should use checkboxes for multiple selections)
◎ Email alerts
◎ SMS notifications  
◎ Phone calls

Service Request Form
Customer Name: [input field]
Service Address: [input field]
◉ Rush processing (shouldn't use individual radio button)
[Submit Request]

Enable backup systems? (should use checkbox with positive wording)
◎ Yes
◎ No

Equipment status (should use checkbox with positive wording)
◎ Do not monitor
◎ Monitor continuously

◉ Assign crew to Vegetation Management  
◎ Assign crew to Line Repair
◎ Assign crew to Damage Assessment
(repetitive wording)
```
