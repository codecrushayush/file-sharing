# File Sharing Systems

**File Sharing Systems** is a full-stack MERN application for uploading documents, managing a personal file library stored in **MongoDB GridFS**, and sharing **public download links** without exposing raw storage IDs. The UI is a dark, responsive experience built with React, Vite, and Tailwind CSS.

## Project overview

- **Users** register and sign in; the API issues **JWT** access tokens stored in the browser (`localStorage`).
- **Files** are uploaded as `multipart/form-data`; binaries go to **GridFS**, metadata to **`FileMetadata`**.
- **Sharing** creates a unique token; recipients open **`/share/:token`** on the frontend, which loads public metadata and downloads via the API.

## Tech stack

| Layer    | Technologies |
|----------|----------------|
| Frontend | React 18, Vite 5, React Router 6, Axios, Tailwind CSS, Lucide React |
| Backend  | Node.js, Express, Mongoose, JWT, bcrypt, Multer |
| Storage  | MongoDB (documents + **GridFS** for file bytes) |

## Folder structure

```
file-sharing-systems/
├── client/                 # React SPA
│   ├── public/
│   ├── src/
│   │   ├── components/     # Layout, Navbar, FileUploadZone, FileInventory, routes…
│   │   ├── context/        # AuthProvider / useAuth
│   │   ├── pages/          # Landing, auth, Dashboard, SharedFile
│   │   ├── services/       # api.js (Axios + token), filesApi.js
│   │   └── utils/          # format helpers
│   ├── index.html
│   ├── vite.config.js      # dev proxy for /api
│   └── package.json
├── server/
│   ├── config/             # env, db, gridfs
│   ├── controllers/       # auth, file, share
│   ├── middleware/        # auth, upload, errors
│   ├── models/            # User, FileMetadata
│   ├── routes/            # health, auth, files, share
│   ├── services/          # gridfs helpers
│   ├── utils/
│   ├── server.js
│   └── package.json
└── README.md
```

## Environment variables

### Server (`server/.env`)

Copy from `server/.env.example`.

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs (**required in production**; must not use dev default) |
| `JWT_EXPIRES_IN` | JWT lifetime (e.g. `7d`) |
| `CLIENT_ORIGIN` | Allowed CORS origin for the SPA (e.g. `http://localhost:5173`) |
| `MAX_FILE_SIZE_BYTES` | Max upload size (default 25 MB) |

### Client (`client/.env`)

Copy from `client/.env.example`.

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Optional absolute API host **without** trailing slash (e.g. `https://api.example.com`). Requests use `{VITE_API_URL}/api/...`. Leave **empty** in local dev so the app uses relative `/api` and the Vite proxy. |
| `VITE_PROXY_TARGET` | Dev only: backend URL for the Vite proxy (default `http://localhost:5000`). Should match server `PORT`. |

## Installation

### Prerequisites

- **Node.js** 18+
- **MongoDB** reachable at `MONGODB_URI` (local or Atlas)

### Backend

```bash
cd server
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET at minimum
npm install
```

### Frontend

```bash
cd client
cp .env.example .env
npm install
```

## Run commands

**Terminal 1 — API**

```bash
cd server
npm run dev
```

Listens on `http://localhost:5000` (or `PORT`). You should see:

- `MongoDB connected`
- `GridFS bucket ready (default: fs)`
- `Server running on http://localhost:...`

**Terminal 2 — SPA**

```bash
cd client
npm run dev
```

Opens `http://localhost:5173` with `/api` proxied to the backend (see `vite.config.js`).

**Production build (client)**

```bash
cd client
npm run build
npm run preview
```

Serve the built `client/dist` behind a reverse proxy that forwards `/api` to the Node server, **or** set `VITE_API_URL` at build time to the public API origin.

## Authentication flow

1. **Register** — `POST /api/auth/register` with `name`, `email`, `password`. Password is hashed with bcrypt; response includes `token` + safe `user` object.
2. **Login** — `POST /api/auth/login` returns `token` + `user`.
3. **Session** — The SPA stores the JWT under `fss_token` and sends `Authorization: Bearer <token>` on Axios requests (see `client/src/services/api.js`).
4. **Bootstrap** — On load, `GET /api/auth/me` validates the token and restores `user`.
5. **Routes** — `/dashboard` is wrapped in **ProtectedRoute** (redirects to `/sign-in` if unauthenticated). `/sign-in` and `/sign-up` use **GuestRoute** (redirects to `/dashboard` if already signed in).

## File upload flow

1. User picks or drops a file in the dashboard upload zone (`multipart` field name **`file`**).
2. `POST /api/files/upload` — Multer validates type/size; stream writes to **GridFS**; **`FileMetadata`** stores `owner`, names, `mimeType`, `size`, `gridFsFileId`, etc.
3. `GET /api/files` returns the owner’s files for the table/cards.

## File sharing flow

1. Authenticated user clicks **Share** on a file — `POST /api/files/:id/share` generates a unique `shareToken`, sets `isShared`, and returns the token and API path.
2. The UI shows a **page URL**: `{origin}/share/{token}` (public route on the SPA).
3. **Public metadata** — `GET /api/share/:token` (no auth).
4. **Public download** — `GET /api/share/:token/download` streams the GridFS file with `Content-Disposition`.
5. **Owner download** — `GET /api/files/:id/download` (requires auth).
6. **Delete** — `DELETE /api/files/:id` removes GridFS chunks and the metadata document.

---

## API quick reference

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | No |
| POST | `/api/auth/register`, `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| GET | `/api/files` | Yes |
| POST | `/api/files/upload` | Yes |
| GET | `/api/files/:id/download` | Yes |
| DELETE | `/api/files/:id` | Yes |
| POST | `/api/files/:id/share` | Yes |
| GET | `/api/share/:token` | No |
| GET | `/api/share/:token/download` | No |

---

## Final run checklist

Use this before demos or releases:

- [ ] **Backend starts** — `cd server && npm run dev` with no crash.
- [ ] **Frontend starts** — `cd client && npm run dev`; app loads at `http://localhost:5173`.
- [ ] **MongoDB connects** — Server logs `MongoDB connected` and `GridFS bucket ready`.
- [ ] **Auth works** — Sign up, sign in, `/dashboard` loads; sign out returns to public pages.
- [ ] **Upload works** — Upload an allowed file type; it appears in the library.
- [ ] **Listing works** — Library shows name, type, size, date, shared status; search filters.
- [ ] **Share link works** — Share copies/opens `{origin}/share/<token>`; metadata loads without login.
- [ ] **Download works** — Owner download from dashboard; public download from shared page.

---

## License

Use and modify for your own projects as needed.
