# Announcement Board Application Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [API Documentation](#api-documentation)
9. [User Roles and Permissions](#user-roles-and-permissions)
10. [Docker Deployment](#docker-deployment)

## Overview

The Announcement Board is a full-stack web application designed for managing and displaying organizational announcements. It provides role-based access control, department-specific announcements, and rich text editing capabilities.

## Architecture

The application follows a MERN (MongoDB, Express.js, React, Node.js) stack architecture:

- Frontend: React-based single-page application
- Backend: Node.js with Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)

## Features

### User Management

- Role-based access control (Superadmin, IT, Admin, User)
- User registration and authentication
- Department-based user organization
- Profile management

### Announcements

- Create, read, update, and delete announcements
- Rich text editor with TipTap
- Department-specific announcements
- Archive functionality
- Real-time updates

### Security

- JWT-based authentication
- Protected API routes
- Role-based authorization
- Secure password hashing

## Technology Stack

### Frontend

- React 18+
- Bootstrap 5
- TipTap Editor
- Axios for HTTP requests
- Context API for state management

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### DevOps

- Docker
- Nginx
- Docker Compose

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/      # Context providers
│   │   └── App.js        # Main application component
│   └── public/           # Static assets
├── server/                # Backend Node.js application
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/         # MongoDB schemas
│   └── routes/         # API routes
└── docker-compose.yml    # Docker composition file
```

## Installation

### Local Development

1. Clone the repository
2. Install dependencies:
   \`\`\`powershell

# Install backend dependencies

cd server
npm install

# Install frontend dependencies

cd ../client
npm install
\`\`\`

3. Configure environment variables:
   Create `.env` files in both client and server directories.

### Docker Deployment

1. Build and start containers:
   \`\`\`powershell
   docker-compose up -d --build
   \`\`\`

## Configuration

### Environment Variables

#### Server

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `PORT`: Server port (default: 5000)

#### Client

- `REACT_APP_API_URL`: Backend API URL
- `PORT`: Client port (default: 3000)

## API Documentation

### Authentication Endpoints

\`\`\`
POST /api/users/register
POST /api/users/login
GET /api/users/me
\`\`\`

### User Management Endpoints

\`\`\`
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
\`\`\`

### Announcement Endpoints

\`\`\`
GET /api/announcements
POST /api/announcements
PUT /api/announcements/:id
DELETE /api/announcements/:id
PUT /api/announcements/:id/archive
\`\`\`

## User Roles and Permissions

### Superadmin

- Full access to all features
- Can manage all users and roles
- Can view and manage all announcements

### IT

- Can manage user accounts
- Can view all announcements
- Can manage system settings

### Admin

- Can manage department-specific announcements
- Can manage users in their department
- Can archive announcements

### User

- Can view announcements
- Can create announcements for their department
- Can manage their own profile

## Docker Deployment

### Prerequisites

- Docker
- Docker Compose

### Components

1. Frontend Container (Nginx + React)
2. Backend Container (Node.js)
3. MongoDB Container

### Configuration Files

- `client/Dockerfile`: Frontend build and deployment
- `server/Dockerfile`: Backend service
- `docker-compose.yml`: Service orchestration
- `nginx.conf`: Nginx reverse proxy configuration

### Deployment Commands

\`\`\`powershell

# Build and start services

docker-compose up -d --build

# View logs

docker-compose logs -f

# Stop services

docker-compose down

# Scale backend service

docker-compose up -d --scale server=3
\`\`\`

### Volume Management

- MongoDB data is persisted in a named volume
- Logs are stored in a separate volume

### Network Configuration

- Internal docker network for service communication
- Exposed ports:
  - 80: Frontend
  - 5000: Backend API
  - 27017: MongoDB (internal only)

### Security Considerations

1. Change default credentials
2. Implement SSL/TLS
3. Regular security updates
4. Proper firewall configuration
5. MongoDB authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Support

For support, please raise an issue in the repository or contact the IT department.
