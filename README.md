# FoodBridge AI

**Surplus food, redistributed in minutes.**

FoodBridge AI connects restaurants and hotels with surplus food to verified NGOs who need it — a "Swiggy for food donation." This repo is a working MVP: a Node.js/Express + MongoDB backend and a React + Tailwind frontend, both fully wired and ready to run.

```
FoodBridgeAI/
├── backend/     Node.js + Express + MongoDB API
├── frontend/    React + Vite + Tailwind app
└── README.md    You are here
```

---

## 1. What's actually built

This isn't just scaffolding — every piece below is implemented end-to-end.

**Backend**
- JWT authentication with three roles: `donor`, `receiver`, `admin`
- Donor → auto-creates a `Restaurant` profile; Receiver → auto-creates an `Ngo` profile
- Full food listing CRUD, with photo upload, nearby search (Haversine distance), and filters
- Complete request workflow: NGO requests → donor accepts/rejects → pickup confirmed with a
  generated confirmation code → stats update automatically. Competing requests auto-reject once
  one is accepted.
- Admin verification queue for restaurants and NGOs, dashboard stats, live donation feed
- Real-time notifications via Socket.IO (new food nearby, new request, accepted/rejected, pickup confirmed)
- Centralized error handling, role-based route guards, file upload validation

**Frontend**
- Landing page, login/register (role-aware form), public food browser, food detail + request flow
- Donor dashboard (listings, incoming requests, accept/reject, analytics)
- Receiver dashboard (nearby food, my requests, confirm pickup with code, cancel)
- Admin dashboard (verification queue, platform stats)
- A custom design system (not the generic "cream + terracotta" AI look) — see [Design](#6-design-system) below

**Not built (intentionally, see [Roadmap](#7-roadmap))**: push notifications to mobile, AI demand
prediction, QR code *scanning* (the confirmation code exists and works, but there's no camera
scanner UI), delivery-partner flow, multilingual UI, offline support.

---

## 2. Prerequisites

Install these once, in order:

| Tool | Check with | Get it from |
|---|---|---|
| Node.js (v18+) | `node -v` | https://nodejs.org |
| npm (comes with Node) | `npm -v` | — |
| Git | `git --version` | https://git-scm.com |
| MongoDB Atlas account (free tier) | — | https://www.mongodb.com/cloud/atlas/register |
| Code editor (VS Code or Cursor) | — | https://code.visualstudio.com or https://cursor.com |
| Postman (optional, for testing the API directly) | — | https://www.postman.com/downloads |

You do **not** need to install MongoDB locally — Atlas gives you a free cloud database, which is
simpler and works the same during a hackathon with or without your own laptop's setup.

---

## 3. Get a MongoDB connection string (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free **M0 cluster** (any provider/region is fine).
3. Under **Database Access**, create a database user with a username and password (save these).
4. Under **Network Access**, click **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
   This is fine for a hackathon; tighten it later for production.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the values from step 3, and add a database name
   before the `?`, e.g. `.../foodbridge?retryWrites=true...`.

---

## 4. Run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
```
MONGO_URI=<the connection string from step 3>
JWT_SECRET=<any long random string>
```

Then start it:
```bash
npm run dev
```

You should see:
```
MongoDB connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

Visit http://localhost:5000 — you should see `FoodBridge AI Backend Running 🚀`.

### Optional: load demo data

This creates a verified demo admin, donor, and NGO account, plus one sample food listing, so you
can test the app immediately without registering and manually verifying accounts.

```bash
npm run seed
```

Demo accounts created:
| Role | Email | Password |
|---|---|---|
| Admin | admin@foodbridge.ai | admin123 |
| Donor | donor@demo.com | demo1234 |
| Receiver | ngo@demo.com | demo1234 |

---

## 5. Run the frontend

Open a **second terminal** (keep the backend running in the first one):

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173. The Vite dev server proxies `/api` and `/uploads` requests to the
backend on port 5000 automatically (see `frontend/vite.config.js`), so you don't need to configure
CORS or a base URL manually.

**That's it — both servers running means the full app works end to end.**

---

## 6. Design system

The frontend uses a deliberate visual identity rather than default styling:

- **Palette**: deep canopy green (`#123A2E`) as the primary color, warm mango (`#F2A93B`) as the
  accent, signal coral (`#E85C4A`) for urgency/expiry states, soft paper (`#F5F6F1`) background.
- **Type**: Space Grotesk for display/headings, Inter for body text, IBM Plex Mono for timestamps
  and data (confirmation codes, distances, countdowns) — reinforcing the logistics/tracking feel.
- **Signature element — the Freshness Ring**: a circular countdown gauge (`FreshnessRing.jsx`) that
  shows how much of a food listing's safe window remains, shifting from mango to coral as it
  depletes. It appears in the hero, on every food card, and on the food detail page.

All tokens live in `frontend/tailwind.config.js` and `frontend/src/index.css` if you want to
restyle.

---

## 7. Roadmap

### Phase 1 — Done in this repo
- [x] Auth (donor / receiver / admin roles)
- [x] Food listing CRUD + nearby search
- [x] Request → accept/reject → pickup confirmation workflow
- [x] Admin verification dashboard
- [x] Real-time notifications (Socket.IO)
- [x] Donor / receiver / admin frontend dashboards
- [x] Custom design system

### Phase 2 — Recommended next
- [ ] Map view (Google Maps / Leaflet) instead of list-only distance sorting
- [ ] Push notifications via Firebase Cloud Messaging for a future mobile app
- [ ] QR code *scanning* (camera) — the confirmation code backend already supports this; you just
      need a scanner UI, e.g. the `react-qr-reader` package
- [ ] Restaurant/NGO document upload UI (backend field `documents` already exists on both models)
- [ ] Ratings and feedback after each completed pickup

### Phase 3 — Differentiators (hackathon-winning features)
- [ ] AI-powered demand prediction: given a donor's typical donation, suggest which NGOs are most
      likely to need it (start simple — rank by distance + past pickup frequency, then add a model)
- [ ] Food freshness score already exists (`Food.freshnessScore()` on the backend, `FreshnessRing`
      on the frontend) — extend it with photo-based spoilage detection using Gemini or GPT-4 Vision
- [ ] AI chatbot for onboarding new restaurants/NGOs
- [ ] Emergency mode: prioritize disaster-relief organizations platform-wide
- [ ] Multilingual interface
- [ ] Offline support with background sync

### Phase 4 — Production hardening
- [ ] Rate limiting and request throttling on the API
- [ ] Image optimization / CDN (move uploads to Cloudinary or S3 instead of local disk)
- [ ] Automated tests (Jest for backend, React Testing Library for frontend)
- [ ] CI/CD pipeline
- [ ] Deploy backend to Render/Railway/Fly.io, frontend to Vercel/Netlify, keep MongoDB on Atlas

---

## 8. API reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register as donor or receiver |
| POST | `/auth/login` | Public | Log in, returns JWT |
| GET | `/auth/me` | Private | Current user + role profile |
| GET | `/food` | Public | List/search food (`?search=&foodType=&status=&longitude=&latitude=&maxDistanceKm=`) |
| GET | `/food/:id` | Public | Single listing + freshness score |
| POST | `/food` | Donor | Create listing (multipart form, field `photo`) |
| PUT | `/food/:id` | Donor (owner) | Update listing |
| DELETE | `/food/:id` | Donor (owner) | Delete listing |
| GET | `/food/my/listings` | Donor | Your own listings |
| POST | `/requests` | Receiver | Request a food listing (`{ foodId, remarks }`) |
| GET | `/requests` | Private | Your requests (as donor or receiver) |
| PUT | `/requests/:id/accept` | Donor | Accept a request, generates confirmation code |
| PUT | `/requests/:id/reject` | Donor | Reject a request |
| PUT | `/requests/:id/complete` | Receiver | Confirm pickup (`{ code }`) |
| PUT | `/requests/:id/cancel` | Either party | Cancel a pending/accepted request |
| GET | `/admin/dashboard` | Admin | Platform-wide stats |
| GET | `/admin/restaurants` | Admin | List restaurants (`?verified=true/false`) |
| GET | `/admin/ngos` | Admin | List NGOs (`?verified=true/false`) |
| PUT | `/admin/restaurants/:id/verify` | Admin | Approve a restaurant |
| PUT | `/admin/ngos/:id/verify` | Admin | Approve an NGO |
| DELETE | `/admin/users/:id` | Admin | Deactivate a user |
| GET | `/admin/live-donations` | Admin | Currently active pickups |
| PUT | `/users/profile` | Private | Update your own profile |
| GET | `/users/analytics` | Private | Your donation/pickup stats |
| GET | `/notifications` | Private | Your notifications |
| PUT | `/notifications/:id/read` | Private | Mark one as read |
| PUT | `/notifications/read-all` | Private | Mark all as read |

Test any of these in Postman — send `Authorization: Bearer <token>` for private routes, where
`<token>` comes from the `/auth/login` response.

---

## 9. Troubleshooting

**`MongoServerError: bad auth`** — your `MONGO_URI` username/password is wrong, or you didn't
URL-encode special characters in the password. Regenerate the connection string from Atlas.

**Backend runs but frontend requests fail with CORS errors** — make sure `CLIENT_URL` in
`backend/.env` matches the URL the frontend is actually running on (default `http://localhost:5173`).

**"Your account is pending verification" and you can't list/request food** — that's expected
behavior; log in as the admin account and verify the restaurant/NGO from the admin dashboard, or
run `npm run seed` in the backend for pre-verified demo accounts.

**Port already in use** — change `PORT` in `backend/.env`, or stop whatever else is using port
5000/5173.

---

## 10. Explaining this project to judges

If asked *"why this tech stack?"*:
- **Express** — lightweight, fast to build REST APIs with, minimal boilerplate for a hackathon timeline.
- **MongoDB** — flexible schema fits evolving requirements (verification documents, optional
  fields) better than a rigid SQL schema for an MVP built under time pressure.
- **React + Vite** — fast dev server with hot reload, huge ecosystem, easy to explain and extend live.
- **Socket.IO** — real-time notifications without building a polling system, which matters for the
  "restaurant lists food → NGO gets notified instantly" flow that's core to the pitch.
- **JWT** — stateless auth, no server-side session storage needed, scales simply.

If asked *"what makes this different from other food-donation apps?"* — point to the Freshness
Ring / freshness score, the automatic competing-request rejection, and the roadmap's AI matching
and spoilage-detection ideas.
