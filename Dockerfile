# Using a multi-stage docker build we can build and test in a builder
# and then copy just the needed files for deployment to the final image

# ----------------------------------------------------------------------
# BUILDER IMAGE

# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-alpine as builder

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# Copying this separately prevents re-running npm install on every code change.
COPY package.json package-lock.json /app/

# Install dependencies.
RUN npm ci

# Copy local code to the container image. Files listed in .dockerignore are ignored
COPY . /app/

# Run tests
RUN npm test

# Build the app
RUN npm run build

# ----------------------------------------------------------------------
# FINAL IMAGE

# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-alpine

# Set environment variables
ENV NODE_ENV production

# Create and change to the app directory.
WORKDIR /app

# Install only the production dependencies.
COPY --from=builder /app/package.json /app/package-lock.json /app/
RUN npm ci --only=production && rm -f package.json package-lock.json

# Copy built code from the builder to the container image.
COPY --from=builder /app/lib /app/

# Run the web service on container startup.
CMD ["node", "--max-http-header-size=16384", "main.js"]
