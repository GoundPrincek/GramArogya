const mongoose = require('mongoose');
const config = require('./env');

let isConnected = false;

/**
 * Sanitizes MongoDB URI to prevent logging sensitive credentials
 */
const sanitizeUri = (rawUri) => {
  if (!rawUri) return '<empty>';
  return rawUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
};

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

  if (!uri) {
    isConnected = false;
    console.error('[Database Error] No MONGODB_URI configured. Please set MONGODB_URI in server/.env');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 20000 // 20s timeout for reliable Atlas cloud replica-set discovery
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`[Database Error] Could not connect to MongoDB at ${sanitizeUri(uri)}`);
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
