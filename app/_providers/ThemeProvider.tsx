"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/app/_utils/settings-store";
import { BUILT_IN_THEMES, getCustomThemeColors } from "@/app/_consts/themes";

const themeIDs = BUILT_IN_THEMES.map((theme) => theme.id);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, getResolvedTheme } = useSettings();
  const [resolvedTheme, setResolvedTheme] = useState<string>('light');
  const [customThemeColors, setCustomThemeColors] = useState<{
    [key: string]: any;
  }>({});

  useEffect(() => {
    const loadCustomColors = async () => {
      try {
        const colors = await getCustomThemeColors();
        setCustomThemeColors(colors);
      } catch (error) {
        console.error("Failed to load custom theme colors:", error);
      }
    };

    loadCustomColors();
  }, []);

  useEffect(() => {
    const updateResolvedTheme = () => {
      const resolved = getResolvedTheme();
      setResolvedTheme(resolved);
    };

    updateResolvedTheme();

    if (theme === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateResolvedTheme();

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, getResolvedTheme]);

  useEffect(() => {
    const allThemes = [...themeIDs, ...Object.keys(customThemeColors)];
    document.documentElement.classList.remove(...allThemes);
    document.documentElement.classList.add(resolvedTheme);

    if (customThemeColors[resolvedTheme]) {
      const styleId = "custom-theme-styles";
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;

      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      const cssVariables = Object.entries(customThemeColors[resolvedTheme])
        .map(([key, value]) => `${key}: ${value};`)
        .join("\n        ");

      const cssContent = `
        .${resolvedTheme} {
          ${cssVariables}
        }
      `;

      styleElement.textContent = cssContent;
    }
  }, [resolvedTheme, customThemeColors]);

  return <>{children}</>;
};