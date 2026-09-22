FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias para compilar módulos nativos como argon2
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
