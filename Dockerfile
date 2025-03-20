# Use Node.js base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN pnpm build

# Use a lightweight Node.js runtime image
FROM node:18-alpine

WORKDIR /app

# Copy built files and dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose the application port
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/main.js"]
