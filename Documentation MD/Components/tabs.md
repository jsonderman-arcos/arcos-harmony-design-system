**MUI:** https://mui.com/material-ui/react-tabs/

**React Native Paper:** https://github.com/web-ridge/react-native-paper-tabs

Tabs allow users to switch between different views or sections of content within the same context, providing a clear and organized way to navigate related information.

## Why to use

**Purpose:** Tabs are used to group related content and speed up navigation between different views or sections.

### Navigation
Tabs are only navigation elements and cannot be used for selection.
**Subject:** what?
```
✅ Good
Arrival windows | Assigned convoys

Personal data | Payment information | Security settings
❌ Avoid
Registration request
As a person | As a business
(segment control or radio buttons should be used)
```

## When to use
- **Long Pages**: Use tabs to speed up navigation within the same context and avoid overly long pages
- **Purpose-based Grouping**: Use tabs to divide content into groups meaningful for different user purposes
***Note:*** Tabs should be used for navigation, not for selection. All tab contents exist simultaneously, with only one visible at a time. For selection controls in forms, use radio buttons or segmented controls instead.

## How to use
### Interaction
- Tabs should provide immediate feedback when clicked or tapped, such as changing appearance or showing a loading state
- For desktop applications, tabs should have clear hover state to indicate interactivity
- For smaller screens, tabs can be swipeable or scrollable (include a button to scroll) left and right

### Visual design
- **Shape:** A horizontal row of text labels with a line underneath. The active tab is distinguished by color, bold text, and a bold underline.
- **Size:** Minimum touch target size of 48px on mobile, 24px on web to avoid 'fat-finger' mistakes
- **Focus States:** Clear visual indicators for keyboard and accessibility
- **Hover States:** Subtle background change or border emphasis to indicate interactivity on desktop

### **Labeling**
- Use Title Case and noun-based labels for tabs, e.g. Account Settings | Payment Information
- Avoid using verbs or action-based labels for tabs, e.g. Account Settings instead of Manage Your Account

## Accessibility requirements
### **WCAG 2.2 compliance**
- Minimum contrast: 4.5:1 for labels, 3:1 for indicators and focus states
- Focus visible indicators required for keyboard navigation
- Content readable when zoomed to 320 CSS pixels without horizontal scrolling

### **Keyboard navigation**
- Reachable via Tab key, activatable with Spacebar or Enter
- Custom controls need tabindex="0" for keyboard focus
- Tab order follows logical reading sequence

### **Screen reader support**
- Use aria-label when no visible label exists
- Proper tab role exposure for accessibility APIs

## States and behavior
| State | Appearance | Purpose | When to use |
|-------|------------|---------|-------------|
| **Enabled** | Text label in Title Case | Indicates that tab is ready to be activated | Tab is ready for interaction but not Active|
| **Active** | Bold label, bold underline, active color | Indicates that tab is currently active | Tab is currently being viewed |
| **Disabled** | Faded appearance | Indicates that tab is not available for interaction | Tab is not available for interaction |
| **Hovered** | Subtle background change or border emphasis | Indicates that tab is interactable | Tab is being hovered over |
| **Focused** | Outline or glow effect | Indicates that tab is currently focused | Tab is focused by keyboard navigation |
| **Pressed** | Darker background or inset effect | Indicates that tab is currently being pressed | Tap or click on tab |


## Examples
### ✅ Correct usage
```
Account | Payment Information | Security Settings

Arrival windows | Assigned convoys
```

### ❌ Incorrect usage
```
Registration request
As a person | As a business

Manage Your Account | Change Payments | Refresh Password

Check arrival windows | Manage assigned convoys
```