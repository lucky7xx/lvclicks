import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dns from 'dns';
import * as dotenv from 'dotenv';

// Use Google's DNS servers
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function testLogin() {
  try {
    console.log('\n🔍 Testing Admin Login\n');

    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB\n');

    const testEmail = 'admin@lvclicks.com';
    const testPassword = 'admin123';

    const user = await User.findOne({ email: testEmail });

    if (!user) {
      console.error('❌ User not found!');
      process.exit(1);
    }

    console.log('✅ User found:', user.email);
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);

    const isPasswordValid = await bcrypt.compare(testPassword, user.password);

    if (isPasswordValid) {
      console.log('\n✅ Password is VALID! Login should work.\n');
      console.log('Login at: http://localhost:3000/admin/login');
      console.log('Email:', testEmail);
      console.log('Password:', testPassword);
    } else {
      console.log('\n❌ Password is INVALID! There may be an issue.\n');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

testLogin();
