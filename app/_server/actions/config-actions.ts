'use server'

import { readFileSync } from 'fs';
import { join } from 'path';

interface ThemeConfig {
    "custom-themes": {
        [key: string]: {
            name: string;
            icon?: string;
            colors: {
                [key: string]: string;
            };
        };
    };
}

interface EmojiConfig {
    "custom-emojis": {
        [key: string]: string;
    };
}

const validateThemeConfig = (config: any): config is ThemeConfig => {
    if (!config || typeof config !== 'object') return false;
    if (!config['custom-themes'] || typeof config['custom-themes'] !== 'object') return false;

    for (const [themeId, theme] of Object.entries(config['custom-themes'])) {
        if (typeof theme !== 'object' || !theme) return false;
        const themeObj = theme as any;
        if (typeof themeObj.name !== 'string') return false;
        if (themeObj.icon && typeof themeObj.icon !== 'string') return false;
        if (!themeObj.colors || typeof themeObj.colors !== 'object') return false;

        for (const [colorKey, colorValue] of Object.entries(themeObj.colors)) {
            if (typeof colorValue !== 'string') return false;
        }
    }

    return true;
};

const validateEmojiConfig = (config: any): config is EmojiConfig => {
    if (!config || typeof config !== 'object') return false;
    if (!config['custom-emojis'] || typeof config['custom-emojis'] !== 'object') return false;

    for (const [key, value] of Object.entries(config['custom-emojis'])) {
        if (typeof value !== 'string') return false;
    }

    return true;
};

export async function loadCustomThemes() {
    try {
        let configPath = join(process.cwd(), 'config', 'themes.json');
        let configContent;

        try {
            configContent = readFileSync(configPath, 'utf-8');
        } catch {
            configPath = join(process.cwd(), '_config', 'themes.json');
            configContent = readFileSync(configPath, 'utf-8');
        }

        const config = JSON.parse(configContent);

        if (!validateThemeConfig(config)) {
            console.warn('Invalid themes.json format, using empty config');
            return { "custom-themes": {} };
        }

        return config;
    } catch (error) {
        return { "custom-themes": {} };
    }
}

export async function loadCustomEmojis() {
    try {
        let configPath = join(process.cwd(), 'config', 'emojis.json');
        let configContent;

        try {
            configContent = readFileSync(configPath, 'utf-8');
        } catch {
            configPath = join(process.cwd(), '_config', 'emojis.json');
            configContent = readFileSync(configPath, 'utf-8');
        }

        const config = JSON.parse(configContent);

        if (!validateEmojiConfig(config)) {
            console.warn('Invalid emojis.json format, using empty config');
            return { "custom-emojis": {} };
        }

        return config;
    } catch (error) {
        return { "custom-emojis": {} };
    }
}
