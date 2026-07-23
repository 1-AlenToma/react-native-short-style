import NestedStyleSheet from '../styles/NestedStyleSheet';


// ==========================================
// 1. BOOTSTRAP ATOMIC DICTIONARY
// ==========================================
export const userDefinedBootstrap = {
    "container": "pa-15 width-100%",
    "row": "di-flex fld-row flexWrap-wrap maR--15 maL--15",
    "col-6": "wi-50% paR-15 paL-15 !important",
    "d-flex": "di-flex !important",
    "justify-content-between": "justifyContent-space-between !important",
    "ali-center": "ali-center !important",

    // Spacing
    "mb-3": "maB-16 !important",
    "mt-3": "maT-16 !important",
    "mt-1": "maT-4 !important",

    // Typography
    "h2": "fs-32 foW-bold maB-8 !important",
    "fw-bold": "foW-bold !important",
    "text-primary": "co-#0d6efd !important",
    "text-success": "co-#198754 !important",
    "text-muted": "co-#6c757d !important",

    // Components
    "btn": "pa-10 bor-6 ali-center justifyContent-center di-flex bow-1 bos-solid boc-transparent",
    "btn > Text": "foW-600 tea-center fs-16",
    "btn-outline-primary": "bac-transparent boc-#0d6efd co-#0d6efd",

    "card": "bow-1 bos-solid bor-6 pa-16 sh-xs shadowColor-rgba(0,0,0,0.075)",
    "card-title": "fs-20 foW-500 maB-8",
    "card-text": "fs-14 lih-20",

    "form-control": "bow-1 bos-solid bor-6 pa-10 fs-16 he-45 wi-100%",
    "form-label": "fs-14 foW-600 maB-6",

    "list-group": "bow-1 bos-solid bor-6 overflow-hidden",
    "list-group-item": "pa-12 bobw-1 bobs-solid"
};

// ==========================================
// 2. TAILWIND ATOMIC DICTIONARY
// ==========================================
export const userDefinedTailwind = {
    "max-w-xl": "wi-100% maw-576 !important",
    "flex": "di-flex !important",
    "flex-row": "fld-row !important",
    "flex-wrap": "flexWrap-wrap !important",
    "justify-between": "justifyContent-space-between !important",
    "items-center": "ali-center !important",

    // Spacing (rem scaled base: 4px per unit)
    "space-y-4": "maB-16 !important",
    "w-1/2": "wi-50% !important",
    "p-4": "pa-16 !important",
    "p-3": "pa-12 !important",
    "mb-4": "maB-16 !important",
    "mt-4": "maT-16 !important",
    "mt-1": "maT-4 !important",

    // Typography & Colors
    "text-3xl": "fs-30 lih-36 !important",
    "text-xl": "fs-20 lih-28 !important",
    "text-sm": "fs-14 lih-20 !important",
    "text-xs": "fs-12 lih-16 !important",
    "font-bold": "foW-700 !important",
    "font-semibold": "foW-600 !important",
    "text-blue-600": "co-#2563eb !important",
    "text-green-600": "co-#16a34a !important",
    "text-gray-500": "co-#6b7280 !important",

    // Components / Utilites
    "rounded-lg": "bor-8 !important",
    "border": "bow-1 bos-solid !important",
    "shadow-sm": "sh-xs shadowColor-rgba(0,0,0,0.05) !important",

    "btn-tw": "pa-10 bor-8 ali-center justifyContent-center di-flex bow-1 bos-solid",
    "btn-tw > Text": "foW-500 tea-center fs-14",
    "btn-outline-blue": "bac-transparent boc-#3b82f6 co-#3b82f6"
};

// ==========================================
// 3. MASTER DESIGN MATRIX COMPILATION
// ==========================================
const designSystemThemes = [
    // [Index 0] Bootstrap Light Theme
    NestedStyleSheet.create({
        AnimatedView: { backgroundColor: "#f8f9fa" },
        View: { backgroundColor: "#ffffff" },
        Text: { color: "#212529" },
        TextInput: { color: "#212529" },
        Icon: { color: "#212529" },
        ...userDefinedBootstrap,
        "card": x=> x.joinRight(userDefinedBootstrap.card).joinRight("boc-#dee2e6 bac-#ffffff"),
        "form-control": "boc-#ced4da bac-#ffffff co-#212529",
        "form-label": "co-#212529",
        "list-group": "boc-#dee2e6",
        "list-group-item": "bobc-color-#dee2e6 bac-#ffffff co-#212529",
        
    }),

    // [Index 1] Bootstrap Dark Theme
    NestedStyleSheet.create({
        AnimatedView: { backgroundColor: "#212529" },
        View: { backgroundColor: "#2b3035" },
        Text: { color: "#f8f9fa" },
        TextInput: { color: "#f8f9fa" },
        Icon: x => x.co("#f8f9fa"),
         ...userDefinedBootstrap,
        "card": x=> x.joinRight(userDefinedBootstrap.card).joinRight("boc-#495057 bac-#2b3035"),
        "form-control": x=> x.joinRight(userDefinedBootstrap["form-control"]).joinRight("boc-#495057 bac-#1c1f23 co-#f8f9fa"),
        "form-label": x=> x.joinRight(userDefinedBootstrap["form-label"]).joinRight("co-#dee2e6"),
        "list-group": x=> x.joinRight(userDefinedBootstrap["list-group"]).joinRight("boc-#495057"),
        "list-group-item": x=> x.joinRight(userDefinedBootstrap["list-group-item"]).joinRight("bobc-#495057 bac-#2b3035 co-#f8f9fa"),
        "text-muted": x=> x.joinRight(userDefinedBootstrap["text-muted"]).joinRight("co-#adb5bd !important"),
       
    }),

    // [Index 2] Tailwind Light Theme
    NestedStyleSheet.create({
        AnimatedView: { backgroundColor: "#f9fafb" }, // bg-gray-50
        View: { backgroundColor: "#ffffff" },         // bg-white
        Text: { color: "#111827" },                   // text-gray-900
        TextInput: { color: "#111827" },
        Icon: { color: "#111827" },
        "border-base": "boc-#e5e7eb",        // border-gray-200
        "bg-surface": "bac-#ffffff",
        "input-base": "boc-#d1d5db bac-#ffffff co-#111827", // border-gray-300
        ...userDefinedTailwind
    }),

    // [Index 3] Tailwind Dark Theme
    NestedStyleSheet.create({
        AnimatedView: { backgroundColor: "#030712" }, // bg-gray-950
        View: { backgroundColor: "#1f2937" },         // bg-gray-800
        Text: { color: "#f9fafb" },                   // text-gray-50
        TextInput: { color: "#f9fafb" },
        Icon: x => x.co("#f9fafb"),
        "border-base": "boc-#374151",        // border-gray-700
        "bg-surface": "bac-#1f2937",
        "input-base": "boc-#4b5563 bac-#111827 co-#f9fafb", // border-gray-600
        "text-gray-500": x=> x.joinRight(userDefinedTailwind["text-gray-500"]).joinRight("co-#9ca3af !important"),     // text-gray-400 override
        ...userDefinedTailwind
    })
];



/**
 * Resolves a specific framework theme matrix from the master design token bank.
 * 
 * This utility dynamically filters and extracts paired structural sheets based on the
 * requested framework layout system, separating Light and Dark runtime configurations.
 *
 * @param themeType - The target UI framework architecture selection ("Tailwind" or "Bootstrap").
 * @returns A tuple array where:
 *          - Index `0` represents the target framework's Light Mode stylesheet compilation.
 *          - Index `1` represents the target framework's Dark Mode stylesheet compilation.
 * 
 * @example
 * // Resolving Bootstrap theme modes for the ThemeContainer component
 * const [lightTheme, darkTheme] = getSystemTheme("Bootstrap");
 */
export const getSystemTheme = (themeType: "Tailwind" | "Bootstrap") =>
    themeType == "Bootstrap"
        ? [designSystemThemes[0], designSystemThemes[1]]
        : [designSystemThemes[2], designSystemThemes[3]];
