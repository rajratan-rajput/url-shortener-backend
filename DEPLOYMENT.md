# Production Deployment Checklist

Use this checklist before deploying the URL Shortener API to production.

## Pre-deploy

- [ ] Copy `.env.example` to `.env` and set **strong, unique** values for `MONGO_ROOT_PASSWORD` and `REDIS_PASSWORD`
- [ ] Set `BASE_URL` to your public HTTPS origin (e.g. `https://short.example.com`)
- [ ] Set `NODE_ENV=production`
- [ ] Set `ENABLE_SWAGGER=false` (or restrict `/api-docs` behind auth / VPN)
- [ ] Set `TRUST_PROXY=1` when running behind nginx, ALB, Render, Railway, etc.
- [ ] Tune `RATE_LIMIT_MAX` and `SHORTEN_RATE_LIMIT_MAX` for expected traffic
- [ ] Confirm MongoDB and Redis are **not** exposed to the public internet (default `docker-compose.yml` keeps them internal)
- [ ] Run tests: `npm test`
- [ ] Build image: `docker compose build`

## Infrastructure

- [ ] Terminate TLS at load balancer or reverse proxy (HTTPS only)
- [ ] Configure health check probe → `GET /health` (expect `200`, body `status: healthy`)
- [ ] Set container restart policy (`unless-stopped` in compose)
- [ ] Configure log aggregation (stdout/stderr from containers)
- [ ] Set up backups for MongoDB volume (`mongo_data`) and Redis AOF (`redis_data`) if self-hosted
- [ ] Plan MongoDB/Redis managed services (Atlas, ElastiCache) for higher availability

## Docker

### Production (recommended)

```bash
docker compose up -d --build
```

### Local development with exposed DB ports

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Security

- [ ] Never commit `.env` or secrets to git
- [ ] Use secrets manager in cloud (AWS Secrets Manager, etc.) instead of plain files where possible
- [ ] Keep base images updated (`node:20-alpine`, `mongo:7`, `redis:7-alpine`)
- [ ] Run containers as non-root (app image uses `nodejs` user)
- [ ] Review rate limits under real client IP / proxy configuration
- [ ] Disable Swagger in production unless required
- [ ] Monitor for abuse (spike in `POST /shorten`, open redirect attempts)
- [ ] Consider WAF / CDN in front of redirect traffic at scale

## Application config

| Variable | Production guidance |
|----------|---------------------|
| `MONGO_URI` | Authenticated connection string; use TLS for managed MongoDB |
| `REDIS_URL` | Include password; use TLS if provider supports it |
| `BASE_URL` | Public HTTPS URL used in shortened links |
| `TRUST_PROXY` | `1` behind reverse proxy |
| `ENABLE_SWAGGER` | `false` |
| `JSON_BODY_LIMIT` | Default `32kb`; lower if not needed |

## Post-deploy verification

- [ ] `GET /health` → `200` with `mongodb: up`, `redis: up`
- [ ] `POST /shorten` with valid HTTPS URL → `201`
- [ ] `GET /{shortCode}` → `302` to original URL
- [ ] Invalid URL → `400`
- [ ] Expired URL → `410`
- [ ] Unknown code → `404`
- [ ] Duplicate custom alias → `409`
- [ ] Confirm HTTP→HTTPS redirect at edge
- [ ] Confirm logs do not contain secrets

## Scaling notes

- [ ] Run multiple app replicas behind a load balancer
- [ ] Use Redis-backed rate limiting (`rate-limit-redis`) when running >1 instance
- [ ] Use managed MongoDB with replica set for HA
- [ ] Put redirect path behind CDN/cache for high read volume
- [ ] Set up alerts on `/health` failures and error rate

## Rollback

- [ ] Tag Docker images by release version
- [ ] Keep previous compose/env snapshot
- [ ] Roll back with `docker compose up -d` using previous image tag
- [ ] Verify `/health` after rollback

## Optional enhancements

- [ ] CI pipeline: test → build image → push to registry
- [ ] Staging environment mirroring production
- [ ] Database index review (`shortCode` unique index exists)
- [ ] TTL index on MongoDB `expiresAt` for automatic cleanup
- [ ] Structured JSON logging (pino/winston)
- [ ] Metrics (Prometheus) and tracing
