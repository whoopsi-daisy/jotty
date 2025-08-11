# rwMarkable

A modern, self-hosted checklist and document management application built with Next.js 14, TypeScript, and Tailwind CSS. rwMarkable allows users to create, manage, and collaborate on checklists and rich text documents with a beautiful, responsive interface.

<p align="center">
  <a href="https://www.buymeacoffee.com/fccview">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" width="150">
  </a>
</p>

## ✨ Features

### 📋 Checklist Management

- **Interactive Checklists**: Create and manage task lists with drag-and-drop reordering
- **Real-time Updates**: Mark items as complete/incomplete with instant feedback
- **Progress Tracking**: Visual progress indicators for checklist completion
- **Categories**: Organize checklists into custom categories
- **Emoji Support**: Optional emoji display for checklist items
- **Drag & Drop**: Reorder items using intuitive drag-and-drop interface

### 📄 Document Editor

- **Rich Text Editing**: Full-featured WYSIWYG editor powered by TipTap
- **Markdown Support**: Write in Markdown with live preview
- **Formatting Tools**: Bold, italic, strikethrough, headings, lists, quotes, and links
- **Category Organization**: Organize documents into custom categories

### 👥 Collaboration & Sharing

- **Item Sharing**: Share checklists and documents with specific users
- **Shared Items View**: Easy access to items shared with you or by you

### 🔐 Authentication & Security

- **Session-based Auth**: Secure cookie-based authentication
- **User Registration**: Manual user creation by Admins
- **Role Management**: Admin and regular user roles
- **Password Security**: SHA-256 password hashing
- **Protected Routes**: Middleware-based route protection

### 🎨 User Experience

- **Theming**: Tons of themes and customisations available
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Keyboard Navigation**: Full keyboard accessibility support
- **Loading States**: Smooth loading indicators and feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Rich Text Editor**: TipTap
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Authentication**: Custom session-based auth
- **Storage**: File-based (JSON + Markdown)
- **Deployment**: Docker

## 📦 Installation

### Prerequisites

- Node.js 18+
- Yarn or npm
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd checklist
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start the development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Initial Setup**
   - On first run, you'll be redirected to `/auth/setup`
   - Create your admin account
   - Start using the application!

### Docker Deployment

1. **Using Docker Compose (Recommended)**

   - Create a `docker-compose.yml` file:

   ```bash
   services:
      app:
         image: ghcr.io/fccview/rwmarkable:main
         container_name: rwmarkable
         user: "1001:65533"
         ports:
            - "1234:3000"
         volumes:
            - ./data:/app/data:rw # Do NOT change this volume name.
         restart: unless-stopped
         environment:
            - NODE_ENV=production
         init: true
   ```

   - Assign the right permissions and start the container:

   ```bash
   sudo chown -R 1001:65533 data/
   docker-compose up -d
   ```

2. **Using Docker directly**
   - Pull the repository locally
   ```bash
   docker build -t rwmarkable .
   docker run -p 1234:3000 -v data:/app/data rwmarkable
   ```

The application will be available at `http://localhost:1234`

## 🔧 Configuration

### Environment Variables

The application uses minimal configuration and works out of the box. For production deployments, consider setting:

- `NODE_ENV`: Set to `production` for production builds
- `NEXT_TELEMETRY_DISABLED`: Set to `1` to disable Next.js telemetry

### Data Storage

The application uses a simple file-based storage system:

- **Checklists**: Stored as Markdown files in `data/checklists/`
- **Documents**: Stored as Markdown files in `data/documents/`
- **Users**: Stored as JSON in `data/users/users.json`
- **Sessions**: Stored as JSON in `data/users/sessions.json`
- **Sharing**: Stored as JSON in `data/sharing/shared-items.json`

## 🚀 Usage

### Creating Your First Checklist

1. **Navigate to the home page** after logging in
2. **Click "Create Checklist"** or use the quick add form
3. **Enter a title** and optionally select a category
4. **Add items** using the input field
5. **Mark items complete** by clicking the checkboxes
6. **Reorder items** by dragging them up or down

### Creating Documents

1. **Switch to Documents mode** using the app mode toggle
2. **Click "Create Document"**
3. **Enter a title** and select a category
4. **Use the rich text editor** to write your content
5. **Save your changes** using the save button

### Sharing Items

1. **Open any checklist or document**
2. **Click the share button** (users icon)
3. **Select users** from the dropdown
4. **Click "Share"** to grant access

### User Management (Admin Only)

1. **Navigate to the Admin panel**
2. **Create new users** with the "Create User" form
3. **Manage user roles** and permissions
4. **View system statistics**

## 🔒 Security Features

- **Session-based authentication** with secure HTTP-only cookies
- **Password hashing** using SHA-256
- **Route protection** via Next.js middleware
- **Role-based access control** for admin functions
- **Input validation** and sanitization
- **CSRF protection** through Next.js built-in security

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** in this README
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information about your problem

I don't have a lot of free time, but I'll try to keep an eye on it all.

## 🔄 Updates

To update your installation:

### Docker Compose

```bash
docker-compose pull
docker-compose up -d
```

### Manual Update

```bash
git pull
yarn install
yarn build
yarn start
```
