FROM node:20-slim

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm ci

# Copy app
COPY . .

# Build frontend + backend (creates dist/index.js)
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]


