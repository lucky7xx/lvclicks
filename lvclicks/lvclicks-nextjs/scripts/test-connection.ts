import mongoose from 'mongoose';
import * as dns from 'dns';
import * as dotenv from 'dotenv';

// Use Google's DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));

    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Successfully connected to MongoDB!');

    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
