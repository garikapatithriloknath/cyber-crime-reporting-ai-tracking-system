import mongoose from 'mongoose';
import { config } from './env.js';
import { dbStore } from '../utils/store.js';

export const connectDB = async () => {
  if (!config.mongoUri) {
    console.log('[Database] No MONGO_URI provided. Using persistent local JSON database (data/db_store.json).');
    return null;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to Cloud Cluster: ${conn.connection.host}/${conn.connection.name}`);
    await dbStore.seedMongoIfEmpty();
    return conn;
  } catch (error) {
    console.log(`[MongoDB] Local/Cloud MongoDB not reachable (${error.message}).`);
    console.log('[Database] Active Mode: Persistent JSON Store (data/db_store.json). All data is saved safely.');
    return null;
  }
};

