import { loadCustomThemes as loadThemesServer, loadCustomEmojis as loadEmojisServer } from "@/app/_server/actions/config-actions";

export interface CustomTheme {
  name: string;
  icon?: string;
  colors: {
    [key: string]: string;
  };
}

export interface CustomEmojis {
  [key: string]: string;
}

export interface ThemeConfig {
  "custom-themes": {
    [key: string]: CustomTheme;
  };
}

export interface EmojiConfig {
  "custom-emojis": CustomEmojis;
}

const getDefaultIcon = (themeName: string) => {
  const lowerName = themeName.toLowerCase();
  if (lowerName.includes('dark')) return 'Moon';
  if (lowerName.includes('light')) return 'Sun';
  if (lowerName.includes('blue')) return 'Waves';
  if (lowerName.includes('green')) return 'Trees';
  if (lowerName.includes('red')) return 'Flame';
  if (lowerName.includes('purple')) return 'Palette';
  if (lowerName.includes('corporate') || lowerName.includes('business')) return 'Building';
  if (lowerName.includes('sunset') || lowerName.includes('orange')) return 'Sunset';
  return 'Palette';
};

export const loadCustomThemes = async (): Promise<ThemeConfig | null> => {
  try {
    const config = await loadThemesServer();
    return config;
  } catch (error) {
    return null;
  }
};

export const loadCustomEmojis = async (): Promise<EmojiConfig | null> => {
  try {
    const config = await loadEmojisServer();
    return config;
  } catch {
    return null;
  }
};

export const processCustomThemes = (config: ThemeConfig | null) => {
  if (!config || !config['custom-themes']) {
    return [];
  }

  const themes = Object.entries(config['custom-themes']).map(([id, theme]) => ({
    id,
    name: theme.name,
    icon: theme.icon || getDefaultIcon(theme.name)
  }));

  return themes;
};

export const processCustomEmojis = (config: EmojiConfig | null) => {
  if (!config || !config['custom-emojis']) return {};
  return config['custom-emojis'];
};
