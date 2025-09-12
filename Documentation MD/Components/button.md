**MUI:** https://mui.com/material-ui/react-button/

**React Native Paper:** https://callstack.github.io/react-native-paper/docs/components/Button/

Buttons allow users to perform actions with a single click or tap, providing clear visual feedback and immediate interaction.

## Why to use

**Purpose:** Buttons are primarily used to give a command to the system, and secondarily to change the status of an object, or navigate to another page.

### Command

Used to give a command to the system, such as submitting a form, saving changes, or executing an action.

**Command**: do what?

```
✅ Good
[Log in]
[Send my information]
[Add team member]
❌ Avoid
[Login] (noun, not a verb)
[Send] (too generic)
[Save automatically] (checkbox or toggle switch is better)
[Please help] (not a command)
```

### Status
Used to change the status of an object, such as marking an item as complete. Allowed to use instead of commands to save space and reduce non-informative labels like “Mark as…”
**Predicative complement:** subject is what? which?
**Adjunct:** how? why? what for? when?
```
✅ Good
[Approved]
[Junk]
[Important]
[Requires review]
✅  Allowed
[Mark as approved] (command form)
❌ Avoid
[Change status to approved] (too long)
```

### Navigation
Used to navigate to another page or section of the application, such as going to a settings page or viewing a profile. Helps to save space avoiding command-based labels like “Go to…”
**Subject:** what?
```
✅ Good
[To profile]
[Settings]
❌ Avoid
[Advanced] (not clear what it does)
[More] (not informative)
```

## When to use
- **Forms**: Submit, save, or cancel actions
- **Actions**: Execute commands like delete, edit, or share
- **Status changes**: Mark items as complete, approved, or important
- **Navigation**: Move to different sections or pages
***Note:*** Avoid using buttons for navigation when links or tabs are more appropriate, as buttons imply an action rather than a navigation intent.

## How to use
### Interaction
- Buttons should provide immediate feedback when clicked or tapped, such as changing appearance or showing a loading state
- For desktop applications, buttons should have clear hover state to indicate interactivity

### Visual design
- **Shape:** Rectangular with rounded corners
- **Size:** Minimum touch target size of 42px on mobile, 24px on web to avoid ‘fat-finger’ mistakes
- **Styling:** Use primary, secondary, or text styles to indicate importance and action type
- **Focus States:** Clear visual indicators for keyboard and accessibility

### **Labeling**
- Use Sentence case for button text, e.g. [Log in] instead of [Log In]
- Command buttons should verb or action based, e.g. [Add team member]
- Command buttons should **only be imperative**—not declarative, interrogative, or exclamatory
- Button text must be descriptive to the action it will perform, e.g. [Send my information] instead of [Submit form]

## Accessibility requirements
### **WCAG 2.2 compliance**
- Minimum contrast: 4.5:1 for labels, 3:1 for borders and focus indicators
- Focus visible indicators required for keyboard navigation
- Content readable when zoomed to 320 CSS pixels without horizontal scrolling

### **Keyboard navigation**
- Reachable via Tab key, activatable with Spacebar or Enter
- Custom controls need tabindex="0" for keyboard focus
- Tab order follows logical reading sequence

### **Screen reader support**
- Use aria-label when no visible label exists
- Proper button role exposure to accessibility APIs
- Labels must be descriptive, brief, and clear

## States and behavior
| State | Appearance | Purpose | When to use |
|-------|------------|---------|-------------|
| **Enabled (Default)** | Normal button appearance | Indicates button is available for interaction | Initial state, ready for user action |
| **Hovered** | Subtle background change or border emphasis | Provides interactive feedback before selection | When hovering over the button |
| **Pressed** | Pressed state with visual feedback | Indicates button is being activated | When button is clicked or tapped |
| **Disabled** | Grayed out, reduced opacity, non-interactive | Option exists but is currently unavailable | Prerequisites not met, insufficient permissions |
| **Focused** | Visible outline or highlight around button | Indicates keyboard navigation position | User navigates via keyboard |
| **Loading** | Spinner or progress indicator within button | Provide continuous feedback during processing | When an action is being processed |
## Examples
### ✅ Correct usage
```
Command buttons:
[Log in]
[Send my information]
[Add team member]
Status buttons:
[Approved]
[Junk]
Navigation buttons:
[To profile]
[Settings]
```

### ❌ Incorrect usage
```
[Login] (noun, not a verb)
[Send] (too generic)
[Save automatically] (checkbox or toggle switch case)
[Please help] (not a command)
[Change status to approved] (too long)
[Advanced] (not clear what it does)
[More] (not informative)
```

## Additional materials
- https://rostermonster.atlassian.net/wiki/x/BoAuKAE — document that helps to identify where to use primary, secondary, or text buttons.