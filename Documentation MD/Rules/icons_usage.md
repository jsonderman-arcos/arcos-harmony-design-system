# Icons Usage

## Where to use icons
Icons are used to provide visual cues that complement text labels. They can be used in various contexts, such as:
- **Buttons**: To indicate actions like save, delete, or edit.
- **Navigation**: To represent sections or features like home, settings, or search.
- **Status indicators**: To show the state of an item, such as online/offline, active/inactive, or error/success.
- **Form elements**: To clarify input fields, such as search boxes or dropdowns.

## What icon libraries to use
It is allowed to use any icon library to find the best fit metaphor and look consistent with other icons. Preferred order of icon libraries:
- **MUI Icons**: The Material-UI icon set that integrates seamlessly with React applications.
- **Material Icons**: Google's icon set that follows Material Design guidelines.
- **Font Awesome**: A widely used icon library that provides a large variety of icons.
- **Noun Project**: A collection of icons created by various designers.
- **Custom SVGs**: For unique icons that are not available in existing libraries, custom SVGs can be created.

## Overall icons usage
- **Labels**: Avoid using icons as standalone labels. Always pair them with text or at least tooltips to ensure clarity.
- **Internal consistency**: Use the same icon for the same action or concept across all of the application to avoid confusion.
- **External consistency**: Align icon usage with platform conventions and popular applications to meet user expectations.
- **Metaphor**: Ensure icons clearly represent their intended action or concept. Avoid abstract or overly complex icons that may confuse users.
- **Not required**: If an icon confuses users or does not add value, it is better to use text labels only. Having no icon for some list items is beneficial for readability. Not every item needs an icon.

## Action icons usage
Action icons can be used to support or replace buttons or other action-based controls.
- **Simplicity**: Use simple, recognizable icons that convey the action clearly (e.g., a trash can for delete, a pencil for edit, a plus sign for add).
- **Action based**: Icons should represent actions rather than objects (e.g., use a simple plus icon for Add document, not a document icon with a plus inside).
- **Consistency**: Use the same icon for similar actions across the application (e.g., always use a pencil icon for edit, regardless of context).
- **Icon only buttons**: Allowed only for secondary actions and when the icon is **widely recognized** (e.g., a magnifying glass for search). Always provide tooltips for desktop experience.

## Navigation icons usage
Navigation icons are used to represent different sections or features of the application.
- **Clarity**: Use icons that clearly represent the navigation destination (e.g., a house for Home, a gear for Settings).
- **Uniqueness**: Each navigation icon should be unique to avoid confusion. Do not use the same icon for different sections.

## Status icons usage
Status icons provide visual feedback about the state of an item or action.
- **Immediate recognition**: Use universally recognized icons for common statuses (e.g., a checkmark for success, an exclamation mark for warning, a cross for error).

## Information icons usage
Information icons are used to support or replace text labels to be used in pair with numbers or other information.
- **Clear metaphor**: Use icons that clearly represent the type of information being conveyed and cannot be confused with other actions (e.g., two people for people count, instead of a user icon).