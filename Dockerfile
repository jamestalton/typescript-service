FROM node:12-alpine as builder
RUN apk add --no-cache python make g++
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app/
RUN npm test
RUN npm run build
RUN rm -rf node_modules
run npm ci --only=production

FROM node:12-alpine
ARG VERSION
ENV NODE_ENV production
ENV PORT 3000
ENV VERSION $VERSION
EXPOSE 3000
WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/lib /app/
USER node
CMD ["node", "main.js"]
