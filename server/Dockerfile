# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including nodemon)
RUN npm install

# Install nodemon globally (optional, or use as devDependency)
RUN npm install -g nodemon

# Copy the rest of the server code
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the server with nodemon
CMD ["node", "server.js"]