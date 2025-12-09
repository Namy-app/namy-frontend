## Multi-stage Dockerfile for Next.js (namy-ui)
## Supports pnpm when `pnpm-lock.yaml` is present, otherwise falls back to npm

FROM node:20-alpine AS base
WORKDIR /app

# Install git and build tools required by some packages
RUN apk add --no-cache git python3 make g++

FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
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

# Set build-time environment variables for Next.js
ENV NEXT_PUBLIC_API_URL=https://api.kiyoo.online/graphql
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SaD54Q4iIDsLM3GpABYZ7tyegbFw0vzwCvQTijsTC4FJJQQIA5Px5SXl3Bzl4ZNREBJjqCx22EpSLWgKSOtMuHY00vTnZNKZE

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only the necessary runtime artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=deps /app/node_modules ./node_modules

# Set ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
