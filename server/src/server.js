const app = require('./app');
const { connectDB } = require('./config/db');
const config = require('./config/env');

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start HTTP Listener
  const server = app.listen(config.port, () => {
    console.log(
      `[Server] GramArogya Connect API running in ${config.nodeEnv} mode on port ${config.port}`
    );
    console.log(`[Server] Health endpoint: http://localhost:${config.port}/api/health`);
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

startServer();
