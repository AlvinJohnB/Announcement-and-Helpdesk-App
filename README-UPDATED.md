# Modern Announcement Board App

A full-stack application for posting and viewing announcements built with the MERN stack (MongoDB, Express, React, Node.js). This application features a modern, responsive UI with tabs for viewing announcements and adding new ones.

## Features

- Modern UI with tabbed interface for announcements and form submission
- Rich text editor with support for tables, formatting, and styling
- Responsive design that works on mobile and desktop
- Category filtering for announcements
- Secure content rendering with HTML sanitization
- MongoDB database for data persistence
- RESTful API for CRUD operations

## Screenshots

![Announcement Board](https://via.placeholder.com/800x400?text=Announcement+Board+Screenshot)

## Project Structure

```
announcement-board-app/
├── client/                # React frontend
│   ├── public/            # Static files
│   └── src/               # React source code
│       ├── components/    # React components
│       └── App.js         # Main React application
├── server/                # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Express server entry point
├── .env                   # Environment variables
├── package.json           # Project metadata and dependencies
└── start-dev.ps1          # PowerShell script to start the development environment
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [PowerShell](https://docs.microsoft.com/en-us/powershell/) (for Windows users)

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd client
   npm install
   cd ..
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/announcement_board
   ```

## Running the Application

### Quick Start (Windows)

Run the PowerShell script to check MongoDB and start both server and client:

```
.\start-dev.ps1
```

### Manual Start

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

## Technologies Used

- **Frontend**: React, Bootstrap 5, Font Awesome, CSS3
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Tools**: Concurrently, Nodemon

## Future Enhancements

- User authentication and authorization
- Image uploads for announcements
- File attachments for documents
- Real-time notifications using WebSockets
- Dark mode theme
- Email notifications for new announcements
