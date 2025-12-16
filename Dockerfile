# syntax = docker/dockerfile:1

# 1. Build stage
FROM node:22-slim AS build

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy all code and build
COPY . .
RUN npm run build

# 2. Runtime stage
FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy only what we need
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/dist/public ./dist/public

# Start the Node server built into dist/index.js
EXPOSE 3000
CMD ["node", "dist/index.js"]



