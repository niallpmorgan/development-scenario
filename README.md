# Companies House starter

React + TypeScript (Vite) frontend + Express backend that searches the Companies House API.

## Setup

1. Requires Node 20.6 or newer.
2. Get a REST API key from https://developer.company-information.service.gov.uk/
3. Add your key:
   ```
   cp server/.env.example server/.env
   # then edit server/.env and set COMPANIES_HOUSE_API_KEY
   ```
4. Install everything and start both apps:
   ```
   npm run install:all
   npm run dev
   ```
5. Open http://localhost:5173

## Endpoints (backend, port 3001)

- `GET /api/companies/search?q=<name>` – search companies
- `GET /api/companies/:number` – company profile

The API key stays on the server; the browser only talks to your backend.

## Notes

- Search runs as you type (300 ms debounce, minimum 2 characters). In-flight requests are cancelled when you keep typing, which also keeps you well inside the Companies House rate limit.
- Type-check the client with `npm run typecheck --prefix client`.
