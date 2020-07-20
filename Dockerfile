FROM --platform=${BUILDPLATFORM:-linux/amd64} node:12-alpine as builder
RUN apk add --no-cache python make g++
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app/
RUN npm run build
RUN rm -rf node_modules
RUN npm ci --only=production

FROM --platform=${TARGETPLATFORM:-linux/amd64} node:12-alpine
USER node
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/lib /app/
ARG VERSION
ENV VERSION $VERSION
CMD ["node", "main.js"]
