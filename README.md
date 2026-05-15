# PulseBoard 🗳️

> A real-time live polling platform for instant audience engagement.

PulseBoard lets you create polls, share them with anyone, and watch responses come in live — no page refresh needed. Built for the web, designed for speed.

---

## 🚀 Features

- **Real-Time Voting** — votes update live using WebSockets (Socket.io)
- **Visual Analytics** — bar charts and progress bars to visualize responses
- **Poll Expiry Timer** — set a countdown after which voting closes automatically
- **Share Poll Link** — one-click copy to share with anyone, no login needed to vote
- **Duplicate Vote Prevention** — browser-level protection stops repeat votes
- **Per-User Data Isolation** — each user sees only their own polls
- **Admin Dashboard** — total polls, users, votes stats and activity chart
- **Create / Edit / Delete Polls** — full poll management
- **JWT Authentication** — secure login and registration

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Realtime | Socket.io |
| Charts | Recharts |
| Auth | JWT, bcrypt |

---


## 📁 Project Structure
pulse-board/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # All page components
│   │   ├── components/     # Shared components (Navbar)
│   │   └── App.jsx
├── server/                 # Node.js backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── middleware/         # Auth middleware
│   ├── sockets/            # Socket.io setup
│   └── server.js


---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/meer-hamza1/poll-App
cd pulse-board
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8000
```

Start the backend:

```bash
npm run dev
```

### 3. Setup the frontend

```bash
cd ../client
npm install
npm run dev
```

### 4. Open the app

Frontend: http://localhost:5173
Backend:  http://localhost:8000

---

## 📸 Pages

| Page | Description |
|------|-------------|
| `/` | Home — features, how it works, CTA |
| `/register` | Sign up |
| `/login` | Login |
| `/dashboard` | View and manage your polls |
| `/create` | Create a new poll |
| `/edit/:id` | Edit an existing poll |
| `/poll/:id` | Vote on a poll (public) |
| `/analytics/:id` | View poll analytics |
| `/admin` | Admin dashboard with stats |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Polls
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/polls` | ✅ | Get all polls for logged in user |
| POST | `/api/polls` | ✅ | Create a new poll |
| GET | `/api/polls/:id` | ❌ | Get a single poll |
| PUT | `/api/polls/:id` | ✅ | Edit a poll |
| DELETE | `/api/polls/:id` | ✅ | Delete a poll |
| POST | `/api/polls/:id/response` | ❌ | Submit a vote |
| GET | `/api/polls/:id/analytics` | ✅ | Get poll analytics |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin` | Get total polls, users, votes stats |

---

## 🌐 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Backend port (default: 8000) |

---

## 👨‍💻 Author

Made with ❤️ for the MasterJi Hackathon

---

## 📄 License

MIT