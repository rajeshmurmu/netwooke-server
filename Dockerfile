# Use Node.js official image
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Copy package files
COPY --from=build /app/package*.json ./

RUN npm ci --only=production && npm cache clean --force

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start" ]
