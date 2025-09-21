FROM node:18-alpine
WORKDIR /app

# copy package files and install
COPY package*.json ./
RUN npm ci --only=production

# copy app files (DOTIGNORE excludes .env)
COPY . .

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.js"]