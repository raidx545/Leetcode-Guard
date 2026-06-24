# LeetCode Streak Guard 🚀

Never lose your LeetCode streak again.

LeetCode Streak Guard is a WhatsApp-based reminder system that monitors a user's LeetCode activity and sends automated reminders when they haven't solved a problem for the current LeetCode day.

The project is designed to solve a simple but common problem faced by many developers: forgetting to solve at least one problem and accidentally breaking a long-running LeetCode streak.

---

## Problem Statement

Many developers maintain daily LeetCode streaks to build consistency and improve problem-solving skills.

However, despite having the intention to solve daily, it is easy to forget and realize too late that the streak has been broken.

LeetCode Streak Guard acts as a safety net by:

- Tracking a user's solved problem count.
- Detecting whether the count has increased during the current LeetCode day.
- Sending WhatsApp reminders before the day ends if no progress has been made.

---

## Features

### User Registration

Users register using their:

- LeetCode Username
- WhatsApp Phone Number (with country code, e.g., `919876543210`)

The system stores user information securely in MongoDB.

---

### Daily Baseline Tracking

LeetCode resets its daily streak at:

00:00 UTC (05:30 AM IST)

Every day, the system:

- Fetches the user's current total solved count.
- Stores it as the baseline for the new LeetCode day.
- Resets reminder status.

---

### Automated Reminder System

At 10:00 PM IST, the system:

- Fetches the latest solved count from LeetCode.
- Compares it with the daily baseline.
- Determines whether the user has solved at least one problem.

If no new problems have been solved:

- A WhatsApp reminder is automatically sent.

Example reminder:

⚠️ Hey username, you haven't solved a problem today. Don't lose your streak!

---

### Duplicate Reminder Protection

Users receive only one reminder per day.

The system tracks reminder history and prevents duplicate notifications.

---

### WhatsApp Integration

The application uses `@whiskeysockets/baileys` (WhatsApp Web API) to:

- Deliver reminders to registered users
- Handle chat commands (!subscribe, !unsubscribe)
- Send admin announcements

**WhatsApp Chat Commands:**

| Command | Description |
|---|---|
| `!start` | Welcome message with your WhatsApp number |
| `!subscribe` | Enable reminders |
| `!unsubscribe` | Disable reminders |
| `!help` | Show available commands |

---

### Admin Broadcast System

Administrators can send announcements to all active users.

Examples:

- New feature releases
- Maintenance notices
- Service updates

---

### Production Ready Features

- MongoDB Atlas
- Render Deployment
- Uptime Monitoring
- Retry Logic
- Error Handling
- Cron Scheduling

---

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Messaging

- WhatsApp (via @whiskeysockets/baileys)

### Deployment

- Render

### Monitoring

- UptimeRobot / cronjob.org

---

## System Architecture

User
│
▼
WhatsApp Client (Baileys)
│
▼
Express Backend
│
├── MongoDB Atlas
│
├── LeetCode GraphQL API
│
└── WhatsApp (send messages)

---

## Application Flow

### Step 1: User Registration

Register via the REST API with:

- LeetCode Username
- WhatsApp Phone Number (with country code)

Data is stored in MongoDB.

---

### Step 2: First-Time Setup

On first server start:

- A QR code is displayed in the terminal.
- Scan it with your phone's WhatsApp (Settings → Linked Devices → Link a Device).
- Session is saved locally in `auth_info/` — no re-scan needed on restart.

---

### Step 3: Daily Baseline Update

Every day at LeetCode reset time:

00:00 UTC

The system:

- Fetches latest solved count
- Updates baseline
- Resets reminder status

Example:

Current solved count = 150

Stored as:

lastSolvedCount = 150

---

### Step 4: User Activity

The user solves problems throughout the day.

Example:

Morning baseline = 150

Evening count = 153

The system detects progress automatically.

---

### Step 5: Reminder Check

At 10:00 PM IST:

The system:

- Fetches current solved count
- Compares against baseline

If:

currentSolved <= baseline

A reminder is sent via WhatsApp.

Otherwise:

No action is taken.

---

## Project Structure

```
├── config
│   └── db.js
├── controllers
│   ├── announceController.js
│   ├── jobController.js
│   ├── subscribeController.js
│   ├── unsubscribeController.js
│   └── userController.js
├── middleware
│   └── adminAuth.js
├── models
│   └── user.js
├── routes
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   └── userRoutes.js
├── services
│   ├── announcementService.js
│   ├── checkAllUsers.js
│   ├── dailyUpdateService.js
│   ├── leetcodeService.js
│   ├── reminderService.js
│   └── whatsappService.js
├── .gitignore
├── README.md
├── app.js
├── whatsapp.js
├── package-lock.json
├── package.json
└── server.js
```

## Environment Variables

Create a `.env` file:

```env
PORT=3001

DATABASE_URI=your_mongodb_uri

ADMIN_TOKEN=your_admin_token

CRON_SECRET=your_cron_secret
```

> **Note:** No bot token is needed. WhatsApp authentication is handled via QR code scan on first startup.

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/leetcode-streak-guard.git
```

Move into the project:

```bash
cd leetcode-streak-guard
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure environment variables.

Start the server:

```bash
npm start
```

On first start, scan the QR code displayed in the terminal with your WhatsApp app.

---

## API Endpoints

### Register User

```http
POST /api/register
```

Request Body:

```json
{
  "leetcodeUsername": "your_username",
  "whatsappNumber": "919876543210"
}
```

> **Note:** WhatsApp number must include the country code without `+` or spaces (e.g., `919876543210` for India).

---

### Subscribe (Enable Reminders)

```http
POST /api/subscribe
```

Request Body:

```json
{
  "whatsappNumber": "919876543210"
}
```

---

### Unsubscribe (Disable Reminders)

```http
POST /api/unsubscribe
```

Request Body:

```json
{
  "whatsappNumber": "919876543210"
}
```

---

### Send Announcement

```http
POST /api/announce
```

Headers:

```http
x-admin-token: YOUR_ADMIN_TOKEN
```

Body:

```json
{
  "message": "New feature released!"
}
```

---

## Future Improvements

- Web Dashboard
- User Authentication
- Multi-Platform Notifications
- Email Reminders
- Streak Analytics
- Reminder Scheduling Preferences
- User Statistics Dashboard
- Leaderboards
- Mobile Application

---

## Deployment

The application is deployed using:

- Render
- MongoDB Atlas
- cronjob.org (external cron for triggering daily updates and reminders)

Cron jobs handle:

- Daily baseline updates
- Reminder checks

---

## Learning Outcomes

This project helped me learn:

- Backend Development with Node.js
- REST APIs
- MongoDB & Mongoose
- WhatsApp Automation with Baileys
- Cron Jobs & Scheduling
- External API Integration
- Production Deployment
- Monitoring & Reliability
- System Design Fundamentals

---

## Author

Rishav Raj

Third-year B.Tech student passionate about software development, problem solving, and building useful products.

If you find this project interesting, feel free to star the repository and contribute.
