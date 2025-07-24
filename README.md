# Checklist App

A simple, fast, and lightweight checklist application built with Next.js, TypeScript, and Tailwind CSS. Features drag-and-drop functionality, dark/light mode, and mobile-first design. **Data is stored as markdown files locally.**

## Features

- ✅ Create and manage multiple lists
- ✅ Drag and drop items to reorder them
- ✅ Check/uncheck items (completed items move to bottom)
- ✅ Mobile-first responsive design
- ✅ Dark/light mode support
- ✅ Real-time updates with server actions
- ✅ **File-based storage using markdown files**
- ✅ **No database required - everything is stored locally**
- ✅ Docker deployment ready

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions
- **Storage**: Local markdown files
- **Deployment**: Docker & Docker Compose
- **Package Manager**: Yarn

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd checklist
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

3. Open your browser and navigate to `http://localhost:3000`

The application will automatically create the data directory and be ready to use!

## Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd checklist
```

2. Install dependencies:
```bash
yarn install
```

3. Run the development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Storage

The application stores all checklists as markdown files in the `./data/checklists/` directory. Each checklist is a separate `.md` file with the following format:

```markdown
# Checklist Title

- [ ] Uncompleted item
- [x] Completed item
- [ ] Another item
```

### Data Directory Structure

```
data/
└── checklists/
    ├── checklist-1234567890.md
    ├── checklist-1234567891.md
    └── ...
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── actions.ts         # Server actions
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── checklist-card.tsx
│   ├── checklist-item.tsx
│   ├── checklist-list.tsx
│   ├── create-list-form.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/                  # Utility functions
│   ├── checklist.ts      # File-based checklist operations
│   └── utils.ts          # Helper functions
├── data/                 # Local data storage (created automatically)
│   └── checklists/       # Markdown files
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── package.json         # Dependencies
```

## Environment Variables

For local development, no environment variables are required. The app will automatically create the data directory.

For Docker deployment, you can optionally set:
```env
DATA_DIR=/app/data/checklists  # Default data directory
NODE_ENV=production
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Deployment

### Docker Deployment

The application is configured for easy deployment with Docker:

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Considerations

- The `./data` directory is mounted as a volume, so your checklists persist between container restarts
- No database setup required
- All data is stored locally in markdown format
- Easy to backup - just copy the `data/` directory

## Benefits of File-Based Storage

- **No Database Required**: No need to set up PostgreSQL or any other database
- **Portable**: Easy to backup, move, or sync data
- **Human Readable**: Checklists are stored as markdown files you can edit manually
- **Version Control Friendly**: Markdown files work great with Git
- **Fast**: No database queries, just file system operations
- **Simple**: No complex database schemas or migrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 