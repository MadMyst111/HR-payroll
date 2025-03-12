FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Install a simple HTTP server to serve the static content
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "dist", "-l", "3000"]
