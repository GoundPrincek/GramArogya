const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const validateEnv = () => {
  const missing = [];
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    missing.push('JWT_SECRET');
  }
  if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    missing.push('MONGODB_URI');
  }

  if (missing.length > 0) {
    throw new Error(
      `[Configuration Error] Missing required environment variables: ${missing.join(', ')}. Please check server/.env`
    );
  }
};

validateEnv();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gram_arogya_connect',
  jwtSecret: process.env.JWT_SECRET || 'gram_arogya_jwt_secure_secret_sih26133_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};

module.exports = config;
