FROM node:16 AS build-env

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . ./

FROM gcr.io/distroless/nodejs:16

ENV NODE_ENV production
ENV SERVICE_NAME greeting-service

WORKDIR /app
COPY --from=build-env /app ./

CMD ["src/index.js"]