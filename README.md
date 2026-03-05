# Config-Driven UI Builder — Complete Study Guide

> **Full preparation from basics to advanced — for interviews and deep understanding.**

---

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [Why Was This Project Built?](#2-why-was-this-project-built)
3. [Tech Stack](#3-tech-stack)
4. [Quick Start](#4-quick-start)
5. [Features Overview](#5-features-overview)
6. [Architecture — 5 Layers Explained](#6-architecture--5-layers-explained)
7. [Folder Structure Explained](#7-folder-structure-explained)
8. [Data Flow — Step by Step](#8-data-flow--step-by-step)
9. [Code Walkthrough for Every File](#9-code-walkthrough-for-every-file)
10. [Three Demo Schemas Explained](#10-three-demo-schemas-explained)
11. [Theme System (Light/Dark Mode)](#11-theme-system-lightdark-mode)
12. [Performance Optimizations](#12-performance-optimizations)
13. [How to Extend?](#13-how-to-extend)
14. [Interview Questions & Answers](#14-interview-questions--answers)
15. [Where Is This Used in the Real World?](#15-where-is-this-used-in-the-real-world)

---

## 1. What Is This Project?

This is a **React application** that **dynamically generates an entire UI from JSON configuration**. No form, field, layout, or button is hardcoded — everything is built at runtime from a JSON schema.

**In simple terms:**

```
Traditional approach:  Developer writes JSX        →  React renders it
Config-driven:         JSON describes the UI       →  Engine decides what to render  →  React renders it
```

Think of it like a **restaurant**:
| Concept | Restaurant Analogy |
|---|---|
| **JSON Schema** | Menu card — "this is what I want" |
| **Schema Parser** | Waiter — reads the order and understands it |
| **Render Engine** | Kitchen manager — assigns each dish to the right chef |
| **Component Registry** | List of chefs — "pizza = Chef A, pasta = Chef B" |
| **Components (Input, Select, etc.)** | Individual chefs — each prepares their own dish |
| **Final Form** | The finished dish served on a plate to the customer |

You just write the **menu card (JSON)**. The kitchen (engine) automatically prepares everything.

---

## 2. Why Was This Project Built?

Modern companies (Shopify, Salesforce, Retool, Google Forms) don't manually code every form. They build a **rendering engine**, and then the product team simply writes a JSON schema — "put an input here, a dropdown there, a checkbox here" — and the UI is automatically generated.

**Benefits of this project:**

1. **Scalability** — Need to add a new field type? Just create a component and register it. No need to touch the engine code.
2. **Separation of Concerns** — Product managers decide *what* to show (JSON). Frontend engineers decide *how* to show it (components).
3. **Server-Driven UI** — The JSON schema can come from an API. The backend changes, the frontend UI updates — without redeploying the frontend.
4. **Consistency** — All forms use the same renderer. Styling, validation, accessibility — everything is uniform.
5. **Testability** — Testing a JSON object is much easier than testing a React component tree.

---

## 3. Tech Stack

| Layer | Choice |
|---|---|
| Bundler | Vite |
| Framework | React 19 (functional components) |
| Language | JavaScript ES6+ |
| State Management | Context API + useReducer |
| Styling | CSS Modules + CSS Custom Properties (theming) |
| UI Frameworks | None (everything built from scratch) |

---

## 4. Quick Start

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Create a production build
npm run build

# Preview the production build
npm run preview
```

---

## 5. Features Overview

- **Dynamic UI Rendering** — The entire interface is generated from JSON
- **Recursive Renderer** — Handles schemas of any nesting depth
- **Component Registry** — Maps type strings to React components (extensible at runtime)
- **Conditional Rendering Engine** — `showIf` / `hideIf` with AND/OR/equality/includes operators
- **Validation Engine** — required, email, minLength, maxLength, pattern, cross-field match, custom validators
- **Nested Layout System** — Row, column, and CSS grid layouts that are composable within schemas
- **Theme System** — Light/Dark mode with system preference detection and localStorage persistence
- **Fully Responsive** — Adapts seamlessly across desktop, tablet, and mobile with touch-friendly controls
- **Performance Optimized** — React.memo, useMemo, useCallback applied thoughtfully throughout

---

## 6. Architecture — 5 Layers Explained

This project has **5 distinct layers**. Each layer has a single responsibility.

```
┌─────────────────────────────────────────────┐
│  Layer 5: Application Shell (App.jsx)       │
│  Selects schema, provides context           │
├─────────────────────────────────────────────┤
│  Layer 4: Renderer (Renderer.jsx)           │
│  Bridge between Schema → Render Engine →    │
│  React elements                             │
├─────────────────────────────────────────────┤
│  Layer 3: Engine Layer                      │
│  renderEngine.js — recursive tree walker    │
│  conditionEngine.js — show/hide logic       │
├─────────────────────────────────────────────┤
│  Layer 2: Component Layer                   │
│  Form, Input, Select, Checkbox, Button ...  │
│  componentRegistry.js — type → component    │
├─────────────────────────────────────────────┤
│  Layer 1: Foundation                        │
│  FormContext — state management             │
│  useValidation / useForm — hooks            │
│  validationUtils — rule evaluation          │
│  schemaParser — normalization               │
└─────────────────────────────────────────────┘
```

### Layer 1: Foundation
- **schemaParser.js** — Normalizes raw JSON. Assigns each node an `id`, `path`, `type`, `props`, and `children`.
- **validationUtils.js** — Pure validation functions. Has nothing to do with React. Pass in a value, rules, and a label — it returns an error or null.
- **FormContext.jsx** — Manages form state via `useReducer` (values, errors, touched, isSubmitting).
- **useValidation.js** — Connects a single field to the form context. Returns `value`, `error`, `handleChange`, `handleBlur`.
- **useForm.js** — Convenience wrapper — provides the full context plus a derived `isValid` value.

### Layer 2: Component Layer
- Each component (Input, Select, Checkbox, Textarea, Button, Form, Layout) is a **leaf renderer**.
- All are wrapped with `React.memo` — preventing unnecessary re-renders.
- Styled with CSS Modules — no class name collisions.
- **componentRegistry.js** — Maps type strings to components. This is the entire system's **extension point**.

### Layer 3: Engine Layer
- **conditionEngine.js** — Evaluates `showIf`/`hideIf` conditions against form values.
- **renderEngine.js** — Recursive tree walker. For each node: check conditions → look up component in registry → recursively process children → call `createElement`.

### Layer 4: Renderer (Bridge)
- `Renderer.jsx` — A thin React wrapper. Parses the schema (memoized), reads form values from context, and calls `renderNode`.

### Layer 5: Application Shell
- `App.jsx` — Tab bar, schema switching, `FormProvider` wrapping, submit handling, theme toggle.

---

## 7. Folder Structure Explained

```
src/
├── components/
│   ├── Renderer/        # Core renderer component — converts schema to React elements
│   ├── Form/            # <form> wrapper — title, description, submit handling
│   ├── Input/           # Text/email/password input — with validation
│   ├── Button/          # Submit/reset/action button — with variants
│   ├── Layout/          # Row/column/grid container — flexible layouts
│   ├── Select/          # Dropdown select — supports string and object options
│   ├── Checkbox/        # Boolean toggle — checked/unchecked
│   └── Textarea/        # Multiline text — configurable rows
│
├── registry/
│   └── componentRegistry.js   # Type → Component mapping (extension point)
│
├── engine/
│   ├── renderEngine.js        # Recursive tree → React element conversion
│   └── conditionEngine.js     # showIf / hideIf evaluation (AND/OR/equals/includes)
│
├── context/
│   ├── FormContext.jsx        # Global form state via useReducer
│   └── ThemeContext.jsx       # Light/Dark theme state + localStorage persistence
│
├── hooks/
│   ├── useForm.js             # Full form API + derived helpers (isValid)
│   └── useValidation.js       # Per-field validation wiring (onChange/onBlur)
│
├── utils/
│   ├── validationUtils.js     # Rule runners + error messages + form-level validation
│   └── schemaParser.js        # Raw JSON → normalized tree + field extraction
│
├── config/
│   └── exampleSchema.js       # Three demo schemas (Contact, Password, Survey)
│
├── styles/
│   ├── global.css             # Reset + CSS custom properties (theme variables)
│   └── App.module.css         # App shell layout + responsive breakpoints
│
├── App.jsx                    # Root: tab bar + schema switching + theme toggle
└── main.jsx                   # Entry point: ThemeProvider + App mount
```

---

## 8. Data Flow — Step by Step

### A) Render Flow (JSON Schema → Form on Screen)

```
1. App.jsx selects a schema object (via tab click)
        │
2. FormProvider receives the schema
   └─► extractFields() walks the schema tree
   └─► Builds initialValues: { firstName: "", lastName: "", ... }
   └─► Initializes useReducer with this state
        │
3. Renderer receives the raw schema
   └─► parseSchema() normalizes it into a tree (with ids/paths)
        │
4. renderNode() is called on the root node
   │
   ├─► shouldRender() checks showIf/hideIf
   │   └─► If false → returns null (entire subtree skipped)
   │
   ├─► componentRegistry[node.type] → resolves the React component
   │
   ├─► For each child: recursively calls renderNode()
   │
   └─► createElement(Component, props, children)
        │
5. React mounts the component tree
   └─► Each field component calls useValidation(name)
       └─► Reads value/error from FormContext
       └─► Returns onChange/onBlur handlers
```

### B) Input Flow (User Types → State Update)

```
1. User types into an Input field
        │
2. onChange fires → handleChange(event)
   └─► Extracts event.target.value
   └─► Calls updateField(name, value)
        │
3. FormContext reducer handles SET_VALUE
   └─► formValues[name] = new value
        │
4. If the field was previously touched (blurred):
   └─► validateField(name) runs validation rules
   └─► Dispatches SET_ERROR or CLEAR_ERROR
        │
5. Context value changes → Renderer re-renders
   └─► renderNode() re-evaluates conditions with new formValues
   └─► Fields whose value/error didn't change → React.memo skips them
```

### C) Submit Flow (Button Click → Data or Errors)

```
1. User clicks the Submit button
        │
2. Button calls submitForm()
        │
3. submitForm() calls validateForm(values, schemaChildren)
   └─► Walks every field node in the schema
   └─► Skips hidden fields (shouldRender check)
   └─► Runs validateField() on every visible field
   └─► Collects all errors into a single object
        │
4. If there are errors:
   └─► Dispatches SET_ERRORS with the full error map
   └─► Fields display their errors
   └─► Submit is aborted
        │
5. If there are no errors:
   └─► Dispatches SET_SUBMITTING = true
   └─► Calls onSubmit(formValues)
   └─► Dispatches SET_SUBMITTING = false
```

### D) Conditional Rendering Flow (showIf/hideIf)

```
1. A schema node contains: showIf: { field: "isEmployed", equals: true }
        │
2. During renderNode(), shouldRender() is called
   └─► evaluateCondition({ field: "isEmployed", equals: true }, formValues)
   └─► Checks formValues["isEmployed"] === true
        │
3. If false → renderNode returns null (component is not mounted)
   If true  → component renders normally
        │
4. When the user toggles the "isEmployed" checkbox:
   └─► formValues changes
   └─► Renderer re-runs renderNode() on the entire tree
   └─► The conditional field now evaluates differently
   └─► React mounts or unmounts the component accordingly
```

---

## 9. Code Walkthrough for Every File

### `src/utils/schemaParser.js` — Schema Parser

**What it does:** Takes the user's raw JSON and converts it into a uniform internal structure.

**`normalizeNode(node, parentPath)`:**
- Assigns each node a unique `id` (uses existing id or auto-generates one)
- Separates `type` and `children`, puts everything else into `props`
- Recursively normalizes all children
- Returns: `{ id, path, type, props, children }`

**Why normalize?** Raw schemas may have missing `children`, inconsistent shapes, or no IDs. The Renderer needs a predictable structure. Normalization happens once (memoized).

**`extractFields(schema)`:** Walks the normalized tree and collects every node that has a `name` property. FormContext uses this to know which fields exist and what their initial values should be.

---

### `src/utils/validationUtils.js` — Validation Engine

**What it does:** Pure-function validation. No connection to React.

**Architecture:**
- `PATTERN_MAP` — Maps pattern names (email, url, phone) to regular expressions
- `BUILT_IN_VALIDATORS` — Maps rule names to validator functions. Each function returns `true` (valid) or `false` (invalid)
- `DEFAULT_MESSAGES` — Maps rule names to human-readable error messages

**`validateField(value, rules, label, allValues)`:**
- Iterates through each rule in the rules object
- Looks up the validator in `BUILT_IN_VALIDATORS`
- If validation fails, generates an error message (custom if provided, otherwise default)
- Returns on the first error (fail-fast) — or null if everything passes

**`validateForm(values, schemaChildren)`:**
- Recursively walks the schema (handles nested layouts)
- Skips hidden fields (`shouldRender` check)
- Calls `validateField` on every visible field
- Returns: an errors object `{ fieldName: "error message", ... }`

---

### `src/context/FormContext.jsx` — Form State Management

**What it does:** Manages centralized form state using `useReducer`.

**State shape:**
```javascript
{
  formValues: { firstName: "", email: "", ... },
  errors: { email: "Email is required" },
  touched: { firstName: true },
  isSubmitting: false
}
```

**Why useReducer instead of useState?** Form state has multiple interdependent sub-values (values, errors, touched). A reducer consolidates all transitions into a single function — making state updates predictable and debuggable. This is the same reasoning Redux uses, just applied at the component level here.

**Action types:**
- `SET_VALUE` — Update a single field's value
- `SET_ERROR` / `CLEAR_ERROR` — Set or remove a single field's error
- `SET_ERRORS` — Replace the entire errors object (used on submit)
- `SET_TOUCHED` — Mark a field as "interacted with"
- `RESET` — Return to initial values
- `SET_SUBMITTING` — Toggle the submitting flag

---

### `src/engine/conditionEngine.js` — Condition Engine

**What it does:** Determines whether a schema node should be rendered or not.

**Supported operators:**
- `{ field, equals }` — Strict equality (===)
- `{ field, notEquals }` — Strict inequality (!==)
- `{ field, includes }` — Array membership check
- `{ and: [...] }` — All sub-conditions must pass
- `{ or: [...] }` — At least one sub-condition must pass

**Recursive composition:** AND/OR conditions can be nested to any depth. This is the same approach used in database query builders (MongoDB, Elasticsearch).

---

### `src/engine/renderEngine.js` — Render Engine

**What it does:** Converts the normalized schema tree into React elements.

**`renderNode(node, registry, formValues, createElement)`:**
1. Null check
2. Calls `shouldRender()` — if false, returns null (entire subtree skipped)
3. Looks up component via `registry[node.type]`
4. If not found — warns in dev mode, returns null
5. Recursively processes children
6. Calls `createElement(Component, { key, ...props }, children)`

**Why is `createElement` injected?** The render engine is pure logic. It doesn't import React directly, so it remains a testable JavaScript module. In tests, you can pass a mock `createElement` that records calls without needing a React environment.

---

### `src/registry/componentRegistry.js` — Component Registry

**What it does:** Maps type strings to React components.

```javascript
{
  form:     Form,       // "form" in schema → <Form /> is rendered
  input:    Input,      // "input" in schema → <Input /> is rendered
  select:   Select,     // "select" in schema → <Select /> is rendered
  checkbox: Checkbox,
  textarea: Textarea,
  button:   Button,
  layout:   Layout,
}
```

**`registerComponent(type, component)`** — Add new types at runtime. Useful for plugin architectures.

**What is the Registry pattern?** This is **Inversion of Control** — the Renderer doesn't need to know about every component type. It just looks them up in a table. The benefit is that adding new components doesn't require touching the engine code (Open/Closed Principle). This same pattern is used in Webpack loaders, VS Code extensions, and Angular dependency injection.

---

### `src/components/Renderer/Renderer.jsx`

**What it does:** The React component that orchestrates rendering.

**Three memoized steps:**
1. `useMemo(() => parseSchema(schema), [schema])` — Normalize once
2. `useMemo(() => merge registries, [registry])` — Allow overrides
3. `useMemo(() => renderNode(...), [schema, registry, formValues])` — Re-render when form values change (necessary for conditional rendering)

---

### Component Files (Input, Select, Checkbox, Textarea, Button, Form, Layout)

All follow the same pattern:
1. Import `useValidation` (field components) or `useFormContext` (Form, Button)
2. Destructure schema props
3. Connect to form state via hooks
4. Render HTML elements with proper attributes
5. Conditionally show error messages
6. Wrap in `React.memo`

---

## 10. Three Demo Schemas Explained

### Schema 1: Contact Form
**Demonstrates:** Multiple input types, nested row layouts, conditional rendering, rich validation.

- First Name + Last Name → Inside a `layout` with `direction: 'row'` (side by side)
- Email → `pattern: 'email'` validation
- Phone → Optional, `pattern: 'phone'`
- Role dropdown → If "Other" is selected → "Specify Your Role" field appears (`showIf`)
- Employed checkbox → If checked → "Company Name" field appears (`showIf`)
- Bio textarea → `maxLength: 300`
- Register + Reset buttons

### Schema 2: Password Change
**Demonstrates:** Cross-field validation (match), custom error messages.

- Current Password → `required: true`
- New Password → `required: true, minLength: 8` + custom message
- Confirm Password → `match: 'newPassword'` + custom message "Passwords do not match"

### Schema 3: Developer Survey
**Demonstrates:** Grid layout, complex nested AND/OR conditions.

- Primary Language + Experience Level → `direction: 'grid', columns: 2` (2-column grid)
- Preferred Framework → `showIf: { or: [JS, TS] }` — only visible when JS or TS is selected
- State Library checkbox → Same OR condition
- "Which state library?" → `showIf: { and: [checkbox true, { or: [JS, TS] }] }` — both conditions must be true
- Comments → `maxLength: 500`

---

## 11. Theme System (Light/Dark Mode)

### How does it work?

1. **CSS Custom Properties** — `global.css` defines 30+ CSS variables under `:root` (light) and `[data-theme="dark"]` (dark). All components use these variables.

2. **ThemeContext** — `ThemeContext.jsx` manages the theme state. The `data-theme` attribute is set on the `<html>` element. The choice is persisted in localStorage.

3. **System Preference Detection** — On the first visit, `prefers-color-scheme: dark` is checked. If the user's system is in dark mode, dark mode is automatically applied.

4. **Toggle Button** — A sun/moon button sits next to the tab bar. Clicking it switches between light and dark modes.

### Theme variables concept:
```css
/* Light mode (default) */
:root {
  --color-bg: #f1f5f9;
  --color-surface: #fff;
  --color-text: #0f172a;
  --color-border: #cbd5e1;
}

/* Dark mode */
[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --color-border: #334155;
}
```

All components use variables like `var(--color-bg)`. When the `data-theme` attribute changes, all colors switch simultaneously.

---

## 12. Performance Optimizations

- **React.memo** on every leaf component — When the parent form state changes but a specific field's value/error hasn't changed, that field doesn't re-render.
- **useMemo** on schema parsing — The raw schema is normalized once and cached until the schema reference changes.
- **useCallback** on event handlers — Closures aren't recreated on every render, which would defeat `React.memo`.
- **queueMicrotask** — Defers validation to the next microtask so that state update batching stays clean.

---

## 13. How to Extend?

### Add a New Component Type (e.g., DatePicker)

```
Step 1: Create src/components/DatePicker/DatePicker.jsx
Step 2: Import it in src/registry/componentRegistry.js
Step 3: Add it to the registry: datepicker: DatePicker
Step 4: Use it in a schema: { type: "datepicker", name: "dob", label: "Date of Birth" }
```

No engine code needs to be touched.

### Server-Driven Schemas

```javascript
const [schema, setSchema] = useState(null);

useEffect(() => {
  fetch('/api/forms/registration')
    .then(res => res.json())
    .then(setSchema);
}, []);

if (!schema) return <Loading />;
return <FormProvider schema={schema}><Renderer schema={schema} /></FormProvider>;
```

### Visual Schema Editor

Build a drag-and-drop interface that produces schema JSON. Feed it into the same Renderer. This is what Retool, Typeform, and JotForm do internally.

### Field-Level Permissions

```javascript
{
  type: "input",
  name: "salary",
  label: "Salary",
  showIf: { field: "$userRole", equals: "admin" }
}
```

Inject `$userRole` from an auth context into form values.

---

## 14. Interview Questions & Answers

### Q1: What is Config-Driven UI? Explain in one line.

**A:** An architecture pattern where the UI is not hardcoded — a JSON schema describes what to display, and a rendering engine reads that schema to produce actual components.

---

### Q2: How is this different from Formik or React Hook Form?

**A:** Those libraries manage form **state** (values, errors, validation), but you still have to write JSX manually for each field. In this project, **the JSX itself is generated from data** — write `type: "input"` in a schema, and the engine produces the `<Input />` component automatically. In practice, you could use React Hook Form as the state layer and build a schema renderer on top of it.

---

### Q3: What is the Registry pattern and why was it used?

**A:** A registry is a **lookup table** — it maps type strings to React components. This is **Inversion of Control** — the render engine doesn't need to know about every component type. It simply looks them up in the table. The benefit is that adding new components doesn't require touching the engine code (Open/Closed Principle). This same pattern is used in Webpack loaders, VS Code extensions, and Angular dependency injection.

---

### Q4: Why was useReducer used instead of useState?

**A:** Form state has multiple interdependent values — `formValues`, `errors`, `touched`, `isSubmitting`. With `useState`, there would be 4 separate state variables, and coordinating between them would be difficult. `useReducer` centralizes all transitions into a single reducer function — every state change is explicit and predictable. Debugging is also easier because every action has a clear type and payload.

---

### Q5: How does conditional rendering work? Explain nested AND/OR.

**A:** Any schema node can have a `showIf` or `hideIf` property. Before rendering each node, the render engine calls `shouldRender()`, which lives in `conditionEngine.js`.

The Condition Engine evaluates recursively:
- Simple: `{ field: "role", equals: "admin" }` → `formValues.role === "admin"`
- AND: `{ and: [cond1, cond2] }` → Both must pass
- OR: `{ or: [cond1, cond2] }` → At least one must pass
- Nested: AND inside OR, OR inside AND — to any depth

When form values change, the Renderer re-runs, conditions are re-evaluated, and React accordingly mounts or unmounts components.

---

### Q6: How would you handle performance with 100+ fields?

**A:** Three strategies:
1. **Virtualization** — Only render visible fields (react-window or react-virtualized). New fields mount on scroll.
2. **Sectioned rendering** — Split the schema into pages/tabs. Only mount the active section.
3. **Field-level subscriptions** — Instead of a single global context, use a pub/sub model where each field subscribes only to its own value. React Hook Form uses this approach with refs.

---

### Q7: How would you add TypeScript?

**A:** Define a discriminated union type for `SchemaNode` — each variant corresponds to a component type. Type the registry as `Record<string, React.ComponentType<any>>`. Create a typed interface for validation rules. Set the render engine's return type as `React.ReactElement | null`. Schemas can then be validated at compile-time — write an incorrect type and TypeScript gives an error.

---

### Q8: What are the tradeoffs of this approach?

**A:**
**Pros:**
- Extensibility — New components are easily added
- Consistency — All forms use the same renderer
- Server-driven capability — Backend can change the UI without frontend redeployment
- Cross-platform potential — Same schema, different renderers

**Cons:**
- Debugging is harder — You debug data, not code
- The schema format becomes a "language" that must be maintained
- Upfront investment — Building the engine is time-consuming
- Overkill for simple apps — If you only have one contact form, writing JSX directly is better

**When the tradeoff is worth it:** When your system has many forms (10+), needs backend-driven UI, or needs to render the same forms across multiple platforms.

---

### Q9: How would you test this system?

**A:**
- **Unit tests** — `validateField`, `evaluateCondition`, `normalizeNode` are pure functions. Test them with Jest.
- **Integration tests** — Use React Testing Library to render a schema, simulate user input, and assert form state.
- **Schema validation** — Validate schemas with JSON Schema or Zod before they reach the renderer.
- **Visual regression** — Snapshot test rendered forms to catch unintended style changes.

---

### Q10: Why is `createElement` injected into the render engine?

**A:** The render engine is pure JavaScript logic. It doesn't import React directly. The benefits:
- **Testability** — Tests can pass a mock `createElement` that records calls without needing a React environment
- **Portability** — Theoretically, another framework's `createElement` could be passed instead
- **Separation of concerns** — The engine knows nothing about React; it just walks a tree

---

### Q11: What was the hidden field validation bug and how was it fixed?

**A:** `validateForm` was validating all fields — including those that weren't visible on screen due to `showIf` conditions. For example, the `otherRole` field had `required: true`, but it was only visible when `role === 'other'`. If the user didn't select "Other", the field was hidden, but validation was still failing silently — the form wouldn't submit, and no error was visible.

Fix: Added a `shouldRender()` check inside `validateForm` — if a field is hidden, its validation is skipped. Additionally, the `allValues` parameter was passed to `validateField` so that cross-field `match` validation also works correctly.

---

### Q12: How was the theme system implemented?

**A:** Using a CSS Custom Properties approach:
1. Defined light theme colors in `:root`
2. Defined dark theme colors in `[data-theme="dark"]`
3. Replaced all hardcoded colors in component CSS files with `var(--color-xyz)`
4. Created `ThemeContext` which toggles the `data-theme` attribute on the `<html>` element
5. The choice persists in `localStorage`
6. On first visit, the `prefers-color-scheme` media query detects the system preference

---

## 15. Where Is This Used in the Real World?

| Company / Product | How They Use It |
|---|---|
| **Shopify** | Store themes and checkout flows are schema-driven. Merchants configure their storefront using JSON-like schemas. |
| **Salesforce Lightning** | The entire Lightning platform uses metadata-driven components. Admins configure pages by setting up schemas, without writing code. |
| **Retool / Appsmith** | Low-code platforms where users drag-and-drop to configure components, which are stored as configuration objects and dynamically rendered. |
| **Google Forms** | Every form is a schema (question type, options, validation rules). The renderer walks the schema and produces the form. |
| **Enterprise Admin Panels** | Companies like Amazon, Meta, and Stripe use schema-driven table/form builders in internal tools so backend engineers can define admin UIs without writing frontend code. |

---

## License

MIT
