import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dns from 'dns';
import * as dotenv from 'dotenv';

// Use Google's DNS servers to resolve MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: '.env.local' });

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    console.log('\n🔧 LV Clicks Admin Setup\n');

    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI not found in .env.local');
      process.exit(1);
    }

    // Default admin credentials
    const name = 'Admin User';
    const email = 'admin@lvclicks.com';
    const password = 'admin123';

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('ℹ️  Admin user already exists with email:', email);
      console.log('Deleting existing admin to recreate...');
      await User.deleteOne({ email });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('Admin Details:');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${password}`);
    console.log(`\n🔐 You can now login at: http://localhost:3000/admin/login\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();
