# 🌤️ WeatherGuard Admin

A secure, invite-only weather alert platform built with **NestJS**, **React**, **MongoDB**, and **Telegram Bot API**.

Users authenticate using Google or GitHub, request access to the platform, and after approval from an administrator, receive automated weather alerts on Telegram.

---

# Features

* 🔐 Google & GitHub OAuth Authentication
* 👤 Invite-only access workflow
* 🛡️ Admin approval dashboard
* 📱 Telegram Bot integration
* 🌦️ Automated weather alerts
* ⏰ Scheduled alerts using Cron Jobs
* 📊 Alert history stored in MongoDB
* ⚡ NestJS Modular Architecture
* 🎨 React + Tailwind CSS Admin Panel
* 💾 MongoDB Database

---

# Tech Stack

## Backend

* NestJS
* TypeScript
* MongoDB
* Mongoose
* Passport.js
* JWT
* Node-Cron
* Telegram Bot API

## Frontend

* React
* TypeScript
* Tailwind CSS
* Axios
* React Router

---

# Project Structure

```
weatherguard/
│
├── api/
│   ├── src/
│   │   ├── admin/
│   │   ├── alerts/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── telegram/
│   │   ├── users/
│   │   └── weather/
│   │
│   ├── .env.example
│   └── package.json
│
├── admin/
│   ├── src/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

# Database Schema

## Users Collection

```javascript
{
    _id,
    name,
    email,
    avatar,

    provider,
    providerId,

    role,               // admin | user
    status,             // pending | approved | rejected

    telegramChatId,
    telegramUsername,

    location,

    createdAt,
    updatedAt
}
```

---

## Alerts Collection

```javascript
{
    _id,

    userId,

    location,

    temperature,

    description,

    humidity,

    windSpeed,

    status,

    createdAt
}
```

---

# Data Flow

```
Google / GitHub Login
            │
            ▼
User Created in MongoDB
            │
            ▼
Status = Pending
            │
            ▼
Admin Reviews Request
            │
      Approve User
            │
            ▼
Status = Approved
            │
            ▼
User Adds Telegram Chat ID
            │
            ▼
Cron Job / Manual Trigger
            │
            ▼
Fetch Weather
            │
            ▼
Telegram Notification
            │
            ▼
Save Alert History
```

---

# Prerequisites

Install the following software:

* Node.js (v20 or later)
* MongoDB Community Server or MongoDB Atlas
* Git
* VS Code
* Telegram Account

---

# Installation

## Clone Repository

```bash
git clone <repository-url>

cd weatherguard
```

---

# Backend Setup

Open a terminal:

```bash
cd api
```

Install dependencies:

```bash
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

Fill in your environment variables.

Example:

```env
PORT=3000

MONGODB_URI=mongodb://localhost:27017/weatherguard

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

GITHUB_CLIENT_ID=

GITHUB_CLIENT_SECRET=

GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

TELEGRAM_BOT_TOKEN=

OPENWEATHER_API_KEY=
```

Start the backend:

```bash
npm run start:dev
```

Backend will run on:

```
http://localhost:3000
```

---

# Frontend Setup

Open another terminal:

```bash
cd admin
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:3000/api
```

Run the frontend:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# Telegram Bot Setup

1. Open Telegram.
2. Search for **@BotFather**.
3. Create a bot using `/newbot`.
4. Copy the Bot Token.
5. Add it to the backend `.env` file:

```env
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
```

6. Search for your bot.
7. Click **Start**.
8. Send:

```
/start
```

The bot will reply with your Telegram Chat ID.

---

# Google OAuth Setup

Create OAuth credentials in Google Cloud Console.

Add the callback URL:

```
http://localhost:3000/api/auth/google/callback
```

Copy:

* Client ID
* Client Secret

Update the backend `.env`.

---

# GitHub OAuth Setup

Create a GitHub OAuth App.

Homepage URL:

```
http://localhost:5173
```

Callback URL:

```
http://localhost:3000/api/auth/github/callback
```

Copy the Client ID and Client Secret into the backend `.env`.

---

# How to Use the Application

## Step 1

Start MongoDB.

---

## Step 2

Run the backend:

```bash
cd api

npm run start:dev
```

---

## Step 3

Run the frontend:

```bash
cd admin

npm run dev
```

---

## Step 4

Open:

```
http://localhost:5173
```

---

## Step 5

Login using Google or GitHub.

* The first registered user becomes the **Admin**.
* Every subsequent user is created with **Pending** status.

---

## Step 6

Log in as the Admin.

Open the Admin Dashboard.

Review pending users.

Click **Approve** to grant access.

---

## Step 7

After approval, the user:

* Opens the Dashboard.
* Enters their Telegram Chat ID.
* Enters a preferred city/location.
* Clicks **Save Settings**.

---

## Step 8

To send weather alerts manually during testing:

```
POST

http://localhost:3000/api/alerts/trigger
```

The approved user will receive a weather notification on Telegram.

---

# Scheduled Weather Alerts

The project uses Cron Jobs.

By default:

```
Every 6 hours
```

For testing/demo purposes, this can be changed to:

```typescript
@Cron(CronExpression.EVERY_MINUTE)
```

inside:

```
src/alerts/alerts.service.ts
```

---

# API Endpoints

## Authentication

```
GET /api/auth/google

GET /api/auth/google/callback

GET /api/auth/github

GET /api/auth/github/callback
```

---

## Users

```
GET /api/users/me

PUT /api/users/profile
```

---

## Admin

```
GET /api/admin/users

GET /api/admin/pending

PUT /api/admin/users/:id/approve

PUT /api/admin/users/:id/reject
```

---

## Alerts

```
GET /api/alerts

POST /api/alerts/trigger
```

---

# Demo Flow

1. Login using Google/GitHub.
2. New user appears as **Pending**.
3. Admin approves the request.
4. User adds Telegram Chat ID and location.
5. Trigger a weather alert.
6. Receive the weather notification on Telegram.
7. Verify alert history in MongoDB.

---

# Future Improvements

* Email notifications
* Weather preferences
* Multi-city alerts
* Alert severity levels
* User notification settings
* Deployment with Docker
* BullMQ for scalable background jobs

---

# Author

**Viraj Patel**

Built as part of a Full Stack Developer assessment using NestJS, React, MongoDB, and Telegram Bot API.
