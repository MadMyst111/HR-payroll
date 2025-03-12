#!/bin/bash

# Build the application
npm run build

# Install serve if not already installed
if ! command -v serve &> /dev/null; then
    echo "Installing serve..."
    npm install -g serve
fi

# Start the server
echo "Starting server on http://localhost:3000"
serve -s dist -l 3000
