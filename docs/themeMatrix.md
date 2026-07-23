import base64

# Define the markdown text for themeMatrix.md
markdown_content = """# Design System Engine Matrix (`themeMatrix.md`)

This repository uses `react-native-short-style` to power a dual-framework design system engine. It translates web-standard **Bootstrap** and **Tailwind CSS** class utility strings directly into optimized native UI configurations at runtime.

---

## 📦 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Global Framework Bridge Utility](#-global-framework-bridge-utility)
- [Bootstrap Theme Matrix](#-bootstrap-theme-matrix)
- [Tailwind CSS Theme Matrix](#-tailwind-css-theme-matrix)
- [Integration Sandbox Example](#-integration-sandbox-example)

---

## 🗺️ Architecture Overview

Unlike traditional CSS-in-JS tools that require individual inline object definitions, this engine parses class chains using an internally compiled selector dictionary:

```
               [ Style Token Chain: "card mb-3 text-primary" ]
                                     │
                                     ▼
                     [ react-native-short-style ]
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
     [ Bootstrap Class Map ]                   [ Tailwind Utility Map ]
  • Matches structural selectors            • Matches atomic utilities
  • Uses child combinators (> Text)         • Strict rule isolation (!important)
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
                     [ Render Native View Layer ]
```

---

## 🛠️ Global Framework Bridge Utility

Isolate design systems or swap active stylesheets at runtime using the system selector utility. This separation ensures your layout scales predictably without framework leakage.

```typescript
import { getSystemTheme } from './designSystemThemes';

// Returns an array pair containing [LightModeSheet, DarkModeSheet]
const [lightStyle, darkStyle] = getSystemTheme("Bootstrap"); 
```

---

## 🅰️ Bootstrap Theme Matrix

The Bootstrap matrix accurately matches traditional mobile-first layout patterns, global standard component spacing, and semantic design structures.

### 📋 Available Utility Token Catalog

| Token Class | Native Mapping Equivalent | Functional Context & Behavior |
| :--- | :--- | :--- |
| `container` | `padding: 15px; width: 100%;` | Primary outer wrapper layout lock |
| `row` | `flex-direction: row; flex-wrap: wrap;` | Core layout wrapper for grid column items |
| `col-6` | `width: 50% !important;` | Strict split-pane 2-column modifier |
| `mb-3` | `margin-bottom: 16px !important;` | Baseline structural bottom padding spacer |
| `mt-3` | `margin-top: 16px !important;` | Baseline structural top padding spacer |
| `h2` | `font-size: 32px; font-weight: bold;` | Large semantic section heading |
| `text-primary` | `color: #0d6efd !important;` | Main brand interactive highlight text token |
| `text-muted` | `color: #6c757d` *(Light)* / `#adb5bd` *(Dark)* | Dynamic contextual disabled text color |

### 🛠️ Built-in Complex UI Patterns

#### Buttons (`css="btn btn-outline-primary"`)
* **Layout Cascading**: Automatically calculates sizing parameters and centers nested labels using flex attributes.
* **Child Combinators**: The engine matches `.btn > Text` dynamically to apply a global `font-weight: 600` and `font-size: 16px` down the tree, removing the need for text styling loops.

#### Cards (`css="card"`)
* **Platform Shadows**: Instantly matches standard web depth profiles using native platform keys (`box-shadow-0px-1px-2px`).
* **Surface Inversion**: Automatically shifts background boundaries contextually (`#ffffff` in Light Mode vs. `#2b3035` in Dark Mode).

---

## 💨 Tailwind CSS Theme Matrix

The Tailwind configuration maps atomic helper utilities directly onto the internal library engine. Slices of layout definitions scale entirely by linking independent, single-purpose classes.

### 📋 Available Utility Token Catalog

| Token Class | Native Mapping Equivalent | Functional Context & Behavior |
| :--- | :--- | :--- |
| `max-w-xl` | `max-width: 576px !important;` | Caps fluid native widths to clear design markers |
| `flex` | `display: flex !important;` | Enforces standard layout structure layout profiles |
| `flex-row` | `flex-direction: row !important;` | Changes component flex direction axes to row |
| `justify-between`| `justify-content: space-between;` | Splits element items cleanly along the main row axis |
| `space-y-4` | `margin-bottom: 16px !important;` | Injects consistent spacing indexes between items |
| `w-1/2` | `width: 50% !important;` | Fractional layout layout boundary width marker |
| `p-4` | `padding: 16px !important;` | Balanced structural text-block layout cushion |
| `text-3xl` | `font-size: 30px; line-height: 36px;` | Dominant display text configuration |
| `text-xl` | `font-size: 20px; line-height: 28px;` | Secondary feature section title baseline |
| `font-bold` | `font-weight: 700 !important;` | Overrides standard font weights to full heavy bold |
| `text-blue-600` | `color: #2563eb !important;` | High-visibility Tailwind token variant color |
| `rounded-lg` | `border-radius: 8px !important;` | Smooth standard radius curve variant |

### 🛠️ Core Execution Mechanics

#### Surface Shifting Matrix (`css="bg-surface border border-base"`)
* **`bg-surface`**: Resolves dynamically to `#ffffff` (Light) or `#1f2937` (Dark - equivalent to `bg-gray-800`).
* **`border-base`**: Automatically swaps the stroke context out between `#e5e7eb` (Light - `gray-200`) and `#374151` (Dark - `gray-700`).

#### Atomic Text Isolation (`css="text-sm text-gray-500"`)
* Allows immediate text modifications without risking wrapper configuration leaks.
* Automatically balances accessibility contrast scores when running inside active dark layout blocks.

---

## ⚡ Integration Sandbox Example

This code sample shows how easily components adapt to framework-specific utility structures when nested inside your system core container.

```javascript
import React from 'react';
import { View, Text } from 'react-native';

export const CoreSystemDemo = () => {
  return (
    <View>
      {/* 🅰️ Bootstrap Component Tree Layout */}
      <View css="card mb-3">
        <Text css="card-title text-primary">Bootstrap Block</Text>
        <Text css="card-text text-muted">Uses class pairing structures.</Text>
      </View>

      {/* 💨 Tailwind Component Tree Layout */}
      <View css="bg-surface border border-base rounded-lg p-4 shadow-sm mb-4">
        <Text css="text-xl font-semibold text-blue-600 mb-4">Tailwind Block</Text>
        <Text css="text-sm text-gray-500">Uses decoupled atomic properties.</Text>
      </View>
    </View>
  );
};
```
"""

