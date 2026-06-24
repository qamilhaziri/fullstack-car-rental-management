FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production
ENV CLIENT_URL=http://localhost:5173

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p public/uploads && chown -R node:node /app

USER node

EXPOSE 5005

CMD ["npm", "start"]
