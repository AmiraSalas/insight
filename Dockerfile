FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN rm -rf node_modules server esbuild
RUN npm install --production
EXPOSE 3000
CMD ["node", "dist/index.js"]
