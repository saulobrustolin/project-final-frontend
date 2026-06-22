FROM node:20-alpine AS builder
WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm ci

COPY ./frontend .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build

RUN npm ci --only=production

EXPOSE 3000
CMD ["npm", "start"]