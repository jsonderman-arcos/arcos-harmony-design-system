**MUI:** https://mui.com/material-ui/react-select

**React Native Paper:** https://callstack.github.io/react-native-paper/docs/components/Menu

Dropdown select menus allow users to select one option from a list of mutually exclusive choices, with options revealed on demand to conserve screen space and provide optimal defaults.

## Why to use

**Purpose:** Dropdown select menus provide space-efficient presentation of multiple options while allowing designers to set optimal defaults and downplay alternative choices when appropriate.

### Selection of an object or state

Enable users to choose one option from multiple mutually exclusive alternatives when there are 5+ options and screen space efficiency is important.

**Complement:** use what? with what? is what?

**Appositive:** what or who, namely?

**Determiner or modifier:** which? of what kind or measure?

```
✅ Example
Event Type
[Category 3 Hurricane ▼]
```

### Adjustment of an action

Configure how an action should be performed from predefined methods while emphasizing the recommended approach.

**Complement:** use what? with what?

**Adjunct:** do how? when? why?

```
✅ Example
Backup Generator Model
[Generac 22kW ▼]
```

## When to use
- **Space-constrained layouts:** Ideal for mobile views, sidebars, and dense forms
- **Contextual options:** Use when the list changes dynamically (e.g., filtered or API-driven)
- **Pre-filled selections:** Helpful when a default suits most users
- **Low-visibility alternatives:** Use when secondary options should stay out of focus
- **Error-prone inputs:** Reduce mistakes for known values like states, currencies, or file formats

***Note:*** Use dropdowns to save space or show dynamic options. Prefer radio buttons when all options should stay visible, or listboxes when an overview helps users decide.

## How to use
### Interaction
- Each dropdown allows selection of exactly one option—clicking the down-arrow displays mutually-exclusive items
- Selecting an item or clicking outside closes the dropdown
- The selected option or default value remains visible in the container box, while other items appear only after clicking the down-arrow
- Give users an optimal option, selected by default to guide decision-making and reduce cognitive load

### Visual design
- **Shape:** Container box with downward-facing arrow button, expandable list
- **Size:** Consistent touch targets (minimum 40 px on mobile, 24 px on web) to avoid 'fat-finger' mistakes
- **Organization:** Display options in logical order: group related items, place most common first, or use alphabetical/sequential order for numbers and dates

### Labeling
- Use object/attribute labels—avoid command language
- Group related options with clear category structure
- Use descriptive labels that work well in constrained space

## Accessibility requirements

### WCAG 2.2 compliance
- Minimum contrast: 4.5:1 for labels and text, 3:1 for borders and focus states
- Focus visible indicators required for keyboard navigation
- Content readable when zoomed to 320 CSS pixels without horizontal scrolling

### Keyboard navigation
- Reachable via Tab key, opens with Space/Enter, navigatable with Arrow keys within options
- Escape key closes dropdown without selection
- Home/End keys navigate to first/last options

### Screen reader support
- Use proper select/combobox roles and ARIA attributes
- Options announced clearly with current selection status
- Labels must be descriptive and associated with controls

## States and behavior
| State | Appearance | Purpose | When to use |
|-------|------------|---------|-------------|
| **Closed without value (Default)** | Container with label or placeholder and down arrow | Motivate user to select value | By default, if selection needs to be done by the user |
| **Closed with value** | Container with selected value and down arrow | Shows current selection efficiently | When selection can be pre-populated or already chosen by the user |
| **Active** | Expanded scrollable list of all options | Allows browsing and selection | User activates dropdown |
| **Disabled** | Grayed out, reduced opacity, non-interactive | Option exists but unavailable | Prerequisites not met, insufficient permissions |
| **Focused** | Visible outline around container | Indicates keyboard navigation position | Keyboard navigation, accessibility compliance |
| **Hovered (Web only)** | Subtle highlighting on container/options | Interactive feedback | Mouse interaction on web platforms |
| **Error** | Red border and label | Focus user on mistake | When selected option is not applicable |

## Examples
### ✅ Correct usage

```
Time Zone
[UTC-05:00 (Eastern Time) ▼]
UTC-12:00 (Baker Island)
UTC-11:00 (American Samoa)
UTC-10:00 (Hawaii)
UTC-09:00 (Alaska)
UTC-08:00 (Pacific Time)
UTC-07:00 (Mountain Time)
UTC-06:00 (Central Time)
UTC-05:00 (Eastern Time)
UTC-04:00 (Atlantic Time)

Hurricane Category
[Category 3 Hurricane ▼]
Tropical Depression
Tropical Storm  
Category 1 Hurricane
Category 2 Hurricane
Category 3 Hurricane
Category 4 Hurricane
Category 5 Hurricane

Power Grid Transformer Model
[Siemens 138kV ▼]
ABB 69kV Distribution
Siemens 138kV  
GE 230kV Transmission
Schneider 345kV
Hitachi 500kV

Backup schedule
[Daily at 2:00 AM ▼]
```

### ❌ Incorrect usage

```
Binary choices (use toggle or checkbox)
[Yes ▼]
Yes
No

Few options with space available (use radio buttons)
Service Status
[Active ▼]
Active
Inactive
Maintenance

Multiple selection needs (use checkboxes or multiselect)
[Email notifications ▼]

Commands/actions (use buttons)
[Delete account ▼]

Execute backup procedure
[Run backup ▼]
```

### Alternative for simple choices

```
❌ Incorrect:
Equipment Status
[Online ▼]
Online
Offline
Maintenance

✅ Correct:
Equipment Status
◉ Online
◎ Offline
◎ Maintenance
```

### Alternative for commands

```
❌ Incorrect:
Account Actions
[Delete account ▼]

✅ Correct:
Account Actions
[Delete Account] [Suspend Account] [Export Data]
```
