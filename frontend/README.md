# LinkSnap Frontend

React + Vite + Tailwind CSS + Axios UI for the URL Shortener API.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

## Development

1. Start the API on port `5000` (from project root):

   ```bash
   npm run dev
   ```

2. Start the frontend:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173)

Vite proxies `/api` → `http://localhost:5000` so no CORS setup is required for local dev.

To call the API directly, set `VITE_API_URL=http://localhost:5000` and add the origin to backend `CORS_ORIGIN`.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/create` | Create short URL |
| `/analytics` | View stats by short code |
| `*` | Error page (404 / route errors) |

## Build

```bash
npm run build
npm run preview
```
