## Multi-stage Dockerfile for Next.js (namy-web-app)
# Builds the app and runs it with `next start` in production mode.

FROM node:18-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
# Install dependencies: prefer package-lock.json via npm ci, otherwise use pnpm if pnpm-lock.yaml exists, otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then \
    npm ci --production=false; \
    elif [ -f pnpm-lock.yaml ]; then \
    npm install -g pnpm && pnpm install --frozen-lockfile; \
    else \
    npm install; \
    fi

# Copy source and build
COPY . .
RUN npm run build

## Production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
