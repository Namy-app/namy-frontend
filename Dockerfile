## Multi-stage Dockerfile for Next.js (namy-ui)
## Supports pnpm when `pnpm-lock.yaml` is present, otherwise falls back to npm

FROM node:18-alpine AS base
WORKDIR /app

# Install git and build tools required by some packages
RUN apk add --no-cache git python3 make g++

FROM base AS deps
COPY package.json package-lock.json pnpm-lock.yaml* ./
# Install dependencies: prefer pnpm when lockfile exists
RUN if [ -f pnpm-lock.yaml ]; then \
    npm install -g pnpm && pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
    npm ci; \
    else \
    npm install; \
    fi

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary runtime artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
