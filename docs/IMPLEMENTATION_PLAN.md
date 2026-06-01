# Step-by-Step Implementation Plan

## Phase 1 — Authentication ✅

1. Create `User` model (name, email, password)
2. Add `bcryptjs` password hashing + `jsonwebtoken`
3. Build `authService` (register, login, logout with Redis blacklist)
4. Add `authenticate` middleware
5. Create `/api/auth/*` routes with input validation

## Phase 2 — User-Owned URLs ✅

1. Extend `Url` model with `userId`, `shortUrl`, `qrCode`
2. Require authentication for URL creation
3. Scope all queries by `userId`
4. Add `GET /api/url/my-urls` with pagination + search
5. Add `DELETE /api/url/:id`

## Phase 3 — QR Codes ✅

1. Integrate `qrcode` library
2. Generate PNG on create → `public/qr/{shortCode}.png`
3. Serve via `express.static` at `/qr`
4. Return `qrCode` URL in API response

## Phase 4 — Analytics ✅

1. Create `ClickEvent` model
2. Parse UA + GeoIP on redirect (`ua-parser-js`, `geoip-lite`)
3. Aggregate clicks per day/week/month
4. Protected `GET /api/analytics/:shortCode`

## Phase 5 — Dashboard ✅

1. `GET /api/dashboard/stats` endpoint
2. React Dashboard with stats cards + URL table
3. Charts on analytics page (`chart.js`)

## Phase 6 — Frontend ✅

1. `AuthContext` + JWT in localStorage
2. Public: Home, Login, Register
3. Protected: Dashboard, Analytics, Profile
4. Navbar with auth state

## Phase 7 — Security & Production ✅

1. Helmet, rate limits, CORS, env validation
2. Structured logging, graceful shutdown
3. Docker multi-stage build + health checks
4. Integration tests (Jest + Supertest)

## Phase 8 — Optional Next Steps

- [ ] Redis rate-limit store for multi-instance
- [ ] MongoDB TTL index on `expiresAt`
- [ ] Email verification / password reset
- [ ] Refresh tokens
- [ ] Serve React build from Express in production
