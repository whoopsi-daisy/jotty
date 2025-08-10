export const APP_CONSTANTS = {
    DEFAULT_CATEGORY: "Uncategorized",
    MAX_TITLE_LENGTH: 100,
    MAX_CONTENT_LENGTH: 10000,
    SEARCH_DEBOUNCE_MS: 300,
    SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
} as const;

export const ROUTES = {
    HOME: "/",
    ADMIN: "/admin",
    PROFILE: "/profile",
    USERS: "/users",
} as const;

export const MODES = {
    CHECKLISTS: "checklists",
    DOCS: "docs",
} as const;

export const STORAGE_KEYS = {
    APP_MODE: "app-mode",
    THEME: "theme",
} as const;
