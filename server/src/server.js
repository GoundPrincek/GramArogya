const app = require('./app');
const { connectDB, isDatabaseConnected } = require('./config/db');
const config = require('./config/env');

const startServer = async () => {
  try {
    // 1. Connect to Database (Atlas)
    const conn = await connectDB();

    if (!conn && config.nodeEnv === 'production') {
      console.error('[Server Error] Cannot start server without database connection in production.');
      process.exit(1);
    }

    // 2. Start HTTP Listener
    const server = app.listen(config.port, () => {
      console.log(
        `[Server] GramArogya Connect API running in ${config.nodeEnv} mode on port ${config.port}`
      );
      console.log(`[Server] Health endpoint: http://localhost:${config.port}/api/health`);
      if (isDatabaseConnected()) {
        console.log('[Server] Database operational: connected to MongoDB Atlas');
      } else {
        console.warn('[Server Warning] Running with degraded database connectivity. Check network access / Atlas IP whitelist.');
      }
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error(`[Server Fatal] Startup failed: ${err.message}`);
    process.exit(1);
  }
};

startServer();
