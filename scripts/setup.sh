#!/bin/bash

echo "🚀 Setting up Checklist App..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Start the database
echo "🐘 Starting PostgreSQL database..."
docker-compose up db -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Generate Prisma client
echo "🔧 Generating Prisma client..."
yarn db:generate

# Push database schema
echo "📊 Setting up database schema..."
yarn db:push

echo "✅ Setup complete!"
echo ""
echo "🎉 You can now run the application:"
echo "   Development: yarn dev"
echo "   Production:  docker-compose up -d"
echo ""
echo "📱 Open http://localhost:3000 in your browser" 