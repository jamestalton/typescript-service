FROM node:12-alpine as builder
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app/
RUN npm test
RUN npm run build

FROM node:12-alpine
ENV NODE_ENV production
RUN mkdir /app
WORKDIR /app
COPY --from=builder /app/built /app/
CMD ["node", "main.js"]
