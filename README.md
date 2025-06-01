# Announcement Board App

A full-stack application for posting and viewing announcements built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- View announcements in real-time
- Post new announcements with title, content, author, and category
- MongoDB database for data persistence
- RESTful API for CRUD operations

## Project Structure

```
announcement-board-app/
├── client/               # React frontend
│   ├── public/           # Static files
│   └── src/              # React source code
│       ├── components/   # React components
│       └── App.js        # Main React application
├── server/               # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── server.js         # Express server entry point
├── .env                  # Environment variables
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd client
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/announcement_board
   ```

## Running the Application

### Development Mode

Run both the server and client concurrently:

```
npm run dev
```

Or separately:

```
# Run the server
npm run server

# Run the client
npm run client
```

### Production Mode

1. Build the client:

   ```
   cd client
   npm run build
   ```

2. Start the server:
   ```
   npm start
   ```

## API Endpoints

- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get a specific announcement
- `POST /api/announcements` - Create a new announcement
- `PUT /api/announcements/:id` - Update an announcement
- `DELETE /api/announcements/:id` - Delete an announcement
