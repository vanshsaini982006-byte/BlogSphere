# BlogSphere

A full-stack blogging platform where anyone can register, write, publish, and discuss ideas through comments. Built as a production-style portfolio project with real authentication, a REST API, MongoDB persistence, and a polished, responsive UI with dark/light mode.

![Node](https://img.shields.io/badge/Node.js-18%2B-339933)
![React](https://img.shields.io/badge/React-18-61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)
![Express](https://img.shields.io/badge/Express-4-000000)

---

## Features

**Authentication**
- Register / login with JWT, bcrypt-hashed passwords
- Protected routes, persistent login, logout
- Auth middleware on every write operation

**Posts**
- Full CRUD — create, read, update, delete (own posts only)
- Draft or publish, character count, live preview before publishing
- Auto-generated slugs, reading time, view counts
- Related posts by category/tags

**Comments**
- Add, edit, and delete your own comments on any post
- "Login to join the discussion" prompt for guests

**Discovery**
- Full-text search across title, content, category, tags, author
- Filter by category, sort by newest / oldest / most popular
- Infinite scroll on the Explore page

**Profiles & Dashboard**
- Editable public profile with avatar, bio, and stats
- Personal dashboard: total posts, published, drafts, comments, total views
- My Posts / Drafts / Recent Comments tabs

**Admin**
- Role-based admin dashboard
- View all users, all posts, all comments
- Remove any inappropriate post or comment

**UI/UX**
- Custom editorial design system (Fraunces + Inter + JetBrains Mono, ink/paper/spine palette)
- Dark and light mode toggle
- Loading skeletons, empty states, toast notifications, confirmation dialogs
- Fully responsive: desktop, tablet, mobile
- Custom 404 page and graceful API/network error handling

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, Lucide Icons
**Backend:** Node.js, Express, JWT, bcryptjs, express-validator, CORS
**Database:** MongoDB with Mongoose (text search index, virtuals, relationships)

---

## Folder Structure

```
blog-platform/
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, BlogCard, CommentCard, PostEditor, etc.
│   │   ├── pages/          # Home, Explore, PostDetail, Dashboard, Admin, etc.
│   │   ├── context/        # AuthContext, ThemeContext, ToastContext
│   │   ├── services/       # Axios API modules (auth, posts, comments, users, admin)
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/        # authController, postController, commentController, etc.
│   ├── models/              # User, Post, Comment (Mongoose schemas)
│   ├── routes/               # authRoutes, postRoutes, commentRoutes, adminRoutes
│   ├── middleware/         # auth (JWT), errorHandler
│   ├── seed/                 # seed.js — sample data generator
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster works well)

### 1. Clone and install

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### 2. Configure environment variables

**backend/.env** (copy from `.env.example`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/blogsphere?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**frontend/.env** (copy from `.env.example`)
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. MongoDB Atlas setup (if you don't already have a cluster)
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register)
2. Under **Database Access**, create a database user with a username/password
3. Under **Network Access**, add your IP (or `0.0.0.0/0` for development)
4. Copy your connection string from **Connect → Drivers** and paste it into `MONGODB_URI`, replacing `<username>`, `<password>`, and adding `/blogsphere` before the query params

### 4. Seed the database with sample data

```bash
cd backend
npm run seed
```

This creates 4 demo users, 10 sample posts across all categories, a couple of drafts, and realistic comments.

### 5. Run the app

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Test Credentials (after seeding)

| Role  | Identifier              | Password  |
|-------|--------------------------|-----------|
| Admin | `demo@blogsphere.com`    | `demo1234`|
| User  | `ananya@blogsphere.com`  | `demo1234`|
| User  | `rahul@blogsphere.com`   | `demo1234`|
| User  | `sara@blogsphere.com`    | `demo1234`|

You can log in with either the email or the username (`vansh`, `ananya`, `rahulv`, `sarak`).

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint             | Auth | Description |
|--------|-----------------------|------|--------------|
| POST   | `/auth/register`      | —    | Register a new user |
| POST   | `/auth/login`         | —    | Login with email/username + password |
| GET    | `/auth/me`            | ✅   | Get current logged-in user |
| POST   | `/auth/logout`        | ✅   | Logout |

### Users
| Method | Endpoint                | Auth | Description |
|--------|---------------------------|------|--------------|
| GET    | `/users/:id`               | —    | Public profile + stats + posts |
| PUT    | `/users/:id`                | ✅ (owner) | Update own profile |
| GET    | `/users/me/dashboard`   | ✅   | Dashboard stats, posts, comments |

### Posts
| Method | Endpoint             | Auth | Description |
|--------|-----------------------|------|--------------|
| GET    | `/posts`               | —    | List posts (search, category, tag, sort, pagination) |
| GET    | `/posts/featured`      | —    | Top 6 most-viewed published posts |
| GET    | `/posts/:id`            | —    | Get single post by ID or slug (increments views) |
| POST   | `/posts`                | ✅   | Create a post |
| PUT    | `/posts/:id`            | ✅ (owner) | Update own post |
| DELETE | `/posts/:id`            | ✅ (owner/admin) | Delete own post |

### Comments
| Method | Endpoint                        | Auth | Description |
|--------|-----------------------------------|------|--------------|
| GET    | `/posts/:postId/comments`     | —    | List comments for a post |
| POST   | `/posts/:postId/comments`     | ✅   | Add a comment |
| PUT    | `/comments/:id`                  | ✅ (owner) | Edit own comment |
| DELETE | `/comments/:id`                  | ✅ (owner/admin) | Delete own comment |

### Admin (requires `role: admin`)
| Method | Endpoint                    | Description |
|--------|-------------------------------|--------------|
| GET    | `/admin/stats`                | Platform-wide stats |
| GET    | `/admin/users`                | All users |
| GET    | `/admin/posts`                | All posts, any status |
| GET    | `/admin/comments`             | All comments |
| DELETE | `/admin/posts/:id`           | Remove any post |
| DELETE | `/admin/comments/:id`     | Remove any comment |

All responses follow `{ success: boolean, message?, ...data }`. Errors return the appropriate HTTP status code with a `message` field.

---

## Screenshots

_Add screenshots of the Home page, Explore page, Post Detail, Dashboard, and Admin panel here once deployed._

---

## Future Improvements

- Rich text / Markdown editor with image uploads (instead of a URL field)
- Email verification and password reset flow
- Follow authors and personalized feed
- Post reactions/likes and bookmarks
- Server-side rendering for SEO
- Rate limiting and refresh tokens for stronger security
- Deploy: backend to Railway/Render, frontend to Netlify/Vercel

---

## Security Notes

- Passwords are hashed with bcrypt and never returned in API responses
- JWT-based auth with a middleware guard on all write routes
- Ownership checks prevent editing/deleting other users' posts or comments
- Input validation via `express-validator` on register/login/post creation
- All secrets are read from environment variables, never hardcoded
