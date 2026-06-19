# LeetCode Streak Guard 🚀

Never lose your LeetCode streak again.

LeetCode Streak Guard is a Telegram-based reminder system that monitors a user's LeetCode activity and sends automated reminders when they haven't solved a problem for the current LeetCode day.

The project is designed to solve a simple but common problem faced by many developers: forgetting to solve at least one problem and accidentally breaking a long-running LeetCode streak.

---

## Problem Statement

Many developers maintain daily LeetCode streaks to build consistency and improve problem-solving skills.

However, despite having the intention to solve daily, it is easy to forget and realize too late that the streak has been broken.

LeetCode Streak Guard acts as a safety net by:

- Tracking a user's solved problem count.
- Detecting whether the count has increased during the current LeetCode day.
- Sending Telegram reminders before the day ends if no progress has been made.

---

## Features

### User Registration

Users register using their:

- LeetCode Username
- Telegram Chat ID

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

- A Telegram reminder is automatically sent.

Example reminder:

⚠️ Hey username, you haven't solved a problem today. Don't lose your streak!

---

### Duplicate Reminder Protection

Users receive only one reminder per day.

The system tracks reminder history and prevents duplicate notifications.

---

### Telegram Bot Integration

The application uses Telegram Bot API to:

- Register users
- Store chat IDs
- Deliver reminders
- Send admin announcements

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

- Telegram Bot API

### Scheduling

- node-cron

### Deployment

- Render

### Monitoring

- UptimeRobot

---

## System Architecture

User
│
▼
Telegram Bot
│
▼
Express Backend
│
├── MongoDB Atlas
│
├── LeetCode GraphQL API
│
└── Telegram API

---

## Application Flow

### Step 1: User Registration

User starts the Telegram bot.

The application stores:

- LeetCode Username
- Telegram Chat ID

in MongoDB.

---

### Step 2: Daily Baseline Update

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

### Step 3: User Activity

The user solves problems throughout the day.

Example:

Morning baseline = 150

Evening count = 153

The system detects progress automatically.

---

### Step 4: Reminder Check

At 10:00 PM IST:

The system:

- Fetches current solved count
- Compares against baseline

If:

currentSolved <= baseline

A reminder is sent.

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
│   └── telegramService.js
├── .gitignore
├── README.md
├── app.js
├── bot.js
├── package-lock.json
├── package.json
└── server.js
```

## Environment Variables

Create a `.env` file:

```env
PORT=3001

MONGODB_URI=your_mongodb_uri

BOT_TOKEN=your_telegram_bot_token

ADMIN_TOKEN=your_admin_token
```

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

---

## API Endpoints

### Register User

```http
POST /register
```

Request Body:

```json
{
  "leetcodeUsername": "your_username",
  "telegramChatId": "123456789"
}
```

---

### Send Announcement

```http
POST /announce
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
- UptimeRobot (now updated with the cronjob.org)

Cron jobs handle:

- Daily baseline updates
- Reminder checks

---

## Learning Outcomes

This project helped me learn:

- Backend Development with Node.js
- REST APIs
- MongoDB & Mongoose
- Telegram Bot Development
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
