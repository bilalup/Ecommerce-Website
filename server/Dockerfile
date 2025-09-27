FROM node:18-alpine

WORKDIR /app

# copy package files
COPY package*.json ./

# install only production dependencies
RUN npm ci --only=production

# copy the rest of the backend files
COPY . .

# ensure Back4App can set the runtime port
ENV NODE_ENV=production

# expose the port your app will listen on
EXPOSE 8080

# start the server (update the file name if different)
CMD ["node", "server.js"]