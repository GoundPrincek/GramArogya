const mongoose = require('mongoose');
const config = require('./env');

let isConnected = false;

/**
 * Connect to MongoDB using Mongoose
 * Handles initial connection, lifecycle events, and graceful termination
 */
const connectDB = async (customUri) => {
  const uri = customUri || config.mongodbUri;

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000 // 5s timeout so startup doesn't hang if Mongo is unreachable
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`[Database Error] Could not connect to MongoDB at ${uri}`);
    console.error(`[Database Error Details]: ${error.message}`);

    if (config.nodeEnv === 'production') {
      console.error('[Database Fatal] Exiting application due to database connection failure in production.');
      process.exit(1);
    }
    return null;
  }
};

/**
 * Check if database is currently connected
 * 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
 */
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Graceful disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      isConnected = false;
      console.log('[Database] MongoDB connection gracefully closed.');
    }
  } catch (error) {
    console.error(`[Database Error] Error disconnecting: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB, isDatabaseConnected };
