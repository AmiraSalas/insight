FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build TypeScript into dist/
RUN npm run build

EXPOSE 3000

# Run compiled server
CMD ["npm", "start"]
