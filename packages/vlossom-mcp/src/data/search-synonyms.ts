/**
 * Natural language → Vlossom concept keyword mapping.
 * Expands the search query so terms not in component metadata
 * still resolve to relevant components.
 */
export const SYNONYM_MAP: Record<string, string[]> = {
    // Layout & Navigation
    chart: ["table", "grid", "data"],
    graph: ["table", "progress"],
    dashboard: ["layout", "grid", "header", "footer"],
    nav: ["header", "tabs", "steps"],
    navigation: ["header", "tabs", "steps"],
    sidebar: ["drawer", "layout"],
    panel: ["drawer", "block", "accordion"],
    menu: ["drawer", "tabs", "select"],

    // Overlay & Feedback
    popup: ["modal", "tooltip", "drawer"],
    overlay: ["modal", "dimmed", "drawer"],
    alert: ["toast", "modal", "message"],
    notification: ["toast", "message"],
    confirm: ["modal", "alert"],
    snackbar: ["toast"],
    dialog: ["modal"],
    banner: ["toast", "bar"],

    // Form & Input
    dropdown: ["select"],
    combobox: ["select", "search-input"],
    autocomplete: ["search-input", "select"],
    multiselect: ["select", "checkbox"],
    picker: ["select", "date"],
    toggle: ["switch"],
    slider: ["input", "range"],
    rating: ["input"],
    typeahead: ["search-input"],

    // Data Display
    list: ["table", "grouped-list"],
    grid: ["table", "layout"],
    card: ["block", "image"],
    tag: ["chip"],
    badge: ["chip", "message"],
    label: ["chip", "message"],
    pill: ["chip"],
    bubble: ["chip", "tooltip"],
    thumbnail: ["image", "avatar"],

    // Loading & Progress
    spinner: ["loading", "skeleton"],
    placeholder: ["skeleton"],
    shimmer: ["skeleton"],
    "progress bar": ["progress", "loading"],
    bar: ["progress", "bar"],

    // Interaction
    drag: ["file-drop"],
    "file upload": ["file-drop"],
    "drag and drop": ["file-drop"],
    collapse: ["accordion", "expandable"],
    expand: ["accordion", "expandable"],
    tree: ["accordion", "grouped-list"],
    stepper: ["steps"],
    wizard: ["steps"],
    carousel: ["tabs", "index-view"],
    gallery: ["image", "tabs"],

    // Typography & Content
    code: ["block", "text-wrap"],
    markdown: ["block", "text-wrap"],
    copy: ["text-wrap"],
    link: ["text-wrap"],
    hint: ["tooltip", "message"],
    helper: ["tooltip", "message"],
    error: ["message", "input"],
    validation: ["form", "input", "message"],

    // Misc
    theme: ["theme-button"],
    "dark mode": ["theme-button"],
    color: ["theme-button", "color-scheme"],
    scroll: ["inner-scroll", "bar"],
    sticky: ["bar", "header", "footer"],
    fixed: ["bar", "header", "footer"],
    divider: ["divider"],
    separator: ["divider"],
};
