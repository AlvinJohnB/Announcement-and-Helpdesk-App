# Announcements and Helpdesk Application Documentation

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [File Structure](#file-structure)
4. [Technology Stack](#technology-stack)
5. [Installation](#installation)
6. [Usage](#usage)
7. [API Documentation](#api-documentation)
8. [User Roles and Permissions](#user-roles-and-permissions)
9. [Future Enhancements](#future-enhancements)

## Overview

The Announcements and Helpdesk app is a full-stack web application for managing organizational announcements and IT/helpdesk tickets. It features a modern, maintainable React frontend and a Node.js/Express backend with MongoDB.

## Features

- **Tabbed UI**: Main navigation tabs for Announcements, Helpdesk, and (if admin) User Management.
- **Announcements**:
  - View, archive, and create announcements (with rich text editor)
  - Department-based filtering
  - Commenting on announcements
  - Archive/unarchive functionality
- **Helpdesk**:
  - Submit, view, and manage helpdesk tickets
  - Filter tickets by department and status (open/closed)
  - Communication trail (comments) for each ticket
- **User Management** (admin/superadmin):
  - Manage users, roles, and departments
- **Authentication**:
  - Login, registration, and role-based access
- **Modern UI**:
  - Responsive design
  - Card-based layout for all major sections
  - Consistent, maintainable file structure

## File Structure

See `client/RECOMMENDED_FILE_STRUCTURE.txt` for the latest maintainable file structure, including feature-based folders and shared components.

## Technology Stack

- **Frontend**: React, Bootstrap 5, Font Awesome, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT
- **Other**: Docker, Nginx (for deployment)

## Installation

1. Clone the repository.
2. Install dependencies in both `client` and `server` folders:
   ```sh
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables as needed (see `.env.example`).
4. Start the development environment:
   ```sh
   cd ..
   npm run dev
   ```

## Usage

- Log in to access announcements, helpdesk, and (if admin) user management.
- Use the Announcements tab to view, create, or archive announcements.
- Use the Helpdesk tab to submit or manage tickets.
- Admins can manage users in the User Management tab.

## API Documentation

See the `routes/api/` folder for RESTful API endpoints for announcements, helpdesk tickets, and users.

## User Roles and Permissions

- **User**: Can view and comment on announcements, submit helpdesk tickets
- **Admin**: Can manage announcements and users in their department
- **Superadmin**: Full access to all features and user management

## Future Enhancements

- Real-time notifications
- File attachments for announcements and tickets
- Improved analytics and reporting
- Dark mode
