const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  // Reuse existing connection if active
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task_management_app';

    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        throw err;
      }
      console.warn(`Could not connect to primary MongoDB at ${mongoUri}. Falling back to mongodb-memory-server...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create({ binary: { version: '7.0.8' } });
      const inMemoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`MongoDB In-Memory Server Connected: ${conn.connection.host}`);
      return conn;
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      throw error;
    }
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error(`Error disconnecting DB: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
