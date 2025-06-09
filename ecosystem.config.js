module.exports = {
  apps: [
    {
      name: "announcement-backend",
      script: "./server/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
      },
      watch: false,
    },
  ],
};
