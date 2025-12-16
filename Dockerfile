# syntax = docker/dockerfile:1
FROM node:22-slim AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all code and build
COPY . .
RUN npm run build

# Runtime image
FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app ./

EXPOSE 3000
CMD ["npm","run","start"]
