# Theme Matrix

This document describes the available design system themes bundled with the project.

The design system consists of **two framework styles**:

- Bootstrap
- Tailwind

Each framework contains both a **Light** and **Dark** variant.

Click [here to view userThemes.ts](https://github.com/1-AlenToma/react-native-short-style/blob/main/styled/src/theme/userThemes.ts) to see the fullcode instead

---

# Theme Index

| Index | Framework | Mode |
|-------:|-----------|------|
| 0 | Bootstrap | Light |
| 1 | Bootstrap | Dark |
| 2 | Tailwind | Light |
| 3 | Tailwind | Dark |

`getSystemTheme()` resolves these into framework pairs.

```ts
getSystemTheme("Bootstrap")
// => [BootstrapLight, BootstrapDark]

getSystemTheme("Tailwind")
// => [TailwindLight, TailwindDark]
```

---

# Bootstrap Theme

## Bootstrap Light

### Global Components

| Component | Value |
|----------|-------|
| AnimatedView | `backgroundColor: #f8f9fa` |
| View | `backgroundColor: #ffffff` |
| Text | `color: #212529` |
| TextInput | `color: #212529` |
| Icon | `color: #212529` |

### Theme Overrides

| Class | Style |
|------|-------|
| card | `border-color: #dee2e6` `background: #ffffff` |
| form-control | `border-color: #ced4da` `background: #ffffff` `color: #212529` |
| form-label | `color: #212529` |
| list-group | `border-color: #dee2e6` |
| list-group-item | `border-bottom-color: #dee2e6` `background: #ffffff` `color: #212529` |

---

## Bootstrap Dark

### Global Components

| Component | Value |
|----------|-------|
| AnimatedView | `backgroundColor: #212529` |
| View | `backgroundColor: #2b3035` |
| Text | `color: #f8f9fa` |
| TextInput | `color: #f8f9fa` |
| Icon | `color: #f8f9fa` |

### Theme Overrides

| Class | Style |
|------|-------|
| card | `border-color: #495057` `background: #2b3035` |
| form-control | `border-color: #495057` `background: #1c1f23` `color: #f8f9fa` |
| form-label | `color: #dee2e6` |
| list-group | `border-color: #495057` |
| list-group-item | `border-bottom-color: #495057` `background: #2b3035` `color: #f8f9fa` |
| text-muted | `color: #adb5bd` |

---

# Bootstrap Utility Classes

## Layout

| Class | Expands To |
|------|------------|
| container | `pa-15 width-100%` |
| row | `di-flex flex-direction-row flex-wrap-wrap maR--15 maL--15` |
| col-6 | `width-50% paR-15 paL-15` |
| d-flex | `di-flex` |
| justify-content-between | `justify-content-space-between` |
| align-items-center | `align-items-center` |

---

## Spacing

| Class | Expands To |
|------|------------|
| mt-1 | `maT-4` |
| mt-3 | `maT-16` |
| mb-3 | `maB-16` |

---

## Typography

| Class | Expands To |
|------|------------|
| h2 | `fs-32 foW-bold maB-8` |
| fw-bold | `foW-bold` |
| text-primary | `co-#0d6efd` |
| text-success | `co-#198754` |
| text-muted | `co-#6c757d` |

---

## Components

### Button

```css
btn
```

```
pa-10
border-radius-6
align-items-center
justify-content-center
di-flex
border-width-1
border-style-solid
border-color-transparent
```

### Button Text

```
foW-600
text-center
fs-16
```

### Outline Button

```
bac-transparent
border-color-#0d6efd
co-#0d6efd
```

### Card

```
border-width-1
border-style-solid
border-radius-6
pa-16
box-shadow-0px-1px-2px-rgba(0,0,0,0.075)
```

### Card Title

```
fs-20
foW-500
maB-8
```

### Card Text

```
fs-14
line-height-20
```

### Form Control

```
border-width-1
border-style-solid
border-radius-6
pa-10
fs-16
height-45
width-100%
```

### Form Label

```
fs-14
foW-600
maB-6
```

### List Group

```
border-width-1
border-style-solid
border-radius-6
overflow-hidden
```

### List Group Item

```
pa-12
border-bottom-width-1
border-bottom-style-solid
```

---

# Tailwind Theme

## Tailwind Light

### Global Components

| Component | Value |
|----------|-------|
| AnimatedView | `backgroundColor: #f9fafb` |
| View | `backgroundColor: #ffffff` |
| Text | `color: #111827` |
| TextInput | `color: #111827` |
| Icon | `color: #111827` |

### Theme Tokens

| Token | Style |
|------|-------|
| border-base | `border-color: #e5e7eb` |
| bg-surface | `background: #ffffff` |
| input-base | `border-color: #d1d5db background:#ffffff color:#111827` |

---

## Tailwind Dark

### Global Components

| Component | Value |
|----------|-------|
| AnimatedView | `backgroundColor: #030712` |
| View | `backgroundColor: #1f2937` |
| Text | `color: #f9fafb` |
| TextInput | `color: #f9fafb` |
| Icon | `color: #f9fafb` |

### Theme Tokens

| Token | Style |
|------|-------|
| border-base | `border-color: #374151` |
| bg-surface | `background: #1f2937` |
| input-base | `border-color: #4b5563 background:#111827 color:#f9fafb` |
| text-gray-500 | `color:#9ca3af` |

---

# Tailwind Utility Classes

## Layout

| Class | Expands To |
|------|------------|
| flex | `di-flex` |
| flex-row | `flex-direction-row` |
| flex-wrap | `flex-wrap-wrap` |
| justify-between | `justify-content-space-between` |
| items-center | `align-items-center` |
| max-w-xl | `width-100% max-width-576` |
| w-1/2 | `width-50%` |

---

## Spacing

| Class | Expands To |
|------|------------|
| p-3 | `pa-12` |
| p-4 | `pa-16` |
| mt-1 | `maT-4` |
| mt-4 | `maT-16` |
| mb-4 | `maB-16` |
| space-y-4 | `maB-16` |

---

## Typography

| Class | Expands To |
|------|------------|
| text-3xl | `fs-30 line-height-36` |
| text-xl | `fs-20 line-height-28` |
| text-sm | `fs-14 line-height-20` |
| text-xs | `fs-12 line-height-16` |
| font-bold | `foW-700` |
| font-semibold | `foW-600` |
| text-blue-600 | `co-#2563eb` |
| text-green-600 | `co-#16a34a` |
| text-gray-500 | `co-#6b7280` |

---

## Components

### Button

```
pa-10
border-radius-8
align-items-center
justify-content-center
di-flex
border-width-1
border-style-solid
```

### Button Text

```
foW-500
text-center
fs-14
```

### Outline Button

```
bac-transparent
border-color-#3b82f6
co-#3b82f6
```

### Rounded

```
border-radius-8
```

### Border

```
border-width-1
border-style-solid
```

### Shadow

```
box-shadow-0px-1px-2px-rgba(0,0,0,0.05)
```

---

# Runtime Selection

Use `getSystemTheme()` to resolve framework-specific themes.

```ts
const [lightTheme, darkTheme] = getSystemTheme("Bootstrap");

<ThemeContainer
    themes={[lightTheme, darkTheme]}
    defaultTheme={lightTheme}
/>
```

or

```ts
const [lightTheme, darkTheme] = getSystemTheme("Tailwind");
```

This API always returns a two-element array containing the Light and Dark variants for the requested framework.