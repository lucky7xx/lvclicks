import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';
import * as dns from 'dns';

// Use Google's DNS servers to resolve MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables
import * as dotenv from 'dotenv';
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('\n🔧 LV Clicks Admin Setup\n');

    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI not found in .env.local');
      console.log('Please create a .env.local file with your MongoDB connection string.');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get admin details
    const name = await question('Admin Name: ');
    const email = await question('Admin Email: ');
    const password = await question('Admin Password (min 6 characters): ');

    if (!name || !email || !password) {
      console.error('\n❌ All fields are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('\n❌ Password must be at least 6 characters long!');
      process.exit(1);
    }

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('\n❌ An admin with this email already exists!');
      process.exit(1);
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

    console.log('\n✅ Admin user created successfully!');
    console.log('\nAdmin Details:');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`\nYou can now login at: http://localhost:3000/admin/login`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

createAdmin();
