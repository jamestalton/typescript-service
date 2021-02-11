FROM --platform=${BUILDPLATFORM:-linux/amd64} node:14-alpine as builder
RUN apk add --no-cache python make g++ openssl
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm run postinstall
RUN npm ci
COPY . /app/
RUN npm run build
RUN rm -rf node_modules
RUN npm ci --only=production
RUN npm i pino-zen

FROM --platform=${TARGETPLATFORM:-linux/amd64} node:14-alpine
RUN apk add --no-cache bash
ENV NODE_ENV production
WORKDIR /app
HEALTHCHECK --interval=10s --timeout=1s --start-period=1s --retries=3 \  
    CMD node /app/build/health-check.js
COPY entrypoint.sh .
COPY --from=builder /app/certs /app/certs
RUN chown -R node /app/certs
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/
ARG VERSION
ENV VERSION $VERSION
USER node
CMD ["./entrypoint.sh"]