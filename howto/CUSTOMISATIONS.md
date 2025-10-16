# Custom Themes and Emojis

You can easily add custom themes and emojis by creating configuration files in the `config/` directory. These will be automatically loaded and merged with the built-in themes and emojis.

**Note**: While app settings (name, description, icons) are now managed through the admin UI, custom themes and emojis still use the `config/` directory approach below.

### Custom Themes

Create `config/themes.json` with your custom themes:

```json
{
  "custom-themes": {
    "my-theme": {
      "name": "My Custom Theme",
      "icon": "Palette",
      "colors": {
        "--background": "255 255 255",
        "--background-secondary": "249 250 251",
        "--foreground": "20 20 20",
        "--primary": "37 99 235",
        "--primary-foreground": "255 255 255",
        "--secondary": "241 245 249",
        "--secondary-foreground": "20 20 20",
        "--muted": "241 245 249",
        "--muted-foreground": "100 116 139",
        "--accent": "241 245 249",
        "--accent-foreground": "20 20 20",
        "--destructive": "239 68 68",
        "--destructive-foreground": "255 255 255",
        "--border": "226 232 240",
        "--input": "226 232 240",
        "--ring": "37 99 235"
      }
    }
  }
}
```

**Required color variables:**

- `--background`, `--background-secondary`, `--foreground`
- `--card`, `--card-foreground`, `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`

### Custom Emojis

Create `config/emojis.json` with your custom emojis:

```json
{
  "custom-emojis": {
    "meeting": "🤝",
    "deadline": "⏰",
    "project": "📋",
    "deploy": "🚀",
    "bug": "🐛",
    "feature": "✨"
  }
}
```

When you type checklist items containing these words, the custom emojis will automatically appear.

### Available Icons

For themes, you can use these icon names: `Sun`, `Moon`, `Sunset`, `Waves`, `Trees`, `CloudMoon`, `Palette`, `Terminal`, `Github`, `Monitor`, `Coffee`, `Flower2`, `Flame`, `Palmtree`, `Building`. If no icon is specified, a default will be chosen based on the theme name.

### Configuration Validation

The app validates your configuration files and will show warnings in the console if there are any format errors. Invalid configs will be ignored and the app will continue working with built-in themes and emojis.

**Important:** If you want to use custom themes and emojis, make sure your local `config/` directory has the correct permissions:

```bash
mkdir -p config
chown -R 1000:1000 config/
chmod -R 755 config/
```
