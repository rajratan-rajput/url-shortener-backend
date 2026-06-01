# API Documentation

Base URL: `http://localhost:5000`  
Swagger UI: `http://localhost:5000/api-docs` (when `ENABLE_SWAGGER=true`)

All protected routes require header: `Authorization: Bearer <token>`

---

## Authentication

### POST `/api/auth/register`

```json
{ "name": "Jane", "email": "jane@example.com", "password": "password123" }
```

**201** — `{ user, token }`

### POST `/api/auth/login`

```json
{ "email": "jane@example.com", "password": "password123" }
```

**200** — `{ user, token }`

### POST `/api/auth/logout`

**200** — Revokes token (Redis blacklist)

### GET `/api/auth/me` (protected)

**200** — `{ user: { id, name, email, createdAt } }`

---

## URL Management

### POST `/api/url/create` (protected)

```json
{
  "url": "https://google.com",
  "customAlias": "google",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

**201**

```json
{
  "id": "...",
  "shortUrl": "http://localhost:5000/google",
  "shortCode": "google",
  "qrCode": "http://localhost:5000/qr/google.png",
  "longUrl": "https://google.com/",
  "clicks": 0,
  "expiresAt": null
}
```

### GET `/api/url/my-urls` (protected)

Query: `page`, `limit`, `search`

**200** — `{ urls: [...], pagination: { page, limit, total, pages } }`

### DELETE `/api/url/:id` (protected)

**200** — `{ message: "URL deleted successfully" }`

---

## Analytics

### GET `/api/analytics/:shortCode` (protected, owner only)

**200**

```json
{
  "shortCode": "google",
  "totalClicks": 42,
  "clicksPerDay": [{ "period": "2026-05-31", "count": 10 }],
  "clicksPerWeek": [...],
  "clicksPerMonth": [...],
  "recentEvents": [
    {
      "browser": "Chrome 120",
      "device": "Desktop",
      "os": "Windows 10",
      "referrer": "Direct",
      "country": "US",
      "city": "New York",
      "timestamp": "..."
    }
  ]
}
```

---

## Dashboard

### GET `/api/dashboard/stats` (protected)

**200**

```json
{
  "totalUrls": 10,
  "totalClicks": 150,
  "mostPopularUrl": { "shortCode": "abc", "shortUrl": "...", "clicks": 80 },
  "latestUrl": { "shortCode": "xyz", "shortUrl": "...", "longUrl": "...", "createdAt": "..." }
}
```

---

## Public

### GET `/:shortCode`

Redirects to long URL (**302**). Records click + analytics event.

| Status | Meaning |
|--------|---------|
| 302 | Redirect |
| 404 | Not found |
| 410 | Expired |

### GET `/qr/:file.png`

Serves QR code image.

### GET `/health`

Service health check.
