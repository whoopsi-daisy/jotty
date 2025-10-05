# rwMarkable

<p align="center">
  <br />
  <a href="https://www.buymeacoffee.com/fccview">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" width="130">
  </a>
</p>

A simple, self-hosted app for your checklists and notes.

Tired of bloated, cloud-based to-do apps? `rwMarkable` is a lightweight alternative for managing your personal checklists and notes. It's built with Next.js 14, is easy to deploy, and keeps all your data on your own server.

<br />

----

<p align="center">
  <a href="http://discord.gg/invite/mMuk2WzVZu">
    <img width="40" src="public/repo-images/discord_icon.webp">
  </a>
  <br />
  <i>Join the discord server for more info</i>
  <br />
</p>

----
<br />

<div align="center">
  <p align="center">
    <em>Clean, intuitive interface for managing your checklists and tasks.</em>
  </p>
  <img src="public/app-screenshots/checklist-home.png" alt="Checklist Home View" width="400" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

  <p align="center">
    <em>Heavily customisable themes.</em>
  </p>
  <img src="public/app-screenshots/checklist-theme.png" alt="Checklist with Theme" width="400" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 0 8px;">

  <p align="center">
    <em>Rich text editor for notes and beautiful theme customization.</em>
  </p>
  <img src="public/app-screenshots/document-view.png" alt="Note Editor" width="400" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 0 8px;">
</div>

## Features

- **Checklists:** Create task lists with drag & drop reordering, progress bars, and categories. Supports both simple checklists and advanced task projects with Kanban boards and time tracking.
- **Rich Text Notes:** A clean WYSIWYG editor for your notes, powered by TipTap with full Markdown support and syntax highlighting.
- **Sharing:** Share checklists or notes with other users on your instance, including public sharing with shareable links.
- **File-Based:** No database needed! Everything is stored in simple Markdown and JSON files in a single data directory.
- **User Management:** An admin panel to create and manage user accounts with session tracking.
- **Customisable:** 14 built-in themes plus custom theme support with custom emojis and icons.
- **API Access:** Programmatic access to your checklists and notes via REST API with authentication.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Editor:** TipTap
- **Drag & Drop:** @dnd-kit
- **Deployment:** Docker

## API

`rwMarkable` includes a REST API for programmatic access to your checklists and notes. This is perfect for:

- **Automation:** Create tasks from external systems
- **Integrations:** Connect with other tools and services
- **Scripts:** Automate repetitive tasks
- **Dashboards:** Build custom interfaces

📖 **For the complete API documentation, see [app/api/README.md](app/api/README.md)**

## Getting Started

The recommended way to run `rwMarkable` is with Docker.

### Docker Compose (Recommended)

1.  Create a `docker-compose.yml` file:

    ```yaml
    services:
      rwmarkable:
        image: ghcr.io/fccview/rwmarkable:latest
        container_name: rwmarkable
        user: "1000:1000"
        ports:
          # Feel free to change the FIRST port, 3000 is very common
          # so I like to map it to something else (in this case 1122)
          - "1122:3000"
        volumes:
          # --- MOUNT DATA DIRECTORY
          # This is needed for persistent data storage on YOUR host machine rather than inside the docker volume.
          - ./data:/app/data:rw
          - ./config:/app/config:ro

          # --- MOUNT CACHE DIRECTORY (OPTIONAL)
          # This improves performance by persisting Next.js cache between restarts
          - ./cache:/app/.next/cache:rw
        restart: unless-stopped
        environment:
          - NODE_ENV=production
          # Uncomment to enable HTTPS
          # - HTTPS=true

          # --- SSO WITH OIDC (OPTIONAL)
          # - SSO_MODE=oidc
          # - OIDC_ISSUER=<YOUR_SSO_ISSUER>
          # - OIDC_CLIENT_ID=<YOUR_SSO_CLIENT_ID>
          # - APP_URL=https://your-rwmarkable-domain.com # if not set sholuld default to http://localhost:<port>

          # --- ADDITIONAL SSO OPTIONS (OPTIONAL)
          #- OIDC_CLIENT_SECRET=your_client_secret  # Enable confidential client mode with client authentication
          #- SSO_FALLBACK_LOCAL=true  # Allow both SSO and normal login
          #- OIDC_ADMIN_GROUPS=admins # Map provider groups to admin role
        # --- DEFAULT PLATFORM IS SET TO AMD64, UNCOMMENT TO USE ARM64.
        #platform: linux/arm64
    ```

2.  Create the data directory and set permissions:

    ```bash
    mkdir -p data/users data/checklists data/notes data/sharing cache
    sudo chown -R 1000:1000 data/
    sudo chown -R 1000:1000 cache/
    ```

    **Note:** The cache directory is optional. If you don't want cache persistence, you can comment out the cache volume line in your `docker-compose.yml`.

3.  Start the container:

    ```bash
    docker-compose up -d
    ```

The application will be available at `http://localhost:1122`.

### Initial Setup

On your first visit, you'll be redirected to `/auth/setup` to create your admin account. Once that's done, you're ready to go!

### Local Development (Without Docker)

If you want to run the app locally for development:

1.  **Clone & Install:**
    ```bash
    git clone <repository-url>
    cd checklist
    yarn install
    ```
2.  **Run Dev Server:**
    ```bash
    yarn dev
    ```
    The app will be running at `http://localhost:3000`.

## Data Storage

`rwMarkable` uses a simple file-based storage system inside the `data/` directory.

- `data/checklists/`: Stores all checklists as `.md` files.
- `data/notes/`: Stores all notes as `.md` files.
- `data/users/`: Contains `users.json` and `sessions.json`.
- `data/sharing/`: Contains `shared-items.json`.
- `data/settings.json`: App settings (name, description, custom icons).
- `data/uploads/app-icons/`: Custom uploaded app icons.

**Make sure you back up the `data` directory!**

## Updating

### Docker Compose

Pull the latest image and restart your container.

```bash
docker-compose pull
docker-compose up -d
```

### Manual

If you're running from source, pull the latest changes and rebuild.

```bash
git pull
yarn install
yarn build
yarn start
```

## Configuration

The `config/` directory contains configuration files that customize various aspects of the application.

### Single Sign-On (SSO) with OIDC

rwMarkable supports any OIDC provider (Authentik, Auth0, Keycloak, Okta, etc.) with these requirements:

- Supports PKCE (most modern providers do)
- Can be configured as a public client (no client secret needed)
- Provides standard OIDC scopes (openid, profile, email)

1. Configure your OIDC Provider:

- Client Type: Public
- Grant Type: Authorization Code with PKCE
- Scopes: openid, profile, email
- Redirect URI: https://YOUR_APP_HOST/api/oidc/callback
- Post-logout URI: https://YOUR_APP_HOST/

2. Get these values from your provider:

- Client ID
- OIDC Issuer URL (usually ends with .well-known/openid-configuration)

3. Set environment variables:

```yaml
services:
  rwmarkable:
    environment:
      - SSO_MODE=oidc
      - OIDC_ISSUER=https://YOUR_SSO_HOST/issuer/path
      - OIDC_CLIENT_ID=your_client_id
      - APP_URL=https://your-rwmarkable-domain.com # if not set defaults to http://localhost:<port>
      # Optional security enhancements:
      - OIDC_CLIENT_SECRET=your_client_secret # Enable confidential client mode (if your provider requires it)
      - SSO_FALLBACK_LOCAL=true # Allow both SSO and local login
      - OIDC_ADMIN_GROUPS=admins # Map provider groups to admin role

Note: When OIDC_CLIENT_SECRET is set, rwMarkable switches to confidential client mode using client authentication instead of PKCE. This is more secure but requires provider support.
```

Dev verified Providers:

- Auth0 (`OIDC_ISSUER=https://YOUR_TENANT.REGION.auth0.com`)
- Authentik (`OIDC_ISSUER=https://YOUR_DOMAIN/application/o/APP_SLUG/`)

Other providers will likely work, but I can at least guarantee these do as I have test them both locally.

p.s. **First user to sign in via SSO when no local users exist becomes admin automatically.**

### Custom Themes and Emojis

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

## Community shouts

I would like to thank the following members for raising issues and help test/debug them!

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/fruiz1972"><img width="100" height="100" alt="fruiz1972" src="https://avatars.githubusercontent.com/u/183622648?v=4&size=100"><br/>fruiz1972</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/seigel"><img width="100" height="100"  src="https://avatars.githubusercontent.com/u/15181?v=4&size=100"><br />seigel</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/mariushosting"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/37554361?v=4&size=100"><br />mariushosting</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/Isotop7"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/8883656?v=4&size=100"><br />Isotop7</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/bluegumcity"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/142639670?v=4&size=100"><br />bluegumcity</a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/IGOLz"><img width="100" height="100" alt="IGOLz" src="https://avatars.githubusercontent.com/u/24594920?s=96&v=4&size=100"><br/>IGOLz</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/floqui-nl"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/73650390?s=96&v=4&size=100"><br />floqui-nl</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/davehope"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/5435716?s=96&v=4&size=100"><br />davehope</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/Sku1ly"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/45756272?s=96&v=4&size=100"><br />Sku1ly</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/ItsNoted"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/57927413?s=96&v=4&size=100"><br />ItsNoted</a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/red-bw"><img width="100" height="100" alt="red-bw" src="https://avatars.githubusercontent.com/u/76931972?s=96&v=4&size=100"><br/>red-bw</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/kn0rr0x"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/13623757?s=96&v=4&size=100"><br />kn0rr0x</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/mroovers"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/108073583?u=f28735093a4131be5876d8bfcee38e18d7293a13&v=4&size=100"><br />mroovers</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/Ryderjj89"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/1996734?u=b64c6cdaebfefe6dacfe4213663df60bb22ccf5f&v=4&size=100"><br />Ryderjj89</a>
      </td>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/spaghetti-coder"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/4891777?v=4&size=100"><br />spaghetti-coder</a>
      </td>
    </tr>
    <tr>
      <td align="center" valign="top" width="20%">
        <a href="https://github.com/hurleyy"><img width="100" height="100" src="https://avatars.githubusercontent.com/u/12866334?v=4&size=100"><br />hurleyy</a>
      </td>
    </tr>
  </tbody>
</table>

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=fccview/rwmarkable&type=Date)](https://www.star-history.com/#fccview/rwmarkable&Date)
