# syntax = docker/dockerfile:1
FROM node:22-slim AS build

WORKDIR /app

# 1) Install dependencies
COPY package*.json ./
RUN npm ci

# 2) Copy all code and build
COPY . .
RUN npm run build

# 3) Runtime image
FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app ./

EXPOSE 3000
CMD ["npm","run","start"]
