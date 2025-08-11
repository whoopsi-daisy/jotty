#!/bin/bash

# Setup script for Docker data directory permissions

echo "Setting up data directory permissions for Docker..."

# Create data directories if they don't exist
mkdir -p data/users
mkdir -p data/checklists
mkdir -p data/docs

# Set proper permissions (matching the Docker container user)
chmod -R 755 data
chown -R 1001:65533 data

echo "Data directory setup complete!"
echo "You can now run: docker-compose up -d" 