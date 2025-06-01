# Docker Deployment Instructions

This application is containerized using Docker and can be deployed using Docker Compose.

## Prerequisites

- Docker
- Docker Compose

## Environment Variables

Before deploying, make sure to set the following environment variables in a production environment:

1. In docker-compose.yml:
   - Change the JWT_SECRET to a secure value
   - Adjust the MONGODB_URI if needed

## Deployment Steps

1. Build and start the containers:

   ```bash
   docker-compose up -d --build
   ```

2. Monitor the logs:

   ```bash
   docker-compose logs -f
   ```

3. Stop the application:
   ```bash
   docker-compose down
   ```

## Container Information

The application consists of three containers:

1. MongoDB (mongodb)

   - Port: 27017
   - Persistent volume for data storage

2. Backend Server (server)

   - Port: 5000
   - Node.js application
   - Connects to MongoDB

3. Frontend Client (client)
   - Port: 80
   - Nginx serving React static files
   - Proxies API requests to the backend

## Data Persistence

MongoDB data is persisted using a Docker volume (mongodb_data).

## Network

All containers are connected through a bridge network named 'app-network'.

## Security Notes

1. Change the JWT_SECRET in production
2. Consider adding SSL/TLS in production
3. Review and adjust MongoDB security settings for production
4. Configure proper authentication for MongoDB

## Scaling

To scale the application:

```bash
docker-compose up -d --scale server=3
```

Note: When scaling the server, you'll need to implement a load balancer.
