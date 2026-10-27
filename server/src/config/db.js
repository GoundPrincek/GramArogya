const mongoose = require('mongoose');
const config = require('./env');

/**
 * Connect to MongoDB using Mongoose
 * Handles initial connection and lifecycle events
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      autoIndex: true
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Could not connect to MongoDB at ${config.mongodbUri}`);
    console.error(`[Database Error Details]: ${error.message}`);
    // In production, exit; in local development, permit server to remain up for health check
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
    return null;
  }
};

/**
 * Disconnect from MongoDB (useful for test teardown)
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('[Database] MongoDB connection closed');
  } catch (error) {
    console.error(`[Database Error] Error disconnecting: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
