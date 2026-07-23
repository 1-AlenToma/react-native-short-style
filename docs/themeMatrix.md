# Theme Matrix

The library includes **4 ready-to-use themes**.

| Index | Framework | Theme |
| ----: | --------- | ----- |
|     0 | Bootstrap | Light |
|     1 | Bootstrap | Dark  |
|     2 | Tailwind  | Light |
|     3 | Tailwind  | Dark  |

Use `getSystemTheme()` to get the Light/Dark pair for a framework.

```ts
const [lightTheme, darkTheme] = getSystemTheme("Bootstrap");

// or

const [lightTheme, darkTheme] = getSystemTheme("Tailwind");
```

---

# Bootstrap

## Shared Bootstrap Classes

These classes are available in **both** Bootstrap Light and Dark themes.

### Layout

| Class                     | Description             |
| ------------------------- | ----------------------- |
| `container`               | Main page container     |
| `row`                     | Flex row with wrapping  |
| `col-6`                   | Half-width column       |
| `d-flex`                  | Display flex            |
| `justify-content-between` | Space between children  |
| `align-items-center`      | Center items vertically |

### Spacing

* `mt-1`
* `mt-3`
* `mb-3`

### Typography

* `h2`
* `fw-bold`
* `text-primary`
* `text-success`
* `text-muted`

### Components

* `btn`
* `btn-outline-primary`
* `card`
* `card-title`
* `card-text`
* `form-control`
* `form-label`
* `list-group`
* `list-group-item`

---

## Bootstrap Light

### Default Colors

| Element    | Color                 |
| ---------- | --------------------- |
| Background | White                 |
| Text       | Dark Gray (`#212529`) |
| Card       | White                 |
| Input      | White                 |
| Borders    | Light Gray            |

---

## Bootstrap Dark

### Default Colors

| Element    | Color        |
| ---------- | ------------ |
| Background | Dark Gray    |
| Text       | White        |
| Card       | Dark Gray    |
| Input      | Almost Black |
| Borders    | Medium Gray  |

---

# Tailwind

## Shared Tailwind Classes

These classes are available in **both** Tailwind Light and Dark themes.

### Layout

* `flex`
* `flex-row`
* `flex-wrap`
* `justify-between`
* `items-center`
* `max-w-xl`
* `w-1/2`

### Spacing

* `p-3`
* `p-4`
* `mt-1`
* `mt-4`
* `mb-4`
* `space-y-4`

### Typography

* `text-3xl`
* `text-xl`
* `text-sm`
* `text-xs`
* `font-bold`
* `font-semibold`
* `text-blue-600`
* `text-green-600`
* `text-gray-500`

### Components

* `btn-tw`
* `btn-outline-blue`
* `rounded-lg`
* `border`
* `shadow-sm`

---

## Tailwind Light

### Default Colors

| Element    | Color    |
| ---------- | -------- |
| Background | White    |
| Text       | Gray 900 |
| Surface    | White    |
| Border     | Gray 200 |
| Input      | White    |

---

## Tailwind Dark

### Default Colors

| Element    | Color    |
| ---------- | -------- |
| Background | Gray 950 |
| Text       | Gray 50  |
| Surface    | Gray 800 |
| Border     | Gray 700 |
| Input      | Gray 900 |

---

# Example

```ts
import { getSystemTheme } from "./themes";

const [lightTheme, darkTheme] = getSystemTheme("Bootstrap");

// or

const [lightTheme, darkTheme] = getSystemTheme("Tailwind");
```

Pass the returned themes to your `ThemeContainer`.

```ts
<ThemeContainer
    themes={[lightTheme, darkTheme]}
/>
```

Click [here to view userThemes.ts](https://github.com/1-AlenToma/react-native-short-style/blob/main/styled/src/theme/userThemes.ts) to see the fullcode instead

This API always returns a two-element array containing the Light and Dark variants for the requested framework.