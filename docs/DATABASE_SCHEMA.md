# Database Schema Design

## Users Collection

| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `name` | String | Required, max 100 chars |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, bcrypt hashed, `select: false` |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

**Indexes:** `email` (unique)

---

## URLs Collection

| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `userId` | ObjectId | Ref `User`, required, indexed |
| `longUrl` | String | Required |
| `shortCode` | String | Required, unique |
| `shortUrl` | String | Required (full public URL) |
| `qrCode` | String | Required (full QR image URL) |
| `clicks` | Number | Default `0` |
| `expiresAt` | Date | Optional |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

**Indexes:**
- `shortCode` (unique)
- `userId + createdAt` (compound)
- Text index on `longUrl`, `shortCode`

---

## ClickEvents Collection

| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `urlId` | ObjectId | Ref `Url`, required, indexed |
| `userId` | ObjectId | Ref `User`, required, indexed |
| `browser` | String | Default `Unknown` |
| `device` | String | Default `Unknown` |
| `os` | String | Default `Unknown` |
| `referrer` | String | Default `Direct` |
| `country` | String | Default `Unknown` |
| `city` | String | Default `Unknown` |
| `createdAt` | Date | Auto (timestamp) |

**Indexes:** `urlId + createdAt` (compound, descending)

---

## Relationships

```
User 1 ── * Url
Url  1 ── * ClickEvent
User 1 ── * ClickEvent (owner reference)
```

## Redis Keys

| Key | Purpose |
|-----|---------|
| `{shortCode}` | Cached redirect payload (JSON) |
| `bl:{jwt}` | Revoked token blacklist (TTL = token expiry) |
