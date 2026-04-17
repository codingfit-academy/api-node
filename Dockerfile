# ─────────────────────────────────────────────────────────────
# templates/api-node/Dockerfile
# Node.js API — Multi-stage, non-root, /health 엔드포인트
#
# 서버는 PORT=8000 환경변수를 주입합니다.
# /health → { "status": "ok" } 응답 필수
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Dependencies ─────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* yarn.lock* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --production; \
  elif [ -f package-lock.json ]; then npm ci --omit=dev; \
  fi

# ── Stage 2: Runner ───────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

RUN addgroup -g 1001 -S nodejs \
 && adduser  -u 1001 -S appuser -G nodejs

COPY --from=deps --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --chown=appuser:nodejs package.json ./
COPY --chown=appuser:nodejs src ./src

USER appuser
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:8000/health || exit 1

CMD ["node", "src/index.js"]
